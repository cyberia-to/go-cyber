const IPFS_API = process.env.BOSTROM_IPFS_API ?? "https://io.cybernode.ai";

interface KuboAddResponse { Hash: string; Name: string; Size: string }
interface ClusterAddResponse { name: string; cid: string; size: number }

/**
 * Pin content to IPFS and return the CID.
 * Supports both kubo API (/api/v0/add) and IPFS Cluster API (/add).
 * Default: https://io.cybernode.ai (cybernode IPFS cluster).
 */
export async function ipfsAdd(content: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", new Blob([content], { type: "text/plain" }));

  // Detect endpoint type: cluster uses /add, kubo uses /api/v0/add
  const isCluster = !IPFS_API.includes("5001") && !IPFS_API.includes("localhost") && !IPFS_API.includes("127.0.0.1");
  const url = isCluster
    ? `${IPFS_API}/add?cid-version=0&raw-leaves=false`
    : `${IPFS_API}/api/v0/add?pin=true`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    throw new Error(`IPFS add failed (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  // Cluster returns { cid }, kubo returns { Hash }
  const cid = (data as ClusterAddResponse).cid ?? (data as KuboAddResponse).Hash;
  if (!cid) {
    throw new Error(`IPFS add: no CID in response: ${JSON.stringify(data)}`);
  }
  return cid;
}
