package bank

import (
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cybercongress/cyberindex/v2/database"
	"github.com/cybercongress/cyberindex/v2/modules/bank/source"
	"github.com/forbole/callisto/v4/types"
	junomessages "github.com/forbole/juno/v5/modules/messages"

	"github.com/forbole/juno/v5/modules"
)

var (
	_ modules.Module                   = &Module{}
	_ modules.GenesisModule            = &Module{}
	_ modules.MessageModule            = &Module{}
	_ modules.PeriodicOperationsModule = &Module{}
)

// Module represents the modules/bank module
type Module struct {
	cdc codec.Codec
	db  *database.CyberDb

	messageParser junomessages.MessageAddressesParser
	keeper        source.Source
}

// NewModule returns a new Module instance
func NewModule(
	messageParser junomessages.MessageAddressesParser,
	keeper source.Source,
	cdc codec.Codec,
	db *database.CyberDb,
) *Module {
	return &Module{
		cdc:           cdc,
		db:            db,
		messageParser: messageParser,
		keeper:        keeper,
	}
}

// Name implements modules.Module
func (m *Module) Name() string {
	return "bank"
}

func (m *Module) GetBalances(addresses []string, height int64) ([]types.AccountBalance, error) {
	return m.keeper.GetBalances(addresses, height)
}
