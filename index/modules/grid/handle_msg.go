package grid

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/authz"
	gridtypes "github.com/cybercongress/go-cyber/v4/x/grid/types"

	"github.com/forbole/juno/v5/types"

	"github.com/cybercongress/cyberindex/v2/database"
)

func (m *Module) HandleMsgExec(index int, _ *authz.MsgExec, _ int, executedMsg sdk.Msg, tx *types.Tx) error {
	return m.HandleMsg(index, executedMsg, tx)
}

func (m *Module) HandleMsg(_ int, msg sdk.Msg, tx *types.Tx) error {
	return HandleMsg(tx, msg, m.db)

	// TODO refresh balances
}

func HandleMsg(
	tx *types.Tx,
	msg sdk.Msg,
	db *database.CyberDb,
) error {
	if len(tx.Logs) == 0 {
		return nil
	}
	switch energyMsg := msg.(type) {
	case *gridtypes.MsgCreateRoute:
		return db.SaveRoute(
			energyMsg.Source,
			energyMsg.Destination,
			energyMsg.Name,
			tx.Timestamp,
			tx.Height,
			tx.TxHash,
		)
	case *gridtypes.MsgEditRoute:
		return db.UpdateRouteValue(
			energyMsg.Source,
			energyMsg.Destination,
			energyMsg.Value,
		)
	case *gridtypes.MsgEditRouteName:
		return db.UpdateRouteAlias(
			energyMsg.Source,
			energyMsg.Destination,
			energyMsg.Name,
		)
	case *gridtypes.MsgDeleteRoute:
		return db.DeleteRoute(
			energyMsg.Source,
			energyMsg.Destination,
		)
	}

	return nil
}
