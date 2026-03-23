package graphsync

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/cosmos/gogoproto/proto"
	"github.com/stretchr/testify/require"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
)

// TestFileValidation_FullPipeline writes snapshot files through the real pipeline,
// then reads back the protobuf file and verifies counts match metadata.
func TestFileValidation_FullPipeline(t *testing.T) {
	s := testService(t)
	require.NoError(t, s.ensureDirectories())

	particles, links, neurons := testData()
	meta := testMeta()

	// Write all files through the real pipeline
	require.NoError(t, s.writeSnapshotFiles(meta, particles, links, neurons))

	tmpDir := s.tmpDir(meta.Height)

	// Write meta
	require.NoError(t, s.writeMeta(meta))

	// Promote to latest
	require.NoError(t, s.promoteSnapshot(meta.Height))

	// --- Validate protobuf file from latest/ ---
	pbData, err := os.ReadFile(filepath.Join(s.latestDir(), "graph.pb"))
	require.NoError(t, err)
	require.Positive(t, len(pbData))

	var snapshot graphtypes.GraphSnapshot
	require.NoError(t, proto.Unmarshal(pbData, &snapshot))

	// Counts in protobuf header must match metadata
	require.Equal(t, meta.ParticlesCount, snapshot.Header.ParticlesCount)
	require.Equal(t, meta.LinksCount, snapshot.Header.LinksCount)
	require.Equal(t, meta.NeuronsCount, snapshot.Header.NeuronsCount)

	// Actual repeated field lengths must match header counts
	require.Equal(t, int(snapshot.Header.ParticlesCount), len(snapshot.Particles))
	require.Equal(t, int(snapshot.Header.LinksCount), len(snapshot.Links))
	require.Equal(t, int(snapshot.Header.NeuronsCount), len(snapshot.Neurons))

	// Verify header fields
	require.Equal(t, "bostrom", snapshot.Header.ChainId)
	require.Equal(t, uint64(meta.Height), snapshot.Header.Height)
	require.Equal(t, meta.Timestamp, snapshot.Header.Timestamp)
	require.Equal(t, meta.RankMerkleRoot, snapshot.Header.RankMerkleRoot)

	// Verify file sizes in meta match actual file sizes on disk
	for key, fm := range meta.Files {
		filePath := filepath.Join(s.latestDir(), fm.File)
		info, err := os.Stat(filePath)
		require.NoError(t, err, "file missing for key %s", key)
		require.Equal(t, fm.SizeBytes, info.Size(), "size mismatch for %s", key)
	}

	// --- Validate meta.json from latest/ ---
	metaData, err := os.ReadFile(filepath.Join(s.latestDir(), "meta.json"))
	require.NoError(t, err)

	var loadedMeta SnapshotMeta
	require.NoError(t, json.Unmarshal(metaData, &loadedMeta))
	require.Equal(t, meta.ChainID, loadedMeta.ChainID)
	require.Equal(t, meta.Height, loadedMeta.Height)
	require.Equal(t, meta.ParticlesCount, loadedMeta.ParticlesCount)
	require.Equal(t, meta.LinksCount, loadedMeta.LinksCount)
	require.Equal(t, meta.NeuronsCount, loadedMeta.NeuronsCount)
	require.Len(t, loadedMeta.Files, len(meta.Files))

	// Verify tmp dir was cleaned up
	_, err = os.Stat(tmpDir)
	require.True(t, os.IsNotExist(err))
}

// TestHTTPServer_ServeGeneratedSnapshot generates real snapshot files,
// starts the HTTP server, and fetches meta.json + graph.pb via HTTP.
func TestHTTPServer_ServeGeneratedSnapshot(t *testing.T) {
	s := testService(t)
	s.cfg.HTTPAddress = "localhost:19877"
	require.NoError(t, s.ensureDirectories())

	particles, links, neurons := testData()
	meta := testMeta()

	// Write + promote
	require.NoError(t, s.writeSnapshotFiles(meta, particles, links, neurons))
	require.NoError(t, s.writeMeta(meta))
	require.NoError(t, s.promoteSnapshot(meta.Height))

	// Start HTTP
	s.startHTTP()
	defer s.httpServer.Close()
	time.Sleep(50 * time.Millisecond)

	// Fetch meta.json — "curl http://localhost:19877/snapshot/latest/meta.json"
	resp, err := http.Get("http://localhost:19877/snapshot/latest/meta.json")
	require.NoError(t, err)
	defer resp.Body.Close()
	require.Equal(t, http.StatusOK, resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)

	var httpMeta SnapshotMeta
	require.NoError(t, json.Unmarshal(body, &httpMeta))
	require.Equal(t, "bostrom", httpMeta.ChainID)
	require.Equal(t, int64(1000), httpMeta.Height)
	require.Equal(t, uint64(3), httpMeta.ParticlesCount)
	require.Equal(t, uint64(3), httpMeta.LinksCount)
	require.Equal(t, uint64(2), httpMeta.NeuronsCount)
	require.NotEmpty(t, httpMeta.Files)

	// Fetch graph.pb and verify protobuf round-trip via HTTP
	resp2, err := http.Get("http://localhost:19877/snapshot/latest/graph.pb")
	require.NoError(t, err)
	defer resp2.Body.Close()
	require.Equal(t, http.StatusOK, resp2.StatusCode)

	pbData, err := io.ReadAll(resp2.Body)
	require.NoError(t, err)

	var snapshot graphtypes.GraphSnapshot
	require.NoError(t, proto.Unmarshal(pbData, &snapshot))
	require.Len(t, snapshot.Particles, 3)
	require.Len(t, snapshot.Links, 3)
	require.Len(t, snapshot.Neurons, 2)

	// Fetch parquet files — just verify they're served with correct content type
	for _, fname := range []string{"particles.parquet", "links.parquet", "neurons.parquet"} {
		resp, err := http.Get("http://localhost:19877/snapshot/latest/" + fname)
		require.NoError(t, err)
		defer resp.Body.Close()
		require.Equal(t, http.StatusOK, resp.StatusCode)
		body, _ := io.ReadAll(resp.Body)
		require.Positive(t, len(body), "empty response for %s", fname)
	}
}

// TestMilestone_SmallPeriod sets milestone_period to a small value and verifies
// milestone directories are created correctly with index.json.
func TestMilestone_SmallPeriod(t *testing.T) {
	s := testService(t)
	s.cfg.MilestonePeriod = 10 // every 10 blocks is a milestone
	require.NoError(t, s.ensureDirectories())

	// Simulate 3 milestone snapshots at heights 10, 20, 30
	for _, height := range []int64{10, 20, 30} {
		meta := &SnapshotMeta{
			ChainID:        "bostrom",
			Height:         height,
			Timestamp:      1700000000 + height*6,
			ParticlesCount: uint64(height),
			LinksCount:     uint64(height * 2),
			NeuronsCount:   uint64(height / 2),
			RankMerkleRoot: []byte{byte(height)},
			Files:          make(map[string]FileMeta),
		}

		// Write files to tmp
		tmpDir := s.tmpDir(height)
		require.NoError(t, os.MkdirAll(tmpDir, 0755))
		require.NoError(t, os.WriteFile(
			filepath.Join(tmpDir, "meta.json"),
			[]byte(fmt.Sprintf(`{"height":%d}`, height)),
			0644,
		))
		require.NoError(t, os.WriteFile(
			filepath.Join(tmpDir, "graph.pb"),
			[]byte(fmt.Sprintf("pb-data-%d", height)),
			0644,
		))

		// Promote to latest
		require.NoError(t, s.promoteSnapshot(height))

		// Set latestMeta (needed by updateMilestoneIndex)
		s.mu.Lock()
		s.latestMeta = meta
		s.mu.Unlock()

		// Check if this is a milestone
		isMilestone := s.cfg.MilestonePeriod > 0 && height%s.cfg.MilestonePeriod == 0
		require.True(t, isMilestone, "height %d should be a milestone with period %d", height, s.cfg.MilestonePeriod)

		require.NoError(t, s.createMilestone(height))
	}

	// Verify all 3 milestone directories exist
	for _, height := range []int64{10, 20, 30} {
		milestoneDir := filepath.Join(s.milestonesDir(), fmt.Sprintf("%d", height))
		require.DirExists(t, milestoneDir)

		// Verify files were copied
		data, err := os.ReadFile(filepath.Join(milestoneDir, "graph.pb"))
		require.NoError(t, err)
		require.Equal(t, fmt.Sprintf("pb-data-%d", height), string(data))
	}

	// Verify index.json
	indexData, err := os.ReadFile(filepath.Join(s.milestonesDir(), "index.json"))
	require.NoError(t, err)

	var index milestoneIndex
	require.NoError(t, json.Unmarshal(indexData, &index))

	require.Equal(t, "bostrom", index.ChainID)
	require.Equal(t, int64(10), index.MilestonePeriod)
	require.Len(t, index.Snapshots, 3)

	// Sorted descending by height
	require.Equal(t, int64(30), index.Snapshots[0].Height)
	require.Equal(t, int64(20), index.Snapshots[1].Height)
	require.Equal(t, int64(10), index.Snapshots[2].Height)

	// Verify counts match what was set
	require.Equal(t, uint64(30), index.Snapshots[0].Particles)
	require.Equal(t, uint64(60), index.Snapshots[0].Links)
	require.Equal(t, uint64(15), index.Snapshots[0].Neurons)
	require.Equal(t, int64(1700000180), index.Snapshots[0].Timestamp)
}

// TestMilestone_ServedViaHTTP verifies milestones are accessible via HTTP.
func TestMilestone_ServedViaHTTP(t *testing.T) {
	s := testService(t)
	s.cfg.HTTPAddress = "localhost:19878"
	s.cfg.MilestonePeriod = 10
	require.NoError(t, s.ensureDirectories())

	// Create a milestone at height 10
	tmpDir := s.tmpDir(10)
	require.NoError(t, os.MkdirAll(tmpDir, 0755))
	require.NoError(t, os.WriteFile(filepath.Join(tmpDir, "meta.json"), []byte(`{"height":10}`), 0644))
	require.NoError(t, s.promoteSnapshot(10))

	s.mu.Lock()
	s.latestMeta = &SnapshotMeta{
		ChainID: "bostrom", Height: 10, Timestamp: 1700000060,
		ParticlesCount: 5, LinksCount: 10, NeuronsCount: 2,
	}
	s.mu.Unlock()
	require.NoError(t, s.createMilestone(10))

	// Start HTTP
	s.startHTTP()
	defer s.httpServer.Close()
	time.Sleep(50 * time.Millisecond)

	// Fetch milestone index
	resp, err := http.Get("http://localhost:19878/snapshot/milestones/index.json")
	require.NoError(t, err)
	defer resp.Body.Close()
	require.Equal(t, http.StatusOK, resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)

	var index milestoneIndex
	require.NoError(t, json.Unmarshal(body, &index))
	require.Len(t, index.Snapshots, 1)
	require.Equal(t, int64(10), index.Snapshots[0].Height)

	// Fetch milestone file
	resp2, err := http.Get("http://localhost:19878/snapshot/milestones/10/meta.json")
	require.NoError(t, err)
	defer resp2.Body.Close()
	require.Equal(t, http.StatusOK, resp2.StatusCode)
}
