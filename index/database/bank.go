package database

import (
	"fmt"
	types2 "github.com/cybercongress/cyberindex/v2/database/types"

	dbutils "github.com/cybercongress/cyberindex/v2/database/utils"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/lib/pq"

	"github.com/forbole/callisto/v4/types"
)

// SaveAccountBalances allows to store the given balances inside the database
func (db *CyberDb) SaveAccountBalances(balances []types.AccountBalance) error {
	if len(balances) == 0 {
		return nil
	}

	paramsNumber := 3
	slices := dbutils.SplitBalances(balances, paramsNumber)

	for _, balances := range slices {
		if len(balances) == 0 {
			continue
		}

		// Store up-to-date data
		err := db.saveUpToDateBalances(paramsNumber, balances)
		if err != nil {
			return fmt.Errorf("error while storing up-to-date balances: %s", err)
		}
	}

	return nil
}

func (db *CyberDb) saveUpToDateBalances(paramsNumber int, balances []types.AccountBalance) error {
	stmt := `INSERT INTO account_balance (address, coins, height) VALUES `
	var params []interface{}

	for i, bal := range balances {
		bi := i * paramsNumber
		stmt += fmt.Sprintf("($%d, $%d, $%d),", bi+1, bi+2, bi+3)

		coins := pq.Array(types2.NewDbCoins(bal.Balance))
		params = append(params, bal.Address, coins, bal.Height)
	}

	stmt = stmt[:len(stmt)-1]
	stmt += `
ON CONFLICT (address) DO UPDATE 
	SET coins = excluded.coins, 
	    height = excluded.height 
WHERE account_balance.height <= excluded.height`

	_, err := db.SQL.Exec(stmt, params...)
	if err != nil {
		return fmt.Errorf("error while storing up-to-date balances: %s", err)
	}

	return nil
}

// GetAccountBalance returns the balance of the user having the given address
func (db *CyberDb) GetAccountBalance(address string) ([]sdk.Coin, error) {
	stmt := `SELECT * FROM account_balance WHERE address = $1`

	var rows []types2.AccountBalanceRow
	err := db.Sqlx.Select(&rows, stmt, address)
	if err != nil {
		return nil, err
	}

	if len(rows) == 0 {
		return sdk.Coins{}, nil
	}

	return rows[0].Coins.ToCoins(), nil
}

// --------------------------------------------------------------------------------------------------------------------

// SaveSupply allows to save for the given height the given total amount of coins
func (db *CyberDb) SaveSupply(coins sdk.Coins, height int64) error {
	query := `
INSERT INTO supply (coins, height) 
VALUES ($1, $2) 
ON CONFLICT (one_row_id) DO UPDATE 
    SET coins = excluded.coins,
    	height = excluded.height
WHERE supply.height <= excluded.height`

	_, err := db.SQL.Exec(query, pq.Array(types2.NewDbCoins(coins)), height)
	if err != nil {
		return fmt.Errorf("error while storing supply: %s", err)
	}

	return nil
}
