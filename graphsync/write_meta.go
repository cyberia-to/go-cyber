package graphsync

import (
	"encoding/json"
	"os"
	"path/filepath"
)

func (s *SyncService) writeMeta(meta *SnapshotMeta) error {
	data, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return err
	}

	filePath := filepath.Join(s.tmpDir(meta.Height), "meta.json")
	return os.WriteFile(filePath, data, 0644)
}
