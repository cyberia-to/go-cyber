package wasm

import (
	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/authz"
	"github.com/cybercongress/cyberindex/v2/database"
	cybertypes "github.com/cybercongress/cyberindex/v2/database/types"
	"github.com/forbole/juno/v5/types"
)

func (m *Module) HandleMsgExec(index int, _ *authz.MsgExec, _ int, executedMsg sdk.Msg, tx *types.Tx) error {
	return m.HandleMsg(index, executedMsg, tx)
}

func (m *Module) HandleMsg(index int, msg sdk.Msg, tx *types.Tx) error {
	return HandleMsg(tx, index, msg, m.db)
}

func HandleMsg(
	tx *types.Tx,
	index int,
	msg sdk.Msg,
	db *database.CyberDb,
) error {
	if len(tx.Logs) == 0 {
		return nil
	}

	switch cosmosMsg := msg.(type) {
	case *wasmtypes.MsgInstantiateContract:
		return handleMsgInstantiateContract(tx, index, cosmosMsg, db)
	case *wasmtypes.MsgExecuteContract:
		return handleMsgExecuteContract(tx, index, cosmosMsg, db)
	}

	return nil
}

func handleMsgInstantiateContract(tx *types.Tx, index int, msg *wasmtypes.MsgInstantiateContract, db *database.CyberDb) error {
	event, err := tx.FindEventByType(index, wasmtypes.EventTypeInstantiate)
	if err != nil {
		return err
	}

	contractAddress, err := tx.FindAttributeByKey(event, wasmtypes.AttributeKeyContractAddr)
	if err != nil {
		return err
	}

	createdAt := &wasmtypes.AbsoluteTxPosition{
		BlockHeight: uint64(tx.Height),
		TxIndex:     uint64(index),
	}

	creator, _ := sdk.AccAddressFromBech32(msg.Sender)
	admin, _ := sdk.AccAddressFromBech32(msg.Admin)
	contractInfo := wasmtypes.NewContractInfo(msg.CodeID, creator, admin, msg.Label, createdAt)
	contract := cybertypes.NewContract(&contractInfo, contractAddress, tx.Timestamp)

	return db.SaveContract(contract)
}

func handleMsgExecuteContract(tx *types.Tx, index int, msg *wasmtypes.MsgExecuteContract, db *database.CyberDb) error {
	event, err := tx.FindEventByType(index, wasmtypes.EventTypeExecute)
	if err != nil {
		return err
	}

	contractAddress, err := tx.FindAttributeByKey(event, wasmtypes.AttributeKeyContractAddr)
	if err != nil {
		return err
	}

	fee := tx.GetFee()
	feeAmount := int64(0)
	if fee.Len() == 1 {
		feeAmount = fee[0].Amount.Int64()
	}

	return db.UpdateContractStats(contractAddress, 1, tx.GasUsed, feeAmount)
}
