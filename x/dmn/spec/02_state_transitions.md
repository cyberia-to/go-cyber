# State Transitions

## BeginBlock: ExecuteThoughtsQueue

Every block:

1. Retrieve all thoughts sorted by gas price (descending).
2. For each thought whose trigger matches the current block:
   a. Create a cache context with a fresh gas meter.
   b. Check remaining block gas. If insufficient, stop processing.
   c. Execute the program via `Sudo` with the thought's input.
   d. Calculate fees: `gasFee = gasPrice.Amount * gasUsed / 10` + `ttlFee = (currentBlock - lastBlock) * feeTTL`.
   e. Deduct total fee from the program account → fee collector.
   f. If the program cannot pay: delete the thought and its stats, skip.
   g. If execution succeeded: apply the cached state.
   h. If execution failed: discard cached state (fees still collected).
   i. Update thought stats (calls, fees, gas, lastBlock).
   j. If the thought used a block trigger: delete it (one-shot).

## SaveThought (create)

1. If current thought count < `MaxSlots`: store the thought and initialize stats.
2. If slots are full: compare gas price with the lowest existing thought.
   - If new price > lowest price: evict the lowest thought and its stats, store the new one.
   - Otherwise: reject with `ErrExceededMaxThoughts`.

## RemoveThoughtFull (forget)

1. Delete the thought from the store.
2. Delete associated stats.

## Update operations

Each update (name, particle, input, gas price, period, block) reads the thought, modifies the field, and writes it back. Name changes also migrate stats to the new key.

Period ↔ block conversion rules:
- `ChangeThoughtPeriod`: only allowed when `trigger.Block == 0` (already period-mode).
- `ChangeThoughtBlock`: only allowed when `trigger.Period > 0` (converts period to block-mode by zeroing period).
