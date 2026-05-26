import { rpcGet } from "../clients/rpc.js";
import { lcdGet } from "../clients/lcd.js";

export async function getChainStatus() {
  const status = await rpcGet<{
    node_info: { network: string; version: string };
    sync_info: {
      latest_block_height: string;
      latest_block_time: string;
      catching_up: boolean;
    };
  }>("/status");
  return {
    chain_id: status.node_info.network,
    node_version: status.node_info.version,
    latest_block_height: status.sync_info.latest_block_height,
    latest_block_time: status.sync_info.latest_block_time,
    catching_up: status.sync_info.catching_up,
  };
}

export async function searchTxs(opts: {
  sender?: string;
  contract?: string;
  messageType?: string;
  limit: number;
  offset: number;
}) {
  const events: string[] = [];
  if (opts.sender) events.push(`message.sender='${opts.sender}'`);
  if (opts.contract) events.push(`execute._contract_address='${opts.contract}'`);
  if (opts.messageType) events.push(`message.action='${opts.messageType}'`);

  if (events.length === 0) {
    throw new Error("Provide at least one filter: sender, contract, or message_type");
  }

  const query = events.join(" AND ");
  const params = new URLSearchParams({
    events: query,
    "pagination.limit": String(opts.limit),
    "pagination.offset": String(opts.offset),
    order_by: "ORDER_BY_DESC",
  });

  const result = await lcdGet<{
    tx_responses: Array<{
      txhash: string;
      height: string;
      timestamp: string;
      code: number;
      raw_log: string;
    }>;
    pagination: { total: string };
  }>(`/cosmos/tx/v1beta1/txs?${params}`);

  const txs = (result.tx_responses ?? []).map((tx) => ({
    txhash: tx.txhash,
    height: tx.height,
    timestamp: tx.timestamp,
    success: tx.code === 0,
    raw_log: tx.raw_log?.slice(0, 200),
  }));

  return { total: result.pagination?.total ?? "0", txs };
}

export async function getTxDetail(txhash: string) {
  const result = await lcdGet<{
    tx_response: {
      txhash: string;
      height: string;
      timestamp: string;
      code: number;
      gas_wanted: string;
      gas_used: string;
      raw_log: string;
      logs: unknown[];
      tx: unknown;
    };
  }>(`/cosmos/tx/v1beta1/txs/${txhash}`);
  return result.tx_response;
}
