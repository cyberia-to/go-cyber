# go-cyber

Collective intelligence substrate. Convergent computation over a knowledge graph with on-chain diffusion model, built on Cosmos SDK.

[![version](https://img.shields.io/github/release/cyberia-to/go-cyber.svg?style=flat-square)](https://github.com/cyberia-to/go-cyber/releases/latest)
![Cosmos-SDK](https://img.shields.io/static/v1.svg?label=cosmos-sdk&message=0.47.16&color=blue&style=flat-square)
![CometBFT](https://img.shields.io/static/v1.svg?label=cometbft&message=0.37.18&color=blue&style=flat-square)
![IBC](https://img.shields.io/static/v1.svg?label=ibc-go&message=7.10.0&color=blue&style=flat-square)
![CosmWasm](https://img.shields.io/static/v1.svg?label=wasmd&message=0.46.0&color=blue&style=flat-square)
[![license](https://img.shields.io/badge/License-Cyber-brightgreen.svg?style=flat-square)](https://github.com/cyberia-to/go-cyber/blob/main/LICENSE)

## Networks

| Network | Hub | Launch | Token |
|---|---|---|---|
| [Bostrom](https://cyb.ai) | Bootloader Hub | 2021 | BOOT |
| [Space Pussy](https://spacepussy.ai) | Meme Community Network | 2022 | PUSSY |

## Build

```bash
make install
```

Without GPU (CLI-only, connects to remote node):

```bash
make install CUDA_ENABLED=false
```

## Quick Start

- RPC: `https://rpc.bostrom.cybernode.ai/`
- REST: `https://lcd.bostrom.cybernode.ai/`
- Seed: `d0518ce9881a4b0c5872e5e9b7c4ea8d760dad3f@85.10.207.173:26656`

Use [localbostrom](networks/local/) for local development.

## Documentation

See [docs/](docs/README.md) for validator setup, CLI guides, module specs, and tutorials.
