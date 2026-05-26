const IPFS_GATEWAY = "https://gateway.ipfs.cybernode.ai";

export async function ipfsGet(cid: string): Promise<string> {
  const res = await fetch(`${IPFS_GATEWAY}/ipfs/${cid}`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`IPFS ${res.status}: ${res.statusText} — CID: ${cid}`);
  }
  const text = await res.text();
  if (text.length > 50_000) {
    return text.slice(0, 50_000) + "\n... (truncated)";
  }
  return text;
}
