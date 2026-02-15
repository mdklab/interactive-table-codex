# AGENTS.md

## Project context (short)
- This repo is the source of truth.
- Work is evidence-driven: every PR must include an Evidence Pack file.

## Definition of done
- `make ci` is green locally/in CI.
- PR includes an Evidence Pack under docs/evidence/.
- No secrets / tokens / PII in logs.

## Review guidelines
- Flag P0/P1 issues only.
- Treat security regressions, auth issues, and data integrity as P0.
- Prefer small PRs (<= 400 changed lines) unless explicitly allowed.
- If change is large, split into multiple PRs.

## Architecture & conventions
- Prefer existing patterns over inventing new ones.
- Add tests for new behavior (unit/integration as appropriate).

## Evidence Pack rules
- Always write what you ran (`make ci`, etc) and the result.
- Include a short risk/rollback note.
