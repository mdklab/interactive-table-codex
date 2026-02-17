# Evidence Pack — Add unit tests for column configuration and rendering contracts

## What changed
- Added `src/columnConfig.js` with focused helpers to normalize column configuration (visibility, ordering, defaults) and resolve rendered cell content from value mapping, formatters, and renderers.
- Added `tests/columnConfig.test.mjs` to cover regression-prone column configuration and rendering contract behavior, including missing keys and invalid renderer outputs.
- Hardened callback handling so `undefined`/non-function `formatter` or `renderer` values now safely fall back to defaults instead of throwing at runtime.
- Updated `package.json` so the new unit test file runs in the merge-gating unit test suite.

## Why
- Issue #63 requires unit-level coverage for column configuration behavior and rendering contracts without browser runtime dependencies.
- The new tests protect logic around visibility/order defaults, mapped values, formatter/renderer sequencing, and invalid renderer return handling.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: formatting, linting, all unit tests (including the new column configuration suite), smoke tests, and build checks passed.

### Manual (if needed)
- Steps:
  1. Review `tests/columnConfig.test.mjs` for the acceptance-criteria scenarios.
  2. Run `npm run test:unit` and confirm the column config tests execute and pass.
- Expected:
  - Column behavior contracts remain deterministic and covered by fast unit tests.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Low runtime risk because this change is additive (new helper + tests) and does not alter production wiring.
- Rollback plan:
  - Revert this PR to remove the additive helper and tests if needed.
