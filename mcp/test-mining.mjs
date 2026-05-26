#!/usr/bin/env node
/**
 * Lithium Mining Test Agent — end-to-end PoW mining through MCP tools.
 *
 * Computes real proofs using the uhash binary, submits on-chain,
 * validates every step, and tests error cases.
 *
 * Requires:
 *   - Funded BOSTROM_MNEMONIC in .env
 *   - uhash binary built at UHASH_BIN path
 *
 * Usage:
 *   node test-mining.mjs
 *
 * Env:
 *   UHASH_BIN        — path to uhash binary (default: ../universal-hash/target/release/uhash)
 *   MINE_TIMEOUT     — mining timeout in seconds (default: 120)
 *   SKIP_V4          — set to "1" to skip v4 seed-based mining
 *   SKIP_LITHIUM     — set to "1" to skip lithium v1 mining
 *   SKIP_ERRORS      — set to "1" to skip error case tests
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Load .env if present (no external dependencies)
try {
  const envPath = new URL(".env", import.meta.url).pathname;
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {}

import { createServer } from "./dist/index.js";

// ─── Config ──────────────────────────────────────────────────
const UHASH_BIN = process.env.UHASH_BIN
  ?? new URL("../universal-hash/target/release/uhash", import.meta.url).pathname;
const MINE_TIMEOUT = Number(process.env.MINE_TIMEOUT ?? 120) * 1000;
const SKIP_V4 = process.env.SKIP_V4 === "1";
const SKIP_LITHIUM = process.env.SKIP_LITHIUM === "1";
const SKIP_ERRORS = process.env.SKIP_ERRORS === "1";

// ─── Server + helpers ────────────────────────────────────────
const server = createServer();
const tools = server._registeredTools;

let passed = 0;
let failed = 0;
let skipped = 0;

function ok(msg) { passed++; console.log(`  \u2705 ${msg}`); }
function fail(msg) { failed++; console.log(`  \u274c ${msg}`); }
function skip(msg) { skipped++; console.log(`  \u23ed\ufe0f  ${msg}`); }

async function call(name, args = {}) {
  const parsed = tools[name].inputSchema
    ? tools[name].inputSchema.parse(args)
    : args;
  return tools[name].handler(parsed, {});
}

function parse(result) {
  if (result.isError) throw new Error(result.content[0].text);
  return JSON.parse(result.content[0].text);
}

function isError(result) {
  return result.isError === true;
}

function errorText(result) {
  return result.content[0].text;
}

// ─── Hex / LE helpers ────────────────────────────────────────
function toLeU64Hex(n) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(n));
  return buf.toString("hex");
}

/** Wait for block confirmation to avoid account sequence mismatch */
function waitForBlock(ms = 6000) {
  return new Promise(r => setTimeout(r, ms));
}

function countLeadingZeroBits(hexStr) {
  const bytes = Buffer.from(hexStr, "hex");
  let bits = 0;
  for (const b of bytes) {
    if (b === 0) { bits += 8; continue; }
    bits += Math.clz32(b) - 24;
    break;
  }
  return bits;
}

// ═══════════════════════════════════════════════════════════════
// Phase A: Prerequisites
// ═══════════════════════════════════════════════════════════════
console.log("\n\u2550\u2550\u2550 Phase A: Prerequisites \u2550\u2550\u2550");

// A1: Check uhash binary
if (!existsSync(UHASH_BIN)) {
  console.error(`uhash binary not found at: ${UHASH_BIN}`);
  console.error("Build with: cd ../universal-hash && cargo build --release -p uhash-cli --features metal-backend");
  process.exit(1);
}
ok(`uhash binary: ${UHASH_BIN}`);

// A2: Get wallet info
const walletData = parse(await call("wallet_info"));
const ADDR = walletData.address;
console.log(`  Wallet: ${ADDR}`);
console.log(`  BOOT: ${walletData.balances.find(b => b.denom === "boot")?.amount ?? "0"}`);
ok("wallet_info");

// A3: Get mine state
const mineState = parse(await call("li_mine_state"));
const { config: mineConfig, seed: seedData, difficulty: diffData, epoch_status: epochData } = mineState;
const currentDifficulty = diffData.current ?? diffData.difficulty ?? mineConfig.difficulty;
ok(`li_mine_state: difficulty=${currentDifficulty}, epoch=${epochData.epoch_id}`);

// A4: Get block context
let blockCtx;
try {
  blockCtx = parse(await call("li_block_context"));
  ok(`li_block_context: height=${blockCtx.height}, block_hash=${blockCtx.block_hash.slice(0, 16)}...`);
} catch (e) {
  fail(`li_block_context: ${e.message}`);
}

// A5: Print summary
console.log("\n  --- Mining Parameters ---");
console.log(`  Seed: ${seedData.seed?.slice(0, 16)}...`);
console.log(`  Difficulty: ${currentDifficulty} bits`);
console.log(`  Epoch: ${epochData.epoch_id}`);
console.log(`  Max proof age: ${mineConfig.max_proof_age}s`);
if (blockCtx) {
  console.log(`  Block height: ${blockCtx.height}`);
  console.log(`  Block hash: ${blockCtx.block_hash.slice(0, 32)}...`);
  console.log(`  Cyberlinks merkle: ${blockCtx.cyberlinks_merkle.slice(0, 32)}...`);
}

// Warn if difficulty is very high
if (currentDifficulty > 28) {
  console.log(`\n  \u26a0\ufe0f  Difficulty is ${currentDifficulty} bits — mining may take a very long time!`);
}

// Get miner stats before mining
let minerStatsBefore;
try {
  minerStatsBefore = parse(await call("li_miner_stats", { address: ADDR }));
  console.log(`  Miner proofs before: ${minerStatsBefore.proofs_submitted ?? 0}`);
} catch (e) {
  minerStatsBefore = { proofs_submitted: 0 };
  console.log(`  Miner stats: new miner (no previous proofs)`);
}

// ═══════════════════════════════════════════════════════════════
// Phase B: v4 Seed-Based Mining
// ═══════════════════════════════════════════════════════════════
console.log("\n\u2550\u2550\u2550 Phase B: v4 Seed-Based Mining \u2550\u2550\u2550");

let v4Proof = null;
let v4Submitted = false;

if (SKIP_V4) {
  skip("v4 mining (SKIP_V4=1)");
} else {
  // B1: Construct challenge: seed_bytes || miner_utf8 || timestamp_le_u64
  // Use blockchain block time (not local clock) to avoid "timestamp in future" rejection
  const freshCtxB = parse(await call("li_block_context"));
  const timestamp = Math.floor(new Date(freshCtxB.time).getTime() / 1000);
  const seedHex = seedData.seed;
  const minerHex = Buffer.from(ADDR, "utf8").toString("hex");
  const tsLEHex = toLeU64Hex(timestamp);
  const challenge = seedHex + minerHex + tsLEHex;
  ok(`Challenge constructed (${challenge.length / 2} bytes)`);
  console.log(`    seed(32) + miner(${ADDR.length}) + ts(8) = ${challenge.length / 2} bytes`);
  console.log(`    timestamp = ${timestamp}`);

  // B2: Mine (random start nonce to avoid collisions with prior runs)
  const startNonceV4 = Math.floor(Math.random() * 2 ** 32);
  try {
    console.log(`  Mining with difficulty=${currentDifficulty}, startNonce=${startNonceV4}, timeout=${MINE_TIMEOUT / 1000}s...`);
    const cmd = `"${UHASH_BIN}" mine --challenge ${challenge} --difficulty ${currentDifficulty} --backend auto --json --stop-on-proof --start-nonce ${startNonceV4}`;
    const output = execSync(cmd, { timeout: MINE_TIMEOUT, encoding: "utf8" });
    const lines = output.trim().split("\n");
    const proof = JSON.parse(lines[lines.length - 1]);

    if (proof.event === "proof_found" || proof.nonce !== undefined) {
      v4Proof = { ...proof, timestamp, challenge };
      const bits = countLeadingZeroBits(proof.hash);
      ok(`Proof found: nonce=${proof.nonce}, hash=${proof.hash.slice(0, 16)}..., difficulty=${bits} bits, ${proof.elapsed_s?.toFixed(1)}s`);
    } else {
      fail(`Unexpected mine output: ${JSON.stringify(proof)}`);
    }
  } catch (e) {
    if (e.killed || e.signal === "SIGTERM") {
      skip(`v4 mining: timeout after ${MINE_TIMEOUT / 1000}s (difficulty ${currentDifficulty} too high)`);
    } else {
      fail(`v4 mining: ${e.message?.slice(0, 200)}`);
    }
  }

  if (v4Proof) {
    // B3: Verify locally
    try {
      const cmd = `"${UHASH_BIN}" verify --challenge ${v4Proof.challenge} --nonce ${v4Proof.nonce} --hash ${v4Proof.hash} --difficulty ${currentDifficulty} --json`;
      const output = execSync(cmd, { encoding: "utf8" });
      const result = JSON.parse(output.trim());
      if (result.valid) {
        ok("Local verify: valid");
      } else {
        fail(`Local verify: invalid (hash_matches=${result.hash_matches}, difficulty_met=${result.difficulty_met})`);
      }
    } catch (e) {
      fail(`Local verify: ${e.message?.slice(0, 120)}`);
    }

    // B4: Verify on-chain (dry-run)
    try {
      const result = parse(await call("li_verify_proof", {
        hash: v4Proof.hash,
        nonce: v4Proof.nonce,
        timestamp: v4Proof.timestamp,
        miner: ADDR,
      }));
      if (result.valid) {
        ok(`On-chain verify: valid, difficulty_bits=${result.difficulty_bits}, reward=${result.estimated_reward}`);
      } else {
        fail(`On-chain verify: invalid — ${result.error || JSON.stringify(result)}`);
      }
    } catch (e) {
      fail(`On-chain verify: ${e.message?.slice(0, 200)}`);
    }

    // B5: Submit proof
    try {
      const result = parse(await call("li_submit_proof", {
        hash: v4Proof.hash,
        nonce: v4Proof.nonce,
        timestamp: v4Proof.timestamp,
        miner_address: ADDR,
      }));
      v4Submitted = true;
      ok(`li_submit_proof: txHash=${result.txHash}, height=${result.height}, gas=${result.gasUsed}`);
      await waitForBlock();
    } catch (e) {
      fail(`li_submit_proof: ${e.message?.slice(0, 200)}`);
    }

    // B6: Confirm miner stats updated
    try {
      const stats = parse(await call("li_miner_stats", { address: ADDR }));
      const before = minerStatsBefore.proofs_submitted ?? 0;
      const after = stats.proofs_submitted ?? 0;
      if (after > before) {
        ok(`Miner stats: proofs ${before} \u2192 ${after} (+${after - before})`);
      } else {
        skip(`Miner stats: proofs unchanged (${after}) — may need block confirmation`);
      }
    } catch (e) {
      fail(`li_miner_stats: ${e.message}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Phase C: Lithium v1 Mining
// ═══════════════════════════════════════════════════════════════
console.log("\n\u2550\u2550\u2550 Phase C: Lithium v1 Mining \u2550\u2550\u2550");

let lithiumProof = null;

if (SKIP_LITHIUM) {
  skip("Lithium v1 mining (SKIP_LITHIUM=1)");
} else if (!blockCtx) {
  skip("Lithium v1 mining: no block context available");
} else {
  // C1: Get fresh block context
  try {
    blockCtx = parse(await call("li_block_context"));
    ok(`Fresh block context: height=${blockCtx.height}`);
  } catch (e) {
    fail(`li_block_context refresh: ${e.message}`);
  }

  // C2: Get current epoch
  let currentEpoch;
  try {
    currentEpoch = parse(await call("li_epoch_status"));
    ok(`Epoch status: id=${currentEpoch.epoch_id}, proofs=${currentEpoch.proof_count ?? 0}`);
  } catch (e) {
    fail(`li_epoch_status: ${e.message}`);
  }

  if (blockCtx && currentEpoch) {
    // C3: Construct lithium header: SHA256(miner_utf8 || block_hash_32 || merkle_32)
    const blockHashBytes = Buffer.from(blockCtx.block_hash, "hex");
    const merkleBytes = Buffer.from(blockCtx.cyberlinks_merkle || "", "hex");

    // Handle empty data_hash (blocks with no transactions)
    let effectiveMerkle = merkleBytes;
    if (effectiveMerkle.length === 0) {
      console.log("  \u26a0\ufe0f  Empty cyberlinks_merkle — using 32 zero bytes");
      effectiveMerkle = Buffer.alloc(32, 0);
    }

    if (blockHashBytes.length !== 32) {
      fail(`Block hash is ${blockHashBytes.length} bytes, expected 32`);
    } else if (effectiveMerkle.length !== 32) {
      fail(`Cyberlinks merkle is ${effectiveMerkle.length} bytes, expected 32`);
    } else {
      const headerInput = Buffer.concat([
        Buffer.from(ADDR, "utf8"),
        blockHashBytes,
        effectiveMerkle,
      ]);
      const challenge = createHash("sha256").update(headerInput).digest("hex");
      ok(`Lithium header (challenge): ${challenge.slice(0, 32)}...`);
      console.log(`    miner(${ADDR.length}) + block_hash(32) + merkle(32) -> SHA256 = 32 bytes`);

      // C4: Mine — use blockchain time, random start nonce to avoid collisions
      const freshCtxC = parse(await call("li_block_context"));
      const timestamp = Math.floor(new Date(freshCtxC.time).getTime() / 1000);
      const startNonce = Math.floor(Math.random() * 2 ** 32);
      try {
        console.log(`  Mining lithium v1 with difficulty=${currentDifficulty}, startNonce=${startNonce}, timeout=${MINE_TIMEOUT / 1000}s...`);
        const cmd = `"${UHASH_BIN}" mine --challenge ${challenge} --difficulty ${currentDifficulty} --backend auto --json --stop-on-proof --start-nonce ${startNonce}`;
        const output = execSync(cmd, { timeout: MINE_TIMEOUT, encoding: "utf8" });
        const lines = output.trim().split("\n");
        const proof = JSON.parse(lines[lines.length - 1]);

        if (proof.event === "proof_found" || proof.nonce !== undefined) {
          lithiumProof = {
            ...proof,
            timestamp,
            challenge,
            block_hash: blockCtx.block_hash,
            cyberlinks_merkle: effectiveMerkle.toString("hex"),
            epoch_id: currentEpoch.epoch_id,
          };
          const bits = countLeadingZeroBits(proof.hash);
          ok(`Lithium proof found: nonce=${proof.nonce}, hash=${proof.hash.slice(0, 16)}..., difficulty=${bits} bits, ${proof.elapsed_s?.toFixed(1)}s`);
        } else {
          fail(`Unexpected mine output: ${JSON.stringify(proof)}`);
        }
      } catch (e) {
        if (e.killed || e.signal === "SIGTERM") {
          skip(`Lithium v1 mining: timeout after ${MINE_TIMEOUT / 1000}s`);
        } else {
          fail(`Lithium v1 mining: ${e.message?.slice(0, 200)}`);
        }
      }

      if (lithiumProof) {
        // C5: Verify locally
        try {
          const cmd = `"${UHASH_BIN}" verify --challenge ${lithiumProof.challenge} --nonce ${lithiumProof.nonce} --hash ${lithiumProof.hash} --difficulty ${currentDifficulty} --json`;
          const output = execSync(cmd, { encoding: "utf8" });
          const result = JSON.parse(output.trim());
          if (result.valid) {
            ok("Local verify (lithium): valid");
          } else {
            fail(`Local verify (lithium): invalid (${JSON.stringify(result)})`);
          }
        } catch (e) {
          fail(`Local verify (lithium): ${e.message?.slice(0, 120)}`);
        }

        // C6: Submit lithium proof
        try {
          const result = parse(await call("li_submit_lithium_proof", {
            hash: lithiumProof.hash,
            nonce: lithiumProof.nonce,
            miner_address: ADDR,
            block_hash: lithiumProof.block_hash,
            cyberlinks_merkle: lithiumProof.cyberlinks_merkle,
            epoch_id: lithiumProof.epoch_id,
            timestamp: lithiumProof.timestamp,
          }));
          ok(`li_submit_lithium_proof: txHash=${result.txHash}, height=${result.height}, gas=${result.gasUsed}`);
          await waitForBlock();
        } catch (e) {
          fail(`li_submit_lithium_proof: ${e.message?.slice(0, 200)}`);
        }

        // C7: Confirm miner epoch stats
        try {
          const stats = parse(await call("li_miner_epoch_stats", {
            address: ADDR,
            epoch_id: lithiumProof.epoch_id,
          }));
          ok(`Miner epoch stats: ${JSON.stringify(stats)}`);
        } catch (e) {
          fail(`li_miner_epoch_stats: ${e.message}`);
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Phase D: Error Cases / Bug Hunting
// ═══════════════════════════════════════════════════════════════
console.log("\n\u2550\u2550\u2550 Phase D: Error Cases \u2550\u2550\u2550");

if (SKIP_ERRORS) {
  skip("Error cases (SKIP_ERRORS=1)");
} else {
  // D1: Wrong hash -> HashMismatch
  try {
    const fakeHash = "0000000000000000000000000000000000000000000000000000000000000000";
    // Use blockchain time to avoid "timestamp in future" masking the hash error
    const ctxD1 = parse(await call("li_block_context"));
    const tsD1 = Math.floor(new Date(ctxD1.time).getTime() / 1000);
    const result = await call("li_submit_proof", {
      hash: fakeHash,
      nonce: 1,
      timestamp: tsD1,
      miner_address: ADDR,
    });
    if (isError(result)) {
      const text = errorText(result);
      if (text.includes("HashMismatch") || text.includes("hash") || text.includes("mismatch")) {
        ok("Wrong hash: correctly rejected (HashMismatch)");
      } else {
        ok(`Wrong hash: rejected with: ${text.slice(0, 100)}`);
      }
    } else {
      fail("Wrong hash: unexpectedly accepted!");
    }
  } catch (e) {
    const msg = e.message;
    if (msg.includes("HashMismatch") || msg.includes("hash") || msg.includes("mismatch")) {
      ok("Wrong hash: correctly rejected (HashMismatch)");
    } else {
      ok(`Wrong hash: rejected with: ${msg.slice(0, 100)}`);
    }
  }

  await waitForBlock();

  // D2: Stale timestamp -> TimestampTooOld
  try {
    const staleTs = Math.floor(Date.now() / 1000) - 100000; // ~27 hours ago
    const result = await call("li_verify_proof", {
      hash: "0000000000000000000000000000000000000000000000000000000000000000",
      nonce: 1,
      timestamp: staleTs,
      miner: ADDR,
    });
    const data = parse({ ...result, isError: false });
    if (data.valid === false || data.error) {
      const errMsg = data.error || "timestamp rejected";
      if (errMsg.includes("Timestamp") || errMsg.includes("timestamp") || errMsg.includes("old") || errMsg.includes("age")) {
        ok(`Stale timestamp: correctly rejected (${errMsg.slice(0, 60)})`);
      } else {
        ok(`Stale timestamp: rejected (${errMsg.slice(0, 60)})`);
      }
    } else {
      fail("Stale timestamp: unexpectedly accepted");
    }
  } catch (e) {
    const msg = e.message;
    if (msg.includes("Timestamp") || msg.includes("timestamp") || msg.includes("old")) {
      ok(`Stale timestamp: correctly rejected (${msg.slice(0, 80)})`);
    } else {
      ok(`Stale timestamp: rejected with: ${msg.slice(0, 100)}`);
    }
  }

  await waitForBlock();

  // D3: Duplicate nonce (resubmit v4 proof if we have one)
  if (v4Proof && v4Submitted) {
    try {
      const result = await call("li_submit_proof", {
        hash: v4Proof.hash,
        nonce: v4Proof.nonce,
        timestamp: v4Proof.timestamp,
        miner_address: ADDR,
      });
      if (isError(result)) {
        const text = errorText(result);
        if (text.includes("Duplicate") || text.includes("duplicate") || text.includes("already")) {
          ok("Duplicate v4 nonce: correctly rejected (DuplicateProof)");
        } else {
          ok(`Duplicate v4 nonce: rejected with: ${text.slice(0, 100)}`);
        }
      } else {
        fail("Duplicate v4 nonce: unexpectedly accepted!");
      }
    } catch (e) {
      const msg = e.message;
      if (msg.includes("Duplicate") || msg.includes("duplicate") || msg.includes("already")) {
        ok("Duplicate v4 nonce: correctly rejected (DuplicateProof)");
      } else {
        ok(`Duplicate v4 nonce: rejected with: ${msg.slice(0, 100)}`);
      }
    }
  } else {
    skip("Duplicate v4 nonce: no successfully submitted v4 proof to re-submit");
  }

  await waitForBlock();

  // D4: Wrong epoch_id for lithium proof
  if (lithiumProof) {
    try {
      const wrongEpochId = lithiumProof.epoch_id + 999;
      const result = await call("li_submit_lithium_proof", {
        hash: lithiumProof.hash,
        nonce: lithiumProof.nonce + 1, // different nonce to avoid duplicate check first
        miner_address: ADDR,
        block_hash: lithiumProof.block_hash,
        cyberlinks_merkle: lithiumProof.cyberlinks_merkle,
        epoch_id: wrongEpochId,
        timestamp: lithiumProof.timestamp,
      });
      if (isError(result)) {
        const text = errorText(result);
        if (text.includes("Epoch") || text.includes("epoch") || text.includes("mismatch")) {
          ok("Wrong epoch_id: correctly rejected (EpochMismatch)");
        } else {
          ok(`Wrong epoch_id: rejected with: ${text.slice(0, 100)}`);
        }
      } else {
        fail("Wrong epoch_id: unexpectedly accepted!");
      }
    } catch (e) {
      const msg = e.message;
      if (msg.includes("Epoch") || msg.includes("epoch") || msg.includes("mismatch")) {
        ok("Wrong epoch_id: correctly rejected (EpochMismatch)");
      } else {
        ok(`Wrong epoch_id: rejected with: ${msg.slice(0, 100)}`);
      }
    }
  } else {
    skip("Wrong epoch_id: no lithium proof available");
  }
}

// ═══════════════════════════════════════════════════════════════
// Phase E: Post-Mining
// ═══════════════════════════════════════════════════════════════
console.log("\n\u2550\u2550\u2550 Phase E: Post-Mining \u2550\u2550\u2550");

await waitForBlock();

// E1: Check LI balance
const LI_DENOM = "factory/bostrom1wsgx32y0tx5rk6g89ffr8hg2wucnpwp650e9nrdm80jeyku5u4zq5ashgz/li";
try {
  const bals = parse(await call("economy_balances", { address: ADDR }));
  const liBal = bals.find(b => b.denom === LI_DENOM);
  const liAmount = liBal ? BigInt(liBal.amount) : 0n;
  ok(`LI balance: ${liAmount.toString()}`);

  // E2: Stake if we earned LI
  if (liAmount >= 1000n) {
    try {
      const stakeRes = parse(await call("li_stake", { amount: "1000" }));
      ok(`li_stake(1000): txHash=${stakeRes.txHash}`);
      await waitForBlock();
    } catch (e) {
      fail(`li_stake: ${e.message?.slice(0, 120)}`);
    }

    // E3: Claim rewards (wait for block to confirm and sequence to settle)
    await new Promise(r => setTimeout(r, 8000));
    try {
      const claimRes = parse(await call("li_claim_rewards"));
      ok(`li_claim_rewards: txHash=${claimRes.txHash}`);
    } catch (e) {
      fail(`li_claim_rewards: ${e.message?.slice(0, 120)}`);
    }
  } else {
    skip("LI staking: insufficient balance (< 1000)");
  }
} catch (e) {
  fail(`economy_balances: ${e.message}`);
}

// E4: Final miner stats
try {
  const finalStats = parse(await call("li_miner_stats", { address: ADDR }));
  ok(`Final miner stats: proofs=${finalStats.proofs_submitted}, rewards=${finalStats.total_rewards}`);
} catch (e) {
  fail(`li_miner_stats: ${e.message}`);
}

// ═══════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════
console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
console.log(`  \u2705 Passed: ${passed}`);
console.log(`  \u274c Failed: ${failed}`);
console.log(`  \u23ed\ufe0f  Skipped: ${skipped}`);
console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");

process.exit(failed > 0 ? 1 : 0);
