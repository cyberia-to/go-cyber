# ---
# tags: cw-cyber, shell
# crystal-type: source
# crystal-domain: cyber
# ---
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[schema] generating lithium contract schemas..."
cargo run -p litium-core --example schema
cargo run -p litium-stake --example schema
cargo run -p litium-wrap --example schema
cargo run -p litium-refer --example schema
cargo run -p litium-mine --example schema
echo "[schema] done"
