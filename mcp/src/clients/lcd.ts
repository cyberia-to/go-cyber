const LCD_BASE = "https://lcd.bostrom.cybernode.ai";

export async function lcdGet<T = unknown>(path: string): Promise<T> {
  const url = `${LCD_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`LCD ${res.status}: ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function lcdSmartQuery<T = unknown>(
  contract: string,
  query: Record<string, unknown>,
): Promise<T> {
  const encoded = Buffer.from(JSON.stringify(query)).toString("base64");
  return lcdGet<{ data: T }>(
    `/cosmwasm/wasm/v1/contract/${contract}/smart/${encoded}`,
  ).then((r) => r.data);
}
