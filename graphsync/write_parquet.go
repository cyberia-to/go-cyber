package graphsync

import (
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"

	"github.com/parquet-go/parquet-go"
	"github.com/parquet-go/parquet-go/compress/zstd"
)

type particleRow struct {
	Number uint64 `parquet:"number"`
	Cid    string `parquet:"cid"`
	Rank   uint64 `parquet:"rank"`
}

type linkRow struct {
	From    uint64 `parquet:"from"`
	To      uint64 `parquet:"to"`
	Account uint64 `parquet:"account"`
	Height  uint64 `parquet:"height"`
}

type neuronRow struct {
	Number     uint64 `parquet:"number"`
	Address    string `parquet:"address"`
	LinksCount uint64 `parquet:"links_count"`
	BootStaked uint64 `parquet:"boot_staked"`
	Hydrogen   uint64 `parquet:"hydrogen"`
	Ampere     uint64 `parquet:"ampere"`
	Volt       uint64 `parquet:"volt"`
}

func (s *SyncService) writeParquetFiles(
	dir string,
	meta *SnapshotMeta,
	particles []snapshotParticle,
	links []snapshotLink,
	neurons []snapshotNeuron,
) error {
	// Particles
	size, checksum, err := writeParticlesParquet(dir, particles)
	if err != nil {
		return fmt.Errorf("particles parquet: %w", err)
	}
	meta.Files["parquet_particles"] = FileMeta{
		File:      "particles.parquet",
		SizeBytes: size,
		Checksum:  fmt.Sprintf("sha256:%x", checksum),
	}

	// Links
	size, checksum, err = writeLinksParquet(dir, links)
	if err != nil {
		return fmt.Errorf("links parquet: %w", err)
	}
	meta.Files["parquet_links"] = FileMeta{
		File:      "links.parquet",
		SizeBytes: size,
		Checksum:  fmt.Sprintf("sha256:%x", checksum),
	}

	// Neurons
	size, checksum, err = writeNeuronsParquet(dir, neurons)
	if err != nil {
		return fmt.Errorf("neurons parquet: %w", err)
	}
	meta.Files["parquet_neurons"] = FileMeta{
		File:      "neurons.parquet",
		SizeBytes: size,
		Checksum:  fmt.Sprintf("sha256:%x", checksum),
	}

	return nil
}

func writeParticlesParquet(dir string, particles []snapshotParticle) (int64, []byte, error) {
	filePath := filepath.Join(dir, "particles.parquet")
	f, err := os.Create(filePath)
	if err != nil {
		return 0, nil, err
	}
	defer f.Close()

	writer := parquet.NewGenericWriter[particleRow](f,
		parquet.Compression(&zstd.Codec{}),
		parquet.MaxRowsPerRowGroup(100000),
	)

	rows := make([]particleRow, len(particles))
	for i, p := range particles {
		rows[i] = particleRow{Number: p.Number, Cid: p.Cid, Rank: p.Rank}
	}

	if _, err := writer.Write(rows); err != nil {
		return 0, nil, err
	}

	if err := writer.Close(); err != nil {
		return 0, nil, err
	}

	return fileChecksum(filePath)
}

func writeLinksParquet(dir string, links []snapshotLink) (int64, []byte, error) {
	filePath := filepath.Join(dir, "links.parquet")
	f, err := os.Create(filePath)
	if err != nil {
		return 0, nil, err
	}
	defer f.Close()

	writer := parquet.NewGenericWriter[linkRow](f,
		parquet.Compression(&zstd.Codec{}),
		parquet.MaxRowsPerRowGroup(100000),
	)

	rows := make([]linkRow, len(links))
	for i, l := range links {
		rows[i] = linkRow{From: l.From, To: l.To, Account: l.Account, Height: l.Height}
	}

	if _, err := writer.Write(rows); err != nil {
		return 0, nil, err
	}

	if err := writer.Close(); err != nil {
		return 0, nil, err
	}

	return fileChecksum(filePath)
}

func writeNeuronsParquet(dir string, neurons []snapshotNeuron) (int64, []byte, error) {
	filePath := filepath.Join(dir, "neurons.parquet")
	f, err := os.Create(filePath)
	if err != nil {
		return 0, nil, err
	}
	defer f.Close()

	writer := parquet.NewGenericWriter[neuronRow](f,
		parquet.Compression(&zstd.Codec{}),
		parquet.MaxRowsPerRowGroup(100000),
	)

	rows := make([]neuronRow, len(neurons))
	for i, n := range neurons {
		rows[i] = neuronRow{
			Number:     n.Number,
			Address:    n.Address,
			LinksCount: n.LinksCount,
			BootStaked: n.BootStaked,
			Hydrogen:   n.Hydrogen,
			Ampere:     n.Ampere,
			Volt:       n.Volt,
		}
	}

	if _, err := writer.Write(rows); err != nil {
		return 0, nil, err
	}

	if err := writer.Close(); err != nil {
		return 0, nil, err
	}

	return fileChecksum(filePath)
}

func fileChecksum(path string) (int64, []byte, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, nil, err
	}
	h := sha256.Sum256(data)
	return int64(len(data)), h[:], nil
}
