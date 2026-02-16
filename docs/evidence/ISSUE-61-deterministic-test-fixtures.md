# Evidence Pack — Add deterministic test data factories and shared fixtures

## What changed
- Added `tests/fixtures.mjs` with reusable factories for deterministic seeded randomness, controllable timestamps, generated people rows, and CSV file metadata objects.
- Added `tests/fixtures.test.mjs` to verify deterministic fixture behavior for seeded random sequences and clock-driven timestamps.
- Refactored existing smoke, upload, and performance tests to consume shared fixture builders instead of repeating ad-hoc inline setup.
- Updated `package.json` test command wiring so the new fixture unit tests run in the CI unit-test phase.
- Documented fixture usage patterns for unit and integration/smoke style tests in README.

## Why
- Issue #61 requires reusable factories that reduce duplicated test setup and improve deterministic behavior for time/random dependent inputs.
- Shared fixtures lower coupling between test files while keeping each test explicit about overridden values.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: format, lint, unit tests, smoke tests, and build all pass locally.

### Manual (if needed)
- Steps:
  1. Open `tests/fixtures.mjs` and review exported factory APIs.
  2. Open `tests/performance.test.mjs`, `tests/smoke.test.mjs`, and `tests/upload.test.mjs` to confirm they compose fixtures for setup.
- Expected:
  - Shared setup is centralized and deterministic.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Tests relying on exact generated fixture shape could fail if fixture defaults change.
- Rollback plan:
  - Revert this PR to restore prior inline setup in test files.
