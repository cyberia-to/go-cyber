package bank

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/forbole/juno/v5/types"
	"github.com/rs/zerolog/log"

	"github.com/forbole/callisto/v4/modules/utils"
)

// HandleMsg implements modules.MessageModule
func (m *Module) HandleMsg(_ int, _ sdk.Msg, tx *types.Tx) error {
	addresses, err := m.messageParser(tx)
	if err != nil {
		log.Error().Str("module", "bank").Str("operation", "refresh balances").
			Err(err).Msgf("error while refreshing balances after transaction %s", tx.TxHash)
	}

	return m.RefreshBalances(tx.Height, utils.FilterNonAccountAddresses(addresses))
}
