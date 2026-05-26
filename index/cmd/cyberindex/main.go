package main

import (
	"github.com/cybercongress/cyberindex/v2/modules"
	cyberapp "github.com/cybercongress/go-cyber/v4/app"
	migratecmd "github.com/forbole/callisto/v4/cmd/migrate"
	"github.com/forbole/callisto/v4/database"
	"github.com/forbole/callisto/v4/types/config"
	"github.com/forbole/juno/v5/cmd"
	initcmd "github.com/forbole/juno/v5/cmd/init"
	parsecmd "github.com/forbole/juno/v5/cmd/parse"
	parsetypes "github.com/forbole/juno/v5/cmd/parse/types"
	startcmd "github.com/forbole/juno/v5/cmd/start"
	junomessages "github.com/forbole/juno/v5/modules/messages"
	"github.com/forbole/juno/v5/types/params"
)

func main() {
	initCfg := initcmd.NewConfig().
		WithConfigCreator(config.Creator)

	parseCfg := parsetypes.NewConfig().
		WithRegistrar(modules.NewRegistrar(getAddressesParser())).
		WithEncodingConfigBuilder(func() params.EncodingConfig {
			return params.EncodingConfig(cyberapp.MakeEncodingConfig())
		}).
		WithDBBuilder(database.Builder)

	cfg := cmd.NewConfig("cyberindex").
		WithInitConfig(initCfg).
		WithParseConfig(parseCfg)

	rootCmd := cmd.RootCmd(cfg.GetName())

	rootCmd.AddCommand(
		cmd.VersionCmd(),
		initcmd.NewInitCmd(cfg.GetInitConfig()),
		parsecmd.NewParseCmd(cfg.GetParseConfig()),
		migratecmd.NewMigrateCmd(cfg.GetName(), cfg.GetParseConfig()),
		startcmd.NewStartCmd(cfg.GetParseConfig()),
	)

	executor := cmd.PrepareRootCmd(cfg.GetName(), rootCmd)
	err := executor.Execute()
	if err != nil {
		panic(err)
	}
}

func getAddressesParser() junomessages.MessageAddressesParser {
	return junomessages.JoinMessageParsers(
		junomessages.CosmosMessageAddressesParser,
		//cybermessages.CyberMessageAddressesParser,
		//cybermessages.WasmMessageAddressesParser,
		//cybermessages.LiquidityMessageAddressesParser,
	)
}
