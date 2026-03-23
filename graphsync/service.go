package graphsync

import (
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	dbm "github.com/cometbft/cometbft-db"
	"github.com/cometbft/cometbft/libs/log"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authkeeper "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	stakingkeeper "github.com/cosmos/cosmos-sdk/x/staking/keeper"

	graphkeeper "github.com/cybercongress/go-cyber/v7/x/graph/keeper"
	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
	rankkeeper "github.com/cybercongress/go-cyber/v7/x/rank/keeper"
)

type SyncService struct {
	cfg      GraphSyncConfig
	homePath string
	logger   log.Logger
	db       dbm.DB

	// Store keys for creating read-only contexts (copy, not original)
	storeKeys map[string]*storetypes.KVStoreKey

	// Keepers (read-only access)
	graphKeeper   *graphkeeper.GraphKeeper
	indexKeeper   *graphkeeper.IndexKeeper
	rankKeeper    *rankkeeper.StateKeeper
	accountKeeper authkeeper.AccountKeeper
	bankKeeper    bankkeeper.Keeper
	stakingKeeper *stakingkeeper.Keeper

	// State
	mu         sync.RWMutex
	latestMeta *SnapshotMeta
	prevDiff   *diffState
	generating atomic.Bool

	// Subscribers for SubscribeGraph streaming
	subscribers []chan *graphtypes.GraphUpdate

	// HTTP server
	httpServer *http.Server
}

type SnapshotMeta struct {
	ChainID        string `json:"chain_id"`
	Height         int64  `json:"height"`
	Timestamp      int64  `json:"timestamp"`
	IsMilestone    bool   `json:"is_milestone"`
	ParticlesCount uint64 `json:"particles_count"`
	LinksCount     uint64 `json:"links_count"`
	NeuronsCount   uint64 `json:"neurons_count"`
	RankMerkleRoot []byte `json:"rank_merkle_root"`

	Files          map[string]FileMeta `json:"files"`
	GenerationTime int64              `json:"generation_time_ms"`
}

type FileMeta struct {
	File      string `json:"file"`
	SizeBytes int64  `json:"size_bytes"`
	Checksum  string `json:"checksum"`
}

func NewSyncService(
	cfg GraphSyncConfig,
	homePath string,
	logger log.Logger,
	db dbm.DB,
	storeKeys map[string]*storetypes.KVStoreKey,
	graphKeeper *graphkeeper.GraphKeeper,
	indexKeeper *graphkeeper.IndexKeeper,
	rankKeeper *rankkeeper.StateKeeper,
	accountKeeper authkeeper.AccountKeeper,
	bankKeeper bankkeeper.Keeper,
	stakingKeeper *stakingkeeper.Keeper,
) *SyncService {
	// Copy store keys to avoid mutation by NewContextWithMSVersion
	keysCopy := make(map[string]*storetypes.KVStoreKey, len(storeKeys))
	for k, v := range storeKeys {
		keysCopy[k] = v
	}

	return &SyncService{
		cfg:           cfg,
		homePath:      homePath,
		logger:        logger.With("module", "graphsync"),
		db:            db,
		storeKeys:     keysCopy,
		graphKeeper:   graphKeeper,
		indexKeeper:   indexKeeper,
		rankKeeper:    rankKeeper,
		accountKeeper: accountKeeper,
		bankKeeper:    bankKeeper,
		stakingKeeper: stakingKeeper,
	}
}

func (s *SyncService) Start() {
	if err := s.ensureDirectories(); err != nil {
		s.logger.Error("Failed to create snapshot directories", "err", err)
		return
	}

	if s.cfg.HTTPAddress != "" {
		s.startHTTP()
	}

	s.logger.Info("Graph sync service started",
		"sync_period", s.cfg.SyncPeriod,
		"milestone_period", s.cfg.MilestonePeriod,
		"http_address", s.cfg.HTTPAddress,
	)
}

func (s *SyncService) Stop() {
	if s.httpServer != nil {
		s.httpServer.Close()
	}
	s.logger.Info("Graph sync service stopped")
}

// OnEndBlock is called from the app's EndBlocker. It checks whether a snapshot
// should be generated at this height and launches background generation.
func (s *SyncService) OnEndBlock(ctx sdk.Context, height int64) {
	if height <= 0 || height%s.cfg.SyncPeriod != 0 {
		return
	}

	if s.generating.Load() {
		s.logger.Info("Skipping snapshot generation, previous still in progress", "height", height)
		return
	}

	chainID := ctx.ChainID()
	timestamp := ctx.BlockTime()

	s.generating.Store(true)
	go func() {
		defer s.generating.Store(false)

		start := time.Now()
		if err := s.generateSnapshot(height, chainID, timestamp); err != nil {
			s.logger.Error("Snapshot generation failed", "height", height, "err", err)
			return
		}
		s.logger.Info("Graph snapshot generated",
			"height", height,
			"duration", time.Since(start),
		)
	}()
}
