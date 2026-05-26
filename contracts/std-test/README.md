# Cyber to Cosmwasm bingings

This is a simple bypassing tester just for testing purpose.

## Running this contract

You can compile it to wasm via:

```
RUSTFLAGS="-C link-arg=-s" cargo build --release --target=wasm32-unknown-unknown --lib
cp ../../target/wasm32-unknown-unknown/release/std_test.wasm .
ls -l std_test.wasm
sha256sum std_test.wasm
```

To build optimized contract call docker from contracts directory:
```
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/std-test \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.1
```