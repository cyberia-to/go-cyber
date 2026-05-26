package modules

import (
	cyberdb "github.com/cybercongress/cyberindex/v2/database"
	"github.com/cybercongress/cyberindex/v2/modules/bank"
	"github.com/cybercongress/cyberindex/v2/modules/graph"
	"github.com/cybercongress/cyberindex/v2/modules/grid"
	"github.com/cybercongress/cyberindex/v2/modules/resources"
	"github.com/cybercongress/cyberindex/v2/modules/types"
	"github.com/cybercongress/cyberindex/v2/modules/wasm"
	"github.com/forbole/callisto/v4/database"
	"github.com/forbole/callisto/v4/modules"
	"github.com/forbole/callisto/v4/modules/auth"
	"github.com/forbole/callisto/v4/modules/consensus"
	dailyrefetch "github.com/forbole/callisto/v4/modules/daily_refetch"
	messagetype "github.com/forbole/callisto/v4/modules/message_type"
	bjmodules "github.com/forbole/callisto/v4/modules/modules"
	jmodules "github.com/forbole/juno/v5/modules"
	"github.com/forbole/juno/v5/modules/messages"
	"github.com/forbole/juno/v5/modules/registrar"
)

var (
	_ registrar.Registrar = &Registrar{}
)

type Registrar struct {
	parser messages.MessageAddressesParser
}

func NewRegistrar(parser messages.MessageAddressesParser) *Registrar {
	return &Registrar{
		parser: modules.UniqueAddressesParser(parser),
	}
}

func (r *Registrar) BuildModules(ctx registrar.Context) jmodules.Modules {
	cdc := ctx.EncodingConfig.Codec
	callistoDb := database.Cast(ctx.Database)
	cyberDb := &cyberdb.CyberDb{Db: callistoDb}

	sources, err := types.BuildSources(ctx.JunoConfig.Node, ctx.EncodingConfig)
	if err != nil {
		panic(err)
	}

	authModule := auth.NewModule(r.parser, cdc, callistoDb)
	bankModule := bank.NewModule(r.parser, sources.BankSource, cdc, cyberDb)

	consensusModule := consensus.NewModule(callistoDb)
	dailyRefetchModule := dailyrefetch.NewModule(ctx.Proxy, callistoDb)
	messagetypeModule := messagetype.NewModule(r.parser, cdc, callistoDb)

	graphModule := graph.NewModule(cdc, cyberDb)
	gridModule := grid.NewModule(r.parser, cdc, cyberDb)
	wasmModule := wasm.NewModule(r.parser, cdc, cyberDb)
	resourceModule := resources.NewModule(r.parser, cdc, cyberDb)
	//liquidityModule := liquidity.NewModule(r.parser, cdc, bankModule, authModule, sources.LiquiditySource, cyberDb)

	return []jmodules.Module{
		bjmodules.NewModule(ctx.JunoConfig.Chain, callistoDb),
		messages.NewModule(r.parser, cdc, ctx.Database),

		authModule,
		consensusModule,
		dailyRefetchModule,
		messagetypeModule,

		bankModule,
		graphModule,
		gridModule,
		resourceModule,
		wasmModule,
		//liquidityModule,

		// TODO add other modules
		//distrModule,
		//feegrantModule,
		//mintModule,
		//slashingModule,
		//stakingModule,
		//govModule,
		//upgradeModule,
	}
}
