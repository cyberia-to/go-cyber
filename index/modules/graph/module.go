package graph

import (
	"github.com/cosmos/cosmos-sdk/codec"

	"github.com/cybercongress/cyberindex/v2/database"
	"github.com/forbole/juno/v5/modules"
)

var (
	_ modules.Module        = &Module{}
	_ modules.MessageModule = &Module{}
)

type Module struct {
	cdc codec.Codec
	db  *database.CyberDb
}

func NewModule(
	cdc codec.Codec,
	db *database.CyberDb,
) *Module {
	return &Module{
		cdc: cdc,
		db:  db,
	}
}

func (m *Module) Name() string {
	return "graph"
}
