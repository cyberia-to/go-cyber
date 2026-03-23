package graphsync

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/cometbft/cometbft/libs/log"
	"github.com/cosmos/gogoproto/proto"
	"github.com/parquet-go/parquet-go"
	"github.com/stretchr/testify/require"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
)

func testService(t *testing.T) *SyncService {
	t.Helper()
	tmpDir := t.TempDir()
	return &SyncService{
		cfg: GraphSyncConfig{
			Enabled:         true,
			SyncPeriod:      10,
			MilestonePeriod: 100,
			Protobuf:        true,
			Parquet:         true,
			HTTPAddress:     "localhost:0",
			RankDeltaBps:    100,
		},
		homePath: tmpDir,
		logger:   log.NewNopLogger(),
	}
}

func testData() ([]snapshotParticle, []snapshotLink, []snapshotNeuron) {
	particles := []snapshotParticle{
		{Number: 0, Cid: "QmTest1", Rank: 1000},
		{Number: 1, Cid: "QmTest2", Rank: 2000},
		{Number: 2, Cid: "QmTest3", Rank: 500},
	}
	links := []snapshotLink{
		{From: 0, To: 1, Account: 10, Height: 100},
		{From: 1, To: 2, Account: 10, Height: 200},
		{From: 0, To: 2, Account: 11, Height: 300},
	}
	neurons := []snapshotNeuron{
		{Number: 10, Address: "bostrom1abc", LinksCount: 2, BootStaked: 1000000, Hydrogen: 500, Ampere: 100, Volt: 50},
		{Number: 11, Address: "bostrom1def", LinksCount: 1, BootStaked: 500000, Hydrogen: 200, Ampere: 50, Volt: 25},
	}
	return particles, links, neurons
}

func testMeta() *SnapshotMeta {
	return &SnapshotMeta{
		ChainID:        "bostrom",
		Height:         1000,
		Timestamp:      1700000000,
		ParticlesCount: 3,
		LinksCount:     3,
		NeuronsCount:   2,
		RankMerkleRoot: []byte{0xab, 0xcd},
		Files:          make(map[string]FileMeta),
	}
}

// --- Protobuf round-trip ---

func TestWriteProtobuf_RoundTrip(t *testing.T) {
	s := testService(t)
	dir := t.TempDir()
	particles, links, neurons := testData()
	meta := testMeta()

	size, checksum, err := s.writeProtobuf(dir, meta, particles, links, neurons)
	require.NoError(t, err)
	require.Positive(t, size)
	require.Len(t, checksum, 32) // SHA-256

	// Read back and unmarshal
	data, err := os.ReadFile(filepath.Join(dir, "graph.pb"))
	require.NoError(t, err)
	require.Equal(t, int64(len(data)), size)

	var snapshot graphtypes.GraphSnapshot
	require.NoError(t, proto.Unmarshal(data, &snapshot))

	// Verify header
	require.Equal(t, "bostrom", snapshot.Header.ChainId)
	require.Equal(t, uint64(1000), snapshot.Header.Height)
	require.Equal(t, int64(1700000000), snapshot.Header.Timestamp)
	require.Equal(t, uint64(3), snapshot.Header.ParticlesCount)
	require.Equal(t, uint64(3), snapshot.Header.LinksCount)
	require.Equal(t, uint64(2), snapshot.Header.NeuronsCount)

	// Verify particles
	require.Len(t, snapshot.Particles, 3)
	require.Equal(t, "QmTest1", snapshot.Particles[0].Cid)
	require.Equal(t, uint64(1000), snapshot.Particles[0].Rank)
	require.Equal(t, "QmTest3", snapshot.Particles[2].Cid)

	// Verify links
	require.Len(t, snapshot.Links, 3)
	require.Equal(t, uint64(0), snapshot.Links[0].From)
	require.Equal(t, uint64(1), snapshot.Links[0].To)
	require.Equal(t, uint64(300), snapshot.Links[2].Height)

	// Verify neurons
	require.Len(t, snapshot.Neurons, 2)
	require.Equal(t, "bostrom1abc", snapshot.Neurons[0].Address)
	require.Equal(t, uint64(1000000), snapshot.Neurons[0].BootStaked)
	require.Equal(t, uint64(500), snapshot.Neurons[0].Hydrogen)
}

// --- Parquet round-trip ---

func TestWriteParquetFiles_RoundTrip(t *testing.T) {
	s := testService(t)
	dir := t.TempDir()
	particles, links, neurons := testData()
	meta := testMeta()

	err := s.writeParquetFiles(dir, meta, particles, links, neurons)
	require.NoError(t, err)

	// Verify particles parquet
	require.Contains(t, meta.Files, "parquet_particles")
	require.Equal(t, "particles.parquet", meta.Files["parquet_particles"].File)
	require.Positive(t, meta.Files["parquet_particles"].SizeBytes)

	pRows := readParticleParquet(t, filepath.Join(dir, "particles.parquet"))
	require.Len(t, pRows, 3)
	require.Equal(t, "QmTest1", pRows[0].Cid)
	require.Equal(t, uint64(2000), pRows[1].Rank)

	// Verify links parquet
	require.Contains(t, meta.Files, "parquet_links")
	lRows := readLinkParquet(t, filepath.Join(dir, "links.parquet"))
	require.Len(t, lRows, 3)
	require.Equal(t, uint64(0), lRows[0].From)
	require.Equal(t, uint64(1), lRows[0].To)

	// Verify neurons parquet
	require.Contains(t, meta.Files, "parquet_neurons")
	nRows := readNeuronParquet(t, filepath.Join(dir, "neurons.parquet"))
	require.Len(t, nRows, 2)
	require.Equal(t, "bostrom1abc", nRows[0].Address)
	require.Equal(t, uint64(1000000), nRows[0].BootStaked)
}

func readParticleParquet(t *testing.T, path string) []particleRow {
	t.Helper()
	f, err := os.Open(path)
	require.NoError(t, err)
	defer f.Close()

	reader := parquet.NewGenericReader[particleRow](f)
	defer reader.Close()

	rows := make([]particleRow, reader.NumRows())
	n, err := reader.Read(rows)
	require.NoError(t, err)
	return rows[:n]
}

func readLinkParquet(t *testing.T, path string) []linkRow {
	t.Helper()
	f, err := os.Open(path)
	require.NoError(t, err)
	defer f.Close()

	reader := parquet.NewGenericReader[linkRow](f)
	defer reader.Close()

	rows := make([]linkRow, reader.NumRows())
	n, err := reader.Read(rows)
	require.NoError(t, err)
	return rows[:n]
}

func readNeuronParquet(t *testing.T, path string) []neuronRow {
	t.Helper()
	f, err := os.Open(path)
	require.NoError(t, err)
	defer f.Close()

	reader := parquet.NewGenericReader[neuronRow](f)
	defer reader.Close()

	rows := make([]neuronRow, reader.NumRows())
	n, err := reader.Read(rows)
	require.NoError(t, err)
	return rows[:n]
}

// --- Meta JSON round-trip ---

func TestWriteMeta_RoundTrip(t *testing.T) {
	s := testService(t)
	meta := testMeta()
	meta.Files["protobuf"] = FileMeta{File: "graph.pb", SizeBytes: 12345, Checksum: "sha256:abc"}
	meta.GenerationTime = 42

	// Create tmpDir so writeMeta can write into it
	tmpDir := s.tmpDir(meta.Height)
	require.NoError(t, os.MkdirAll(tmpDir, 0755))

	require.NoError(t, s.writeMeta(meta))

	data, err := os.ReadFile(filepath.Join(tmpDir, "meta.json"))
	require.NoError(t, err)

	var loaded SnapshotMeta
	require.NoError(t, json.Unmarshal(data, &loaded))

	require.Equal(t, "bostrom", loaded.ChainID)
	require.Equal(t, int64(1000), loaded.Height)
	require.Equal(t, uint64(3), loaded.ParticlesCount)
	require.Equal(t, int64(42), loaded.GenerationTime)
	require.Equal(t, "graph.pb", loaded.Files["protobuf"].File)
	require.Equal(t, int64(12345), loaded.Files["protobuf"].SizeBytes)
}

// --- Checksum ---

func TestChecksumBytes(t *testing.T) {
	data := []byte("hello world")
	cs := checksumBytes(data)
	require.Len(t, cs, 32)

	// Same input -> same checksum
	cs2 := checksumBytes(data)
	require.Equal(t, cs, cs2)

	// Different input -> different checksum
	cs3 := checksumBytes([]byte("different"))
	require.NotEqual(t, cs, cs3)
}

func TestFileChecksum(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.bin")
	content := []byte("test content for checksum")
	require.NoError(t, os.WriteFile(path, content, 0644))

	size, hash, err := fileChecksum(path)
	require.NoError(t, err)
	require.Equal(t, int64(len(content)), size)
	require.Len(t, hash, 32)
}
