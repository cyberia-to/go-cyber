# Red Cycle — Failure Investigation

## Failed Test Suite: {{SUITE_NAME}}

## Attempt: {{ATTEMPT_NUMBER}} of {{MAX_RETRIES}}

## Failure Output
```
{{FAILURE_OUTPUT}}
```

## Previous Attempt Summaries
{{PREVIOUS_ATTEMPTS}}

## Instructions

1. **Diagnose:** Read the failure output carefully. Identify the root cause — is it a test bug, a source bug, a build issue, or an environment problem?

2. **Investigate:** Read the relevant source files. Understand the code path that leads to the failure. Check if the test expectations match the implementation.

3. **Fix:** Make the minimal change that fixes the root cause. Prefer fixing source bugs over adjusting tests, unless the test is clearly wrong.

4. **Rebuild:** Run the appropriate build command to verify compilation succeeds.

5. **Re-test:** Run the exact same test command that failed. Verify the fix resolves the issue without breaking other tests.

6. **Report:** Output your result as the LAST line of your response:
   - `FIXED: <one-line summary of what you fixed and why>`
   - `STUCK: <one-line explanation of why you cannot fix this>`

If you are STUCK, explain clearly what information or access you would need to fix it.

Do NOT attempt workarounds that mask the real issue. Do NOT disable tests. If the test is correct and the code is wrong, fix the code.
