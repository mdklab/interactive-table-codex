# Evidence Pack — Bug - cannot process (add Process CSV button)

## What changed
- Added a dedicated `Process CSV` button to the upload panel so users can proceed after selecting a file.
- Wired upload validation to enable/disable the process button in real time.
- Added test coverage for process button state toggling based on selected file validity.
- Follow-up fix: removed app-level bootstrap dependency on `#processCsv` so sorting/filtering/table rendering still initialize if the upload button is temporarily missing.
- Follow-up fix: made upload validation status updates resilient when `#processCsv` is absent by treating the process button as optional in upload setup, with test coverage.

## Why
- The reported bug indicated users could upload a file but saw no process action in the UI.
- This change provides an explicit process affordance and clearer readiness behavior.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: includes format, lint, unit tests, and build.

### Manual (if needed)
- Steps:
  1. Run `make dev` and open `http://localhost:4173`.
  2. Confirm `Process CSV` button is visible and initially disabled.
  3. Pick a valid `.csv` file and verify button becomes enabled.
  4. Pick an invalid/empty file and verify button is disabled again.
- Expected:
  - Button visibility and disabled state track validation status.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Upload state wiring could regress if upload elements are renamed.
  - During staggered deploys, upload wiring may be skipped while core table interactions continue (intended fault-tolerant behavior).
- Rollback plan:
  - Revert commit to restore prior upload panel behavior.
