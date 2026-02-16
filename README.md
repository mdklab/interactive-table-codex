# interactive-table-codex

Minimal static frontend app demonstrating CSV upload validation, column sorting, and per-column filtering in an accessible table UI.

## Quick start
1. Install dependencies:
   - `make setup`
2. Run all checks:
   - `make ci`
3. Build and preview locally:
   - `make dev`
4. Open `http://localhost:4173` in your browser.

## How to use the app
1. **Upload a CSV file**
   - Click **CSV file** and select a local `.csv` file.
   - The upload status confirms whether the file is ready or explains what to fix.
2. **Sort columns**
   - Use the sort buttons in the header (`Name`, `Role`, `City`).
   - Each click cycles through ascending, descending, and unsorted.
3. **Filter rows**
   - Use the search inputs below each header to filter by column.
   - Filtering is case-insensitive and supports partial matches.
   - Use `×` to clear a single column filter, or **Clear all filters** to reset both filters and sort order.

## Supported CSV format
- UTF-8 text input.
- Comma-delimited values.
- Optional quoted fields (`"value"`).
- Escaped quotes are supported inside quoted fields (`""`).
- Every non-empty row must have the same number of columns as the header row.

## Known limitations / out of scope
- No persistence: data is not stored after page refresh.
- No drag-and-drop uploads (file picker only).
- No server-side processing; this is a fully static frontend demo.
- Row virtualization is not implemented (rendering uses chunked updates for responsiveness).
- Parsed CSV preview rendering exists in utilities/tests, but the main UI currently focuses on fixed demo columns (`name`, `role`, `city`).

## Troubleshooting
- **No file selected**: choose a CSV file before trying to proceed.
- **Unsupported file type**: ensure the filename ends in `.csv`.
- **Empty CSV file**: include at least a header row and one data row.
- **CSV parse errors**: check quote pairing and that each row has the same number of columns.
- **No matching rows in table**: clear filters or broaden search text.

## Verification
Run:
- `make ci`

This runs format and lint checks, the unit test suite, a smoke-test subset, and build checks required for merge.

## Commands
- `make setup`
- `make fmt`
- `make lint`
- `make test`
- `make test-smoke`
- `make build`
- `make ci`
- `make dev`

## GitHub Pages deployment
- Workflow: `.github/workflows/deploy-pages.yml`
- Trigger: pushes to `main` (plus manual `workflow_dispatch`)
- Expected URL: `https://<org-or-user>.github.io/interactive-table-codex/`

### Rollback notes
1. Open the latest failed or undesired deployment run in the **Actions** tab.
2. Revert the commit on `main` that produced the bad artifact.
3. Push the revert commit to `main` to trigger a fresh deployment of the previous known-good static output.
