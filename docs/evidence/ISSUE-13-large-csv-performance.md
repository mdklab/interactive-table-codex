# Evidence Pack — Performance slice: handle 10,000+ rows without UI freezing

## What changed
- Switched table body updates to chunked rendering (`renderRowsChunked`) so large row sets are painted incrementally instead of as one blocking DOM write.
- Added cancellation-aware refresh tokens to prevent stale render chunks from finishing after a newer sort/filter interaction.
- Added memoization in `getVisibleRows` for repeated calls with unchanged row/filter/sort references.
- Added regression tests for 10,000-row sort/filter correctness and a chunked-rendering behavior check.

## Why
- Issue #13 targets responsiveness for 10,000+ rows. Incremental rendering keeps the UI interactive while large tables are drawn, and tests guard correctness under larger datasets.

## How to verify
### Automated
- `make ci`:
  - Result: PASS
  - Notes: Format, lint, tests, and build all succeed. The large-dataset correctness test passes and verifies expected ordering/filtering behavior.

### Manual (if needed)
- Steps:
  1. Run `make dev` and open the app.
  2. Load a dataset with >=10,000 rows.
  3. Apply per-column filters and sorting repeatedly while rows render.
- Expected:
  - Table begins painting quickly and continues filling without a long main-thread freeze.
  - New interactions supersede in-flight rendering, and final displayed rows match active sort/filter controls.

## Risk assessment
- Risk level: medium
- Potential regressions:
  - Async chunk scheduling could briefly show partial table content while rendering progresses.
  - Future logic that assumes `refresh` is synchronous could mis-handle timing.
- Rollback plan:
  - Revert the issue branch commit to restore previous single-pass rendering path.
