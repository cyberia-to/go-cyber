package keeper

import (
	"fmt"
	"github.com/cybercongress/go-cyber/v7/x/resources/exported"
	"math"

	errorsmod "cosmossdk.io/errors"

	storetypes "github.com/cosmos/cosmos-sdk/store/types"

	"github.com/cometbft/cometbft/libs/log"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	vestingtypes "github.com/cosmos/cosmos-sdk/x/auth/vesting/types"

	ctypes "github.com/cybercongress/go-cyber/v7/types"
	bandwithkeeper "github.com/cybercongress/go-cyber/v7/x/bandwidth/keeper"
	"github.com/cybercongress/go-cyber/v7/x/resources/types"
)

type Keeper struct {
	cdc            codec.BinaryCodec
	storeKey       storetypes.StoreKey
	accountKeeper  types.AccountKeeper
	graphKeeper    exported.GraphKeeper
	bankKeeper     types.BankKeeper
	bandwidthMeter *bandwithkeeper.BandwidthMeter

	authority string
}

// Exponential supply half-life controls: mint factor = 0.5^(supply / halfLife)
// Larger halfLife -> slower decay (more mint per same supply)
var (
	expHalfLifeVolt = sdk.NewInt(4000000000)  // 4*1e9
	expHalfLifeAmp  = sdk.NewInt(32000000000) // 3.2*1e10
)

func NewKeeper(
	cdc codec.BinaryCodec,
	key storetypes.StoreKey,
	ak types.AccountKeeper,
	bk types.BankKeeper,
	bm *bandwithkeeper.BandwidthMeter,
	gk exported.GraphKeeper,
	authority string,
) Keeper {
	if addr := ak.GetModuleAddress(types.ResourcesName); addr == nil {
		panic(fmt.Sprintf("%s module account has not been set", types.ResourcesName))
	}

	keeper := Keeper{
		cdc:            cdc,
		storeKey:       key,
		accountKeeper:  ak,
		bankKeeper:     bk,
		bandwidthMeter: bm,
		graphKeeper:    gk,
		authority:      authority,
	}
	return keeper
}

func (k Keeper) GetAuthority() string { return k.authority }

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

func (k Keeper) SetParams(ctx sdk.Context, p types.Params) error {
	if err := p.Validate(); err != nil {
		return err
	}

	store := ctx.KVStore(k.storeKey)
	bz := k.cdc.MustMarshal(&p)
	store.Set(types.ParamsKey, bz)

	return nil
}

func (k Keeper) GetParams(ctx sdk.Context) (p types.Params) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.ParamsKey)
	if bz == nil {
		return p
	}

	k.cdc.MustUnmarshal(bz, &p)
	return p
}

func (k Keeper) ConvertResource(
	ctx sdk.Context,
	neuron sdk.AccAddress,
	amount sdk.Coin,
	resource string,
	_ uint64,
) (sdk.Coin, error) {
	// mint volts or amperes based on current max period and rate
	// burn hydrogen (not vesting)
	// put newly minted volts/amperes to vesting schedule with minimal period (1 second) for backward compatibility

	maxPeriod := k.GetMaxPeriod(ctx, resource)

	if k.bankKeeper.SpendableCoins(ctx, neuron).AmountOf(ctypes.SCYB).LT(amount.Amount) {
		return sdk.Coin{}, sdkerrors.ErrInsufficientFunds
	}

	err := k.bankKeeper.SendCoinsFromAccountToModule(ctx, neuron, types.ResourcesName, sdk.NewCoins(amount))
	if err != nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrTimeLockCoins, err.Error())
	}
	err = k.bankKeeper.BurnCoins(ctx, types.ResourcesName, sdk.NewCoins(amount))
	if err != nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrBurnCoins, err.Error())
	}

	minted, err := k.Mint(ctx, neuron, amount, resource, maxPeriod)
	if err != nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrIssueCoins, err.Error())
	}

	return minted, err
}

func (k Keeper) AddTimeLockedCoinsToAccount(ctx sdk.Context, recipientAddr sdk.AccAddress, amt sdk.Coins, length int64) error {
	acc := k.accountKeeper.GetAccount(ctx, recipientAddr)
	if acc == nil {
		return errorsmod.Wrapf(types.ErrAccountNotFound, recipientAddr.String())
	}

	switch acc.(type) {
	case *vestingtypes.PeriodicVestingAccount:
		return k.AddTimeLockedCoinsToPeriodicVestingAccount(ctx, recipientAddr, amt, length, false)
	case *authtypes.BaseAccount:
		return k.AddTimeLockedCoinsToBaseAccount(ctx, recipientAddr, amt, length)
	default:
		return errorsmod.Wrapf(types.ErrInvalidAccountType, "%T", acc)
	}
}

func (k Keeper) AddTimeLockedCoinsToPeriodicVestingAccount(ctx sdk.Context, recipientAddr sdk.AccAddress, amt sdk.Coins, length int64, mergeSlot bool) error {
	err := k.addCoinsToVestingSchedule(ctx, recipientAddr, amt, length, mergeSlot)
	if err != nil {
		return err
	}
	return nil
}

func (k Keeper) AddTimeLockedCoinsToBaseAccount(ctx sdk.Context, recipientAddr sdk.AccAddress, amt sdk.Coins, length int64) error {
	acc := k.accountKeeper.GetAccount(ctx, recipientAddr)
	bacc := authtypes.NewBaseAccount(acc.GetAddress(), acc.GetPubKey(), acc.GetAccountNumber(), acc.GetSequence())
	newPeriods := vestingtypes.Periods{types.NewPeriod(amt, length)}
	bva := vestingtypes.NewBaseVestingAccount(bacc, amt, ctx.BlockTime().Unix()+length)
	pva := vestingtypes.NewPeriodicVestingAccountRaw(bva, ctx.BlockTime().Unix(), newPeriods)
	k.accountKeeper.SetAccount(ctx, pva)
	return nil
}

func (k Keeper) addCoinsToVestingSchedule(ctx sdk.Context, addr sdk.AccAddress, amt sdk.Coins, length int64, mergeSlot bool) error {
	acc := k.accountKeeper.GetAccount(ctx, addr)
	vacc := acc.(*vestingtypes.PeriodicVestingAccount)

	// just mock short vesting period for backward compatibility with ui

	newPeriod := types.NewPeriod(amt, length)
	vacc.VestingPeriods = append(vestingtypes.Periods{}, newPeriod)
	vacc.StartTime = ctx.BlockTime().Unix()
	vacc.EndTime = ctx.BlockTime().Unix() + length
	vacc.OriginalVesting = newPeriod.Amount
	k.accountKeeper.SetAccount(ctx, vacc)
	return nil
}

func (k Keeper) Mint(ctx sdk.Context, recipientAddr sdk.AccAddress, amt sdk.Coin, resource string, length uint64) (sdk.Coin, error) {
	acc := k.accountKeeper.GetAccount(ctx, recipientAddr)
	if acc == nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrAccountNotFound, recipientAddr.String())
	}

	toMint := k.CalculateInvestmint(ctx, amt, resource, length)

	// Apply exponential supply-based decreasing adjustment so each next minter mints less, ceteris paribus.
	toMint = k.applySupplyExponentialAdjustment(ctx, resource, toMint)

	if toMint.Amount.LT(sdk.NewInt(1000)) {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrSmallReturn, recipientAddr.String())
	}

	err := k.bankKeeper.MintCoins(ctx, types.ResourcesName, sdk.NewCoins(toMint))
	if err != nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrMintCoins, recipientAddr.String())
	}
	err = k.bankKeeper.SendCoinsFromModuleToAccount(ctx, types.ResourcesName, recipientAddr, sdk.NewCoins(toMint))
	if err != nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrSendMintedCoins, recipientAddr.String())
	}
	// adding converted resources to vesting schedule
	err = k.AddTimeLockedCoinsToAccount(ctx, recipientAddr, sdk.NewCoins(toMint), int64(1))
	if err != nil {
		return sdk.Coin{}, errorsmod.Wrapf(types.ErrTimeLockCoins, err.Error())
	}

	if resource == ctypes.VOLT {
		k.bandwidthMeter.AddToDesirableBandwidth(ctx, toMint.Amount.Uint64())
	}

	return toMint, nil
}

func (k Keeper) CalculateInvestmint(ctx sdk.Context, amt sdk.Coin, resource string, length uint64) sdk.Coin {
	var toMint sdk.Coin
	var halving sdk.Dec
	params := k.GetParams(ctx)

	switch resource {
	case ctypes.VOLT:
		cycles := sdk.NewDec(int64(length)).QuoInt64(int64(params.BaseInvestmintPeriodVolt))
		base := sdk.NewDec(amt.Amount.Int64()).QuoInt64(params.BaseInvestmintAmountVolt.Amount.Int64())

		// NOTE out of parametrization, custom code is applied here in order to shift the HALVINGS START 6M BLOCKS LATER but keep base halving parameter same
		if ctx.BlockHeight() > 15000000 {
			halving = sdk.NewDecWithPrec(int64(math.Pow(0.5, float64((ctx.BlockHeight()-6000000)/int64(params.HalvingPeriodVoltBlocks)))*10000), 4)
		} else {
			halving = sdk.OneDec()
		}

		if halving.LT(sdk.NewDecWithPrec(1, 2)) {
			halving = sdk.NewDecWithPrec(1, 2)
		}

		toMint = ctypes.NewVoltCoin(base.Mul(cycles).Mul(halving).Mul(sdk.NewDec(1000)).TruncateInt64())

		k.Logger(ctx).Info("Investmint", "cycles", cycles.String(), "base", base.String(), "halving", halving.String(), "mint", toMint.String())
	case ctypes.AMPERE:
		cycles := sdk.NewDec(int64(length)).QuoInt64(int64(params.BaseInvestmintPeriodAmpere))
		base := sdk.NewDec(amt.Amount.Int64()).QuoInt64(params.BaseInvestmintAmountAmpere.Amount.Int64())

		// NOTE out of parametrization, custom code is applied here in order to shift the HALVINGS START 6M BLOCKS LATER but keep base halving parameter same
		if ctx.BlockHeight() > 15000000 {
			halving = sdk.NewDecWithPrec(int64(math.Pow(0.5, float64((ctx.BlockHeight()-6000000)/int64(params.HalvingPeriodAmpereBlocks)))*10000), 4)
		} else {
			halving = sdk.OneDec()
		}

		if halving.LT(sdk.NewDecWithPrec(1, 2)) {
			halving = sdk.NewDecWithPrec(1, 2)
		}

		toMint = ctypes.NewAmpereCoin(base.Mul(cycles).Mul(halving).Mul(sdk.NewDec(1000)).TruncateInt64())

		k.Logger(ctx).Info("Investmint", "cycles", cycles.String(), "base", base.String(), "halving", halving.String(), "mint", toMint.String())
	}
	return toMint
}

// applySupplyExponentialAdjustment reduces base mint using f = 0.5^(supply / halfLife)
// where halfLife is resource-specific. Returns a coin with the same denom adjusted by f.
func (k Keeper) applySupplyExponentialAdjustment(ctx sdk.Context, resource string, base sdk.Coin) sdk.Coin {
	if !base.Amount.IsPositive() {
		return base
	}

	totalSupply := k.bankKeeper.GetSupply(ctx, resource).Amount
	if resource == ctypes.VOLT {
		totalSupply = totalSupply.Add(sdk.NewInt(int64(k.graphKeeper.GetBurnedVolts(ctx))))
	}
	if resource == ctypes.AMPERE {
		totalSupply = totalSupply.Add(sdk.NewInt(int64(k.graphKeeper.GetBurnedAmperes(ctx))))
	}

	var halfLife sdk.Int
	switch resource {
	case ctypes.VOLT:
		halfLife = expHalfLifeVolt
	case ctypes.AMPERE:
		halfLife = expHalfLifeAmp
	default:
		return base
	}

	if !halfLife.IsPositive() {
		return base
	}

	// factor = 0.5 ^ (supply / halfLife)
	// compute using high-precision decimals
	supplyDec := sdk.NewDecFromInt(totalSupply)
	halfLifeDec := sdk.NewDecFromInt(halfLife)
	ratio := supplyDec.Quo(halfLifeDec)

	// Convert to float64 for exponent; bounded to avoid NaN/Inf
	r64 := ratio.MustFloat64()
	if math.IsNaN(r64) || math.IsInf(r64, 0) || r64 < 0 {
		return base
	}
	factor := math.Pow(0.5, r64)
	if factor < 0 {
		factor = 0
	}
	if factor > 1 {
		factor = 1
	}

	// Apply factor on base.Amount
	baseDec := sdk.NewDecFromInt(base.Amount)
	// Use big.Rat via String to minimize precision drift when multiplying
	factorDec, err := sdk.NewDecFromStr(fmt.Sprintf("%.18f", factor))
	if err != nil {
		return base
	}
	adjustedDec := baseDec.Mul(factorDec)
	adjusted := base
	adjusted.Amount = adjustedDec.TruncateInt()

	// Ensure we don't drop to zero unexpectedly if base was small but positive
	if base.Amount.IsPositive() && adjusted.Amount.IsZero() {
		adjusted.Amount = sdk.OneInt()
	}

	k.Logger(ctx).Info("Supply exponential adjust", "resource", resource, "supply", totalSupply.String(), "halfLife", halfLife.String(), "factor", fmt.Sprintf("%.10f", factor), "base", base.Amount.String(), "adjusted", adjusted.Amount.String())

	return adjusted
}

func (k Keeper) GetMaxPeriod(ctx sdk.Context, resource string) uint64 {
	var availableLength uint64
	passed := ctx.BlockHeight()
	params := k.GetParams(ctx)

	switch resource {
	case ctypes.VOLT:
		halvingVolt := params.HalvingPeriodVoltBlocks
		doubling := uint32(math.Pow(2, float64(passed/int64(halvingVolt))))
		availableLength = uint64(doubling * halvingVolt * 6)

	case ctypes.AMPERE:
		halvingAmpere := params.HalvingPeriodAmpereBlocks
		doubling := uint32(math.Pow(2, float64(passed/int64(halvingAmpere))))
		availableLength = uint64(doubling * halvingAmpere * 6)
	}

	return availableLength
}
