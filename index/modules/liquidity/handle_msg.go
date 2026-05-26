package liquidity

import (
	"fmt"
	"github.com/cybercongress/cyberindex/v2/database"
	liquiditytypes "github.com/cybercongress/go-cyber/v4/x/liquidity/types"
	"github.com/forbole/callisto/v4/modules/utils"
	"github.com/rs/zerolog/log"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/forbole/juno/v5/types"
)

func (m *Module) HandleMsg(
	index int,
	msg sdk.Msg,
	tx *types.Tx,
) error {
	if len(tx.Logs) == 0 {
		return nil
	}

	switch cosmosMsg := msg.(type) {
	case *liquiditytypes.MsgSwapWithinBatch:
		return handleMsgSwapWithingBatch(tx, index, cosmosMsg, m.db)
	case *liquiditytypes.MsgDepositWithinBatch:
		return handleMsgDepositWithinBatch(tx, index, cosmosMsg, m.db)
	case *liquiditytypes.MsgWithdrawWithinBatch:
		return handleMsgWithdrawWithinBatch(tx, index, cosmosMsg, m.db)
	case *liquiditytypes.MsgCreatePool:
		return m.handleMsgMsgCreatePool(tx, index, cosmosMsg, m.db)
	}

	return nil
}

func handleMsgSwapWithingBatch(tx *types.Tx, index int, msg *liquiditytypes.MsgSwapWithinBatch, db *database.CyberDb) error {
	return nil
}

func handleMsgDepositWithinBatch(tx *types.Tx, index int, msg *liquiditytypes.MsgDepositWithinBatch, db *database.CyberDb) error {
	return nil
}

func handleMsgWithdrawWithinBatch(tx *types.Tx, index int, msg *liquiditytypes.MsgWithdrawWithinBatch, db *database.CyberDb) error {
	return nil
}

func (m *Module) handleMsgMsgCreatePool(tx *types.Tx, index int, msg *liquiditytypes.MsgCreatePool, db *database.CyberDb) error {
	logs := tx.Logs
	log.Debug().Str("module", "liquidity").Msg(logs.String())

	event := logs[0].Events[2].Attributes

	attrs := eventAttrsFromTxAttrs(event)
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

	err = m.authModule.RefreshAccounts(tx.Height, utils.FilterNonAccountAddresses([]string{reverse_account}))
	if err != nil {
		fmt.Errorf("error while parsing tx: %s", err)
	}

	deposit, err := attrs.PoolDepositCoins()
	if err != nil {
		fmt.Errorf("error while parsing attr: %s", err)
	}
	pool_denom, err := attrs.PoolCoinDenom()
	if err != nil {
		fmt.Errorf("error while parsing attr: %s", err)
	}

	err = db.SavePool(
		pool_id,
		reverse_account,
		pool_name,
		deposit[0].Denom,
		deposit[1].Denom,
		pool_denom,
	)

	return nil
}
