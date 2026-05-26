package types

// AccountBalanceRow represents a single row inside the account_balance table
type AccountBalanceRow struct {
	Address string   `db:"address"`
	Coins   *DbCoins `db:"coins"`
	Height  int64    `db:"height"`
}

// NewAccountBalanceRow allows to build a new AccountBalanceRow instance
func NewAccountBalanceRow(address string, coins DbCoins, height int64) AccountBalanceRow {
	return AccountBalanceRow{
		Address: address,
		Coins:   &coins,
		Height:  height,
	}
}

// Equal tells whether a and b contain the same data
func (a AccountBalanceRow) Equal(b AccountBalanceRow) bool {
	return a.Address == b.Address &&
		a.Coins.Equal(b.Coins) &&
		a.Height == b.Height
}
