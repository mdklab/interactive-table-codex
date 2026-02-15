# Evidence Pack — Documentation and UX polish: usage guide, limitations, and troubleshooting

## What changed
- Expanded `README.md` with quick start instructions, end-user usage workflow, supported CSV format, known limitations, troubleshooting, and verification steps.
- Updated upload-related microcopy in `src/index.html` and `src/upload.js` for clearer empty/error states.
- Updated empty-data table message in `src/tableRenderer.js`.
- Updated unit tests in `tests/upload.test.mjs` and `tests/tableRenderer.test.mjs` to match revised UX copy.

## Why
- Improve discoverability for new contributors and users.
- Make error and empty-state language explicit and actionable.
- Ensure verification expectations are documented and repeatable.

## How to verify
### Automated
- `make ci`:
  - Result: ✅ pass
  - Notes: npm emitted a non-blocking warning (`Unknown env config "http-proxy"`) during npm command execution.

### Manual (if needed)
- Steps:
  1. Run `make dev`.
  2. Open `http://localhost:4173`.
  3. Confirm upload panel instructional text appears.
  4. Confirm initial upload status reads: "No file selected. Choose a CSV file to continue."
  5. Trigger invalid and empty-file validations to confirm updated copy.
- Expected:
  - UI shows updated microcopy and remains functional for sorting/filtering interactions.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Tests or snapshots relying on previous literal UX strings.
- Rollback plan:
  - Revert this commit to restore prior documentation and copy.
