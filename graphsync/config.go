package graphsync

import (
	servertypes "github.com/cosmos/cosmos-sdk/server/types"
	"github.com/spf13/cast"
)

type GraphSyncConfig struct {
	Enabled         bool   `mapstructure:"enabled"`
	SyncPeriod      int64  `mapstructure:"sync_period"`
	MilestonePeriod int64  `mapstructure:"milestone_period"`
	Protobuf        bool   `mapstructure:"protobuf"`
	Parquet         bool   `mapstructure:"parquet"`
	HTTPAddress     string `mapstructure:"http_address"`
	RankDeltaBps    int64  `mapstructure:"rank_delta_bps"`
}

func DefaultGraphSyncConfig() GraphSyncConfig {
	return GraphSyncConfig{
		Enabled:         false,
		SyncPeriod:      1000,
		MilestonePeriod: 100000,
		Protobuf:        true,
		Parquet:         true,
		HTTPAddress:     "localhost:9999",
		RankDeltaBps:    100,
	}
}

func ReadConfig(appOpts servertypes.AppOptions) GraphSyncConfig {
	return GraphSyncConfig{
		Enabled:         cast.ToBool(appOpts.Get("graph-sync.enabled")),
		SyncPeriod:      cast.ToInt64(appOpts.Get("graph-sync.sync_period")),
		MilestonePeriod: cast.ToInt64(appOpts.Get("graph-sync.milestone_period")),
		Protobuf:        cast.ToBool(appOpts.Get("graph-sync.protobuf")),
		Parquet:         cast.ToBool(appOpts.Get("graph-sync.parquet")),
		HTTPAddress:     cast.ToString(appOpts.Get("graph-sync.http_address")),
		RankDeltaBps:    cast.ToInt64(appOpts.Get("graph-sync.rank_delta_bps")),
	}
}

const DefaultConfigTemplate = `

###############################################################################
###                         Graph Sync Configuration                        ###
###############################################################################

[graph-sync]

# Enable periodic graph snapshot generation
enabled = {{ .GraphSync.Enabled }}

# Generate rolling snapshot every N blocks (must be divisible by CalculationPeriod)
# 1000 blocks ≈ 1.7 hours at 6s block time
sync_period = {{ .GraphSync.SyncPeriod }}

# Keep permanent milestone snapshot every N blocks
# 100000 blocks ≈ 7 days at 6s block time
# Set to 0 to disable milestones
milestone_period = {{ .GraphSync.MilestonePeriod }}

# Generate protobuf format (.pb)
protobuf = {{ .GraphSync.Protobuf }}

# Generate parquet format (.parquet)
parquet = {{ .GraphSync.Parquet }}

# HTTP server address for serving snapshot files
# Set to "" to disable HTTP serving (files still generated on disk)
http_address = "{{ .GraphSync.HTTPAddress }}"

# Minimum rank change (basis points, 100 = 1%) to include in diff updates
rank_delta_bps = {{ .GraphSync.RankDeltaBps }}
`
