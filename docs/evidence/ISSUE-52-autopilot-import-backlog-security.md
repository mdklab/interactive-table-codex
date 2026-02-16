# Evidence Pack — Harden autopilot backlog import logging

## What changed
- Removed raw `context.payload` logging from `.github/workflows/autopilot-import-backlog.yml`.
- Kept minimal repository-level logging (`context.repo`) that does not include user-supplied comment content.

## Why
- Reviewer feedback identified that logging full webhook payload captures untrusted comment text before allowlist checks.
- This could leak sensitive content to Action logs and enable log-command style injection strings.

## How to verify
### Automated
- `make ci`
  - Result: PASS
  - Notes: formatting, linting, tests, and build all succeed.

## Risk assessment
- Risk level: low
- Potential regressions:
  - Reduced diagnostics in workflow logs when debugging payload-shape issues.
- Rollback plan:
  - Revert this commit to restore previous logging behavior.
