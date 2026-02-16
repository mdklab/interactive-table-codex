# Evidence Pack — Expand unit coverage for interactive table core behaviors

## What changed
- Added `tests/coreBehaviors.test.mjs` with focused unit tests that cover core logic pathways for sorting, filtering, memoized visibility selection, and chunked row rendering behavior.
- Extended edge-case validation for empty datasets, null/undefined values, mixed value types, and sort state transition fallback from invalid direction values.
- Updated `package.json` unit-test command so the new test file runs in the merge-gating test suite.

## Why
- Issue #62 asks for broader and faster unit-level coverage of table core logic (sorting, filtering, pagination-like chunking behavior, and state transitions), including edge-case inputs.
- These tests add confidence in business-logic invariants without adding slow integration overhead.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: formatting, linting, full unit tests (including new core behavior tests), smoke tests, and build checks all completed successfully.

### Manual (if needed)
- Steps:
  1. Inspect `tests/coreBehaviors.test.mjs` for the new behavior coverage categories.
  2. Run `npm run test:unit` and verify all tests pass.
- Expected:
  - New tests execute quickly and pass consistently while covering edge cases called out in issue scope.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Minimal production risk because changes are test-only plus test command wiring.
- Rollback plan:
  - Revert this PR to restore the prior unit test surface.
