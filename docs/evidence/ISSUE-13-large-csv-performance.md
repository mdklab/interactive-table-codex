# Evidence Pack — Performance slice: handle 10,000+ rows without UI freezing

## What changed
- Added `src/tablePerformance.js` with focused helpers for high-row-count table workflows:
  - `filterRows` for normalized multi-column filtering.
  - `sortFilteredRows` wrapper for sort composition.
  - `getVisibleRange` for virtualization window bounds.
  - `chunkRows` for chunked asynchronous processing.
- Updated `src/main.js` to route filtering/sorting through the performance helpers.
- Added regression coverage in `tests/tablePerformance.test.mjs` for:
  - 10,000-row filter correctness.
  - large dataset sort correctness.
  - virtualization range math.
  - chunked processing behavior.

## Why
- Provide a safe, reviewable vertical slice that keeps large table interactions responsive while preserving sorting/filtering correctness.
- Establish utility primitives that can be integrated into rendering paths without large refactors.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: all lint, test, and build checks passed.

### Manual (if needed)
- Steps:
  1) Run `make dev`.
  2) Load a CSV with >=10,000 rows.
  3) Apply column filters and sorting.
- Expected:
  - Filtering/sorting behavior remains correct.
  - Large-data interactions remain responsive enough for iterative work.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Utility functions could diverge from future UI behavior if not kept as the single composition path.
- Rollback plan:
  - Revert this PR commit to restore prior filtering/sorting composition.


## Follow-up update (review feedback)
- Fixed virtualization bounds edge case in `getVisibleRange` where stale `scrollTop` from a previously larger dataset could produce `start > end`.
- Added regression test to validate clamping when `scrollTop` exceeds the current filtered dataset size.
- Re-ran `make ci` after the fix; all checks passed.
