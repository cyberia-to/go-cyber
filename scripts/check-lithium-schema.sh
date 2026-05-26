# ---
# tags: cw-cyber, shell
# crystal-type: source
# crystal-domain: cyber
# ---
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

echo "[schema-check] regenerating lithium schemas..."
./scripts/generate-lithium-schema.sh

if ! git diff --quiet -- \
  contracts/litium-core/schema \
  contracts/litium-stake/schema \
  contracts/litium-wrap/schema \
  contracts/litium-refer/schema \
  contracts/litium-mine/schema; then
  echo "[schema-check] lithium schema is out of date."
  echo "[schema-check] run ./scripts/generate-lithium-schema.sh and stage updated schema files."
  git status --short -- \
    contracts/litium-core/schema \
    contracts/litium-stake/schema \
    contracts/litium-wrap/schema \
    contracts/litium-refer/schema \
    contracts/litium-mine/schema
  exit 1
fi

echo "[schema-check] lithium schema is up to date."
