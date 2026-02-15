# Evidence Pack — Add per-column sorting (ascending/descending) with stable behavior

## What changed
- Added reusable sorting utilities for deterministic sort toggling (`none -> asc -> desc -> none`) and stable ordering with original-index tie breaks.
- Updated table UI to make Name, Role, and City headers sortable with visible indicators (`↕`, `▲`, `▼`).
- Added tests for numeric and text sorting, sort stability, non-mutation, and toggle behavior.

## Why
- Issue #11 requires per-column ascending/descending sorting with predictable toggles and stable behavior while preserving source dataset immutability.

## How to verify
### Automated
- `make ci`:
  - Result: PASS
  - Notes: Runs install, format, lint, tests, and build successfully.

### Manual (if needed)
- Steps:
  1. Run `make dev`.
  2. Open `http://localhost:4173`.
  3. Click Name / Role / City headers repeatedly and observe icon/state cycles.
  4. Verify row order updates immediately and ties remain in original relative order.
- Expected:
  - Active column cycles `↕ -> ▲ -> ▼ -> ↕`.
  - Sorting is deterministic and stable.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Header-label updates or sort-state transitions could drift from expected icon cycle.
- Rollback plan:
  - Revert this PR commit to restore previous unsorted/legacy behavior.
