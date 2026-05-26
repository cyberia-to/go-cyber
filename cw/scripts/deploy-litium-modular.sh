# ---
# tags: cw-cyber, shell
# crystal-type: source
# crystal-domain: cyber
# ---
#!/usr/bin/env bash
# Deploy Litium modular contracts to Bostrom mainnet
#
# Deployment order (handles circular dependency):
#   1. Store all 5 WASMs → get code_ids
#   2. Instantiate litium-core (CW-20 token, no dependencies)
#   3. Instantiate litium-stake with placeholder mine_contract
#   4. Instantiate litium-refer with placeholder mine_contract
#   5. Instantiate litium-mine with real stake + refer addresses
#   6. UpdateConfig on litium-stake + litium-refer to set real mine_contract
#   7. Register mine, stake, refer as authorized callers in litium-core (for minting)
#   8. Instantiate litium-wrap (CW-20↔native bridge, creates TokenFactory denom)
#   9. Register wrap as authorized caller + set burn-exempt slots on litium-core
#
# Usage:
#   ./scripts/deploy-litium-modular.sh
#
# Requires: cyber CLI with key "deployer" (or set KEY below)

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────
KEY="${KEY:-deployer}"
KEYRING_BACKEND="${KEYRING_BACKEND:-os}"
CHAIN_ID="bostrom"
NODE="https://rpc.bostrom.cybernode.ai:443"
GAS_PRICES="0boot"
GAS_ADJ="2.5"
ARTIFACTS_DIR="$(cd "$(dirname "$0")/.." && pwd)/artifacts"

TX_FLAGS="--from $KEY --keyring-backend $KEYRING_BACKEND --chain-id $CHAIN_ID --node $NODE --gas-prices $GAS_PRICES --gas-adjustment $GAS_ADJ --gas auto -y -o json"

# Log to stderr so stdout capture in $() works cleanly
log() { echo "$@" >&2; }

die() { log "FATAL: $*"; exit 1; }

# ── Helpers ─────────────────────────────────────────────────────────
wait_tx() {
  local txhash="$1"
  local max_attempts=5
  log "  Waiting for tx $txhash ..."
  for i in $(seq 1 $max_attempts); do
    sleep 7
    local tx_result
    if tx_result=$(cyber query tx "$txhash" --node "$NODE" -o json 2>/dev/null); then
      local code
      code=$(echo "$tx_result" | jq -r '.code // 0')
      if [ "$code" != "0" ]; then
        local raw_log
        raw_log=$(echo "$tx_result" | jq -r '.raw_log // "unknown error"')
        die "TX $txhash failed with code $code: $raw_log"
      fi
      echo "$tx_result"
      return 0
    fi
    log "  Attempt $i/$max_attempts: tx not found yet, retrying..."
  done
  die "TX $txhash not found after $max_attempts attempts"
}

store_wasm() {
  local wasm_file="$1"
  local label="$2"
  log ""
  log "=== Storing $label ==="

  if [ ! -f "$wasm_file" ]; then
    die "WASM file not found: $wasm_file"
  fi

  local result
  if ! result=$(cyber tx wasm store "$wasm_file" $TX_FLAGS 2>&1); then
    die "Failed to broadcast store tx for $label: $result"
  fi

  # cyber CLI prints "gas estimate: NNN" before the JSON — extract only the JSON line
  local json_line
  json_line=$(echo "$result" | grep '^{')

  local txhash
  txhash=$(echo "$json_line" | jq -r '.txhash // empty')
  if [ -z "$txhash" ]; then
    die "No txhash in store response for $label: $result"
  fi

  local tx_result
  tx_result=$(wait_tx "$txhash")

  local code_id
  code_id=$(echo "$tx_result" | jq -r '.events[] | select(.type=="store_code") | .attributes[] | select(.key=="code_id") | .value')
  if [ -z "$code_id" ]; then
    die "No code_id in store tx events for $label"
  fi

  log "  $label code_id: $code_id"
  echo "$code_id"
}

instantiate() {
  local code_id="$1"
  local label="$2"
  local init_msg="$3"
  local admin_flag="${4:---admin $ADMIN_ADDR}"
  log ""
  log "=== Instantiating $label (code_id=$code_id) ==="
  log "  msg: $init_msg"

  local result
  if ! result=$(cyber tx wasm instantiate "$code_id" "$init_msg" --label "$label" $admin_flag $TX_FLAGS 2>&1); then
    die "Failed to broadcast instantiate tx for $label: $result"
  fi

  local json_line
  json_line=$(echo "$result" | grep '^{')

  local txhash
  txhash=$(echo "$json_line" | jq -r '.txhash // empty')
  if [ -z "$txhash" ]; then
    die "No txhash in instantiate response for $label: $result"
  fi

  local tx_result
  tx_result=$(wait_tx "$txhash")

  local contract_addr
  contract_addr=$(echo "$tx_result" | jq -r '.events[] | select(.type=="instantiate") | .attributes[] | select(.key=="_contract_address") | .value')
  if [ -z "$contract_addr" ]; then
    die "No contract address in instantiate tx events for $label"
  fi

  log "  $label address: $contract_addr"
  echo "$contract_addr"
}

execute() {
  local contract="$1"
  local msg="$2"
  local desc="$3"
  log ""
  log "=== Execute: $desc ==="
  log "  contract: $contract"
  log "  msg: $msg"

  local result
  if ! result=$(cyber tx wasm execute "$contract" "$msg" $TX_FLAGS 2>&1); then
    die "Failed to broadcast execute tx ($desc): $result"
  fi

  local json_line
  json_line=$(echo "$result" | grep '^{')

  local txhash
  txhash=$(echo "$json_line" | jq -r '.txhash // empty')
  if [ -z "$txhash" ]; then
    die "No txhash in execute response ($desc): $result"
  fi

  wait_tx "$txhash" > /dev/null
  log "  Done: $txhash"
}

# ── Preflight checks ───────────────────────────────────────────────
command -v cyber >/dev/null 2>&1 || die "cyber CLI not found"
command -v jq >/dev/null 2>&1 || die "jq not found"

ADMIN_ADDR=$(cyber keys show "$KEY" --keyring-backend "$KEYRING_BACKEND" -a 2>/dev/null) || die "Key '$KEY' not found"
log "Deployer/Admin: $ADMIN_ADDR"
log "Chain: $CHAIN_ID"
log "Node: $NODE"

# Verify node is reachable
if ! cyber status --node "$NODE" >/dev/null 2>&1; then
  die "Cannot reach node at $NODE"
fi
log "Node reachable"
log ""

# ── Step 1: Store all 5 WASMs ──────────────────────────────────────
log "============================================"
log " Step 1: Store WASM code"
log "============================================"

CORE_CODE_ID=$(store_wasm "$ARTIFACTS_DIR/litium_core.wasm" "litium-core")
MINE_CODE_ID=$(store_wasm "$ARTIFACTS_DIR/litium_mine.wasm" "litium-mine")
STAKE_CODE_ID=$(store_wasm "$ARTIFACTS_DIR/litium_stake.wasm" "litium-stake")
REFER_CODE_ID=$(store_wasm "$ARTIFACTS_DIR/litium_refer.wasm" "litium-refer")
WRAP_CODE_ID=$(store_wasm "$ARTIFACTS_DIR/litium_wrap.wasm" "litium-wrap")

log ""
log "Code IDs:"
log "  litium-core:  $CORE_CODE_ID"
log "  litium-mine:  $MINE_CODE_ID"
log "  litium-stake: $STAKE_CODE_ID"
log "  litium-refer: $REFER_CODE_ID"
log "  litium-wrap:  $WRAP_CODE_ID"

# ── Step 2: Instantiate litium-core (CW-20 token) ──────────────────
log ""
log "============================================"
log " Step 2: Instantiate litium-core (CW-20)"
log "============================================"

CORE_ADDR=$(instantiate "$CORE_CODE_ID" "litium-core" \
  "{\"name\":\"Litium\",\"symbol\":\"LI\",\"decimals\":6}")

# ── Step 3: Instantiate litium-stake (placeholder mine_contract) ────
log ""
log "============================================"
log " Step 3: Instantiate litium-stake"
log "============================================"

STAKE_ADDR=$(instantiate "$STAKE_CODE_ID" "litium-stake" \
  "{\"core_contract\":\"$CORE_ADDR\",\"mine_contract\":\"$ADMIN_ADDR\",\"token_contract\":\"$CORE_ADDR\",\"unbonding_period_seconds\":1814400}")

# ── Step 4: Instantiate litium-refer (placeholder mine_contract) ────
log ""
log "============================================"
log " Step 4: Instantiate litium-refer"
log "============================================"

REFER_ADDR=$(instantiate "$REFER_CODE_ID" "litium-refer" \
  "{\"core_contract\":\"$CORE_ADDR\",\"mine_contract\":\"$ADMIN_ADDR\"}")

# ── Step 5: Instantiate litium-mine (with real stake + refer) ───────
log ""
log "============================================"
log " Step 5: Instantiate litium-mine"
log "============================================"

MINE_ADDR=$(instantiate "$MINE_CODE_ID" "litium-mine" \
  "{\"max_proof_age\":3600,\"estimated_gas_cost_uboot\":\"250000\",\"core_contract\":\"$CORE_ADDR\",\"stake_contract\":\"$STAKE_ADDR\",\"refer_contract\":\"$REFER_ADDR\",\"token_contract\":\"$CORE_ADDR\",\"warmup_base_rate\":\"1000000\"}")

# ── Step 6: Update stake + refer to set real mine_contract ──────────
log ""
log "============================================"
log " Step 6: Update mine_contract in stake + refer"
log "============================================"

execute "$STAKE_ADDR" \
  "{\"update_config\":{\"mine_contract\":\"$MINE_ADDR\"}}" \
  "litium-stake: set mine_contract"

execute "$REFER_ADDR" \
  "{\"update_config\":{\"mine_contract\":\"$MINE_ADDR\"}}" \
  "litium-refer: set mine_contract"

# ── Step 7: Register authorized callers in litium-core (for minting) ─
log ""
log "============================================"
log " Step 7: Register authorized callers (mint)"
log "============================================"

execute "$CORE_ADDR" \
  "{\"register_authorized_caller\":{\"contract_addr\":\"$MINE_ADDR\"}}" \
  "litium-core: authorize litium-mine"

execute "$CORE_ADDR" \
  "{\"register_authorized_caller\":{\"contract_addr\":\"$STAKE_ADDR\"}}" \
  "litium-core: authorize litium-stake"

execute "$CORE_ADDR" \
  "{\"register_authorized_caller\":{\"contract_addr\":\"$REFER_ADDR\"}}" \
  "litium-core: authorize litium-refer"

# ── Step 8: Instantiate litium-wrap (CW-20↔native bridge) ──────────
log ""
log "============================================"
log " Step 8: Instantiate litium-wrap"
log "============================================"

WRAP_ADDR=$(instantiate "$WRAP_CODE_ID" "litium-wrap" \
  "{\"cw20_contract\":\"$CORE_ADDR\",\"token_subdenom\":\"li\"}")

TOKEN_DENOM="factory/$WRAP_ADDR/li"
log "  Native denom: $TOKEN_DENOM"

# ── Step 9: Register wrap + set burn-exempt slots ───────────────────
log ""
log "============================================"
log " Step 9: Register wrap + burn-exempt config"
log "============================================"

execute "$CORE_ADDR" \
  "{\"register_authorized_caller\":{\"contract_addr\":\"$WRAP_ADDR\"}}" \
  "litium-core: authorize litium-wrap"

execute "$CORE_ADDR" \
  "{\"update_config\":{\"mine_contract\":\"$MINE_ADDR\",\"stake_contract\":\"$STAKE_ADDR\",\"refer_contract\":\"$REFER_ADDR\",\"wrap_contract\":\"$WRAP_ADDR\"}}" \
  "litium-core: set burn-exempt contract slots"

# ── Summary ─────────────────────────────────────────────────────────
log ""
log "============================================"
log " Deployment Complete!"
log "============================================"
log ""
log "Contract Addresses:"
log "  LITIUM_CORE_CONTRACT  = '$CORE_ADDR'"
log "  LITIUM_MINE_CONTRACT  = '$MINE_ADDR'"
log "  LITIUM_STAKE_CONTRACT = '$STAKE_ADDR'"
log "  LITIUM_REFER_CONTRACT = '$REFER_ADDR'"
log "  LITIUM_WRAP_CONTRACT  = '$WRAP_ADDR'"
log ""
log "Native Denom (via litium-wrap):"
log "  LI_DENOM = '$TOKEN_DENOM'"
log ""
log "Code IDs:"
log "  litium-core:  $CORE_CODE_ID"
log "  litium-mine:  $MINE_CODE_ID"
log "  litium-stake: $STAKE_CODE_ID"
log "  litium-refer: $REFER_CODE_ID"
log "  litium-wrap:  $WRAP_CODE_ID"
log ""
log "Paste into src/constants/mining.ts:"
log "  export const LITIUM_CORE_CONTRACT = '$CORE_ADDR';"
log "  export const LITIUM_MINE_CONTRACT = '$MINE_ADDR';"
log "  export const LITIUM_STAKE_CONTRACT = '$STAKE_ADDR';"
log "  export const LITIUM_REFER_CONTRACT = '$REFER_ADDR';"
log "  export const LITIUM_WRAP_CONTRACT = '$WRAP_ADDR';"
