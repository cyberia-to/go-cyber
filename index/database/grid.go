package database

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	dbtypes "github.com/forbole/callisto/v4/database/types"
	"github.com/lib/pq"
)

func (db *CyberDb) SaveRoute(
	source string,
	destination string,
	alias string,
	timestamp string,
	height int64,
	txHash string,
) error {
	query := `
		INSERT INTO routes (source, destination, alias, value, timestamp, height, transaction_hash)
		VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING
	`

	coins := pq.Array(dbtypes.NewDbCoins(sdk.Coins{}))

	_, err := db.SQL.Exec(query,
		source,
		destination,
		alias,
		coins,
		timestamp,
		height,
		txHash,
	)
	if err != nil {
		return err
	}

	return nil
}

func (db *CyberDb) UpdateRouteValue(
	source string,
	destination string,
	amount sdk.Coin,
) error {
	// TODO
	return nil
}

func (db *CyberDb) UpdateRouteAlias(
	source string,
	destination string,
	alias string,
) error {
	// TODO
	return nil
}

func (db *CyberDb) DeleteRoute(
	source string,
	destination string,
) error {
	query := `DELETE FROM routes WHERE source = $1 AND destination = $2`

	_, err := db.SQL.Exec(query, source, destination)
	if err != nil {
		return err
	}

	return nil
}
