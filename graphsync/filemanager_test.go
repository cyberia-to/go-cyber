package graphsync

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestEnsureDirectories(t *testing.T) {
	s := testService(t)
	require.NoError(t, s.ensureDirectories())

	require.DirExists(t, s.snapshotBaseDir())
	require.DirExists(t, s.latestDir())
	require.DirExists(t, s.milestonesDir())
}

func TestPromoteSnapshot(t *testing.T) {
	s := testService(t)
	require.NoError(t, s.ensureDirectories())

	height := int64(1000)
	tmpDir := s.tmpDir(height)
	require.NoError(t, os.MkdirAll(tmpDir, 0755))

	// Write a test file in tmp
	require.NoError(t, os.WriteFile(filepath.Join(tmpDir, "meta.json"), []byte(`{"height":1000}`), 0644))
	require.NoError(t, os.WriteFile(filepath.Join(tmpDir, "graph.pb"), []byte("protobuf data"), 0644))

	// Promote
	require.NoError(t, s.promoteSnapshot(height))

	// Verify latest has the files
	data, err := os.ReadFile(filepath.Join(s.latestDir(), "meta.json"))
	require.NoError(t, err)
	require.Contains(t, string(data), "1000")

	data, err = os.ReadFile(filepath.Join(s.latestDir(), "graph.pb"))
	require.NoError(t, err)
	require.Equal(t, "protobuf data", string(data))

	// Verify tmp is gone
	_, err = os.Stat(tmpDir)
	require.True(t, os.IsNotExist(err))
}

func TestPromoteSnapshot_ReplacesOldLatest(t *testing.T) {
	s := testService(t)
	require.NoError(t, s.ensureDirectories())

	// Create first snapshot
	tmp1 := s.tmpDir(1000)
	require.NoError(t, os.MkdirAll(tmp1, 0755))
	require.NoError(t, os.WriteFile(filepath.Join(tmp1, "meta.json"), []byte(`{"height":1000}`), 0644))
	require.NoError(t, s.promoteSnapshot(1000))

	// Create second snapshot
	tmp2 := s.tmpDir(2000)
	require.NoError(t, os.MkdirAll(tmp2, 0755))
	require.NoError(t, os.WriteFile(filepath.Join(tmp2, "meta.json"), []byte(`{"height":2000}`), 0644))
	require.NoError(t, s.promoteSnapshot(2000))

	// Verify latest now has height 2000
	data, err := os.ReadFile(filepath.Join(s.latestDir(), "meta.json"))
	require.NoError(t, err)
	require.Contains(t, string(data), "2000")
}

func TestCreateMilestone(t *testing.T) {
	s := testService(t)
	require.NoError(t, s.ensureDirectories())

	// Set up latestMeta for milestone index
	s.latestMeta = &SnapshotMeta{
		ChainID:        "bostrom",
		Height:         100000,
		Timestamp:      1700000000,
		ParticlesCount: 100,
		LinksCount:     200,
		NeuronsCount:   50,
	}

	// Create files in latest
	require.NoError(t, os.WriteFile(filepath.Join(s.latestDir(), "meta.json"), []byte(`{"height":100000}`), 0644))
	require.NoError(t, os.WriteFile(filepath.Join(s.latestDir(), "graph.pb"), []byte("pb data"), 0644))

	// Create milestone
	require.NoError(t, s.createMilestone(100000))

	// Verify milestone directory
	milestoneDir := filepath.Join(s.milestonesDir(), "100000")
	require.DirExists(t, milestoneDir)

	data, err := os.ReadFile(filepath.Join(milestoneDir, "meta.json"))
	require.NoError(t, err)
	require.Contains(t, string(data), "100000")

	data, err = os.ReadFile(filepath.Join(milestoneDir, "graph.pb"))
	require.NoError(t, err)
	require.Equal(t, "pb data", string(data))
}

func TestUpdateMilestoneIndex(t *testing.T) {
	s := testService(t)
	require.NoError(t, s.ensureDirectories())

	s.latestMeta = &SnapshotMeta{
		ChainID:        "bostrom",
		Height:         100000,
		Timestamp:      1700000000,
		ParticlesCount: 100,
		LinksCount:     200,
		NeuronsCount:   50,
	}

	require.NoError(t, s.updateMilestoneIndex(100000))

	// Add second milestone
	s.latestMeta = &SnapshotMeta{
		ChainID:        "bostrom",
		Height:         200000,
		Timestamp:      1700100000,
		ParticlesCount: 150,
		LinksCount:     300,
		NeuronsCount:   60,
	}
	require.NoError(t, s.updateMilestoneIndex(200000))

	// Read index
	data, err := os.ReadFile(filepath.Join(s.milestonesDir(), "index.json"))
	require.NoError(t, err)

	var index milestoneIndex
	require.NoError(t, json.Unmarshal(data, &index))

	require.Equal(t, "bostrom", index.ChainID)
	require.Len(t, index.Snapshots, 2)
	// Sorted descending by height
	require.Equal(t, int64(200000), index.Snapshots[0].Height)
	require.Equal(t, int64(100000), index.Snapshots[1].Height)
	require.Equal(t, uint64(150), index.Snapshots[0].Particles)
}

func TestCopyFile(t *testing.T) {
	dir := t.TempDir()
	src := filepath.Join(dir, "src.txt")
	dst := filepath.Join(dir, "dst.txt")

	content := []byte("copy me!")
	require.NoError(t, os.WriteFile(src, content, 0644))
	require.NoError(t, copyFile(src, dst))

	data, err := os.ReadFile(dst)
	require.NoError(t, err)
	require.Equal(t, content, data)
}

func TestDirectoryPaths(t *testing.T) {
	s := testService(t)

	require.Contains(t, s.snapshotBaseDir(), "data/snapshots")
	require.Contains(t, s.latestDir(), "data/snapshots/latest")
	require.Contains(t, s.milestonesDir(), "data/snapshots/milestones")
	require.Contains(t, s.tmpDir(1000), ".tmp-1000")
}
