package graphsync

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
)

func TestLatestSnapshot_NoData(t *testing.T) {
	s := testService(t)

	_, err := s.LatestSnapshot(context.Background(), &graphtypes.QueryLatestSnapshotRequest{})
	require.Error(t, err)
	require.Contains(t, err.Error(), "no snapshot available")
}

func TestLatestSnapshot_WithData(t *testing.T) {
	s := testService(t)
	s.latestMeta = &SnapshotMeta{
		ChainID:        "bostrom",
		Height:         5000,
		Timestamp:      1700000000,
		ParticlesCount: 100,
		LinksCount:     200,
		NeuronsCount:   50,
		RankMerkleRoot: []byte{0x01, 0x02},
		Files: map[string]FileMeta{
			"protobuf":          {File: "graph.pb", SizeBytes: 1024, Checksum: "sha256:abc"},
			"parquet_particles": {File: "particles.parquet", SizeBytes: 2048},
			"parquet_links":     {File: "links.parquet", SizeBytes: 4096},
			"parquet_neurons":   {File: "neurons.parquet", SizeBytes: 512},
		},
	}

	resp, err := s.LatestSnapshot(context.Background(), &graphtypes.QueryLatestSnapshotRequest{})
	require.NoError(t, err)

	require.Equal(t, "bostrom", resp.ChainId)
	require.Equal(t, uint64(5000), resp.Height)
	require.Equal(t, int64(1700000000), resp.Timestamp)
	require.Equal(t, uint64(100), resp.ParticlesCount)
	require.Equal(t, uint64(200), resp.LinksCount)
	require.Equal(t, uint64(50), resp.NeuronsCount)

	// Verify URLs
	require.Contains(t, resp.ProtobufUrl, "graph.pb")
	require.Equal(t, uint64(1024), resp.ProtobufSize)
	require.Equal(t, "sha256:abc", resp.ProtobufChecksum)
	require.Contains(t, resp.ParquetParticlesUrl, "particles.parquet")
	require.Equal(t, uint64(2048), resp.ParquetParticlesSize)
	require.Contains(t, resp.ParquetLinksUrl, "links.parquet")
	require.Contains(t, resp.ParquetNeuronsUrl, "neurons.parquet")
}

func TestNotifySubscribers(t *testing.T) {
	s := testService(t)

	ch1 := make(chan *graphtypes.GraphUpdate, 4)
	ch2 := make(chan *graphtypes.GraphUpdate, 4)
	s.subscribers = []chan *graphtypes.GraphUpdate{ch1, ch2}

	update := &graphtypes.GraphUpdate{
		ToHeight:       2000,
		TotalParticles: 10,
	}

	s.notifySubscribers(update)

	// Both subscribers should receive the update
	u1 := <-ch1
	require.Equal(t, uint64(2000), u1.ToHeight)

	u2 := <-ch2
	require.Equal(t, uint64(2000), u2.ToHeight)
}

func TestNotifySubscribers_SlowSubscriberDropped(t *testing.T) {
	s := testService(t)

	// Unbuffered channel — will block
	slowCh := make(chan *graphtypes.GraphUpdate)
	fastCh := make(chan *graphtypes.GraphUpdate, 4)
	s.subscribers = []chan *graphtypes.GraphUpdate{slowCh, fastCh}

	update := &graphtypes.GraphUpdate{ToHeight: 3000}
	s.notifySubscribers(update)

	// Fast subscriber got it
	u := <-fastCh
	require.Equal(t, uint64(3000), u.ToHeight)

	// Slow subscriber's channel is empty (update was dropped)
	select {
	case <-slowCh:
		t.Fatal("slow subscriber should not have received update")
	default:
		// expected
	}
}
