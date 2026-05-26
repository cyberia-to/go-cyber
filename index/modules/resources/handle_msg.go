package resources

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/authz"
	resourcestypes "github.com/cybercongress/go-cyber/v4/x/resources/types"

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
	switch resourcesMsg := msg.(type) {
	case *resourcestypes.MsgInvestmint:
		return db.SaveInvestmints(
			resourcesMsg.Neuron,
			resourcesMsg.Amount,
			resourcesMsg.Resource,
			resourcesMsg.Length,
			tx.Timestamp,
			tx.Height,
			tx.TxHash,
		)
	}

	return nil
}
