package liquidity

import (
	"fmt"
	coretypes "github.com/cometbft/cometbft/rpc/core/types"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cybercongress/cyberindex/v2/database"
	"github.com/cybercongress/cyberindex/v2/modules/liquidity/source"
	"github.com/forbole/juno/v5/modules"
	"github.com/forbole/juno/v5/modules/messages"
	"github.com/forbole/juno/v5/types"
)

var (
	_ modules.Module        = &Module{}
	_ modules.MessageModule = &Module{}
	_ modules.BlockModule   = &Module{}
	_ modules.PeriodicOperationsModule
)

type Module struct {
	messagesParser messages.MessageAddressesParser
	cdc            codec.Codec
	bankModule     BankModule
	authModule     AuthModule
	keeper         source.Source
	db             *database.CyberDb
}

func NewModule(
	messagesParser messages.MessageAddressesParser,
	cdc codec.Codec,
	bankModule BankModule,
	authModule AuthModule,
	keeper source.Source,
	db *database.CyberDb,
) *Module {
	return &Module{
		messagesParser: messagesParser,
		cdc:            cdc,
		bankModule:     bankModule,
		authModule:     authModule,
		keeper:         keeper,
		db:             db,
	}
}

func (m *Module) Name() string {
	return "liquidity"
}

func (m *Module) HandleBlock(block *coretypes.ResultBlock, results *coretypes.ResultBlockResults, txs []*types.Tx, vals *coretypes.ResultValidators) error {
	err := m.executePoolBatches(block.Block.Height, results.EndBlockEvents, block.Block.Time)
	if err != nil {
		return fmt.Errorf("error while executing pool batches: %s", err)
	}
	return nil
}
