# ---
# tags: cw-cyber, shell
# crystal-type: source
# crystal-domain: cyber
# ---
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [[ "${LITHIUM_PRECOMMIT_FORCE:-0}" == "1" ]]; then
  SHOULD_RUN=1
else
  STAGED="$(git diff --cached --name-only --diff-filter=ACMR)"
  if [[ -z "$STAGED" ]]; then
    SHOULD_RUN=0
  elif echo "$STAGED" | rg -q '^(contracts/litium-(core|stake|wrap|refer|mine)/)'; then
    SHOULD_RUN=1
  else
    SHOULD_RUN=0
  fi
fi

if [[ "$SHOULD_RUN" != "1" ]]; then
  echo "[pre-commit] lithium paths not staged; skipping lithium test suite."
  exit 0
fi

echo "[pre-commit] checking lithium schema sync..."
bash ./scripts/check-lithium-schema.sh
echo "[pre-commit] lithium schema check passed."

echo "[pre-commit] running lithium lint (fmt + clippy)..."
cargo fmt -p litium-core -p litium-stake -p litium-wrap -p litium-refer -p litium-mine -- --check
cargo clippy --no-deps -p litium-core -p litium-stake -p litium-wrap -p litium-refer -p litium-mine -- -D warnings
echo "[pre-commit] lithium lint passed."

echo "[pre-commit] running lithium test suite..."
cargo test -p litium-core -p litium-stake -p litium-wrap -p litium-refer -p litium-mine
echo "[pre-commit] lithium test suite passed."
