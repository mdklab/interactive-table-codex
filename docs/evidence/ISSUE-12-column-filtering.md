# Evidence Pack — Add per-column text filtering with composable filters

## What changed
- Added per-column text filters for Name, Role, and City with dedicated clear (`×`) buttons in the table header.
- Added a global **Clear all filters** action that resets all filter inputs and clears sort state.
- Updated table state logic to compose all active column filters with existing sort behavior.
- Added tests for single-column filtering, composed multi-column filtering, filtering+sorting interaction, and reset behavior.

## Why
- Issue #12 requires composable per-column text filtering that works together with sorting and can be cleared quickly by users.

## How to verify
### Automated
- `make ci`:
  - Result: PASS
  - Notes: Runs setup, formatting, lint, tests, and build successfully.

### Manual (if needed)
- Steps:
  1. Run `make dev` and open `http://127.0.0.1:4173`.
  2. Enter `engine` in Role filter and `austin` in City filter.
  3. Confirm only matching rows remain visible.
  4. Click a sortable header to sort filtered rows.
  5. Click a per-column `×` clear button and verify that filter is removed.
  6. Click **Clear all filters** and verify all filters and sort indicators reset.
- Expected:
  - Filters apply cumulatively across columns.
  - Sorting works on the currently filtered row set.
  - Clear controls reset filtered state as described.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Incorrect filter wiring for a specific column could hide expected rows.
  - UI state could desync if future columns are added without updating the column list.
- Rollback plan:
  - Revert this PR commit to restore prior single-query filter behavior.
