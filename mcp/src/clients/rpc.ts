const RPC_BASE = "https://rpc.bostrom.cybernode.ai";

export async function rpcGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${RPC_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`RPC ${res.status}: ${res.statusText}`);
  }
  const json = (await res.json()) as { result?: T };
  return json.result as T;
}
