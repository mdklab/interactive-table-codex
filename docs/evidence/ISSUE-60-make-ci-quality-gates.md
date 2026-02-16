# Evidence Pack — Bootstrap test quality gates in Make targets and CI entrypoint

## What changed
- Updated `Makefile` to make `make ci` explicitly run setup, fmt, lint, unit tests, smoke tests, and build with clear step-by-step output banners.
- Added explicit `test:unit` and `test:smoke` npm scripts and wired `test` to run both.
- Updated README command docs so the smoke subset is documented as a first-class quality gate.
- Updated `.github/workflows/require-codex-signal.yml` so the Codex signal gate accepts all Codex bot login variants and can resolve PR numbers from review-comment `pull_request_url` payloads.

## Why
- Issue #60 requires `make ci`, `make test`, `make lint`, and `make fmt` to be the single source of truth and deterministic in local/CI.
- Explicit quality-gate phases improve debuggability and ensure smoke checks are always exercised during CI.
- Follow-up fixes keep the `codex-reviewed` required check satisfiable across bot-account variants and review-comment payload shapes used by this repository.

## How to verify
### Automated
- `make ci`:
  - Result: ✅ pass
  - Notes (output snippets):
    - `==> Running unit + integration tests`
    - `# pass 21`
    - `==> Running smoke test subset`
    - `# pass 2`
    - `==> CI checks passed`

### Manual (if needed)
- Steps:
  1. Run `make test` to execute unit + integration tests.
  2. Run `make test-smoke` to execute the smoke subset independently.
- Expected:
  - Both commands exit `0` and show TAP summaries with no failing tests.

## Risk assessment
- Risk level: low
- Potential regressions:
  - CI behavior now depends on new script names (`test:unit`, `test:smoke`), so renaming scripts without updating Makefile would break checks.
- Rollback plan:
  - Revert this commit to restore prior `make`/npm script wiring.
