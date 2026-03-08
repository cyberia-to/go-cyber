# Go-Cyber Development Guidelines

## Current Focus: Phase 0 (No Consensus Change)

We are working on **non-consensus infrastructure** — features for peripheral nodes, light clients, indexers, and desktop apps. NOT for validator/consensus nodes.

### CRITICAL RULE: DO NOT TOUCH CONSENSUS

- Do NOT modify anything that affects consensus state (block execution, state transitions, module keepers that write to store during tx processing)
- Do NOT change rank computation, graph store writes, or any BeginBlock/EndBlock logic
- Do NOT alter protobuf message types used in transactions (MsgCyberlink, etc.)
- Do NOT modify state machine determinism (same input must produce same output on all nodes)
- All new work is **query-side only**: new gRPC query endpoints, streaming, read-only access to existing state
- New endpoints read from existing IAVL store or in-memory index — they do NOT write

### What We CAN Do (Query/Infra Layer)

- Add new gRPC **query** endpoints (read-only)
- Add server-side streaming RPCs
- Add embedded HTTP servers (dashboard)
- Add subprocess management (IPFS sidecar, llama-server)
- Add CLI subcommands (`cyber service`, `cyber network`)
- Optimize CPU rank calculation (performance only, same algorithm, same results)
- Add `//go:embed` static assets

### Priority Order

0.1 Graph Streaming gRPC → 0.3 cyb tray app → 0.5 IPFS Sidecar → 0.4 Dashboard → 0.2 Native Queries → 0.9 Embeddings → 0.10 LLM Inference

### Reference

Full upgrade plan: `docs/upgrade-plan.md`
