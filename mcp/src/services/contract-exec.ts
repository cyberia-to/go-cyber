import { readFile } from "node:fs/promises";
import {
  getWalletAddress,
  getCosmWasmClient,
} from "../clients/signing.js";
import type { Coin } from "@cosmjs/amino";

/** Execute a single CosmWasm contract message */
export async function executeContract(
  contractAddr: string,
  msg: Record<string, unknown>,
  funds: Coin[] = [],
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const result = await client.execute(sender, contractAddr, msg, "auto", memo, funds);
  return {
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    sender,
    contract: contractAddr,
  };
}

/** Upload wasm bytecode. Returns code ID. */
export async function uploadCode(
  wasmBytecode: Uint8Array,
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const result = await client.upload(sender, wasmBytecode, "auto", memo);
  return {
    codeId: result.codeId,
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    checksum: result.checksum,
    sender,
  };
}

/** Upload wasm bytecode from a file path. Returns code ID. */
export async function uploadCodeFromFile(
  filePath: string,
  memo?: string,
) {
  const bytecode = await readFile(filePath);
  return uploadCode(new Uint8Array(bytecode), memo);
}

/** Instantiate a contract from a code ID */
export async function instantiateContract(
  codeId: number,
  msg: Record<string, unknown>,
  label: string,
  funds: Coin[] = [],
  admin?: string,
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const options = admin ? { admin, memo, funds } : { memo, funds };
  const result = await client.instantiate(sender, codeId, msg, label, "auto", options);
  return {
    contractAddress: result.contractAddress,
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    codeId,
    label,
    sender,
  };
}

/** Migrate a contract to a new code ID */
export async function migrateContract(
  contractAddr: string,
  newCodeId: number,
  msg: Record<string, unknown>,
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const result = await client.migrate(sender, contractAddr, newCodeId, msg, "auto", memo);
  return {
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    sender,
    contract: contractAddr,
    newCodeId,
  };
}

/** Update the admin of a contract */
export async function updateContractAdmin(
  contractAddr: string,
  newAdmin: string,
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const result = await client.updateAdmin(sender, contractAddr, newAdmin, "auto", memo);
  return {
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    sender,
    contract: contractAddr,
    newAdmin,
  };
}

/** Clear the admin of a contract (makes it immutable) */
export async function clearContractAdmin(
  contractAddr: string,
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const result = await client.clearAdmin(sender, contractAddr, "auto", memo);
  return {
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    sender,
    contract: contractAddr,
    note: "Admin cleared — contract is now immutable",
  };
}

/** Execute multiple contract messages in a single transaction */
export async function executeContractMulti(
  operations: Array<{
    contract: string;
    msg: Record<string, unknown>;
    funds?: Coin[];
  }>,
  memo?: string,
) {
  const client = await getCosmWasmClient();
  const sender = await getWalletAddress();
  const msgs = operations.map((op) => ({
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: {
      sender,
      contract: op.contract,
      msg: new TextEncoder().encode(JSON.stringify(op.msg)),
      funds: op.funds ?? [],
    },
  }));
  const result = await client.signAndBroadcast(sender, msgs, "auto", memo);
  if (result.code !== 0) {
    throw new Error(`Multi-execute failed (code ${result.code}): ${result.rawLog}`);
  }
  return {
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    sender,
    operationCount: operations.length,
  };
}
