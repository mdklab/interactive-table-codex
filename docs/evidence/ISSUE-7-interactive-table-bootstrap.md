# Evidence Pack — Issue #7 interactive table bootstrap

## What changed
- Replaced placeholder Makefile targets with working `setup`, `fmt`, `lint`, `test`, `build`, `ci`, and `dev` commands.
- Bootstrapped a static frontend app under `src/` with a sortable and filterable table UI.
- Added build/lint/format scripts and a smoke test for table sorting behavior.
- Added `.gitignore` and npm project metadata for reproducible local/CI runs.

## Why
- Issue #7 requires a mergeable vertical slice with runnable static frontend behavior and CI automation wired to `make ci`.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: npm emits a non-failing warning about unknown env config `http-proxy`; all required checks succeed.

### Manual (if needed)
- Steps:
  1. Run `make dev`.
  2. Open `http://localhost:4173`.
  3. Use the search box to filter rows and click `Name`/`City` headers to sort.
- Expected: rows update immediately based on filter/sort actions.

## Risk assessment
- Risk level: low
- Potential regressions: static assets may not include future nested paths if build script assumptions change.
- Rollback plan: revert this PR commit.
