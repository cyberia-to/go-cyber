# go-cyber: Release & Build Guide

## Two binaries, one source

| Binary | Audience | Build | Platforms | Distribution |
|--------|----------|-------|-----------|--------------|
| `cyber` | Validators, node operators | CGO + CUDA + Ledger | Linux amd64/arm64 | Docker (GHCR), GitHub Release, install script |
| `cyb` | Developers, researchers, users | CGO=0, static | 14 targets (see below) | GitHub Release, install script, Homebrew |

Same source code (`./cmd/cyber`), different build flags and binary name.

---

## Build

### `cyber` — full node binary

```bash
make build NODE=true
```

- NVIDIA CUDA toolkit + `libcbdrank` (`x/rank/cuda/`) required
- CGO enabled → gcc, Ledger HW wallet support
- Linux only (CUDA is Linux-exclusive)
- Rank computation on GPU (`--compute-gpu=true`, default)

### `cyb` — CLI binary

```bash
CGO_ENABLED=0 go build -tags "netgo" \
  -ldflags '-s -w -X github.com/cosmos/cosmos-sdk/version.AppName=cyb' \
  -trimpath -o build/cyb ./cmd/cyber
```

- No CGO, no gcc, no CUDA — fully static
- Cross-compiles to any OS/arch
- All CLI commands: `query`, `tx`, `keys`, `status`, `genesis`
- Can run a node with `--compute-gpu=false` (CPU rank, slower but identical results)

### Quick build

```bash
make build                  # cyb (CLI, static, no CGO)
make build NODE=true        # cyber (full node, CGO + CUDA + Ledger)
```

### GPU isolation

```
x/rank/keeper/
├── calculate.go           # dispatcher: CPU vs GPU vs mock
├── calculate_cpu.go       # always available
├── calculate_gpu.go       # //go:build cuda — C bindings to CUDA
└── calculate_gpu_nop.go   # //go:build !cuda — panic stub
```

Compile-time: `cuda` build tag. Runtime: `--compute-gpu` flag.

---

## Install

### Quick install (any platform)

```bash
curl -sSL https://raw.githubusercontent.com/cyberia-to/go-cyber/main/scripts/install.sh | bash
```

Installs `cyb` by default. For node operators on Linux:

```bash
curl -sSL https://raw.githubusercontent.com/cyberia-to/go-cyber/main/scripts/install.sh | bash -s -- --node
```

### Install script (`scripts/install.sh`)

```bash
#!/bin/bash
set -e

REPO="cyberia-to/go-cyber"
VERSION=${VERSION:-$(curl -sf "https://api.github.com/repos/$REPO/releases/latest" | grep tag_name | cut -d'"' -f4)}
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
BASE_URL="https://github.com/$REPO/releases/download/${VERSION}"

# Default: cyb (CLI). With --node: cyber (full node, Linux only)
BINARY="cyb"
if [ "${1}" = "--node" ]; then
    BINARY="cyber"
    if [ "$OS" != "linux" ]; then
        echo "Error: cyber (node) is only available for Linux"
        exit 1
    fi
fi

ARCHIVE="${BINARY}_${VERSION}_${OS}_${ARCH}"
if [ "$OS" = "windows" ] && [ "$BINARY" = "cyb" ]; then
    EXT="zip"
else
    EXT="tar.gz"
fi

echo "Installing ${BINARY} ${VERSION} for ${OS}/${ARCH}..."

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

curl -sL "${BASE_URL}/${ARCHIVE}.${EXT}" -o "$TMPDIR/archive"
if [ "$EXT" = "zip" ]; then
    unzip -q "$TMPDIR/archive" -d "$TMPDIR"
else
    tar xzf "$TMPDIR/archive" -C "$TMPDIR"
fi

sudo install -m 755 "$TMPDIR/$BINARY" "/usr/local/bin/$BINARY"
echo "Installed: $($BINARY version)"
```

### Docker (validators only)

```bash
docker pull ghcr.io/cyberia-to/go-cyber:vX.Y.Z
```

- Ubuntu 20.04 + CUDA 11.4
- Cosmovisor with all upgrade binaries
- GHCR only (no Docker Hub)

### Homebrew (future)

```bash
brew install cyberia-to/cyb/cyb
```

---

## Release Artifacts

```
# GitHub Release:

# cyber (node, CGO + CUDA + Ledger)
cyber_vX.Y.Z_linux_amd64.tar.gz
cyber_vX.Y.Z_linux_arm64.tar.gz

# cyb (CLI, static, CGO=0) — 14 targets
cyb_vX.Y.Z_linux_amd64.tar.gz
cyb_vX.Y.Z_linux_arm64.tar.gz
cyb_vX.Y.Z_linux_riscv64.tar.gz
cyb_vX.Y.Z_linux_loong64.tar.gz        ← Loongson
cyb_vX.Y.Z_linux_mips64.tar.gz         ← MIPS64
cyb_vX.Y.Z_linux_ppc64le.tar.gz        ← IBM POWER
cyb_vX.Y.Z_darwin_amd64.tar.gz         ← macOS Intel
cyb_vX.Y.Z_darwin_arm64.tar.gz         ← macOS Apple Silicon
cyb_vX.Y.Z_windows_amd64.zip
cyb_vX.Y.Z_windows_arm64.zip
cyb_vX.Y.Z_android_arm64.tar.gz        ← Termux
cyb_vX.Y.Z_freebsd_amd64.tar.gz
cyb_vX.Y.Z_freebsd_arm64.tar.gz
cyb_vX.Y.Z_openbsd_amd64.tar.gz
checksums.txt

# Docker (GHCR):
ghcr.io/cyberia-to/go-cyber:vX.Y.Z     ← CUDA node image
```

---

## Versioning

```
vX.Y.Z
 │ │ └─ patch: beta channel (new features, may break, for testing)
 │ └── minor: stable release (validators + all users should upgrade)
 └──── major: network-wide hard fork (coordinated chain upgrade)
```

| Bump | What changes | Who upgrades | Governance | Example |
|------|-------------|-------------|------------|---------|
| **Major** (`v7→v8`) | Consensus-breaking: new modules, state machine changes, protobuf breaking | Everyone simultaneously (halt height) | On-chain proposal required | `v8.0.0` |
| **Minor** (`v7.0→v7.1`) | Non-consensus: new queries, CLI features, perf, bugfixes | Validators + node operators (recommended), clients (should) | No proposal, release announcement | `v7.1.0` |
| **Patch** (`v7.1.0→v7.1.1`) | Beta: experimental features, WIP, may break | Testers, developers (opt-in) | None, PR merge → tag | `v7.1.1` |

### Release channels

**Stable** = latest `vX.Y.0` tag (patch = 0). This is what install script and docs point to.

**Beta** = any `vX.Y.Z` where Z > 0. Marked as pre-release on GitHub. Not served by default install script.

### Branch strategy

```
main ──────────────────────────────────────────►
  │                    │
  ├─ tag v7.0.0        ├─ tag v7.1.0
  │                    │
  └─ v7.0.1 (hotfix)  └─ v7.1.1, v7.1.2 (beta)
```

- `main` is the development branch
- Major releases (`vX.0.0`) are tagged on `main` after governance proposal passes
- Minor releases (`vX.Y.0`) are tagged on `main` when stable
- Patch releases (`vX.Y.Z`, Z>0) are tagged for beta/testing, marked pre-release

---

## Release Process

### By version type

#### Major release (`vX.0.0`) — hard fork

1. On-chain governance proposal with halt height
2. Full test suite + E2E + testnet validation
3. Release notes with migration guide
4. Cosmovisor upgrade binary in Docker image
5. Coordinated upgrade at halt height

```bash
go test ./...
make build NODE=true && bash graphsync/e2e_test.sh

git tag -a v8.0.0 -m "Release v8.0.0 — network upgrade"
git push origin v8.0.0
```

#### Minor release (`vX.Y.0`) — stable

1. Full test suite + E2E
2. Release notes with changelog
3. Update install script default version

```bash
go test ./...
make build NODE=true && bash graphsync/e2e_test.sh

git tag -a v7.1.0 -m "Release v7.1.0"
git push origin v7.1.0
```

#### Patch release (`vX.Y.Z`) — beta

1. Unit tests pass (E2E optional)
2. Tagged as **pre-release** on GitHub
3. Not served by install script unless `VERSION=vX.Y.Z` is set explicitly

```bash
go test ./...

git tag -a v7.1.1 -m "Beta v7.1.1"
git push origin v7.1.1
```

### Automated (GitHub Actions)

Pushing a `v*` tag triggers `.github/workflows/release.yml`:
- GoReleaser builds `cyber` (Linux, CGO=1) and `cyb` (14 targets, CGO=0)
- Docker image built and pushed to GHCR
- All artifacts published to GitHub Release
- **Patch releases** (Z > 0): automatically marked as **pre-release**

### GoReleaser config (`.goreleaser.yml`)

```yaml
builds:
  - id: cyber
    main: ./cmd/cyber
    binary: cyber
    goos: [linux]
    goarch: [amd64, arm64]
    env:
      - CGO_ENABLED=1
    flags:
      - -tags=netgo,ledger
      - -trimpath
    ldflags:
      - -X github.com/cosmos/cosmos-sdk/version.Name=cyber
      - -X github.com/cosmos/cosmos-sdk/version.AppName=cyber
      - -X github.com/cosmos/cosmos-sdk/version.Version={{ .Version }}
      - -X github.com/cosmos/cosmos-sdk/version.Commit={{ .Commit }}

  - id: cyb
    main: ./cmd/cyber
    binary: cyb
    goos: [linux, darwin, windows, android, freebsd, openbsd]
    goarch: [amd64, arm64, riscv64, loong64, mips64, ppc64le]
    goamd64: [v1]
    ignore:
      # darwin: only amd64 + arm64
      - goos: darwin
        goarch: riscv64
      - goos: darwin
        goarch: loong64
      - goos: darwin
        goarch: mips64
      - goos: darwin
        goarch: ppc64le
      # windows: only amd64 + arm64
      - goos: windows
        goarch: riscv64
      - goos: windows
        goarch: loong64
      - goos: windows
        goarch: mips64
      - goos: windows
        goarch: ppc64le
      # android: only arm64
      - goos: android
        goarch: amd64
      - goos: android
        goarch: riscv64
      - goos: android
        goarch: loong64
      - goos: android
        goarch: mips64
      - goos: android
        goarch: ppc64le
      # freebsd: only amd64 + arm64
      - goos: freebsd
        goarch: riscv64
      - goos: freebsd
        goarch: loong64
      - goos: freebsd
        goarch: mips64
      - goos: freebsd
        goarch: ppc64le
      # openbsd: only amd64
      - goos: openbsd
        goarch: arm64
      - goos: openbsd
        goarch: riscv64
      - goos: openbsd
        goarch: loong64
      - goos: openbsd
        goarch: mips64
      - goos: openbsd
        goarch: ppc64le
    env:
      - CGO_ENABLED=0
    flags:
      - -tags=netgo
      - -trimpath
    ldflags:
      - -s -w
      - -X github.com/cosmos/cosmos-sdk/version.Name=cyber
      - -X github.com/cosmos/cosmos-sdk/version.AppName=cyb
      - -X github.com/cosmos/cosmos-sdk/version.Version={{ .Version }}
      - -X github.com/cosmos/cosmos-sdk/version.Commit={{ .Commit }}

archives:
  - id: cyber
    builds: [cyber]
    format: tar.gz
    name_template: "cyber_{{ .Version }}_{{ .Os }}_{{ .Arch }}"
  - id: cyb
    builds: [cyb]
    format: tar.gz
    format_overrides:
      - goos: windows
        format: zip
    name_template: "cyb_{{ .Version }}_{{ .Os }}_{{ .Arch }}"

checksum:
  name_template: "checksums.txt"
  algorithm: sha256

release:
  prerelease: auto  # vX.Y.Z where Z>0 → marked pre-release on GitHub

changelog:
  sort: asc
  filters:
    exclude:
      - "^docs:"
      - "^test:"
```

### GitHub Actions workflow (`.github/workflows/release.yml`)

```yaml
name: Release
on:
  push:
    tags: ["v*"]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-go@v5
        with: { go-version: '1.22' }
      - uses: goreleaser/goreleaser-action@v6
        with: { args: "release --clean" }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # Docker only for stable releases (vX.Y.0), not beta patches
      - name: Check if stable release
        id: check
        run: |
          TAG="${{ github.ref_name }}"
          if [[ "$TAG" =~ ^v[0-9]+\.[0-9]+\.0$ ]]; then
            echo "stable=true" >> "$GITHUB_OUTPUT"
          fi
      - uses: docker/login-action@v3
        if: steps.check.outputs.stable == 'true'
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push Docker
        if: steps.check.outputs.stable == 'true'
        run: |
          docker build -t ghcr.io/cyberia-to/go-cyber:${{ github.ref_name }} .
          docker push ghcr.io/cyberia-to/go-cyber:${{ github.ref_name }}
```

---

## Local Testing

### Prerequisites

- Go 1.22+
- gcc, CUDA toolkit (only for `make build NODE=true`; not needed for `make build`)
- `jq`, `ipfs` CLI (for E2E test)

### Unit tests

```bash
go test ./...                   # all tests, no GPU needed
go test ./graphsync/ -v         # graphsync (31 tests)
```

### Local chain

```bash
make build                  # builds cyb
HMDIR=$(mktemp -d)
./build/cyb init test --chain-id test --home $HMDIR
./build/cyb keys add val --keyring-backend test --home $HMDIR
./build/cyb start --home $HMDIR --compute-gpu=false
```

### E2E test

```bash
make build NODE=true && bash graphsync/e2e_test.sh
```

Starts a single-node testnet, creates cyberlinks, validates snapshots + HTTP + milestones. ~90 seconds, cleans up automatically.

---

## TODO

| # | Task | Status |
|---|------|--------|
| 1 | GPU isolation (`cuda` build tag) | Done |
| 2 | `CGO_ENABLED=0` compatibility | Done |
| 3 | Update `.goreleaser.yml` (`cyber` + `cyb`) | Done |
| 4 | `.github/workflows/release.yml` (goreleaser + Docker → GHCR) | Done |
| 5 | `.github/workflows/tests.yml` (Go 1.22) | Done |
| 6 | `scripts/install.sh` (replaces outdated `install_cyber.sh`) | Done |
| 7 | `Makefile` (`make build` = cyb, `make build NODE=true` = cyber) | Done |
| 8 | Homebrew formula | Future |

---

## Reference

### Ports

| Port | Service |
|------|---------|
| 26656 | P2P (CometBFT) |
| 26657 | RPC (CometBFT) |
| 1317 | REST (Cosmos SDK) |
| 9090 | gRPC (Cosmos SDK) |
| 26660 | Prometheus |
| 9999 | Graph Sync HTTP |

### Version embedding

```makefile
ldflags = -X github.com/cosmos/cosmos-sdk/version.Name=cyber \
          -X github.com/cosmos/cosmos-sdk/version.AppName=cyber \
          -X github.com/cosmos/cosmos-sdk/version.Version=$(VERSION) \
          -X github.com/cosmos/cosmos-sdk/version.Commit=$(COMMIT)
```

`VERSION` from `git describe --tags`. GoReleaser provides `{{ .Version }}` automatically.
