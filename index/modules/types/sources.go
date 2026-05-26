package types

import (
	"fmt"
	"github.com/cometbft/cometbft/libs/log"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	banksource "github.com/cybercongress/cyberindex/v2/modules/bank/source"
	localbanksource "github.com/cybercongress/cyberindex/v2/modules/bank/source/local"
	remotebanksource "github.com/cybercongress/cyberindex/v2/modules/bank/source/remote"
	liquiditysource "github.com/cybercongress/cyberindex/v2/modules/liquidity/source"
	remoteliquiditysource "github.com/cybercongress/cyberindex/v2/modules/liquidity/source/remote"
	"github.com/cybercongress/go-cyber/v4/app"
	liquiditytypes "github.com/cybercongress/go-cyber/v4/x/liquidity/types"
	nodeconfig "github.com/forbole/juno/v5/node/config"
	"github.com/forbole/juno/v5/node/local"
	"github.com/forbole/juno/v5/node/remote"
	"github.com/forbole/juno/v5/types/params"
	"os"
)

type Sources struct {
	BankSource      banksource.Source
	LiquiditySource liquiditysource.Source
}

func BuildSources(nodeCfg nodeconfig.Config, encodingConfig params.EncodingConfig) (*Sources, error) {
	switch cfg := nodeCfg.Details.(type) {
	case *remote.Details:
		return buildRemoteSources(cfg)
	case *local.Details:
		return buildLocalSources(cfg, encodingConfig)

	default:
		return nil, fmt.Errorf("invalid configuration type: %T", cfg)
	}
}

func buildLocalSources(cfg *local.Details, encodingConfig params.EncodingConfig) (*Sources, error) {
	source, err := local.NewSource(cfg.Home, encodingConfig)
	if err != nil {
		return nil, err
	}

	cyberapp := app.NewApp(
		log.NewTMLogger(log.NewSyncWriter(os.Stdout)), source.StoreDB, nil, true, nil, nil, nil,
	)

	return &Sources{
		BankSource: localbanksource.NewSource(source, banktypes.QueryServer(cyberapp.BankKeeper)),
	}, nil
}

func buildRemoteSources(cfg *remote.Details) (*Sources, error) {
	source, err := remote.NewSource(cfg.GRPC)
	if err != nil {
		return nil, fmt.Errorf("error while creating remote source: %s", err)
	}

	return &Sources{
		BankSource:      remotebanksource.NewSource(source, banktypes.NewQueryClient(source.GrpcConn)),
		LiquiditySource: remoteliquiditysource.NewSource(source, liquiditytypes.NewQueryClient(source.GrpcConn)),
	}, nil
}
