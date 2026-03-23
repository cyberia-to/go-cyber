package graphsync

import (
	"os"
	"path/filepath"

	"github.com/cosmos/gogoproto/proto"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
)

func (s *SyncService) writeProtobuf(
	dir string,
	meta *SnapshotMeta,
	particles []snapshotParticle,
	links []snapshotLink,
	neurons []snapshotNeuron,
) (int64, []byte, error) {
	snapshot := &graphtypes.GraphSnapshot{
		Header: &graphtypes.GraphSnapshotHeader{
			ChainId:        meta.ChainID,
			Height:         uint64(meta.Height),
			Timestamp:      meta.Timestamp,
			ParticlesCount: meta.ParticlesCount,
			LinksCount:     meta.LinksCount,
			NeuronsCount:   meta.NeuronsCount,
			RankMerkleRoot: meta.RankMerkleRoot,
		},
		Particles: make([]*graphtypes.Particle, len(particles)),
		Links:     make([]*graphtypes.Cyberlink, len(links)),
		Neurons:   make([]*graphtypes.Neuron, len(neurons)),
	}

	for i, p := range particles {
		snapshot.Particles[i] = &graphtypes.Particle{
			Number: p.Number,
			Cid:    p.Cid,
			Rank:   p.Rank,
		}
	}

	for i, l := range links {
		snapshot.Links[i] = &graphtypes.Cyberlink{
			From:    l.From,
			To:      l.To,
			Account: l.Account,
			Height:  l.Height,
		}
	}

	for i, n := range neurons {
		snapshot.Neurons[i] = &graphtypes.Neuron{
			Number:     n.Number,
			Address:    n.Address,
			LinksCount: n.LinksCount,
			BootStaked: n.BootStaked,
			Hydrogen:   n.Hydrogen,
			Ampere:     n.Ampere,
			Volt:       n.Volt,
		}
	}

	data, err := proto.Marshal(snapshot)
	if err != nil {
		return 0, nil, err
	}

	filePath := filepath.Join(dir, "graph.pb")
	if err := os.WriteFile(filePath, data, 0644); err != nil {
		return 0, nil, err
	}

	checksum := checksumBytes(data)
	return int64(len(data)), checksum, nil
}
