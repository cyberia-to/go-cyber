package liquidity

import "github.com/forbole/callisto/v4/types"

type BankModule interface {
	RefreshBalances(height int64, addresses []string) error
	GetBalances(addresses []string, height int64) ([]types.AccountBalance, error)
}

type AuthModule interface {
	RefreshAccounts(height int64, addresses []string) error
}
