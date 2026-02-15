# Evidence Pack — Issue #9 CSV parser module

## What changed
- Added `src/csvParser.js` with a framework-agnostic `parseCsv` utility that:
  - decodes UTF-8 from string/byte input,
  - normalizes line endings,
  - parses comma-delimited rows with quoted field and escaped quote support,
  - returns deterministic structured errors (`invalid_encoding`, `malformed_csv`, `column_mismatch`, `empty_input`, `invalid_input`).
- Added `tests/csvParser.test.mjs` with unit coverage for simple parsing, quoted values, blank lines, malformed input, column mismatch, and invalid UTF-8.

## Why
- Issue #9 requests a robust, testable CSV parser module that returns consistent table-model output and actionable parser errors.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: Runs setup, formatting, linting, tests, and build.

### Manual (if needed)
- Steps:
  1. Run `node --test tests/csvParser.test.mjs`.
  2. Inspect parser behavior with representative CSV inputs in a Node REPL.
- Expected:
  - Valid CSV returns `{ ok: true, headers, rows }`.
  - Invalid CSV/encoding returns `{ ok: false, error }` with stable codes.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Parser currently handles single-line records; multiline quoted records are treated as malformed.
- Rollback plan:
  - Revert commit introducing `src/csvParser.js`, `tests/csvParser.test.mjs`, and this evidence file.
