import { createRequire } from "node:module";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
  defaultRegistryTypes,
  GasPrice,
  type DeliverTxResponse,
} from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Registry } from "@cosmjs/proto-signing";
import type { EncodeObject, GeneratedType } from "@cosmjs/proto-signing";

// CJS sub-path imports — cyber-ts lacks ESM "exports" field.
// Lazy-loaded to avoid crashing Smithery's CJS scan bundler.
let _cyberProtoRegistry: ReadonlyArray<[string, GeneratedType]> | null = null;
let _osmosisProtoRegistry: ReadonlyArray<[string, GeneratedType]> | null = null;

function loadProtoRegistries() {
  if (_cyberProtoRegistry) return;
  const req = createRequire(import.meta.url);
  _cyberProtoRegistry = (req("@cybercongress/cyber-ts/cyber/client") as {
    cyberProtoRegistry: ReadonlyArray<[string, GeneratedType]>;
  }).cyberProtoRegistry;
  _osmosisProtoRegistry = (req("@cybercongress/cyber-ts/osmosis/client") as {
    osmosisProtoRegistry: ReadonlyArray<[string, GeneratedType]>;
  }).osmosisProtoRegistry;
}

const RPC_ENDPOINT = process.env.BOSTROM_RPC ?? "https://rpc.bostrom.cybernode.ai";
const ADDRESS_PREFIX = "bostrom";
const GAS_PRICE_STR = process.env.BOSTROM_GAS_PRICE ?? "0.01boot";
const GAS_MULTIPLIER = Number(process.env.BOSTROM_GAS_MULTIPLIER ?? "1.4");

let wallet: DirectSecp256k1HdWallet | null = null;
let address: string | null = null;
let stargateClient: SigningStargateClient | null = null;
let cosmwasmClient: SigningCosmWasmClient | null = null;

function requireMnemonic(): string {
  const mnemonic = process.env.BOSTROM_MNEMONIC;
  if (!mnemonic) {
    throw new Error(
      "BOSTROM_MNEMONIC environment variable is not set. " +
      "Write tools require a wallet. Set BOSTROM_MNEMONIC to enable signing.",
    );
  }
  return mnemonic;
}

async function initWallet(): Promise<void> {
  if (wallet) return;
  const mnemonic = requireMnemonic();
  wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: ADDRESS_PREFIX,
  });
  const [account] = await wallet.getAccounts();
  address = account.address;
}

/** Get the wallet address (initializes wallet on first call) */
export async function getWalletAddress(): Promise<string> {
  await initWallet();
  return address!;
}

/** Build a merged registry: default stargate + cyber + osmosis types */
function buildRegistry(): Registry {
  loadProtoRegistries();
  return new Registry([
    ...defaultRegistryTypes,
    ..._cyberProtoRegistry!,
    ..._osmosisProtoRegistry!,
  ]);
}

/**
 * Get a SigningStargateClient with cyber + osmosis + default types registered.
 * Used for chain-native messages (bank, staking, gov, cyberlink, tokenfactory, etc.)
 */
export async function getStargateClient(): Promise<SigningStargateClient> {
  await initWallet();
  if (!stargateClient) {
    const registry = buildRegistry();
    stargateClient = await SigningStargateClient.connectWithSigner(
      RPC_ENDPOINT,
      wallet!,
      {
        registry,
        gasPrice: GasPrice.fromString(GAS_PRICE_STR),
      },
    );
  }
  return stargateClient;
}

/**
 * Get a SigningCosmWasmClient for contract execution.
 * Includes wasm types (MsgExecuteContract, etc.) automatically.
 */
export async function getCosmWasmClient(): Promise<SigningCosmWasmClient> {
  await initWallet();
  if (!cosmwasmClient) {
    cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
      RPC_ENDPOINT,
      wallet!,
      {
        gasPrice: GasPrice.fromString(GAS_PRICE_STR),
      },
    );
  }
  return cosmwasmClient;
}

const MIN_GAS = Number(process.env.BOSTROM_MIN_GAS ?? "100000");

/** Sign and broadcast messages using the stargate client with auto gas */
export async function signAndBroadcast(
  msgs: EncodeObject[],
  memo?: string,
): Promise<DeliverTxResponse> {
  const client = await getStargateClient();
  const addr = await getWalletAddress();
  const gasEstimate = await client.simulate(addr, msgs, memo);
  const gasLimit = Math.max(Math.ceil(gasEstimate * GAS_MULTIPLIER), MIN_GAS);
  const fee = {
    amount: [{ denom: "boot", amount: String(Math.ceil(gasLimit * 0.01)) }],
    gas: String(gasLimit),
  };
  const result = await client.signAndBroadcast(addr, msgs, fee, memo);
  if (result.code !== 0) {
    throw new Error(`Transaction failed (code ${result.code}): ${result.rawLog}`);
  }
  return result;
}

/** Format a DeliverTxResponse for tool output */
export function formatTxResult(result: DeliverTxResponse) {
  return {
    txHash: result.transactionHash,
    height: result.height,
    gasUsed: result.gasUsed,
    gasWanted: result.gasWanted,
    code: result.code,
  };
}

/** Check amount against BOSTROM_MAX_SEND_AMOUNT circuit breaker */
export function checkAmountLimit(amount: string, denom: string): void {
  const maxStr = process.env.BOSTROM_MAX_SEND_AMOUNT;
  if (!maxStr) return;
  const max = BigInt(maxStr);
  const val = BigInt(amount);
  if (val > max) {
    throw new Error(
      `Amount ${amount} ${denom} exceeds BOSTROM_MAX_SEND_AMOUNT (${maxStr}). ` +
      "Increase the limit or reduce the amount.",
    );
  }
}
