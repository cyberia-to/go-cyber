package graphsync

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestComputeDiff_FirstSnapshot(t *testing.T) {
	s := testService(t)
	particles, links, neurons := testData()
	meta := testMeta()

	// No previous state — first snapshot
	update := s.computeDiff(particles, links, neurons, meta)

	require.Equal(t, uint64(0), update.FromHeight)
	require.Equal(t, uint64(1000), update.ToHeight)
	require.Equal(t, uint64(3), update.TotalParticles)
	require.Equal(t, uint64(3), update.TotalLinks)
	require.Equal(t, uint64(2), update.TotalNeurons)
	// No deltas on first snapshot
	require.Empty(t, update.NewParticles)
	require.Empty(t, update.NewLinks)
	require.Empty(t, update.NewNeurons)
	require.Empty(t, update.RankUpdates)
}

func TestComputeDiff_NewParticles(t *testing.T) {
	s := testService(t)

	// Save initial state with 2 particles
	s.saveDiffState(
		[]snapshotParticle{
			{Number: 0, Cid: "QmOld1", Rank: 1000},
			{Number: 1, Cid: "QmOld2", Rank: 2000},
		},
		[]snapshotNeuron{{Number: 10}},
		1000,
	)

	// New snapshot has 3 particles (one new)
	particles := []snapshotParticle{
		{Number: 0, Cid: "QmOld1", Rank: 1000},
		{Number: 1, Cid: "QmOld2", Rank: 2000},
		{Number: 2, Cid: "QmNew3", Rank: 500},
	}
	meta := &SnapshotMeta{Height: 2000, Timestamp: 1700001000, ParticlesCount: 3, LinksCount: 0, NeuronsCount: 1}

	update := s.computeDiff(particles, nil, []snapshotNeuron{{Number: 10}}, meta)

	require.Equal(t, uint64(1000), update.FromHeight)
	require.Equal(t, uint64(2000), update.ToHeight)
	require.Len(t, update.NewParticles, 1)
	require.Equal(t, "QmNew3", update.NewParticles[0].Cid)
	require.Equal(t, uint64(2), update.NewParticles[0].Number)
}

func TestComputeDiff_NewLinks(t *testing.T) {
	s := testService(t)

	s.saveDiffState(
		[]snapshotParticle{{Number: 0, Cid: "Qm1", Rank: 100}},
		nil,
		1000,
	)

	links := []snapshotLink{
		{From: 0, To: 1, Account: 10, Height: 500},  // old
		{From: 0, To: 2, Account: 10, Height: 1500}, // new
		{From: 1, To: 2, Account: 11, Height: 1001}, // new
	}
	meta := &SnapshotMeta{Height: 2000, LinksCount: 3, ParticlesCount: 1}

	update := s.computeDiff(nil, links, nil, meta)

	require.Len(t, update.NewLinks, 2)
	require.Equal(t, uint64(1500), update.NewLinks[0].Height)
	require.Equal(t, uint64(1001), update.NewLinks[1].Height)
}

func TestComputeDiff_NewNeurons(t *testing.T) {
	s := testService(t)

	s.saveDiffState(
		nil,
		[]snapshotNeuron{{Number: 10}},
		1000,
	)

	neurons := []snapshotNeuron{
		{Number: 10, Address: "bostrom1abc"},
		{Number: 11, Address: "bostrom1def"}, // new
	}
	meta := &SnapshotMeta{Height: 2000, NeuronsCount: 2}

	update := s.computeDiff(nil, nil, neurons, meta)

	require.Len(t, update.NewNeurons, 1)
	require.Equal(t, "bostrom1def", update.NewNeurons[0].Address)
}

func TestComputeDiff_RankDeltas(t *testing.T) {
	s := testService(t)
	s.cfg.RankDeltaBps = 100 // 1% threshold

	// Initial rank: particle 0 = 10000, particle 1 = 10000
	s.saveDiffState(
		[]snapshotParticle{
			{Number: 0, Cid: "Qm1", Rank: 10000},
			{Number: 1, Cid: "Qm2", Rank: 10000},
		},
		nil,
		1000,
	)

	particles := []snapshotParticle{
		{Number: 0, Cid: "Qm1", Rank: 10050}, // +0.5% — below threshold, no delta
		{Number: 1, Cid: "Qm2", Rank: 10200}, // +2% — above threshold, delta
	}
	meta := &SnapshotMeta{Height: 2000, ParticlesCount: 2}

	update := s.computeDiff(particles, nil, nil, meta)

	require.Len(t, update.RankUpdates, 1)
	require.Equal(t, uint64(1), update.RankUpdates[0].Particle)
	require.Equal(t, uint64(10200), update.RankUpdates[0].Rank)
}

func TestComputeDiff_RankDeltas_Decrease(t *testing.T) {
	s := testService(t)
	s.cfg.RankDeltaBps = 100

	s.saveDiffState(
		[]snapshotParticle{{Number: 0, Cid: "Qm1", Rank: 10000}},
		nil,
		1000,
	)

	particles := []snapshotParticle{
		{Number: 0, Cid: "Qm1", Rank: 9800}, // -2% — above threshold
	}
	meta := &SnapshotMeta{Height: 2000, ParticlesCount: 1}

	update := s.computeDiff(particles, nil, nil, meta)

	require.Len(t, update.RankUpdates, 1)
	require.Equal(t, uint64(9800), update.RankUpdates[0].Rank)
}

func TestComputeDiff_RankUnchanged(t *testing.T) {
	s := testService(t)
	s.cfg.RankDeltaBps = 100

	s.saveDiffState(
		[]snapshotParticle{{Number: 0, Cid: "Qm1", Rank: 10000}},
		nil,
		1000,
	)

	// Same rank — no delta
	particles := []snapshotParticle{{Number: 0, Cid: "Qm1", Rank: 10000}}
	meta := &SnapshotMeta{Height: 2000, ParticlesCount: 1}

	update := s.computeDiff(particles, nil, nil, meta)
	require.Empty(t, update.RankUpdates)
}

func TestSaveDiffState(t *testing.T) {
	s := testService(t)

	particles := []snapshotParticle{
		{Number: 0, Cid: "Qm1", Rank: 100},
		{Number: 2, Cid: "Qm3", Rank: 300}, // gap at number 1
	}
	neurons := []snapshotNeuron{
		{Number: 10},
		{Number: 20},
	}

	s.saveDiffState(particles, neurons, 5000)

	require.NotNil(t, s.prevDiff)
	require.Equal(t, int64(5000), s.prevDiff.height)
	require.Equal(t, uint64(2), s.prevDiff.cidCount)
	require.Len(t, s.prevDiff.rankValues, 3) // 0..2
	require.Equal(t, uint64(100), s.prevDiff.rankValues[0])
	require.Equal(t, uint64(0), s.prevDiff.rankValues[1]) // gap
	require.Equal(t, uint64(300), s.prevDiff.rankValues[2])
	require.True(t, s.prevDiff.neuronSet[10])
	require.True(t, s.prevDiff.neuronSet[20])
	require.False(t, s.prevDiff.neuronSet[30])
}
