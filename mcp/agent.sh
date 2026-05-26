#!/usr/bin/env bash
set -euo pipefail

# ── macOS compatibility ──
if ! command -v timeout &>/dev/null; then
  if command -v gtimeout &>/dev/null; then
    timeout() { gtimeout "$@"; }
  else
    # Fallback: run without timeout
    timeout() { shift; "$@"; }
  fi
fi

# ── Load config ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/agent-config.env"

LOG_DIR="$SCRIPT_DIR/agent-logs"
PROMPT_DIR="$SCRIPT_DIR/agent-prompts"
STATE_FILE="$SCRIPT_DIR/agent-state.json"
PID_FILE="$SCRIPT_DIR/agent.pid"
SUMMARY_LOG="$LOG_DIR/summary.log"

mkdir -p "$LOG_DIR"

# ── Write PID ──
echo $$ > "$PID_FILE"

# ── Graceful shutdown ──
STOP=""
trap 'echo "[$(date +%H:%M:%S)] Caught signal, finishing current phase..."; STOP=1' SIGINT SIGTERM

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Logging ──
log() {
  echo -e "[$(date +%H:%M:%S)] $*"
}

log_summary() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$SUMMARY_LOG"
}

# ── State management ──
init_state() {
  if [ ! -f "$STATE_FILE" ]; then
    cat > "$STATE_FILE" << 'STATEJSON'
{
  "cycle": 0,
  "daily_spend": 0.0,
  "daily_reset": "",
  "failures": {},
  "escalated": [],
  "improvements": []
}
STATEJSON
    log "Initialized state file"
  fi
}

get_state() {
  jq -r "$1" "$STATE_FILE" 2>/dev/null || echo ""
}

set_state() {
  local tmp="$STATE_FILE.tmp"
  jq "$1" "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

get_cycle() {
  local c
  c=$(get_state '.cycle')
  [ "$c" = "null" ] || [ -z "$c" ] && echo "0" || echo "$c"
}

# ── Budget tracking ──
check_daily_budget() {
  local today
  today=$(date +%Y-%m-%d)
  local reset_date
  reset_date=$(get_state '.daily_reset')

  if [ "$reset_date" != "$today" ]; then
    set_state ".daily_reset = \"$today\" | .daily_spend = 0.0"
    log "Daily budget reset for $today"
  fi

  local spent
  spent=$(get_state '.daily_spend')
  spent=${spent:-0}

  # Budget disabled (subscription mode)
  if [ "$DAILY_BUDGET_USD" = "0" ]; then
    return 0
  fi

  if (( $(echo "$spent >= $DAILY_BUDGET_USD" | bc -l) )); then
    log "${RED}Daily budget exhausted (\$$spent / \$$DAILY_BUDGET_USD). Sleeping until midnight.${NC}"
    return 1
  fi
  return 0
}

record_spend() {
  local cost="$1"
  set_state ".daily_spend = (.daily_spend + $cost)"
}

# ── Build pipeline ──
run_build_step() {
  local name="$1" dir="$2" cmd="$3" logfile="$4"
  log "  Building ${BLUE}$name${NC}..."

  if (cd "$dir" && eval "$cmd" >> "$logfile" 2>&1); then
    log "  ${GREEN}OK${NC} $name"
    return 0
  else
    log "  ${RED}FAIL${NC} $name"
    return 1
  fi
}

run_build_pipeline() {
  local logfile="$LOG_DIR/cycle-$(printf '%04d' "$CYCLE")-build.log"
  : > "$logfile"

  BUILD_FAILED_STEP=""
  BUILD_FAILED_OUTPUT=""
  BUILD_RESULT="BUILD_OK"

  if ! run_build_step "universal-hash" "$UNIVERSAL_HASH_DIR" "$UHASH_BUILD" "$logfile"; then
    BUILD_FAILED_STEP="universal-hash ($UHASH_BUILD)"
    BUILD_FAILED_OUTPUT=$(tail -50 "$logfile")
    BUILD_RESULT="BUILD_FAIL"
    return 0
  fi

  if ! run_build_step "cw-cyber" "$CW_CYBER_DIR" "$CW_BUILD" "$logfile"; then
    BUILD_FAILED_STEP="cw-cyber ($CW_BUILD)"
    BUILD_FAILED_OUTPUT=$(tail -50 "$logfile")
    BUILD_RESULT="BUILD_FAIL"
    return 0
  fi

  if ! run_build_step "bostrom-mcp" "$BOSTROM_MCP_DIR" "$MCP_BUILD" "$logfile"; then
    BUILD_FAILED_STEP="bostrom-mcp ($MCP_BUILD)"
    BUILD_FAILED_OUTPUT=$(tail -50 "$logfile")
    BUILD_RESULT="BUILD_FAIL"
    return 0
  fi
}

# ── Test pipeline ──
run_test_step() {
  local name="$1" dir="$2" cmd="$3" logfile="$4" timeout_s="$5"
  log "  Testing ${BLUE}$name${NC}..."

  local output exit_code=0
  output=$(cd "$dir" && timeout "$timeout_s" bash -c "$cmd" 2>&1) || exit_code=$?

  echo "$output" >> "$logfile"

  if [ $exit_code -eq 0 ]; then
    log "  ${GREEN}PASS${NC} $name"
    return 0
  else
    log "  ${RED}FAIL${NC} $name (exit $exit_code)"
    TEST_FAILED_SUITE="$name"
    TEST_FAILED_OUTPUT="$output"
    return 1
  fi
}

run_tests() {
  local logfile="$LOG_DIR/cycle-$(printf '%04d' "$CYCLE")-test.log"
  : > "$logfile"

  TEST_FAILED_SUITE=""
  TEST_FAILED_OUTPUT=""
  TEST_RESULT="TEST_PASS"

  # 1. Rust tests (fast, pure)
  if ! run_test_step "cargo-test-uhash" "$UNIVERSAL_HASH_DIR" "$UHASH_TEST" "$logfile" "$TEST_TIMEOUT"; then
    TEST_RESULT="TEST_FAIL"
    return 0
  fi

  if ! run_test_step "cargo-test-cw" "$CW_CYBER_DIR" "$CW_TEST" "$logfile" "$TEST_TIMEOUT"; then
    TEST_RESULT="TEST_FAIL"
    return 0
  fi

  # 2. MCP tool registration test
  if ! run_test_step "mcp-test-all" "$BOSTROM_MCP_DIR" "$MCP_TEST_ALL" "$logfile" "$TEST_TIMEOUT"; then
    TEST_RESULT="TEST_FAIL"
    return 0
  fi

  # 3. E2E mining test (slower, on-chain) - skip if env not configured
  if [ -f "$BOSTROM_MCP_DIR/.env" ]; then
    if ! run_test_step "mcp-test-mining" "$BOSTROM_MCP_DIR" "$MCP_TEST_MINING" "$logfile" "$TEST_TIMEOUT"; then
      TEST_RESULT="TEST_FAIL"
      return 0
    fi
  else
    log "  ${YELLOW}SKIP${NC} mcp-test-mining (no .env)"
  fi
}

# ── Failure signature ──
failure_signature() {
  local output="$1"
  echo "$output" | head -5 | md5 -q 2>/dev/null || echo "$output" | head -5 | md5sum | cut -d' ' -f1
}

# ── Prompt building ──
build_prompt() {
  local type="$1" context="$2"
  local system_prompt template prompt

  system_prompt=$(cat "$PROMPT_DIR/system.md")
  template=$(cat "$PROMPT_DIR/${type}.md")

  prompt="$system_prompt

---

$template"

  echo "$prompt" | sed "s|{{FAILURE_OUTPUT}}|$(echo "$context" | head -100 | sed 's/[&/\]/\\&/g')|g"
}

build_red_prompt() {
  local suite="$1" output="$2" attempt="$3" prev="$4"
  local system_prompt template

  system_prompt=$(cat "$PROMPT_DIR/system.md")
  template=$(cat "$PROMPT_DIR/red-cycle.md")

  # Truncate output to last 100 lines for prompt size
  local trunc_output
  trunc_output=$(echo "$output" | tail -100)

  local prompt="$system_prompt

---

$template"

  # Variable substitution
  prompt="${prompt//\{\{SUITE_NAME\}\}/$suite}"
  prompt="${prompt//\{\{ATTEMPT_NUMBER\}\}/$attempt}"
  prompt="${prompt//\{\{MAX_RETRIES\}\}/$MAX_RETRIES_PER_FAILURE}"
  prompt="${prompt//\{\{PREVIOUS_ATTEMPTS\}\}/$prev}"

  # FAILURE_OUTPUT needs special handling due to special chars
  local escaped_output
  escaped_output=$(echo "$trunc_output" | python3 -c "import sys; print(sys.stdin.read().replace('\\\\','\\\\\\\\').replace('\"','\\\\\"'))" 2>/dev/null || echo "$trunc_output")
  prompt="${prompt//\{\{FAILURE_OUTPUT\}\}/$escaped_output}"

  echo "$prompt"
}

build_build_prompt() {
  local step="$1" output="$2"
  local system_prompt template

  system_prompt=$(cat "$PROMPT_DIR/system.md")
  template=$(cat "$PROMPT_DIR/build-fix.md")

  local trunc_output
  trunc_output=$(echo "$output" | tail -80)

  local prompt="$system_prompt

---

$template"

  prompt="${prompt//\{\{BUILD_STEP\}\}/$step}"

  local escaped_output
  escaped_output=$(echo "$trunc_output" | python3 -c "import sys; print(sys.stdin.read().replace('\\\\','\\\\\\\\').replace('\"','\\\\\"'))" 2>/dev/null || echo "$trunc_output")
  prompt="${prompt//\{\{BUILD_OUTPUT\}\}/$escaped_output}"

  echo "$prompt"
}

# ── Claude Code invocation ──
spawn_claude() {
  local type="$1" prompt="$2" model="$3"
  local claude_log="$LOG_DIR/cycle-$(printf '%04d' "$CYCLE")-claude.jsonl"

  log "Spawning Claude Code (${YELLOW}$type${NC}, model=${model})..."

  # Write prompt to temp file to avoid shell escaping issues
  local prompt_file="$LOG_DIR/cycle-$(printf '%04d' "$CYCLE")-prompt.md"
  echo "$prompt" > "$prompt_file"

  # Build claude args
  local -a claude_args=(
    -p "$(cat "$prompt_file")"
    --output-format json
    --allowedTools "Bash Read Edit Write Glob Grep"
    --model "$model"
    --dangerously-skip-permissions
    --no-session-persistence
  )
  if [ "$MAX_BUDGET_PER_INVOCATION" != "0" ]; then
    claude_args+=(--max-budget-usd "$MAX_BUDGET_PER_INVOCATION")
  fi

  local result exit_code=0
  result=$(unset CLAUDECODE; claude "${claude_args[@]}" 2>&1 | tee "$claude_log") || exit_code=$?

  # Extract cost from json output
  local cost
  cost=$(echo "$result" | jq -r '.cost_usd // 0' 2>/dev/null)
  cost=${cost:-0}

  # Extract the final text result
  local summary
  summary=$(echo "$result" | jq -r '.result // ""' 2>/dev/null)

  # Look for FIXED/STUCK/IMPROVED in the output
  local outcome="UNKNOWN"
  if echo "$summary" | grep -q "^FIXED:"; then
    outcome="FIXED"
  elif echo "$summary" | grep -q "^STUCK:"; then
    outcome="STUCK"
  elif echo "$summary" | grep -q "^IMPROVED:"; then
    outcome="IMPROVED"
  elif echo "$summary" | grep -qi "FIXED:"; then
    outcome="FIXED"
  elif echo "$summary" | grep -qi "STUCK:"; then
    outcome="STUCK"
  elif echo "$summary" | grep -qi "IMPROVED:"; then
    outcome="IMPROVED"
  fi

  CLAUDE_COST="$cost"
  CLAUDE_OUTCOME="$outcome"
  CLAUDE_SUMMARY=$(echo "$summary" | grep -oiE "(FIXED|STUCK|IMPROVED):.*" | head -1)
  CLAUDE_SUMMARY=${CLAUDE_SUMMARY:-"$outcome (no summary extracted)"}

  log "Claude done: ${BLUE}$outcome${NC} cost=\$$cost"

  if [ "$cost" != "0" ] && [ -n "$cost" ]; then
    record_spend "$cost"
  fi
}

# ── Git operations ──

# Ensure each repo is on its "agent" branch (created from base if needed)
ensure_agent_branch() {
  local repo="$1"
  local repo_name
  repo_name=$(basename "$repo")

  local base_branch
  case "$repo" in
    "$BOSTROM_MCP_DIR") base_branch="$BOSTROM_MCP_BRANCH" ;;
    "$UNIVERSAL_HASH_DIR") base_branch="$UNIVERSAL_HASH_BRANCH" ;;
    "$CW_CYBER_DIR") base_branch="$CW_CYBER_BRANCH" ;;
    *) base_branch="main" ;;
  esac

  (
    cd "$repo"
    local current
    current=$(git branch --show-current)
    if [ "$current" = "agent" ]; then
      return 0
    fi
    if git show-ref --verify --quiet refs/heads/agent; then
      git checkout agent --quiet
    else
      git checkout -b agent --quiet
    fi
    log "  ${BLUE}$repo_name${NC} on branch ${GREEN}agent${NC} (from $base_branch)"
  )
}

commit_if_changed() {
  local repo="$1" cycle_type="$2"
  local repo_name
  repo_name=$(basename "$repo")

  (
    cd "$repo"

    # Check for any changes (tracked or untracked)
    if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
      return 0
    fi

    # Stage all changes, exclude agent infra files
    git add -A
    git reset HEAD -- agent-state.json agent-state.json.tmp agent.pid agent-logs/ 2>/dev/null || true

    # Only proceed if there's something staged
    if git diff --cached --quiet 2>/dev/null; then
      return 0
    fi

    git commit -m "$(cat <<EOF
[agent] cycle $CYCLE ($cycle_type): $CLAUDE_SUMMARY

Automated change by mining agent.
Cycle: $CYCLE
Cost: \$$CLAUDE_COST
EOF
)"
    log "  ${GREEN}Committed${NC} $repo_name (cycle $CYCLE)"
  ) 2>/dev/null

  return 0
}

# ── Failure tracking ──
get_failure_attempts() {
  local sig="$1"
  local count
  count=$(jq -r --arg sig "$sig" '.failures[$sig].count // 0' "$STATE_FILE" 2>/dev/null)
  echo "${count:-0}"
}

get_failure_summaries() {
  local sig="$1"
  jq -r --arg sig "$sig" '.failures[$sig].summaries // [] | join("; ")' "$STATE_FILE" 2>/dev/null
}

record_failure_attempt() {
  local sig="$1" summary="$2"
  local tmp="$STATE_FILE.tmp"
  jq --arg sig "$sig" --arg summary "$summary" --argjson cycle "$CYCLE" '
    .failures[$sig].count = ((.failures[$sig].count // 0) + 1) |
    .failures[$sig].first_cycle = (.failures[$sig].first_cycle // $cycle) |
    .failures[$sig].summaries = ((.failures[$sig].summaries // []) + [$summary])
  ' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

clear_failure() {
  local sig="$1"
  local tmp="$STATE_FILE.tmp"
  jq --arg sig "$sig" 'del(.failures[$sig])' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

record_escalation() {
  local sig="$1"
  local tmp="$STATE_FILE.tmp"
  jq --arg sig "$sig" '.escalated += [$sig]' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

is_escalated() {
  local sig="$1"
  local found
  found=$(jq -r --arg sig "$sig" '.escalated | index($sig)' "$STATE_FILE" 2>/dev/null)
  [ "$found" != "null" ] && [ -n "$found" ]
}

record_improvement() {
  local summary="$1"
  local tmp="$STATE_FILE.tmp"
  jq --arg summary "$summary" --argjson cycle "$CYCLE" '
    .improvements += [{"cycle": $cycle, "summary": $summary}]
  ' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

# ── Log pruning ──
prune_logs() {
  local count
  count=$(find "$LOG_DIR" -name "cycle-*" -type f | wc -l | tr -d ' ')
  if [ "$count" -gt "$((MAX_CYCLE_LOGS * 4))" ]; then
    log "Pruning old cycle logs..."
    find "$LOG_DIR" -name "cycle-*" -type f | sort | head -n "$((count - MAX_CYCLE_LOGS * 4))" | xargs rm -f
  fi
}

# ══════════════════════════════════════════
#  MAIN LOOP
# ══════════════════════════════════════════

main() {
  log "${GREEN}=== Autonomous Mining Agent Starting ===${NC}"
  log "Repos: bostrom-mcp, universal-hash, cw-cyber"
  log "Budget: \$$MAX_BUDGET_PER_INVOCATION/invocation, \$$DAILY_BUDGET_USD/day"
  log "PID: $$"

  init_state

  # Switch all repos to persistent "agent" branch
  log "Switching repos to ${BLUE}agent${NC} branch..."
  ensure_agent_branch "$BOSTROM_MCP_DIR"
  ensure_agent_branch "$UNIVERSAL_HASH_DIR"
  ensure_agent_branch "$CW_CYBER_DIR"

  while [ -z "$STOP" ]; do
    CYCLE=$(($(get_cycle) + 1))
    set_state ".cycle = $CYCLE"

    log ""
    log "${GREEN}════════ Cycle $CYCLE ════════${NC}"

    # ── Budget check ──
    if ! check_daily_budget; then
      sleep 3600
      continue
    fi

    # ── BUILD ──
    log "Phase: ${BLUE}BUILD${NC}"
    run_build_pipeline

    if [ "$BUILD_RESULT" = "BUILD_FAIL" ]; then
      log "${RED}Build failed: $BUILD_FAILED_STEP${NC}"
      local build_prompt
      build_prompt=$(build_build_prompt "$BUILD_FAILED_STEP" "$BUILD_FAILED_OUTPUT")
      spawn_claude "build-fix" "$build_prompt" "$MODEL_SIMPLE"
      log_summary "[$CYCLE] BUILD-FIX $CLAUDE_OUTCOME \$$CLAUDE_COST \"$CLAUDE_SUMMARY\""

      [ -n "$STOP" ] && break
      sleep "$PAUSE_RED_FIXED"
      continue
    fi
    log "${GREEN}All builds passed${NC}"

    [ -n "$STOP" ] && break

    # ── TEST ──
    log "Phase: ${BLUE}TEST${NC}"
    run_tests

    [ -n "$STOP" ] && break

    # ── DECIDE ──
    if [ "$TEST_RESULT" = "TEST_FAIL" ]; then
      log "${RED}Tests failed: $TEST_FAILED_SUITE${NC}"

      local sig
      sig=$(failure_signature "$TEST_FAILED_OUTPUT")
      local attempts
      attempts=$(get_failure_attempts "$sig")

      # Check escalation
      if is_escalated "$sig"; then
        log "${YELLOW}Already escalated, skipping: $sig${NC}"
        log_summary "[$CYCLE] RED SKIP-ESCALATED \$0 \"$TEST_FAILED_SUITE already escalated\""
        sleep "$PAUSE_RED_STUCK"
        continue
      fi

      if [ "$attempts" -ge "$MAX_RETRIES_PER_FAILURE" ]; then
        log "${YELLOW}Max retries reached ($attempts), escalating: $sig${NC}"
        record_escalation "$sig"
        log_summary "[$CYCLE] RED ESCALATED \$0 \"$TEST_FAILED_SUITE after $attempts attempts\""
        sleep "$PAUSE_RED_STUCK"
        continue
      fi

      # Select model
      local model="$MODEL_SIMPLE"
      [ "$attempts" -ge 2 ] && model="$MODEL_DEEP"

      local prev_summaries
      prev_summaries=$(get_failure_summaries "$sig")

      local red_prompt
      red_prompt=$(build_red_prompt "$TEST_FAILED_SUITE" "$TEST_FAILED_OUTPUT" "$((attempts + 1))" "$prev_summaries")

      spawn_claude "red-cycle" "$red_prompt" "$model"

      record_failure_attempt "$sig" "$CLAUDE_SUMMARY"

      if [ "$CLAUDE_OUTCOME" = "FIXED" ]; then
        clear_failure "$sig"
        log_summary "[$CYCLE] RED FIXED \$$CLAUDE_COST \"$CLAUDE_SUMMARY\""
        CYCLE_PAUSE="$PAUSE_RED_FIXED"
      else
        log_summary "[$CYCLE] RED $CLAUDE_OUTCOME \$$CLAUDE_COST \"$CLAUDE_SUMMARY\""
        CYCLE_PAUSE="$PAUSE_RED_STUCK"
      fi
    else
      log "${GREEN}All tests passed${NC}"
      log "Phase: ${BLUE}GREEN CYCLE${NC}"

      local green_prompt
      green_prompt=$(build_prompt "green-cycle" "")

      spawn_claude "green-cycle" "$green_prompt" "$MODEL_SIMPLE"

      record_improvement "$CLAUDE_SUMMARY"
      log_summary "[$CYCLE] GREEN $CLAUDE_OUTCOME \$$CLAUDE_COST \"$CLAUDE_SUMMARY\""
      CYCLE_PAUSE="$PAUSE_GREEN"
    fi

    [ -n "$STOP" ] && break

    # ── POST-VALIDATE ──
    log "Phase: ${BLUE}POST-VALIDATE${NC}"
    run_build_pipeline
    run_tests

    # ── COMMIT ──
    log "Phase: ${BLUE}COMMIT${NC}"
    local cycle_type
    [ "$TEST_RESULT" = "TEST_FAIL" ] && cycle_type="red" || cycle_type="green"

    commit_if_changed "$BOSTROM_MCP_DIR" "$cycle_type"
    commit_if_changed "$UNIVERSAL_HASH_DIR" "$cycle_type"
    commit_if_changed "$CW_CYBER_DIR" "$cycle_type"

    # ── STATE UPDATE ──
    set_state ".cycle = $CYCLE"

    # ── PRUNE ──
    prune_logs

    # ── MAX CYCLES CHECK ──
    if [ "${MAX_CYCLES:-0}" -gt 0 ] && [ "$CYCLE" -ge "$MAX_CYCLES" ]; then
      log "${YELLOW}Reached MAX_CYCLES=$MAX_CYCLES, stopping${NC}"
      break
    fi

    # ── PAUSE ──
    log "Sleeping ${CYCLE_PAUSE}s before next cycle..."
    sleep "${CYCLE_PAUSE:-$PAUSE_GREEN}"
  done

  log "${GREEN}=== Agent stopped after $CYCLE cycles ===${NC}"
  rm -f "$PID_FILE"
}

main "$@"
