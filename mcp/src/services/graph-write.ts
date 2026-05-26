import {
  getWalletAddress,
  signAndBroadcast,
  formatTxResult,
} from "../clients/signing.js";
import { ipfsAdd } from "../clients/ipfs-write.js";

/** Create a single cyberlink between two CIDs */
export async function createCyberlink(fromCid: string, toCid: string) {
  const neuron = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
    value: {
      neuron,
      links: [{ from: fromCid, to: toCid }],
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), neuron, from: fromCid, to: toCid };
}

/** Create multiple cyberlinks in a single transaction */
export async function createCyberlinks(
  links: Array<{ from: string; to: string }>,
) {
  if (links.length === 0) throw new Error("At least one link is required");
  const neuron = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
    value: {
      neuron,
      links,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), neuron, linkCount: links.length };
}

/**
 * Investmint: convert HYDROGEN into millivolt or milliampere for a time period.
 * Resource is either "millivolt" or "milliampere".
 * Length is the number of base periods (each period = ~5 days / 100800 blocks).
 */
export async function investmint(
  amount: string,
  resource: string,
  length: number,
) {
  const neuron = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
    value: {
      neuron,
      amount: { denom: "hydrogen", amount },
      resource,
      length: BigInt(length),
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), neuron, amount, resource, length };
}

/** Pin text content to IPFS and return the CID */
export async function pinContent(content: string) {
  const cid = await ipfsAdd(content);
  return { cid, size: content.length };
}

/**
 * Compound operation: pin content to IPFS then create a cyberlink.
 * Links fromCid → new content CID (or new content CID → toCid, or both).
 */
export async function createKnowledge(
  content: string,
  fromCid?: string,
  toCid?: string,
) {
  const contentCid = await ipfsAdd(content);
  const links: Array<{ from: string; to: string }> = [];

  if (fromCid) {
    links.push({ from: fromCid, to: contentCid });
  }
  if (toCid) {
    links.push({ from: contentCid, to: toCid });
  }
  if (links.length === 0) {
    // If no from/to provided, just return the pinned CID
    return { cid: contentCid, links: [], note: "Content pinned but no cyberlinks created (provide fromCid or toCid)" };
  }

  const neuron = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
    value: { neuron, links },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), cid: contentCid, neuron, links };
}
