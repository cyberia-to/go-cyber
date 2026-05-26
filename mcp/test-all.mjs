#!/usr/bin/env node
/**
 * Comprehensive test of all bostrom-mcp functionality.
 * Tests server startup, tool registration, read tools, write tool error handling,
 * and optionally live write tests if BOSTROM_MNEMONIC is set.
 */

import { createServer } from "./dist/index.js";

const server = createServer();
const tools = server._registeredTools;
const toolNames = Object.keys(tools).sort();

let passed = 0;
let failed = 0;
let skipped = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${msg}`);
  } else {
    failed++;
    console.log(`  ❌ FAIL: ${msg}`);
  }
}

function skip(msg) {
  skipped++;
  console.log(`  ⏭️  SKIP: ${msg}`);
}

async function callTool(name, args = {}) {
  const tool = tools[name];
  if (!tool) throw new Error(`Tool not found: ${name}`);
  // inputSchema is a ZodObject — parse to apply defaults (MCP SDK does this automatically)
  const parsedArgs = tool.inputSchema ? tool.inputSchema.parse(args) : args;
  const result = await tool.handler(parsedArgs, {});
  return result;
}

// ─── Test 1: Server startup & tool count ────────────────────
console.log("\n═══ Test 1: Server Startup & Tool Registration ═══");
assert(toolNames.length === 89, `Total tools = ${toolNames.length} (expected 89)`);

// Verify tool categories
const readTools = toolNames.filter(n => {
  const t = tools[n];
  return t.annotations?.readOnlyHint === true;
});
const writeTools = toolNames.filter(n => {
  const t = tools[n];
  return t.annotations?.readOnlyHint === false;
});
console.log(`  Read tools: ${readTools.length}, Write tools: ${writeTools.length}`);
assert(readTools.length >= 44, `At least 44 read tools (got ${readTools.length})`);
assert(writeTools.length >= 30, `At least 30 write tools (got ${writeTools.length})`);

// Verify all expected write tools exist
const expectedWriteTools = [
  // Phase 1: Wallet
  "wallet_info", "wallet_send", "wallet_delegate", "wallet_undelegate",
  "wallet_redelegate", "wallet_claim_rewards", "wallet_vote",
  // Phase 2: Graph Write
  "graph_create_cyberlink", "graph_create_cyberlinks", "graph_investmint",
  "graph_pin_content", "graph_create_knowledge",
  // Phase 3: Contract + Lithium Write
  "contract_execute", "contract_execute_multi",
  "li_submit_proof", "li_stake", "li_unstake", "li_claim_rewards", "li_set_referrer",
  // Phase 4: Token Factory
  "token_create", "token_set_metadata", "token_mint", "token_burn",
  "token_change_admin", "token_list_created",
  // Phase 5: Liquidity
  "liquidity_create_pool", "liquidity_deposit", "liquidity_withdraw",
  "liquidity_swap", "liquidity_pool_detail",
  // Phase 6: Grid + IBC
  "grid_create_route", "grid_edit_route", "grid_delete_route", "grid_list_routes",
  "ibc_transfer", "ibc_channels",
];
for (const name of expectedWriteTools) {
  assert(toolNames.includes(name), `Tool exists: ${name}`);
}

// Verify annotations are set correctly
const annotationChecks = {
  wallet_info: { readOnlyHint: true },
  wallet_send: { readOnlyHint: false, idempotentHint: false },
  token_set_metadata: { readOnlyHint: false, idempotentHint: true },
  token_list_created: { readOnlyHint: true },
  liquidity_pool_detail: { readOnlyHint: true },
  ibc_channels: { readOnlyHint: true },
  grid_list_routes: { readOnlyHint: true },
};
console.log("\n  Annotation checks:");
for (const [name, expected] of Object.entries(annotationChecks)) {
  const actual = tools[name]?.annotations;
  const match = Object.entries(expected).every(([k, v]) => actual?.[k] === v);
  assert(match, `${name} annotations: ${JSON.stringify(expected)}`);
}

// ─── Test 2: Read tools still work ──────────────────────────
console.log("\n═══ Test 2: Existing Read Tools ═══");

async function testReadTool(name, args, check) {
  try {
    const result = await callTool(name, args);
    const text = result.content?.[0]?.text;
    if (result.isError) {
      assert(false, `${name}: returned error: ${text}`);
    } else if (check && !check(text)) {
      assert(false, `${name}: check failed, got: ${text?.slice(0, 200)}`);
    } else {
      assert(true, `${name}: OK (${text?.length} chars)`);
    }
  } catch (e) {
    assert(false, `${name}: threw: ${e.message}`);
  }
}

await testReadTool("infra_chain_status", {}, (t) => t.includes("chain_id"));
await testReadTool("economy_supply", { denom: "boot" }, (t) => t.includes("amount"));
await testReadTool("graph_stats", {}, (t) => t.includes("cyberlinks") || t.includes("particles") || t.length > 10);
await testReadTool("li_core_config", {}, (t) => t.includes("token_denom") || t.includes("admin"));
await testReadTool("li_mine_state", {}, (t) => t.includes("config") || t.includes("seed"));
await testReadTool("li_stake_config", {}, (t) => t.includes("config") || t.includes("core"));
await testReadTool("economy_staking", { address: "bostrom1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqstlrt0s" }, (t) => t.length > 10);
await testReadTool("gov_proposals", { limit: 2 }, (t) => t.length > 10);

// ─── Test 3: New read tools ─────────────────────────────────
console.log("\n═══ Test 3: New Read Tools ═══");

await testReadTool("ibc_channels", {}, (t) => t.includes("channel") || t.length > 10);
await testReadTool("liquidity_pool_detail", { pool_id: 1 }, (t) => t.length > 5);

// grid_list_routes needs an address or mnemonic
try {
  const result = await callTool("grid_list_routes", { address: "bostrom1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqstlrt0s" });
  const text = result.content?.[0]?.text;
  // May return empty routes or error for nonexistent address
  assert(!result.isError || text.includes("routes"), `grid_list_routes: responded (${text?.length} chars)`);
} catch (e) {
  assert(false, `grid_list_routes: threw: ${e.message}`);
}

// ─── Test 4: Write tools without mnemonic ───────────────────
console.log("\n═══ Test 4: Write Tools Without Mnemonic (error handling) ═══");

// Temporarily unset mnemonic
const savedMnemonic = process.env.BOSTROM_MNEMONIC;
delete process.env.BOSTROM_MNEMONIC;

const writeToolsToTest = [
  ["wallet_send", { to: "bostrom1test", amount: "1", denom: "boot" }],
  ["wallet_delegate", { validator: "bostromvaloper1test", amount: "1" }],
  ["wallet_vote", { proposal_id: 1, option: "yes" }],
  ["graph_create_cyberlink", { from_cid: "QmTest1", to_cid: "QmTest2" }],
  ["graph_investmint", { amount: "1", resource: "millivolt", length: 1 }],
  ["contract_execute", { contract: "bostrom1test", msg: { test: {} } }],
  ["li_submit_proof", { hash: "abc", nonce: 1, timestamp: 1000 }],
  ["li_stake", { amount: "1" }],
  ["token_create", { subdenom: "test" }],
  ["token_mint", { denom: "factory/test/test", amount: "1", mint_to: "bostrom1test" }],
  ["liquidity_create_pool", { denom_a: "boot", amount_a: "1", denom_b: "hydrogen", amount_b: "1" }],
  ["liquidity_swap", { pool_id: 1, offer_denom: "boot", offer_amount: "1", demand_denom: "hydrogen", order_price: "1.0" }],
  ["grid_create_route", { destination: "bostrom1test", name: "test" }],
  ["ibc_transfer", { channel: "channel-0", denom: "boot", amount: "1", receiver: "cosmos1test" }],
];

for (const [name, args] of writeToolsToTest) {
  try {
    const result = await callTool(name, args);
    const text = result.content?.[0]?.text || "";
    assert(
      result.isError && text.includes("BOSTROM_MNEMONIC"),
      `${name}: returns BOSTROM_MNEMONIC error`
    );
  } catch (e) {
    // Some tools might throw before reaching the handler
    assert(
      e.message.includes("BOSTROM_MNEMONIC"),
      `${name}: threw BOSTROM_MNEMONIC error`
    );
  }
}

// wallet_info also requires mnemonic
try {
  const result = await callTool("wallet_info", {});
  const text = result.content?.[0]?.text || "";
  assert(
    result.isError && text.includes("BOSTROM_MNEMONIC"),
    `wallet_info: returns BOSTROM_MNEMONIC error`
  );
} catch (e) {
  assert(e.message.includes("BOSTROM_MNEMONIC"), `wallet_info: threw BOSTROM_MNEMONIC error`);
}

// graph_pin_content should work without mnemonic (only IPFS)
// (may fail due to IPFS gateway, but should not fail with mnemonic error)
try {
  const result = await callTool("graph_pin_content", { content: "test" });
  const text = result.content?.[0]?.text || "";
  assert(
    !text.includes("BOSTROM_MNEMONIC"),
    `graph_pin_content: does NOT require mnemonic (got: ${result.isError ? 'error: ' + text.slice(0, 100) : 'OK'})`
  );
} catch (e) {
  assert(!e.message.includes("BOSTROM_MNEMONIC"), `graph_pin_content: does not require mnemonic`);
}

// token_list_created requires mnemonic (needs wallet address)
try {
  const result = await callTool("token_list_created", {});
  const text = result.content?.[0]?.text || "";
  assert(
    result.isError && text.includes("BOSTROM_MNEMONIC"),
    `token_list_created: returns BOSTROM_MNEMONIC error (needs wallet addr)`
  );
} catch (e) {
  assert(e.message.includes("BOSTROM_MNEMONIC"), `token_list_created: threw BOSTROM_MNEMONIC error`);
}

// Restore mnemonic
if (savedMnemonic) process.env.BOSTROM_MNEMONIC = savedMnemonic;

// ─── Test 5: Signing client registry ────────────────────────
console.log("\n═══ Test 5: Signing Client Registry ═══");

import { createRequire } from "node:module";
const require2 = createRequire(import.meta.url);
const { cyberProtoRegistry } = require2("@cybercongress/cyber-ts/cyber/client");
const { osmosisProtoRegistry } = require2("@cybercongress/cyber-ts/osmosis/client");
const stargateModule = require2("@cosmjs/stargate");
const protoSigningModule = require2("@cosmjs/proto-signing");
const { defaultRegistryTypes } = stargateModule;
const { Registry } = protoSigningModule;

const allTypes = [...defaultRegistryTypes, ...cyberProtoRegistry, ...osmosisProtoRegistry];
const registry = new Registry(allTypes);

const requiredTypeUrls = [
  // Cosmos standard
  "/cosmos.bank.v1beta1.MsgSend",
  "/cosmos.staking.v1beta1.MsgDelegate",
  "/cosmos.staking.v1beta1.MsgUndelegate",
  "/cosmos.staking.v1beta1.MsgBeginRedelegate",
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
  "/cosmos.gov.v1beta1.MsgVote",
  "/ibc.applications.transfer.v1.MsgTransfer",
  // Cyber-specific
  "/cyber.graph.v1beta1.MsgCyberlink",
  "/cyber.resources.v1beta1.MsgInvestmint",
  "/cyber.liquidity.v1beta1.MsgCreatePool",
  "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
  "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
  "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
  "/cyber.grid.v1beta1.MsgCreateRoute",
  "/cyber.grid.v1beta1.MsgEditRoute",
  "/cyber.grid.v1beta1.MsgDeleteRoute",
  // Osmosis TokenFactory
  "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
  "/osmosis.tokenfactory.v1beta1.MsgMint",
  "/osmosis.tokenfactory.v1beta1.MsgBurn",
  "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin",
  "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata",
];

for (const typeUrl of requiredTypeUrls) {
  try {
    const codec = registry.lookupType(typeUrl);
    assert(codec !== undefined, `Registry has ${typeUrl}`);
  } catch (e) {
    assert(false, `Registry missing ${typeUrl}: ${e.message}`);
  }
}

console.log(`\n  Total registered type URLs in merged registry: ${allTypes.length}`);

// ─── Test 6: Live write tests (if mnemonic set) ─────────────
console.log("\n═══ Test 6: Live Write Tests ═══");

if (process.env.BOSTROM_MNEMONIC) {
  console.log("  BOSTROM_MNEMONIC is set — running live tests...");

  // Test wallet_info
  try {
    const result = await callTool("wallet_info", {});
    const text = result.content?.[0]?.text || "";
    const data = JSON.parse(text);
    assert(
      data.address && data.address.startsWith("bostrom1"),
      `wallet_info: address = ${data.address}`
    );
    assert(
      Array.isArray(data.balances),
      `wallet_info: has balances array (${data.balances.length} denoms)`
    );
    console.log(`  Balances: ${JSON.stringify(data.balances.slice(0, 5))}`);
  } catch (e) {
    assert(false, `wallet_info: ${e.message}`);
  }

  // Test token_list_created
  try {
    const result = await callTool("token_list_created", {});
    const text = result.content?.[0]?.text || "";
    const data = JSON.parse(text);
    assert(
      data.creator && data.creator.startsWith("bostrom1"),
      `token_list_created: creator = ${data.creator}`
    );
    console.log(`  Created denoms: ${JSON.stringify(data.denoms)}`);
  } catch (e) {
    assert(false, `token_list_created: ${e.message}`);
  }

  // Test grid_list_routes (own routes)
  try {
    const result = await callTool("grid_list_routes", {});
    const text = result.content?.[0]?.text || "";
    const data = JSON.parse(text);
    assert(data.source && data.source.startsWith("bostrom1"), `grid_list_routes: source = ${data.source}`);
    console.log(`  Routes: ${data.routes?.length ?? 0}`);
  } catch (e) {
    assert(false, `grid_list_routes (own): ${e.message}`);
  }

  // NOTE: We intentionally do NOT test wallet_send, delegate, or other
  // state-changing operations here to avoid spending real tokens.
  // Those should be tested manually with a test mnemonic.
  skip("wallet_send, wallet_delegate, etc. — skipped to avoid spending tokens");
  skip("graph_create_cyberlink — skipped (requires VOLT/AMPERE)");
  skip("token_create — skipped (costs ~10,000 BOOT)");
  skip("liquidity_create_pool — skipped (costs ~1,000 BOOT)");
} else {
  skip("No BOSTROM_MNEMONIC — skipping live write tests");
}

// ─── Summary ────────────────────────────────────────────────
console.log("\n═══════════════════════════════════════════════════");
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  ⏭️  Skipped: ${skipped}`);
console.log("═══════════════════════════════════════════════════\n");

process.exit(failed > 0 ? 1 : 0);
