package graph

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/authz"
	graphtypes "github.com/cybercongress/go-cyber/v4/x/graph/types"

	"github.com/forbole/juno/v5/types"

	"github.com/cybercongress/cyberindex/v2/database"
)

func (m *Module) HandleMsgExec(index int, _ *authz.MsgExec, _ int, executedMsg sdk.Msg, tx *types.Tx) error {
	return m.HandleMsg(index, executedMsg, tx)
}

func (m *Module) HandleMsg(_ int, msg sdk.Msg, tx *types.Tx) error {
	return HandleMsg(tx, msg, m.db)
}

func HandleMsg(
	tx *types.Tx,
	msg sdk.Msg,
	db *database.CyberDb,
) error {
	if len(tx.Logs) == 0 {
		return nil
	}
	switch graphMsg := msg.(type) {
	case *graphtypes.MsgCyberlink:
		return db.SaveCyberlinks(
			graphMsg.Links,
			graphMsg.Neuron,
			tx.Timestamp,
			tx.Height,
			tx.TxHash,
		)
	}

	return nil
}
