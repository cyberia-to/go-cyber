package database

import (
	"github.com/cybercongress/cyberindex/v2/database/types"
)

// SaveContract allows to save the given contract into the database.
func (db *CyberDb) SaveContract(contract types.Contract) error {
	stmt := `
INSERT INTO contracts (code_id, address, creator, admin, label, creation_time, height) 
VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := db.SQL.Exec(stmt, contract.CodeID, contract.Address, contract.Creator, contract.Admin, contract.Label, contract.CreatedTime, contract.Created.BlockHeight)
	return err
}

// UpdateContractStats update stats by contract call.
func (db *CyberDb) UpdateContractStats(contract string, tx, gas, fees int64) error {
	stmt := `
UPDATE contracts SET tx=tx+$2, gas=gas+$3, fees=fees+$4 WHERE address = $1`
	_, err := db.SQL.Exec(stmt, contract, tx, gas, fees)
	return err
}
