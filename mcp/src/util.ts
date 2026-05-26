/** BigInt-safe JSON serializer with pretty-printing */
export function jsonStringify(obj: unknown): string {
  return JSON.stringify(
    obj,
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  );
}

const MAX_RESPONSE_CHARS = 40_000;
const MAX_STRING_VALUE_CHARS = 2_000;

/** Recursively truncate long string values inside an object */
function truncateDeep(data: unknown): unknown {
  if (typeof data === "string") {
    if (data.length > MAX_STRING_VALUE_CHARS) {
      return data.slice(0, MAX_STRING_VALUE_CHARS) + "… (truncated)";
    }
    return data;
  }
  if (Array.isArray(data)) return data.map(truncateDeep);
  if (data !== null && typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      out[k] = truncateDeep(v);
    }
    return out;
  }
  return data;
}

/** Format a successful tool response, truncating if too large */
export function ok(data: unknown): ToolResult {
  let text = jsonStringify(truncateDeep(data));
  if (text.length > MAX_RESPONSE_CHARS) {
    text = text.slice(0, MAX_RESPONSE_CHARS) + "\n… (response truncated)";
  }
  return { content: [{ type: "text" as const, text }] };
}

/** Format an error tool response */
export function err(message: string): ToolResult {
  return {
    content: [{ type: "text" as const, text: message.slice(0, 4_000) }],
    isError: true,
  };
}

/** Wrap a tool handler with try/catch error handling */
export function safe<T>(
  fn: (args: T) => Promise<ToolResult>,
): (args: T) => Promise<ToolResult> {
  return async (args: T) => {
    try {
      return await fn(args);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : String(error);
      return err(msg);
    }
  };
}

/** Build pagination hint for list-returning tools */
export function paginationHint(
  toolName: string,
  currentOffset: number,
  limit: number,
  totalOrItems: number | unknown[],
): PaginationHint | null {
  const count =
    typeof totalOrItems === "number" ? totalOrItems : totalOrItems.length;
  if (count < limit) return null;
  return {
    next_call: {
      tool: toolName,
      params: { offset: currentOffset + limit, limit },
    },
  };
}

export interface PaginationHint {
  next_call: { tool: string; params: Record<string, unknown> };
}

export interface ToolResult {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

/** Read-only tool annotations (all our tools are read-only) */
export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true as const,
  destructiveHint: false as const,
  idempotentHint: true as const,
  openWorldHint: true as const,
};

/** Write tool annotations — non-idempotent state changes */
export const WRITE_ANNOTATIONS = {
  readOnlyHint: false as const,
  destructiveHint: false as const,
  idempotentHint: false as const,
  openWorldHint: true as const,
};

/** Idempotent write annotations — safe to retry (e.g. set metadata) */
export const IDEMPOTENT_WRITE_ANNOTATIONS = {
  readOnlyHint: false as const,
  destructiveHint: false as const,
  idempotentHint: true as const,
  openWorldHint: true as const,
};
