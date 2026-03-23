package graphsync

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestDefaultGraphSyncConfig(t *testing.T) {
	cfg := DefaultGraphSyncConfig()

	require.False(t, cfg.Enabled)
	require.Equal(t, int64(1000), cfg.SyncPeriod)
	require.Equal(t, int64(100000), cfg.MilestonePeriod)
	require.True(t, cfg.Protobuf)
	require.True(t, cfg.Parquet)
	require.Equal(t, "localhost:9999", cfg.HTTPAddress)
	require.Equal(t, int64(100), cfg.RankDeltaBps)
}
