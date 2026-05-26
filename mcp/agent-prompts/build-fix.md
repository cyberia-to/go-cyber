# Build Fix — Compilation Failure

## Failed Build Step: {{BUILD_STEP}}

## Build Output
```
{{BUILD_OUTPUT}}
```

## Instructions

1. **Read the errors:** Identify the exact files and line numbers from the compiler output.

2. **Understand the cause:** Is it a syntax error, missing import, type mismatch, dependency issue, or something else?

3. **Fix:** Make the minimal change that fixes compilation. Do NOT refactor or improve unrelated code.

4. **Rebuild:** Run the same build command to verify it passes.

5. **Test:** If the build passes, run the test suite for that repo to make sure nothing is broken.

6. **Report:** Output your result as the LAST line:
   - `FIXED: <one-line summary of the build fix>`
   - `STUCK: <one-line explanation of why the build cannot be fixed>`

Common build issues:
- TypeScript: missing types, import paths, tsconfig issues → check `src/` and `tsconfig.json`
- Rust: borrow checker, missing traits, version mismatches → check `Cargo.toml` and source
- CosmWasm: cosmwasm-std API changes, missing features → check contract `Cargo.toml`
