package graphsync

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
)

type milestoneIndex struct {
	ChainID         string              `json:"chain_id"`
	MilestonePeriod int64               `json:"milestone_period"`
	Snapshots       []milestoneSnapshot `json:"snapshots"`
}

type milestoneSnapshot struct {
	Height    int64  `json:"height"`
	Timestamp int64  `json:"timestamp"`
	Particles uint64 `json:"particles"`
	Links     uint64 `json:"links"`
	Neurons   uint64 `json:"neurons"`
}

func (s *SyncService) snapshotBaseDir() string {
	return filepath.Join(s.homePath, "data", "snapshots")
}

func (s *SyncService) latestDir() string {
	return filepath.Join(s.snapshotBaseDir(), "latest")
}

func (s *SyncService) milestonesDir() string {
	return filepath.Join(s.snapshotBaseDir(), "milestones")
}

func (s *SyncService) tmpDir(height int64) string {
	return filepath.Join(s.snapshotBaseDir(), fmt.Sprintf(".tmp-%d", height))
}

func (s *SyncService) ensureDirectories() error {
	dirs := []string{
		s.snapshotBaseDir(),
		s.latestDir(),
		s.milestonesDir(),
	}
	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("failed to create directory %s: %w", dir, err)
		}
	}
	return nil
}

// promoteSnapshot atomically replaces the latest/ directory with the newly generated snapshot.
func (s *SyncService) promoteSnapshot(height int64) error {
	tmpDir := s.tmpDir(height)
	latestDir := s.latestDir()

	// Remove old latest (if any)
	oldDir := latestDir + ".old"
	_ = os.RemoveAll(oldDir)

	// Move current latest to .old
	if _, err := os.Stat(latestDir); err == nil {
		if err := os.Rename(latestDir, oldDir); err != nil {
			return fmt.Errorf("failed to move old latest: %w", err)
		}
	}

	// Move tmp to latest
	if err := os.Rename(tmpDir, latestDir); err != nil {
		// Try to restore old latest
		_ = os.Rename(oldDir, latestDir)
		return fmt.Errorf("failed to promote snapshot: %w", err)
	}

	// Clean up old
	_ = os.RemoveAll(oldDir)
	return nil
}

// createMilestone copies the latest snapshot to milestones/{height}/ and updates index.json.
func (s *SyncService) createMilestone(height int64) error {
	milestoneDir := filepath.Join(s.milestonesDir(), fmt.Sprintf("%d", height))
	if err := os.MkdirAll(milestoneDir, 0755); err != nil {
		return err
	}

	latestDir := s.latestDir()

	// Copy all files from latest to milestone directory
	entries, err := os.ReadDir(latestDir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		src := filepath.Join(latestDir, entry.Name())
		dst := filepath.Join(milestoneDir, entry.Name())
		if err := copyFile(src, dst); err != nil {
			return fmt.Errorf("failed to copy %s: %w", entry.Name(), err)
		}
	}

	// Update milestones/index.json
	return s.updateMilestoneIndex(height)
}

func (s *SyncService) updateMilestoneIndex(height int64) error {
	indexPath := filepath.Join(s.milestonesDir(), "index.json")

	var index milestoneIndex

	// Read existing index if present
	if data, err := os.ReadFile(indexPath); err == nil {
		_ = json.Unmarshal(data, &index)
	}

	s.mu.RLock()
	meta := s.latestMeta
	s.mu.RUnlock()

	if meta == nil {
		return nil
	}

	index.ChainID = meta.ChainID
	index.MilestonePeriod = s.cfg.MilestonePeriod

	// Add new milestone entry
	index.Snapshots = append(index.Snapshots, milestoneSnapshot{
		Height:    height,
		Timestamp: meta.Timestamp,
		Particles: meta.ParticlesCount,
		Links:     meta.LinksCount,
		Neurons:   meta.NeuronsCount,
	})

	// Sort by height descending
	sort.Slice(index.Snapshots, func(i, j int) bool {
		return index.Snapshots[i].Height > index.Snapshots[j].Height
	})

	data, err := json.MarshalIndent(index, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(indexPath, data, 0644)
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}
