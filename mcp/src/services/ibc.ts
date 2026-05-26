import {
  getWalletAddress,
  signAndBroadcast,
  formatTxResult,
} from "../clients/signing.js";
import { lcdGet } from "../clients/lcd.js";

/** IBC transfer tokens to another chain */
export async function ibcTransfer(
  channel: string,
  denom: string,
  amount: string,
  receiver: string,
  timeoutMinutes: number = 10,
) {
  const sender = await getWalletAddress();

  // Timeout timestamp in nanoseconds (current time + timeout)
  const timeoutNs = BigInt(Date.now() + timeoutMinutes * 60 * 1000) * BigInt(1_000_000);

  const msg = {
    typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    value: {
      sourcePort: "transfer",
      sourceChannel: channel,
      token: { denom, amount },
      sender,
      receiver,
      timeoutHeight: { revisionNumber: BigInt(0), revisionHeight: BigInt(0) },
      timeoutTimestamp: timeoutNs,
      memo: "",
    },
  };
  const result = await signAndBroadcast([msg]);
  return {
    ...formatTxResult(result),
    sender,
    receiver,
    channel,
    denom,
    amount,
    timeoutMinutes,
  };
}

/** List IBC channels */
export async function listChannels() {
  const data = await lcdGet<{
    channels: Array<{
      channel_id: string;
      port_id: string;
      state: string;
      counterparty: { channel_id: string; port_id: string };
      connection_hops: string[];
    }>;
  }>("/ibc/core/channel/v1/channels?pagination.limit=100");
  return data.channels;
}
