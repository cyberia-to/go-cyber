# ---
# tags: cw-cyber, shell
# crystal-type: source
# crystal-domain: cyber
# ---
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[daily] multi-miner epoch/difficulty e2e"
cargo test -p litium-mine --test local_config_suite local_epochs_retarget_with_real_cli_hashrate_profiles -- --nocapture

echo "[daily] difficulty profile 1..16 and recommendation"
cargo test -p litium-mine --test local_config_suite difficulty_profile_1_to_16_daily -- --nocapture

echo "[daily] done"
