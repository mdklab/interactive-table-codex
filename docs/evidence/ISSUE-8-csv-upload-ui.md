# Evidence Pack — Implement CSV file upload UI with client-side validation

## What changed
- Added a CSV upload panel to the main UI with file input, empty-state guidance, and a live status message area.
- Added `src/upload.js` to perform client-side validation for missing file selection, CSV type (extension or MIME best effort), and empty file rejection.
- Wired upload validation into app initialization in `src/main.js`.
- Added upload validation tests for happy path and invalid selections.

## Why
- Issue #8 requests a small, merge-safe upload UI slice that validates local CSV files entirely in-browser and gives clear feedback before parser/table integration.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: fmt, lint, tests, and build all passed locally.

### Manual (if needed)
- Steps:
  1. Run `make dev`.
  2. Open `http://127.0.0.1:4173`.
  3. Select a `.csv` file and verify success messaging.
  4. Select a non-CSV file and verify error messaging.
  5. Select an empty CSV and verify empty-file error messaging.
- Expected:
  - Upload status text updates with clear, user-friendly success/error feedback.

## Risk assessment
- Risk level: low
- Potential regressions:
  - MIME differences across browsers may vary; extension fallback is used.
- Rollback plan:
  - Revert this PR to remove upload UI and validation module.
