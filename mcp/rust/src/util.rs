use rmcp::model::{CallToolResult, Content};
use serde_json::Value;

const MAX_TOTAL: usize = 40_000;
const MAX_STRING: usize = 2_000;

/// Format a successful tool result, JSON-serializing data and truncating if needed.
pub fn ok(data: &Value) -> CallToolResult {
    let mut val = data.clone();
    truncate_strings(&mut val, MAX_STRING);
    let text = serde_json::to_string_pretty(&val).unwrap_or_else(|_| val.to_string());
    let text = if text.len() > MAX_TOTAL {
        format!(
            "{}...\n[truncated, {} bytes total]",
            &text[..MAX_TOTAL],
            text.len()
        )
    } else {
        text
    };
    CallToolResult::success(vec![Content::text(text)])
}

/// Format an error tool result.
pub fn err(msg: &str) -> CallToolResult {
    let truncated = if msg.len() > 4000 { &msg[..4000] } else { msg };
    CallToolResult::error(vec![Content::text(truncated)])
}

/// Recursively truncate string values in a JSON Value.
pub fn truncate_strings(val: &mut Value, max: usize) {
    match val {
        Value::String(s) => {
            if s.len() > max {
                s.truncate(max);
                s.push_str("...[truncated]");
            }
        }
        Value::Array(arr) => {
            for item in arr.iter_mut() {
                truncate_strings(item, max);
            }
        }
        Value::Object(map) => {
            for (_, v) in map.iter_mut() {
                truncate_strings(v, max);
            }
        }
        _ => {}
    }
}

/// Build a pagination hint for the next call.
pub fn pagination_hint(tool: &str, offset: u64, limit: u64, total: u64) -> Option<Value> {
    let next_offset = offset + limit;
    if next_offset < total {
        Some(serde_json::json!({
            "next_call": {
                "tool": tool,
                "params": {
                    "offset": next_offset,
                    "limit": limit
                }
            },
            "total": total,
            "showing": format!("{}-{} of {}", offset, next_offset.min(total), total)
        }))
    } else {
        None
    }
}
