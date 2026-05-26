package grid

import (
	"github.com/forbole/juno/v5/modules"
	"github.com/forbole/juno/v5/modules/messages"

	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cybercongress/cyberindex/v2/database"
)

var (
	_ modules.Module        = &Module{}
	_ modules.MessageModule = &Module{}
)

type Module struct {
	messagesParser messages.MessageAddressesParser
	cdc            codec.Codec
	db             *database.CyberDb
}

func NewModule(
	messagesParser messages.MessageAddressesParser,
	cdc codec.Codec,
	db *database.CyberDb,
) *Module {
	return &Module{
		messagesParser: messagesParser,
		cdc:            cdc,
		db:             db,
	}
}

func (m *Module) Name() string {
	return "grid"
}
