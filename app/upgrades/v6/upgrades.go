package v6

import (
	"fmt"
	"time"

	sdkmath "cosmossdk.io/math"
	liquiditytypes "github.com/cybercongress/go-cyber/v7/x/liquidity/types"

	bandwidthtypes "github.com/cybercongress/go-cyber/v7/x/bandwidth/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	vestingtypes "github.com/cosmos/cosmos-sdk/x/auth/vesting/types"
	upgradetypes "github.com/cosmos/cosmos-sdk/x/upgrade/types"
	"github.com/cybercongress/go-cyber/v7/app/keepers"
	resourcestypes "github.com/cybercongress/go-cyber/v7/x/resources/types"
)

func CreateV6UpgradeHandler(
	mm *module.Manager,
	cfg module.Configurator,
	keepers *keepers.AppKeepers,
) upgradetypes.UpgradeHandler {
	return func(ctx sdk.Context, _ upgradetypes.Plan, vm module.VersionMap) (module.VersionMap, error) {
		before := time.Now()
		logger := ctx.Logger().With("upgrade", UpgradeName)

		liquidityParams := keepers.LiquidityKeeper.GetParams(ctx)
		liquidityParams.CircuitBreakerEnabled = false
		err := keepers.LiquidityKeeper.SetParams(ctx, liquidityParams)
		if err != nil {
			panic(err)
		}
		logger.Info("set liquidity circuit breaker disabled, enable dex")

		keepers.BankKeeper.SetSendEnabled(ctx, "millivolt", true)
		keepers.BankKeeper.SetSendEnabled(ctx, "milliampere", true)

		logger.Info("set bank send enabled for millivolt and amperes")

		logger.Info(fmt.Sprintf("pre migrate version map: %v", vm))
		versionMap, err := mm.RunMigrations(ctx, cfg, vm)
		if err != nil {
			return nil, err
		}
		logger.Info(fmt.Sprintf("post migrate version map: %v", versionMap))
		after := time.Now()
		ctx.Logger().Info("upgrade time", "duration ms", after.Sub(before).Milliseconds())

		voltSupply := keepers.BankKeeper.GetSupply(ctx, "millivolt")
		ampereSupply := keepers.BankKeeper.GetSupply(ctx, "milliampere")
		resourcesSupplyBefore := sdk.NewCoins(voltSupply, ampereSupply)

		bootSupply := keepers.BankKeeper.GetSupply(ctx, "boot")
		hydrogenSupply := keepers.BankKeeper.GetSupply(ctx, "hydrogen")
		tocybSupply := keepers.BankKeeper.GetSupply(ctx, "tocyb")
		baseSupplyBefore := sdk.NewCoins(bootSupply, hydrogenSupply, tocybSupply)

		before = time.Now()
		// -- burn unvested coins for accounts with periodic vesting accounts
		// -- delete unvested future vesting periods, set end time to current block time

		updatedVestingAccounts := 0
		totalUnvestedBurned := sdk.NewCoins()
		for _, acc := range keepers.AccountKeeper.GetAllAccounts(ctx) {
			switch v := acc.(type) {
			case *vestingtypes.PeriodicVestingAccount:

				// compute unvested (still vesting) coins at upgrade time before any conversion
				unvested := v.GetVestingCoins(ctx.BlockTime())

				// Trim all not-yet-finished periods so remaining schedule contains only fully completed periods.
				// Also set EndTime to current block time and align OriginalVesting with kept periods.
				if unvested.IsAllPositive() {
					elapsed := ctx.BlockTime().Unix() - v.StartTime
					if elapsed < 0 {
						elapsed = 0
					}
					cumLength := int64(0)
					keptPeriods := vestingtypes.Periods{}
					keptOriginal := sdk.NewCoins()
					for _, p := range v.VestingPeriods {
						cumLength += p.Length
						if cumLength <= elapsed {
							keptPeriods = append(keptPeriods, p)
							keptOriginal = keptOriginal.Add(p.Amount...)
						} else {
							break
						}
					}
					v.VestingPeriods = keptPeriods
					v.OriginalVesting = keptOriginal
					v.EndTime = v.StartTime + cumLength // or ctx.BlockTime().Unix()
					keepers.AccountKeeper.SetAccount(ctx, v)

					updatedVestingAccounts++

					// After unlocking, burn the unvested resources, limited by available balances.
					addr := acc.GetAddress()
					balances := keepers.BankKeeper.GetAllBalances(ctx, addr)
					coinsToBurn := sdk.NewCoins()
					for _, c := range unvested {
						if c.Denom == "millivolt" || c.Denom == "milliampere" {
							balAmt := balances.AmountOf(c.Denom)
							if balAmt.IsPositive() {
								amt := sdk.MinInt(c.Amount, balAmt)
								if amt.IsPositive() {
									coinsToBurn = coinsToBurn.Add(sdk.NewCoin(c.Denom, amt))
								}
							}
						}
					}
					if coinsToBurn.IsAllPositive() {
						if err := keepers.BankKeeper.SendCoinsFromAccountToModule(ctx, addr, resourcestypes.ResourcesName, coinsToBurn); err != nil {
							logger.Error("failed to move coins for burning", "addr", addr.String(), "coins", coinsToBurn.String(), "err", err)
						} else {
							if err := keepers.BankKeeper.BurnCoins(ctx, resourcestypes.ResourcesName, coinsToBurn); err != nil {
								logger.Error("failed to burn coins", "addr", addr.String(), "coins", coinsToBurn.String(), "err", err)
							} else {
								totalUnvestedBurned = totalUnvestedBurned.Add(coinsToBurn...)
								//logger.Info("unvested and burned coins", "addr", addr.String(), "coins", coinsToBurn)
							}
						}
					}
				}
			}
		}
		logger.Info("vesting cleanup completed", "accounts updated", updatedVestingAccounts, "total unvested burned", totalUnvestedBurned.String())

		// manually burn minted coins for accounts which made investmints during HFR break

		explosionBurned := sdk.NewCoins()
		processedHFREntries := 0
		for _, e := range hfrBurnEntries {
			addr, err := sdk.AccAddressFromBech32(e.addr)
			if err != nil {
				logger.Error("invalid address", "addr", e.addr, "err", err)
				continue
			}
			amt, ok := sdk.NewIntFromString(e.amount)
			if !ok || !amt.IsPositive() {
				continue
			}
			balanceAmt := keepers.BankKeeper.GetBalance(ctx, addr, e.denom).Amount
			toBurnAmt := sdk.MinInt(balanceAmt, amt)
			if !toBurnAmt.IsPositive() {
				processedHFREntries++
				logger.Info("nothing to burn", "addr", addr.String(), "denom", e.denom, "amount", e.amount, "balance", balanceAmt.String())
				continue
			}
			coin := sdk.NewCoin(e.denom, toBurnAmt)
			if err := keepers.BankKeeper.SendCoinsFromAccountToModule(ctx, addr, resourcestypes.ResourcesName, sdk.NewCoins(coin)); err != nil {
				logger.Error("failed to move coins for burning", "addr", addr.String(), "coin", coin.String(), "err", err)
				continue
			}
			if err := keepers.BankKeeper.BurnCoins(ctx, resourcestypes.ResourcesName, sdk.NewCoins(coin)); err != nil {
				logger.Error("failed to burn coins", "addr", addr.String(), "coin", coin.String(), "err", err)
				continue
			}

			explosionBurned = explosionBurned.Add(coin)
			processedHFREntries++
		}

		logger.Info("exploded HFR recovery completed", "entries processed", processedHFREntries, "total explosion burned", explosionBurned.String())

		// manually burn coins from dex pool accounts during HFR break

		dexBurned := sdk.NewCoins()
		processedDEXEntries := 0
		for _, e := range dexBurnEntries {
			addr, err := sdk.AccAddressFromBech32(e.addr)
			if err != nil {
				logger.Error("invalid address", "addr", e.addr, "err", err)
				continue
			}

			toBurnAmt, ok := sdk.NewIntFromString(e.amount)
			if !ok || !toBurnAmt.IsPositive() {
				continue
			}

			coin := sdk.NewCoin(e.denom, toBurnAmt)
			if err := keepers.BankKeeper.SendCoinsFromAccountToModule(ctx, addr, resourcestypes.ResourcesName, sdk.NewCoins(coin)); err != nil {
				logger.Error("failed to move coins for burning", "addr", addr.String(), "coin", coin.String(), "err", err)
				continue
			}
			if err := keepers.BankKeeper.BurnCoins(ctx, resourcestypes.ResourcesName, sdk.NewCoins(coin)); err != nil {
				logger.Error("failed to burn coins", "addr", addr.String(), "coin", coin.String(), "err", err)
				continue
			}

			dexBurned = dexBurned.Add(coin)
			processedDEXEntries++
		}

		logger.Info("exploited DEX recovery completed", "entries processed", processedDEXEntries, "total dex burned", dexBurned.String())

		after = time.Now()
		logger.Info("balances fixed", "duration ms", after.Sub(before).Milliseconds())

		totalBurned := totalUnvestedBurned.Add(explosionBurned...).Add(dexBurned...)

		voltSupply = keepers.BankKeeper.GetSupply(ctx, "millivolt")
		ampereSupply = keepers.BankKeeper.GetSupply(ctx, "milliampere")
		resourcesSupplyAfter := sdk.NewCoins(voltSupply, ampereSupply)

		logger.Info("resources supply", "before", resourcesSupplyBefore.String(), "after", resourcesSupplyAfter.String(), "total burned", totalBurned.String())

		before = time.Now()
		for _, acc := range keepers.AccountKeeper.GetAllAccounts(ctx) {
			keepers.BandwidthMeter.SetZeroAccountBandwidth(ctx, acc.GetAddress())
		}
		logger.Info("set zero bandwidth for all accounts", "duration ms", after.Sub(before).Milliseconds())

		params := keepers.BandwidthMeter.GetParams(ctx)
		err = keepers.BandwidthMeter.SetParams(ctx, bandwidthtypes.Params{
			BasePrice:         sdk.OneDec(),
			RecoveryPeriod:    params.RecoveryPeriod,
			AdjustPricePeriod: params.AdjustPricePeriod,
			BaseLoad:          params.BaseLoad,
			MaxBlockBandwidth: params.MaxBlockBandwidth,
		})
		if err != nil {
			return nil, err
		}
		after = time.Now()

		millivoltSupply := keepers.BankKeeper.GetSupply(ctx, "millivolt")
		keepers.BandwidthMeter.SetDesirableBandwidth(ctx, millivoltSupply.Amount.Uint64())

		giftBoots := sdk.NewCoin("boot", sdkmath.NewInt(603000000000000))
		giftTocybs := sdk.NewCoin("tocyb", sdkmath.NewInt(603000000000000))
		giftCoins := sdk.NewCoins(giftBoots, giftTocybs)
		giftMSAddress, _ := sdk.AccAddressFromBech32("bostrom1qs9w7ry45axfxjgxa4jmuhjthzfvj78sxh5p6e")
		if err := keepers.BankKeeper.SendCoinsFromAccountToModule(ctx, giftMSAddress, liquiditytypes.ModuleName, giftCoins); err != nil {
			logger.Error("failed to move gift coins for burning", "addr", giftMSAddress.String(), "coin", giftCoins.String(), "err", err)
		}
		if err := keepers.BankKeeper.BurnCoins(ctx, liquiditytypes.ModuleName, giftCoins); err != nil {
			logger.Error("failed to burn gift coins", "addr", giftMSAddress.String(), "coin", giftCoins.String(), "err", err)
		}
		ctx.Logger().Info("burned gift tokens from multisig", "amount", giftCoins.String())

		// Adjust congress boots burn amount to available balance (burn all existing if less than target)
		congressBootsTarget := sdk.NewCoin("boot", sdkmath.NewInt(136963281024834))
		congressTocybs := sdk.NewCoin("tocyb", sdkmath.NewInt(115594467532355))
		congressMSAddress, _ := sdk.AccAddressFromBech32("bostrom1xszmhkfjs3s00z2nvtn7evqxw3dtus6yr8e4pw")
		congressBootBalance := keepers.BankKeeper.GetBalance(ctx, congressMSAddress, "boot").Amount
		congressBootBurnAmt := sdk.MinInt(congressBootsTarget.Amount, congressBootBalance)
		congressCoinsToBurn := sdk.NewCoins(congressTocybs)
		if congressBootBurnAmt.IsPositive() {
			congressCoinsToBurn = congressCoinsToBurn.Add(sdk.NewCoin("boot", congressBootBurnAmt))
		}
		if congressCoinsToBurn.IsAllPositive() {
			if err := keepers.BankKeeper.SendCoinsFromAccountToModule(ctx, congressMSAddress, liquiditytypes.ModuleName, congressCoinsToBurn); err != nil {
				logger.Error("failed to move congress coins for burning", "addr", congressMSAddress.String(), "coin", congressCoinsToBurn.String(), "err", err)
			} else {
				if err := keepers.BankKeeper.BurnCoins(ctx, liquiditytypes.ModuleName, congressCoinsToBurn); err != nil {
					logger.Error("failed to burn congress coins", "addr", congressMSAddress.String(), "coin", congressCoinsToBurn.String(), "err", err)
				} else {
					ctx.Logger().Info("burned congress tokens from multisig", "amount", congressCoinsToBurn.String())
				}
			}
		} else {
			logger.Info("nothing to burn for congress multisig", "addr", congressMSAddress.String())
		}

		// Adjust gift treasury boots burn amount to available balance (burn all existing if less than target)
		giftTreasuryBootTarget := sdk.NewInt(58648526573806)
		giftTreasuryAddress, _ := sdk.AccAddressFromBech32("bostrom182jzjwdyl5fw43yujnlljddgtrkr04dpd30ywp2yn724u7qhtaqstjzlcu")
		giftTreasuryBootBalance := keepers.BankKeeper.GetBalance(ctx, giftTreasuryAddress, "boot").Amount
		giftTreasuryBootBurnAmt := sdk.MinInt(giftTreasuryBootTarget, giftTreasuryBootBalance)
		if giftTreasuryBootBurnAmt.IsPositive() {
			giftTreasuryBurnCoin := sdk.NewCoin("boot", giftTreasuryBootBurnAmt)
			if err := keepers.BankKeeper.SendCoinsFromAccountToModule(ctx, giftTreasuryAddress, liquiditytypes.ModuleName, sdk.NewCoins(giftTreasuryBurnCoin)); err != nil {
				logger.Error("failed to move gift treasury coins for burning", "addr", giftTreasuryAddress.String(), "coin", giftTreasuryBurnCoin.String(), "err", err)
			} else {
				if err := keepers.BankKeeper.BurnCoins(ctx, liquiditytypes.ModuleName, sdk.NewCoins(giftTreasuryBurnCoin)); err != nil {
					logger.Error("failed to burn gift treasury coins", "addr", giftTreasuryAddress.String(), "coin", giftTreasuryBurnCoin.String(), "err", err)
				} else {
					ctx.Logger().Info("burned gift tokens from treasury", "amount", giftTreasuryBurnCoin.String())
				}
			}
		} else {
			logger.Info("nothing to burn for gift treasury", "addr", giftTreasuryAddress.String())
		}

		bootSupply = keepers.BankKeeper.GetSupply(ctx, "boot")
		hydrogenSupply = keepers.BankKeeper.GetSupply(ctx, "hydrogen")
		tocybSupply = keepers.BankKeeper.GetSupply(ctx, "tocyb")
		baseSupplyAfter := sdk.NewCoins(bootSupply, hydrogenSupply, tocybSupply)
		logger.Info("base supply", "before", baseSupplyBefore.String(), "after", baseSupplyAfter.String())

		return versionMap, err
	}
}
