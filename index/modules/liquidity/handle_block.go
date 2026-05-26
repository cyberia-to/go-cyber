package liquidity

import (
	"fmt"
	abcitypes "github.com/cometbft/cometbft/abci/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	dbtypes "github.com/cybercongress/cyberindex/v2/database"
	liquiditytypes "github.com/cybercongress/go-cyber/v4/x/liquidity/types"
	"github.com/forbole/juno/v5/types"
	"github.com/rs/zerolog/log"
	"strconv"
	"strings"
	"time"
	"unicode"
)

func (m *Module) executePoolBatches(height int64, endBlockEvents []abcitypes.Event, timestamp time.Time) error {
	events := types.FindEventsByType(endBlockEvents, liquiditytypes.EventTypeSwapTransacted)

	for _, event := range events {

		var poolsVolumeMap = make(map[uint64]sdk.Coins, 0)
		var poolsFeeMap = make(map[uint64]sdk.Coins, 0)
		var poolsRateMap = make(map[uint64]sdk.Dec, 0)

		attrs := eventAttrsFromEvent(event)
		status, err := attrs.SwapStatus()
		if err != nil {
			return err
		}
		if status {
			addr, err := attrs.SwapRequesterAddr()
			if err != nil {
				return err
			}
			poolID, err := attrs.PoolID()
			if err != nil {
				return err
			}

			swapPrice, err := attrs.SwapPrice()
			if err != nil {
				return err
			}

			exchangedOfferCoin, err := attrs.CoinAttrs(liquiditytypes.AttributeValueOfferCoinDenom, liquiditytypes.AttributeValueExchangedOfferCoinAmount)
			exchangedDemandCoin, err := attrs.CoinAttrs(liquiditytypes.AttributeValueDemandCoinDenom, liquiditytypes.AttributeValueExchangedDemandCoinAmount)
			exchangedOfferCoinFee, err := attrs.CoinAttrs(liquiditytypes.AttributeValueOfferCoinDenom, liquiditytypes.AttributeValueOfferCoinFeeAmount)
			feeDec, err := attrs.DecCoinAttrs(liquiditytypes.AttributeValueDemandCoinDenom, liquiditytypes.AttributeValueExchangedCoinFeeAmount)
			exchangedDemandCoinFee := sdk.NewCoin(feeDec.Denom, feeDec.Amount.Ceil().TruncateInt())

			err = m.db.SaveSwap(
				addr,
				poolID,
				swapPrice,
				exchangedOfferCoin,
				exchangedDemandCoin,
				exchangedOfferCoinFee,
				exchangedDemandCoinFee,
				height,
			)
			if err != nil {
				fmt.Errorf("error while saving swap: %s", err)
			}

			poolsRateMap[poolID] = swapPrice

			var swapVolume = sdk.NewCoins(exchangedOfferCoin, exchangedDemandCoin).Sort()
			if volume, ok := poolsVolumeMap[poolID]; ok {
				poolsVolumeMap[poolID] = volume.Add(swapVolume...)
			} else {
				poolsVolumeMap[poolID] = swapVolume
			}

			var feeVolume = sdk.NewCoins(exchangedOfferCoinFee, exchangedDemandCoinFee).Sort()
			if fee, ok := poolsFeeMap[poolID]; ok {
				poolsFeeMap[poolID] = fee.Add(feeVolume...)
			} else {
				poolsFeeMap[poolID] = feeVolume
			}

			for poolID, volume := range poolsVolumeMap {
				err = m.db.SaveVolume(
					poolID,
					volume[0],
					volume[1],
					poolsFeeMap[poolID][0],
					poolsFeeMap[poolID][1],
					timestamp,
				)
				if err != nil {
					fmt.Errorf("error while saving volume: %s", err)
				}
			}

			for poolID, rate := range poolsRateMap {
				err = m.db.SaveRate(
					poolID,
					rate,
					timestamp,
				)
				if err != nil {
					fmt.Errorf("error while saving rate: %s", err)
				}
			}

			for poolID := range poolsRateMap {
				// return err nil if not found and default pool row, later will panic on error
				pool, err := m.db.GetPoolInfo(poolID)
				if err == nil {
					// if we sync from non zero and parse current block
					// than save pool not from message but with query from application state
					if len(pool.Address) == 0 {
						poolState, err := m.keeper.GetPool(poolID, height)
						if err != nil {
							panic(err)
						}
						pool = dbtypes.PoolRow{
							PoolId:    int64(poolState.Id),
							PoolName:  poolState.Name(),
							Address:   poolState.ReserveAccountAddress,
							ADenom:    poolState.ReserveCoinDenoms[0],
							BDenom:    poolState.ReserveCoinDenoms[1],
							PoolDenom: poolState.PoolCoinDenom,
						}
						err = m.db.SavePool(
							poolState.Id,
							poolState.ReserveAccountAddress,
							poolState.Name(),
							poolState.ReserveCoinDenoms[0],
							poolState.ReserveCoinDenoms[1],
							poolState.PoolCoinDenom,
						)
						if err != nil {
							panic(err)
						}
					}

					err := m.bankModule.RefreshBalances(height, []string{pool.Address})
					if err != nil {
						log.Debug().Str("module", "liquidity").Err(err)
					}
					// if not in db that query application state
					poolBalances, err := m.db.GetAccountBalance(pool.Address)
					if len(poolBalances) == 0 {
						balances, err := m.bankModule.GetBalances([]string{pool.Address}, height)
						if err != nil {
							panic(err)
						}
						poolBalances = balances[0].Balance
					}
					if err != nil {
						log.Debug().Str("module", "liquidity").Err(err)
					}
					var coins = sdk.NewCoins(poolBalances...)
					err = m.db.SaveLiquidity(
						poolID,
						sdk.NewCoin(pool.ADenom, coins.AmountOfNoDenomValidation(pool.ADenom)),
						sdk.NewCoin(pool.BDenom, coins.AmountOfNoDenomValidation(pool.BDenom)),
						timestamp,
					)
					if err != nil {
						log.Debug().Str("module", "liquidity").Err(err)
					}
				} else {
					log.Debug().Str("module", "liquidity").Err(err)
				}
			}
		}
	}

	return nil
}

// not used, refactor
func (m *Module) executePoolCreations(height int64, beginBlockEvents []abcitypes.Event, timestamp time.Time) error {
	events := types.FindEventsByType(beginBlockEvents, liquiditytypes.EventTypeCreatePool)
	for _, event := range events {
		attrs := eventAttrsFromEvent(event)
		pool_id, err := attrs.PoolID()
		if err != nil {
			fmt.Errorf("error while parsing attr: %s", err)
		}
		pool_name, err := attrs.PoolName()
		if err != nil {
			fmt.Errorf("error while parsing attr: %s", err)
		}
		if err != nil {
			fmt.Errorf("error while parsing attr: %s", err)
		}
		reverse_account, err := attrs.ReserveAccount()
		if err != nil {
			fmt.Errorf("error while parsing attr: %s", err)
		}
		deposit, err := attrs.PoolDepositCoins()
		if err != nil {
			fmt.Errorf("error while parsing attr: %s", err)
		}
		pool_denom, err := attrs.PoolCoinDenom()
		if err != nil {
			fmt.Errorf("error while parsing attr: %s", err)
		}

		err = m.db.SavePool(
			pool_id,
			pool_name,
			reverse_account,
			deposit[0].Denom,
			deposit[1].Denom,
			pool_denom,
		)
	}
	return nil
}

type EventAttributes map[string]string

func eventAttrsFromEvent(event abcitypes.Event) EventAttributes {
	m := make(EventAttributes)
	for _, attr := range event.Attributes {
		m[string(attr.Key)] = string(attr.Value)
	}
	return m
}

func eventAttrsFromTxAttrs(attribute []sdk.Attribute) EventAttributes {
	m := make(EventAttributes)
	for _, attr := range attribute {
		m[attr.Key] = attr.Value
	}
	return m
}

func (attrs EventAttributes) Attr(key string) (string, error) {
	v, ok := attrs[key]
	if !ok {
		return "", fmt.Errorf("attribute %q not found", key)
	}
	return v, nil
}

func (attrs EventAttributes) PoolID() (uint64, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValuePoolId)
	if err != nil {
		return 0, err
	}
	id, err := strconv.ParseUint(v, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("parse pool id: %w", err)
	}
	return id, nil
}

func (attrs EventAttributes) DepositorAddr() (string, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValueDepositor)
	if err != nil {
		return "", err
	}
	return v, nil
}

func (attrs EventAttributes) SwapRequesterAddr() (string, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValueSwapRequester)
	if err != nil {
		return "", err
	}
	return v, nil
}

func (attrs EventAttributes) OfferCoinFee() (sdk.Coin, error) {
	denom, err := attrs.Attr(liquiditytypes.AttributeValueOfferCoinDenom)
	if err != nil {
		return sdk.Coin{}, err
	}
	v, err := attrs.Attr(liquiditytypes.AttributeValueOfferCoinFeeAmount)
	if err != nil {
		return sdk.Coin{}, err
	}
	amt, err := sdk.NewDecFromStr(v)
	if err != nil {
		return sdk.Coin{}, fmt.Errorf("parse offer coin fee amount: %w", err)
	}
	return sdk.NewCoin(denom, amt.TruncateInt()), nil
}

func (attrs EventAttributes) DemandCoinDenom() (string, error) {
	return attrs.Attr(liquiditytypes.AttributeValueDemandCoinDenom)
}

func (attrs EventAttributes) SwapStatus() (bool, error) {
	value, err := attrs.Attr(liquiditytypes.AttributeValueSuccess)
	if err != nil {
		return false, err
	}
	if value == liquiditytypes.Success {
		return true, nil
	} else {
		return false, nil
	}
}

func (attrs EventAttributes) SwapPrice() (sdk.Dec, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValueSwapPrice)
	if err != nil {
		return sdk.Dec{}, err
	}
	d, err := sdk.NewDecFromStr(v)
	if err != nil {
		return sdk.Dec{}, fmt.Errorf("parse swap price: %w", err)
	}
	return d, nil
}

func (attrs EventAttributes) CoinAttrs(denomKey, amountKey string) (sdk.Coin, error) {
	denom, err := attrs.Attr(denomKey)
	if err != nil {
		return sdk.Coin{}, err
	}
	amount, err := attrs.IntAttr(amountKey)
	if err != nil {
		return sdk.Coin{}, err
	}
	return sdk.NewCoin(denom, amount), nil
}

func (attrs EventAttributes) DecCoinAttrs(denomKey, amountKey string) (sdk.DecCoin, error) {
	denom, err := attrs.Attr(denomKey)
	if err != nil {
		return sdk.DecCoin{}, err
	}
	amount, err := attrs.DecAttr(amountKey)
	if err != nil {
		return sdk.DecCoin{}, err
	}
	return sdk.NewDecCoinFromDec(denom, amount), nil
}

func (attrs EventAttributes) IntAttr(key string) (sdk.Int, error) {
	s, err := attrs.Attr(key)
	if err != nil {
		return sdk.Int{}, err
	}
	i, ok := sdk.NewIntFromString(s)
	if !ok {
		return sdk.Int{}, fmt.Errorf("not an Int: %s", s)
	}
	return i, nil
}

func (attrs EventAttributes) DecAttr(key string) (sdk.Dec, error) {
	s, err := attrs.Attr(key)
	if err != nil {
		return sdk.Dec{}, err
	}
	d, err := sdk.NewDecFromStr(s)
	if err != nil {
		return sdk.Dec{}, err
	}
	return d, nil
}

func (attrs EventAttributes) PoolTypeId() (string, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValuePoolId)
	if err != nil {
		return "", err
	}
	return v, nil
}

func (attrs EventAttributes) PoolName() (string, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValuePoolName)
	if err != nil {
		return "", err
	}
	return v, nil
}

func (attrs EventAttributes) ReserveAccount() (string, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValueReserveAccount)
	if err != nil {
		return "", err
	}
	return v, nil
}

// sdk.NewAttribute(types.AttributeValueDepositCoins, msg.DepositCoins.String()),
func (attrs EventAttributes) PoolDepositCoins() ([]sdk.Coin, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValueDepositCoins)
	coins := strings.Split(v, ",")

	var data []sdk.Coin
	for _, coin := range coins {
		n := strings.IndexFunc(coin, unicode.IsLetter)
		amount, _ := sdk.NewIntFromString(coin[:n])
		data = append(data, sdk.NewCoin(coin[n:], amount))
	}

	if err != nil {
		return sdk.Coins{}, err
	}
	return data, nil
}

func (attrs EventAttributes) PoolCoinDenom() (string, error) {
	v, err := attrs.Attr(liquiditytypes.AttributeValuePoolCoinDenom)

	if err != nil {
		return "", err
	}
	return v, nil
}
