package bank

import (
	"encoding/json"
	"fmt"

	authutils "github.com/forbole/callisto/v4/modules/auth"

	tmtypes "github.com/cometbft/cometbft/types"

	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	"github.com/rs/zerolog/log"

	"github.com/forbole/callisto/v4/types"
)

// HandleGenesis implements modules.GenesisModule
func (m *Module) HandleGenesis(doc *tmtypes.GenesisDoc, appState map[string]json.RawMessage) error {
	log.Debug().Str("module", "bank").Msg("parsing genesis")

	// Unmarshal the bank state
	var bankState banktypes.GenesisState
	if err := m.cdc.UnmarshalJSON(appState[banktypes.ModuleName], &bankState); err != nil {
		return fmt.Errorf("error while unmarhshaling bank state: %s", err)
	}

	// Store the balances
	accounts, err := authutils.GetGenesisAccounts(appState, m.cdc)
	if err != nil {
		return fmt.Errorf("error while getting genesis account: %s", err)
	}
	accountsMap := getAccountsMap(accounts)

	var balances []types.AccountBalance
	for _, balance := range bankState.Balances {
		_, ok := accountsMap[balance.Address]
		if !ok {
			continue
		}

		balances = append(balances, types.NewAccountBalance(balance.Address, balance.Coins, doc.InitialHeight))
	}

	return m.db.SaveAccountBalances(balances)
}

func getAccountsMap(accounts []types.Account) map[string]bool {
	var accountsMap = make(map[string]bool, len(accounts))
	for _, account := range accounts {
		accountsMap[account.Address] = true
	}
	return accountsMap
}
