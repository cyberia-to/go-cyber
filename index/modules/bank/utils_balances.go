package bank

import (
	"github.com/rs/zerolog/log"
)

// RefreshBalances updates the balances of the accounts having the given addresses,
// taking the data at the provided height
func (m *Module) RefreshBalances(height int64, addresses []string) error {
	log.Debug().Str("module", "bank").Int64("height", height).Msg("refreshing balances")

	balances, err := m.keeper.GetBalances(addresses, height)
	if err != nil {
		return err
	}

	return m.db.SaveAccountBalances(balances)
}
