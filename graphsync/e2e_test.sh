#!/usr/bin/env bash
#
# E2E test for Graph Sync feature.
# Builds binary, starts a single-node testnet with fast parameters,
# creates cyberlinks, and validates snapshot generation + HTTP serving + milestones.
#
# Usage: bash graphsync/e2e_test.sh
# Expected runtime: ~90 seconds
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BINARY="$REPO_DIR/build/cyber"
CHAIN_ID="graphsync-test"
HMDIR=$(mktemp -d)
KEYRING="test"
NODE_PID=""
PASSED=0
FAILED=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cleanup() {
    echo ""
    echo "=== Cleanup ==="
    if [ -n "$NODE_PID" ] && kill -0 "$NODE_PID" 2>/dev/null; then
        echo "Stopping node (PID $NODE_PID)..."
        kill "$NODE_PID" 2>/dev/null || true
        wait "$NODE_PID" 2>/dev/null || true
    fi
    echo "Removing temp dir: $HMDIR"
    rm -rf "$HMDIR"
    echo ""
    echo "=============================="
    echo -e "  ${GREEN}PASSED: $PASSED${NC}  ${RED}FAILED: $FAILED${NC}"
    echo "=============================="
    if [ "$FAILED" -gt 0 ]; then
        exit 1
    fi
}
trap cleanup EXIT

assert_ok() {
    local desc="$1"
    shift
    if "$@" >/dev/null 2>&1; then
        echo -e "  ${GREEN}PASS${NC} $desc"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} $desc"
        FAILED=$((FAILED + 1))
    fi
}

assert_file_exists() {
    local desc="$1"
    local path="$2"
    if [ -f "$path" ]; then
        echo -e "  ${GREEN}PASS${NC} $desc ($(wc -c < "$path") bytes)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} $desc — file not found: $path"
        FAILED=$((FAILED + 1))
    fi
}

assert_dir_exists() {
    local desc="$1"
    local path="$2"
    if [ -d "$path" ]; then
        echo -e "  ${GREEN}PASS${NC} $desc"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} $desc — dir not found: $path"
        FAILED=$((FAILED + 1))
    fi
}

assert_json_field() {
    local desc="$1"
    local file="$2"
    local field="$3"
    local val
    val=$(jq -r "$field" "$file" 2>/dev/null || echo "")
    if [ -n "$val" ] && [ "$val" != "null" ]; then
        echo -e "  ${GREEN}PASS${NC} $desc ($field = $val)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} $desc — field $field missing or null"
        FAILED=$((FAILED + 1))
    fi
}

assert_http_ok() {
    local desc="$1"
    local url="$2"
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    if [ "$status" = "200" ]; then
        echo -e "  ${GREEN}PASS${NC} $desc (HTTP $status)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} $desc — got HTTP $status"
        FAILED=$((FAILED + 1))
    fi
}

assert_http_json_field() {
    local desc="$1"
    local url="$2"
    local field="$3"
    local val
    val=$(curl -s "$url" 2>/dev/null | jq -r "$field" 2>/dev/null || echo "")
    if [ -n "$val" ] && [ "$val" != "null" ]; then
        echo -e "  ${GREEN}PASS${NC} $desc ($field = $val)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} $desc — field $field missing from $url"
        FAILED=$((FAILED + 1))
    fi
}

get_height() {
    curl -s "http://localhost:26657/status" 2>/dev/null | jq -r '.result.sync_info.latest_block_height' 2>/dev/null || echo "0"
}

wait_for_height() {
    local target=$1
    local timeout=$2
    local elapsed=0
    echo -e "${YELLOW}Waiting for height >= $target (timeout ${timeout}s)...${NC}"
    while true; do
        local h
        h=$(get_height)
        if [ "$h" != "0" ] && [ "$h" -ge "$target" ] 2>/dev/null; then
            echo "  Reached height $h"
            return 0
        fi
        sleep 1
        elapsed=$((elapsed + 1))
        if [ "$elapsed" -ge "$timeout" ]; then
            echo -e "  ${RED}Timeout waiting for height $target (current: $h)${NC}"
            return 1
        fi
    done
}

# ============================================================
echo "=== Graph Sync E2E Test ==="
echo "  Chain ID:  $CHAIN_ID"
echo "  Home dir:  $HMDIR"
echo "  Binary:    $BINARY"
echo ""

# --- Step 1: Verify binary ---
echo "=== Step 1: Verify binary ==="
if [ ! -x "$BINARY" ]; then
    echo "Binary not found. Run 'make build' first."
    exit 1
fi
echo "  Binary OK: $($BINARY version 2>&1 || true)"

# --- Step 2: Initialize chain ---
echo ""
echo "=== Step 2: Initialize chain ==="

$BINARY init "$CHAIN_ID" --chain-id "$CHAIN_ID" --home "$HMDIR" > /dev/null 2>&1

# Add validator key
$BINARY keys add validator --keyring-backend "$KEYRING" --home "$HMDIR" > /dev/null 2>&1
VALIDATOR_ADDR=$($BINARY keys show validator -a --keyring-backend "$KEYRING" --home "$HMDIR")
echo "  Validator: $VALIDATOR_ADDR"

# Patch genesis: stake → boot
if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' 's/"stake"/"boot"/g' "$HMDIR/config/genesis.json"
else
    sed -i 's/"stake"/"boot"/g' "$HMDIR/config/genesis.json"
fi

# Patch genesis: calculation_period = 5
GENESIS="$HMDIR/config/genesis.json"
TMP_GENESIS=$(mktemp)
jq '.app_state.rank.params.calculation_period = "5"' "$GENESIS" > "$TMP_GENESIS" && mv "$TMP_GENESIS" "$GENESIS"

# Add genesis account with boot + energy tokens needed for cyberlinks
$BINARY genesis add-genesis-account "$VALIDATOR_ADDR" \
    "1000000000000boot,1000000000milliampere,1000000000millivolt,1000000000hydrogen" \
    --home "$HMDIR" --keyring-backend "$KEYRING" > /dev/null 2>&1

# Create gentx
$BINARY genesis gentx validator 500000000000boot \
    --keyring-backend "$KEYRING" \
    --chain-id "$CHAIN_ID" \
    --home "$HMDIR" > /dev/null 2>&1

# Collect gentxs
$BINARY genesis collect-gentxs --home "$HMDIR" > /dev/null 2>&1

echo "  Genesis configured"

# --- Step 3: Patch configs for speed ---
echo ""
echo "=== Step 3: Patch configs ==="

APP_TOML="$HMDIR/config/app.toml"
CONFIG_TOML="$HMDIR/config/config.toml"

# Fast block time
if [[ "$(uname)" == "Darwin" ]]; then
    SED_I="sed -i ''"
else
    SED_I="sed -i"
fi

# Patch config.toml for fast blocks
$SED_I 's/timeout_commit = "5s"/timeout_commit = "1s"/g' "$CONFIG_TOML"

# Patch app.toml: enable graph-sync with fast periods
# Use python to only modify the [graph-sync] section, not other enabled flags
python3 -c "
import re
with open('$APP_TOML', 'r') as f:
    content = f.read()
# Replace only in graph-sync section
content = re.sub(
    r'(\[graph-sync\].*?)(enabled = false)',
    r'\1enabled = true',
    content, count=1, flags=re.DOTALL
)
content = content.replace('sync_period = 1000', 'sync_period = 10')
content = content.replace('milestone_period = 100000', 'milestone_period = 30')
with open('$APP_TOML', 'w') as f:
    f.write(content)
"

echo "  timeout_commit = 1s"
echo "  graph-sync: enabled=true, sync_period=10, milestone_period=30"

# Verify graph-sync config was patched
grep -q "enabled = true" "$APP_TOML" && echo "  Graph-sync enabled: OK" || echo "  WARNING: graph-sync not enabled in app.toml"

# --- Step 4: Start node ---
echo ""
echo "=== Step 4: Start node ==="

$BINARY start --home "$HMDIR" --compute-gpu=false > "$HMDIR/node.log" 2>&1 &
NODE_PID=$!
echo "  Node started (PID $NODE_PID, compute-gpu=false)"

# Wait for node to be ready and producing blocks
echo "  Waiting for node to be ready..."
NODE_READY=false
for i in $(seq 1 60); do
    if ! kill -0 "$NODE_PID" 2>/dev/null; then
        echo -e "  ${RED}Node crashed! Last 30 lines of log:${NC}"
        tail -30 "$HMDIR/node.log"
        exit 1
    fi
    H=$(get_height)
    if [ "$H" != "0" ] && [ "$H" -ge 1 ] 2>/dev/null; then
        echo "  Node ready at height $H"
        NODE_READY=true
        break
    fi
    sleep 1
done
if [ "$NODE_READY" = false ]; then
    echo -e "  ${RED}Node failed to produce blocks. Last 30 lines of log:${NC}"
    tail -30 "$HMDIR/node.log"
    exit 1
fi

# --- Step 5: Create cyberlinks ---
echo ""
echo "=== Step 5: Create cyberlinks ==="

# Generate valid CIDs using ipfs
CIDS=()
for i in $(seq 1 20); do
    CID=$(echo "graphsync-test-particle-$i-$RANDOM" | ipfs add -Q --only-hash 2>/dev/null)
    CIDS+=("$CID")
done
echo "  Generated ${#CIDS[@]} CIDs"

# Create 15 cyberlinks
LINK_COUNT=0
for i in $(seq 0 14); do
    FROM_IDX=$((i % 20))
    TO_IDX=$(((i + 1) % 20))
    FROM_CID="${CIDS[$FROM_IDX]}"
    TO_CID="${CIDS[$TO_IDX]}"

    RESULT=$($BINARY tx graph cyberlink "$FROM_CID" "$TO_CID" \
        --from validator \
        --chain-id "$CHAIN_ID" \
        --keyring-backend "$KEYRING" \
        --home "$HMDIR" \
        --node "tcp://localhost:26657" \
        --gas auto \
        --gas-adjustment 1.5 \
        --fees 100boot \
        -y 2>&1 || true)

    if echo "$RESULT" | grep -q "txhash"; then
        LINK_COUNT=$((LINK_COUNT + 1))
    else
        echo "  Link $i failed: $(echo "$RESULT" | head -1)"
    fi
    sleep 0.5
done
echo "  Created $LINK_COUNT cyberlinks"

# --- Step 6: Wait for first snapshot (height >= 20) ---
echo ""
echo "=== Step 6: Validate first snapshot ==="

if ! wait_for_height 20 120; then
    echo "Failed to reach height 20"
    tail -30 "$HMDIR/node.log"
    exit 1
fi

# Give extra time for snapshot generation (runs in background goroutine)
sleep 5

SNAP_DIR="$HMDIR/data/snapshots"
LATEST_DIR="$SNAP_DIR/latest"

# Check node log for graph-sync activity
echo "  Graph-sync log entries:"
grep -i "graph" "$HMDIR/node.log" | tail -20 || echo "  (no graph-sync log entries found)"
echo ""

# List snapshot directory
echo "  Snapshot directory contents:"
ls -laR "$SNAP_DIR" 2>/dev/null || echo "  (snapshot dir does not exist)"
echo ""

echo "  Checking snapshot files..."
assert_file_exists "meta.json exists" "$LATEST_DIR/meta.json"
assert_file_exists "graph.pb exists" "$LATEST_DIR/graph.pb"
assert_file_exists "particles.parquet exists" "$LATEST_DIR/particles.parquet"
assert_file_exists "links.parquet exists" "$LATEST_DIR/links.parquet"
assert_file_exists "neurons.parquet exists" "$LATEST_DIR/neurons.parquet"

# Validate meta.json content
if [ -f "$LATEST_DIR/meta.json" ]; then
    echo "  Validating meta.json content..."
    assert_json_field "chain_id present" "$LATEST_DIR/meta.json" ".chain_id"
    assert_json_field "height > 0" "$LATEST_DIR/meta.json" ".height"
    assert_json_field "particles_count" "$LATEST_DIR/meta.json" ".particles_count"
    assert_json_field "links_count" "$LATEST_DIR/meta.json" ".links_count"
    assert_json_field "neurons_count" "$LATEST_DIR/meta.json" ".neurons_count"
    assert_json_field "protobuf file entry" "$LATEST_DIR/meta.json" '.files.protobuf.file'
    assert_json_field "protobuf size" "$LATEST_DIR/meta.json" '.files.protobuf.size_bytes'
    assert_json_field "protobuf checksum" "$LATEST_DIR/meta.json" '.files.protobuf.checksum'

    # Verify file sizes match meta.json
    echo "  Verifying file sizes match metadata..."
    META_PB_SIZE=$(jq -r '.files.protobuf.size_bytes' "$LATEST_DIR/meta.json" 2>/dev/null || echo "0")
    ACTUAL_PB_SIZE=$(wc -c < "$LATEST_DIR/graph.pb" 2>/dev/null | tr -d ' ' || echo "-1")
    if [ "$META_PB_SIZE" = "$ACTUAL_PB_SIZE" ]; then
        echo -e "  ${GREEN}PASS${NC} protobuf file size matches meta ($ACTUAL_PB_SIZE bytes)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} protobuf size mismatch: meta=$META_PB_SIZE actual=$ACTUAL_PB_SIZE"
        FAILED=$((FAILED + 1))
    fi
fi

# Validate HTTP endpoint
echo "  Validating HTTP endpoints..."
assert_http_ok "HTTP /snapshot/latest/meta.json" "http://localhost:9999/snapshot/latest/meta.json"
assert_http_ok "HTTP /snapshot/latest/graph.pb" "http://localhost:9999/snapshot/latest/graph.pb"
assert_http_ok "HTTP /snapshot/latest/particles.parquet" "http://localhost:9999/snapshot/latest/particles.parquet"
assert_http_json_field "HTTP meta.json has chain_id" "http://localhost:9999/snapshot/latest/meta.json" ".chain_id"
assert_http_json_field "HTTP meta.json has height" "http://localhost:9999/snapshot/latest/meta.json" ".height"

# --- Step 7: Wait for milestone (height >= 30) ---
echo ""
echo "=== Step 7: Validate milestone ==="

if ! wait_for_height 30 120; then
    echo "Failed to reach height 30"
    exit 1
fi

# Wait for snapshot at height 30 to generate
sleep 5

MILESTONE_DIR="$SNAP_DIR/milestones/30"

assert_dir_exists "milestone dir at height 30" "$MILESTONE_DIR"

if [ -d "$MILESTONE_DIR" ]; then
    assert_file_exists "milestone meta.json" "$MILESTONE_DIR/meta.json"
    assert_file_exists "milestone graph.pb" "$MILESTONE_DIR/graph.pb"
fi

INDEX_FILE="$SNAP_DIR/milestones/index.json"
assert_file_exists "milestones index.json" "$INDEX_FILE"

if [ -f "$INDEX_FILE" ]; then
    assert_json_field "index has chain_id" "$INDEX_FILE" ".chain_id"
    assert_json_field "index has milestone_period" "$INDEX_FILE" ".milestone_period"

    SNAP_COUNT=$(jq '.snapshots | length' "$INDEX_FILE" 2>/dev/null || echo "0")
    if [ "$SNAP_COUNT" -ge 1 ]; then
        echo -e "  ${GREEN}PASS${NC} index.json has $SNAP_COUNT milestone(s)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}FAIL${NC} index.json has no snapshots"
        FAILED=$((FAILED + 1))
    fi

    # Verify milestone via HTTP
    assert_http_ok "HTTP /snapshot/milestones/index.json" "http://localhost:9999/snapshot/milestones/index.json"
    assert_http_ok "HTTP /snapshot/milestones/30/meta.json" "http://localhost:9999/snapshot/milestones/30/meta.json"
fi

echo ""
echo "=== E2E Test Complete ==="
