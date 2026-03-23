package graphsync

import (
	"context"
	"fmt"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
)

// Compile-time check that SyncService implements GraphSyncQueryServer.
// This will be enforced once proto-gen creates the interface.
// var _ graphtypes.GraphSyncQueryServer = &SyncService{}

func (s *SyncService) LatestSnapshot(
	_ context.Context,
	_ *graphtypes.QueryLatestSnapshotRequest,
) (*graphtypes.QueryLatestSnapshotResponse, error) {
	s.mu.RLock()
	meta := s.latestMeta
	s.mu.RUnlock()

	if meta == nil {
		return nil, fmt.Errorf("no snapshot available yet")
	}

	baseURL := fmt.Sprintf("http://%s/snapshot/latest", s.cfg.HTTPAddress)

	resp := &graphtypes.QueryLatestSnapshotResponse{
		ChainId:        meta.ChainID,
		Height:         uint64(meta.Height),
		Timestamp:      meta.Timestamp,
		ParticlesCount: meta.ParticlesCount,
		LinksCount:     meta.LinksCount,
		NeuronsCount:   meta.NeuronsCount,
		RankMerkleRoot: meta.RankMerkleRoot,
	}

	// Set file URLs, sizes, and checksums from metadata
	if pb, ok := meta.Files["protobuf"]; ok {
		resp.ProtobufUrl = baseURL + "/" + pb.File
		resp.ProtobufSize = uint64(pb.SizeBytes)
		resp.ProtobufChecksum = pb.Checksum
	}
	if pp, ok := meta.Files["parquet_particles"]; ok {
		resp.ParquetParticlesUrl = baseURL + "/" + pp.File
		resp.ParquetParticlesSize = uint64(pp.SizeBytes)
	}
	if pl, ok := meta.Files["parquet_links"]; ok {
		resp.ParquetLinksUrl = baseURL + "/" + pl.File
		resp.ParquetLinksSize = uint64(pl.SizeBytes)
	}
	if pn, ok := meta.Files["parquet_neurons"]; ok {
		resp.ParquetNeuronsUrl = baseURL + "/" + pn.File
		resp.ParquetNeuronsSize = uint64(pn.SizeBytes)
	}

	return resp, nil
}

func (s *SyncService) SubscribeGraph(
	req *graphtypes.SubscribeGraphRequest,
	stream graphtypes.GraphSyncQuery_SubscribeGraphServer,
) error {
	// Create subscriber channel
	ch := make(chan *graphtypes.GraphUpdate, 4)

	s.mu.Lock()
	s.subscribers = append(s.subscribers, ch)
	s.mu.Unlock()

	// Cleanup on disconnect
	defer func() {
		s.mu.Lock()
		for i, sub := range s.subscribers {
			if sub == ch {
				s.subscribers = append(s.subscribers[:i], s.subscribers[i+1:]...)
				break
			}
		}
		s.mu.Unlock()
		close(ch)
	}()

	// Send initial update with current snapshot metadata
	s.mu.RLock()
	meta := s.latestMeta
	s.mu.RUnlock()

	if meta != nil {
		initialUpdate := &graphtypes.GraphUpdate{
			FromHeight:     0,
			ToHeight:       uint64(meta.Height),
			Timestamp:      meta.Timestamp,
			TotalParticles: meta.ParticlesCount,
			TotalLinks:     meta.LinksCount,
			TotalNeurons:   meta.NeuronsCount,
		}
		if err := stream.Send(initialUpdate); err != nil {
			return err
		}
	}

	// Stream updates as they come
	for {
		select {
		case update, ok := <-ch:
			if !ok {
				return nil
			}
			if err := stream.Send(update); err != nil {
				return err
			}
		case <-stream.Context().Done():
			return stream.Context().Err()
		}
	}
}

// notifySubscribers sends a GraphUpdate to all active subscribers.
// Called after each snapshot generation completes.
func (s *SyncService) notifySubscribers(update *graphtypes.GraphUpdate) {
	s.mu.RLock()
	subs := make([]chan *graphtypes.GraphUpdate, len(s.subscribers))
	copy(subs, s.subscribers)
	s.mu.RUnlock()

	for _, ch := range subs {
		// Non-blocking send — drop update if subscriber is too slow
		select {
		case ch <- update:
		default:
			s.logger.Error("Dropping graph update for slow subscriber")
		}
	}
}
