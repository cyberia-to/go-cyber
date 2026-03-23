package graphsync

import (
	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
)

// diffState holds the previous snapshot's state for computing incremental diffs.
type diffState struct {
	height     int64
	cidCount   uint64
	rankValues []uint64
	neuronSet  map[uint64]bool
}

// computeDiff computes what changed between the previous snapshot and the current one.
// Returns a GraphUpdate protobuf message containing only the delta.
func (s *SyncService) computeDiff(
	particles []snapshotParticle,
	links []snapshotLink,
	neurons []snapshotNeuron,
	meta *SnapshotMeta,
) *graphtypes.GraphUpdate {
	s.mu.RLock()
	prev := s.prevDiff
	s.mu.RUnlock()

	update := &graphtypes.GraphUpdate{
		ToHeight:       uint64(meta.Height),
		Timestamp:      meta.Timestamp,
		TotalParticles: meta.ParticlesCount,
		TotalLinks:     meta.LinksCount,
		TotalNeurons:   meta.NeuronsCount,
	}

	if prev == nil {
		// First snapshot — no diff possible, just send totals
		update.FromHeight = 0
		return update
	}

	update.FromHeight = uint64(prev.height)

	// New particles: CID numbers >= previous CID count
	for _, p := range particles {
		if p.Number >= prev.cidCount {
			update.NewParticles = append(update.NewParticles, &graphtypes.Particle{
				Number: p.Number,
				Cid:    p.Cid,
				Rank:   p.Rank,
			})
		}
	}

	// New links: links with height > previous snapshot height
	for _, l := range links {
		if int64(l.Height) > prev.height {
			update.NewLinks = append(update.NewLinks, &graphtypes.Cyberlink{
				From:    l.From,
				To:      l.To,
				Account: l.Account,
				Height:  l.Height,
			})
		}
	}

	// New neurons: account numbers not in previous neuron set
	for _, n := range neurons {
		if !prev.neuronSet[n.Number] {
			update.NewNeurons = append(update.NewNeurons, &graphtypes.Neuron{
				Number:     n.Number,
				Address:    n.Address,
				LinksCount: n.LinksCount,
				BootStaked: n.BootStaked,
				Hydrogen:   n.Hydrogen,
				Ampere:     n.Ampere,
				Volt:       n.Volt,
			})
		}
	}

	// Rank deltas: particles where rank changed by more than threshold
	if prev.rankValues != nil {
		thresholdBps := s.cfg.RankDeltaBps
		for _, p := range particles {
			if p.Number >= uint64(len(prev.rankValues)) {
				// New particle — already captured in NewParticles
				continue
			}
			oldRank := prev.rankValues[p.Number]
			if oldRank == p.Rank {
				continue
			}
			// Relative change threshold: |new - old| > old * bps / 10000
			threshold := oldRank * uint64(thresholdBps) / 10000
			var delta uint64
			if p.Rank > oldRank {
				delta = p.Rank - oldRank
			} else {
				delta = oldRank - p.Rank
			}
			if delta > threshold {
				update.RankUpdates = append(update.RankUpdates, &graphtypes.RankDelta{
					Particle: p.Number,
					Rank:     p.Rank,
				})
			}
		}
	}

	return update
}

// saveDiffState stores the current snapshot's state for next diff computation.
func (s *SyncService) saveDiffState(
	particles []snapshotParticle,
	neurons []snapshotNeuron,
	height int64,
) {
	// Build rank values array
	var maxNum uint64
	for _, p := range particles {
		if p.Number > maxNum {
			maxNum = p.Number
		}
	}
	rankValues := make([]uint64, maxNum+1)
	for _, p := range particles {
		rankValues[p.Number] = p.Rank
	}

	// Build neuron set
	neuronSet := make(map[uint64]bool, len(neurons))
	for _, n := range neurons {
		neuronSet[n.Number] = true
	}

	s.mu.Lock()
	s.prevDiff = &diffState{
		height:     height,
		cidCount:   uint64(len(particles)),
		rankValues: rankValues,
		neuronSet:  neuronSet,
	}
	s.mu.Unlock()
}
