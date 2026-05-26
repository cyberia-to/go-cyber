# Green Cycle — Mining Performance Improvement

All tests are passing. Choose ONE improvement activity and execute it.
Always benchmark before and after to measure impact.

## Priority Order (pick the highest-priority item you can make progress on)

### Tier 1: Direct Performance Gains

1. **Add on-GPU difficulty checking to CUDA backend**
   - Metal already has FC_PROOF_MODE — study `gpu/metal.rs` (search for `FC_PROOF_MODE`, `found_flag`)
   - Port the concept to `gpu/cuda.rs` and the inline CUDA kernel
   - GPU kernel writes found_flag + nonce + hash when difficulty is met
   - Eliminates transferring ALL hashes back to CPU — huge bandwidth savings
   - Verify with `cargo test --workspace` and benchmark with `bench --backend cuda`

2. **Add on-GPU difficulty checking to OpenCL backend**
   - Same concept as above, port to `kernels/uhash.cl` and `gpu/opencl.rs`
   - Add found_flag/found_data buffers, kernel writes result on match
   - Verify and benchmark with `bench --backend opencl`

3. **Add on-GPU difficulty checking to WGPU backend**
   - Port to `kernels/uhash.wgsl` and `gpu/wgpu.rs`
   - WGSL has limitations (u32 only) — handle carefully
   - Verify and benchmark with `bench --backend wgpu`

4. **Replace per-batch thread spawning with persistent thread pool on CPU**
   - `cpu/parallel.rs` spawns fresh OS threads per `find_proof_batch` call
   - Use `std::thread::scope` or a simple channel-based pool (no rayon — it was intentionally removed)
   - Measure thread creation overhead with small batch sizes
   - Benchmark with `bench --backend cpu --threads N`

### Tier 2: Tuning and Testing

5. **Add performance regression tests**
   - Create tests that measure hashrate and fail if it drops below a threshold
   - Test each backend independently
   - Useful for catching accidental regressions

6. **Optimize CLI default batch_size**
   - CLI uses 4096 but ProverConfig default is 65536
   - Profile the optimal batch size for CPU and each GPU backend
   - Update the CLI default to match optimal

7. **Improve auto-tuning coverage**
   - Profile additional parameter combinations
   - Add tuning for CPU (optimal batch size per thread count)
   - Improve WGPU memory detection (try adapter limits)

### Tier 3: Algorithm-Level Optimizations

8. **Parallelize chains within a single hash (CPU SIMD)**
   - 4 independent chains could use SIMD (4-wide AES on x86, NEON on ARM)
   - Would require significant refactoring of hash.rs
   - High risk, high reward — be very careful with correctness

9. **Optimize GPU shader memory access patterns**
   - Profile and optimize scratchpad access in GPU kernels
   - Consider coalesced memory access patterns for GPU architectures
   - Minimize bank conflicts in shared memory

10. **Add Metal shader optimizations**
    - Leverage Apple Family-specific features more aggressively
    - Profile different threadgroup memory usage patterns
    - Test SIMD group functions for intra-group communication

## Rules

- Pick exactly ONE activity per cycle
- Always measure before AND after (run benchmarks, report numbers)
- Follow existing code patterns in the backend you're modifying
- Run `cargo test --workspace` to verify correctness
- If optimizing a GPU kernel, verify hash output matches CPU reference
- Rebuild and test after every change
- Output: `IMPROVED: <one-line summary with before/after numbers if applicable>`
