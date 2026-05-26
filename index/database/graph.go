package database

import (
	graphtypes "github.com/cybercongress/go-cyber/v4/x/graph/types"
)

func (db *CyberDb) SaveCyberlinks(
	cyberlinks []graphtypes.Link,
	neuron string,
	timestamp string,
	height int64,
	txHash string,
) error {
	queryCyberlinks := `
		INSERT INTO cyberlinks (particle_from, particle_to, neuron, timestamp, height, transaction_hash)
		VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING
	`
	queryParticles := `
		INSERT INTO particles (particle, neuron, timestamp, height, transaction_hash)
		VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING
	`

	for i, _ := range cyberlinks {
		_, err := db.SQL.Exec(queryCyberlinks,
			cyberlinks[i].From,
			cyberlinks[i].To,
			neuron,
			timestamp,
			height,
			txHash,
		)
		if err != nil {
			return err
		}

		_, err = db.SQL.Exec(queryParticles,
			cyberlinks[i].From,
			neuron,
			timestamp,
			height,
			txHash,
		)
		if err != nil {
			return err
		}

		_, err = db.SQL.Exec(queryParticles,
			cyberlinks[i].To,
			neuron,
			timestamp,
			height,
			txHash,
		)
		if err != nil {
			return err
		}
	}
	return nil
}
