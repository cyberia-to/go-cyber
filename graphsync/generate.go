package graphsync

import (
	"crypto/sha256"
	"fmt"
	"os"
	"time"

	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
	"github.com/cybercongress/go-cyber/v7/utils"
)

// Snapshot data containers used during generation.
type snapshotParticle struct {
	Number uint64
	Cid    string
	Rank   uint64
}

type snapshotLink struct {
	From    uint64
	To      uint64
	Account uint64
	Height  uint64
}

type snapshotNeuron struct {
	Number     uint64
	Address    string
	LinksCount uint64
	BootStaked uint64
	Hydrogen   uint64
	Ampere     uint64
	Volt       uint64
}

func (s *SyncService) generateSnapshot(height int64, chainID string, timestamp time.Time) error {
	// Create a fresh copy of store keys for each snapshot (NewContextWithMSVersion mutates the map)
	keysCopy := make(map[string]*storetypes.KVStoreKey, len(s.storeKeys))
	for k, v := range s.storeKeys {
		keysCopy[k] = v
	}

	// Use height-1 because at EndBlocker(height) the current block
	// hasn't been committed to IAVL yet — only height-1 is available.
	iavlHeight := height - 1
	ctx, err := utils.NewContextWithMSVersion(s.db, iavlHeight, keysCopy)
	if err != nil {
		return fmt.Errorf("failed to create context at height %d: %w", iavlHeight, err)
	}

	s.logger.Info("Collecting graph snapshot data", "height", height)

	// 1. Collect particles (CIDs + rank)
	particles := s.collectParticles(ctx)

	// 2. Collect links (from IAVL with height data)
	links := s.collectLinks(ctx)

	// 3. Collect neurons (neudeg + account addresses + balances)
	neurons := s.collectNeurons(ctx)

	// 4. Get rank merkle root
	rankMerkleRoot := s.rankKeeper.GetLatestMerkleTree(ctx)

	s.logger.Info("Snapshot data collected",
		"height", height,
		"particles", len(particles),
		"links", len(links),
		"neurons", len(neurons),
	)

	// 5. Determine if this is a milestone
	isMilestone := s.cfg.MilestonePeriod > 0 && height%s.cfg.MilestonePeriod == 0

	// 6. Write files
	meta := &SnapshotMeta{
		ChainID:        chainID,
		Height:         height,
		Timestamp:      timestamp.Unix(),
		IsMilestone:    isMilestone,
		ParticlesCount: uint64(len(particles)),
		LinksCount:     uint64(len(links)),
		NeuronsCount:   uint64(len(neurons)),
		RankMerkleRoot: rankMerkleRoot,
		Files:          make(map[string]FileMeta),
	}

	start := time.Now()

	if err := s.writeSnapshotFiles(meta, particles, links, neurons); err != nil {
		return fmt.Errorf("failed to write snapshot files: %w", err)
	}

	meta.GenerationTime = time.Since(start).Milliseconds()

	// 7. Write meta.json
	if err := s.writeMeta(meta); err != nil {
		return fmt.Errorf("failed to write meta.json: %w", err)
	}

	// 8. Promote to latest (atomic rename)
	if err := s.promoteSnapshot(height); err != nil {
		return fmt.Errorf("failed to promote snapshot: %w", err)
	}

	// 9. Handle milestone
	if isMilestone {
		if err := s.createMilestone(height); err != nil {
			s.logger.Error("Failed to create milestone", "height", height, "err", err)
			// Non-fatal — rolling snapshot is still valid
		}
	}

	// 10. Compute diff and notify subscribers
	update := s.computeDiff(particles, links, neurons, meta)
	s.saveDiffState(particles, neurons, height)

	// 11. Update in-memory state
	s.mu.Lock()
	s.latestMeta = meta
	s.mu.Unlock()

	// 12. Push update to streaming subscribers
	s.notifySubscribers(update)

	return nil
}

func (s *SyncService) collectParticles(ctx sdk.Context) []snapshotParticle {
	count := s.graphKeeper.GetCidsCount(ctx)
	particles := make([]snapshotParticle, 0, count)

	s.graphKeeper.IterateCids(ctx, func(cid graphtypes.Cid, num graphtypes.CidNumber) {
		rank := s.rankKeeper.GetRankValueByNumber(uint64(num))
		particles = append(particles, snapshotParticle{
			Number: uint64(num),
			Cid:    string(cid),
			Rank:   rank,
		})
	})

	return particles
}

func (s *SyncService) collectLinks(ctx sdk.Context) []snapshotLink {
	count := s.graphKeeper.GetLinksCount(ctx)
	links := make([]snapshotLink, 0, count)

	s.graphKeeper.IterateBinaryLinks(ctx, func(key, value []byte) {
		links = append(links, snapshotLink{
			From:    sdk.BigEndianToUint64(key[1:9]),
			Account: sdk.BigEndianToUint64(key[9:17]),
			To:      sdk.BigEndianToUint64(key[17:25]),
			Height:  sdk.BigEndianToUint64(value),
		})
	})

	return links
}

func (s *SyncService) collectNeurons(ctx sdk.Context) []snapshotNeuron {
	neudegs := s.graphKeeper.GetNeudegs()
	if len(neudegs) == 0 {
		return nil
	}

	// Build accNumber → address map by iterating all accounts
	addrMap := make(map[uint64]sdk.AccAddress, len(neudegs))
	s.accountKeeper.IterateAccounts(ctx, func(acc authtypes.AccountI) bool {
		num := acc.GetAccountNumber()
		if _, exists := neudegs[num]; exists {
			addrMap[num] = acc.GetAddress()
		}
		return false
	})

	neurons := make([]snapshotNeuron, 0, len(neudegs))
	for accNum, linkCount := range neudegs {
		addr, ok := addrMap[accNum]
		if !ok {
			continue
		}

		staked := s.stakingKeeper.GetDelegatorBonded(ctx, addr)
		h := s.bankKeeper.GetBalance(ctx, addr, "hydrogen")
		a := s.bankKeeper.GetBalance(ctx, addr, "ampere")
		v := s.bankKeeper.GetBalance(ctx, addr, "volt")

		neurons = append(neurons, snapshotNeuron{
			Number:     accNum,
			Address:    addr.String(),
			LinksCount: linkCount,
			BootStaked: staked.Uint64(),
			Hydrogen:   h.Amount.Uint64(),
			Ampere:     a.Amount.Uint64(),
			Volt:       v.Amount.Uint64(),
		})
	}

	return neurons
}

func (s *SyncService) writeSnapshotFiles(
	meta *SnapshotMeta,
	particles []snapshotParticle,
	links []snapshotLink,
	neurons []snapshotNeuron,
) error {
	tmpDir := s.tmpDir(meta.Height)
	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return fmt.Errorf("failed to create tmp dir: %w", err)
	}

	if s.cfg.Protobuf {
		size, checksum, err := s.writeProtobuf(tmpDir, meta, particles, links, neurons)
		if err != nil {
			return fmt.Errorf("protobuf write failed: %w", err)
		}
		meta.Files["protobuf"] = FileMeta{
			File:      "graph.pb",
			SizeBytes: size,
			Checksum:  fmt.Sprintf("sha256:%x", checksum),
		}
	}

	if s.cfg.Parquet {
		if err := s.writeParquetFiles(tmpDir, meta, particles, links, neurons); err != nil {
			return fmt.Errorf("parquet write failed: %w", err)
		}
	}

	return nil
}

func checksumBytes(data []byte) []byte {
	h := sha256.Sum256(data)
	return h[:]
}
