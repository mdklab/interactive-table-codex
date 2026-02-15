# Evidence Pack — Render parsed data as accessible dynamic HTML table

## What changed
- Added `buildAccessibleTableHTML` to render accessible HTML for loading, parse-error, empty-data, and ready table states.
- Added tests for each renderer state plus row/column/cell count checks in ready state.

## Why
- Issue #10 requires a reusable dynamic table renderer with explicit accessibility and state coverage.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: Includes setup, formatter, lint checks, tests, and build.

### Manual (if needed)
- Steps:
  1. Run `node --input-type=module` and import `buildAccessibleTableHTML` from `src/tableRenderer.js`.
  2. Call it with `status: "loading"`, `status: "error"`, and `status: "ready"` payloads.
- Expected:
  - Loading returns `role="status"` + `aria-live="polite"`.
  - Error returns `role="alert"`.
  - Ready with headers + rows returns `<table>` with `<caption>`, `<thead>`, `<tbody>`, and `<th scope="col">`.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Consumers passing mismatched row lengths may produce uneven table rows.
- Rollback plan:
  - Revert commit to remove renderer utility, tests, and evidence file.
