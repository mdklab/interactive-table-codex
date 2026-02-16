# Evidence Pack — Harden autopilot backlog import logging

## What changed
- Removed early workflow logging of webhook data in `.github/workflows/autopilot-import-backlog.yml` to avoid recording untrusted comment content before author validation.
- Added minimal, sanitized workflow logs (`owner/repo`, issue number, comment id, and author) only after allowlist checks pass.
- Added a single informational log when a non-allowlisted author is ignored.

## Why
- Reviewer feedback identified that logging webhook payload data before allowlist checks can capture untrusted comment text.
- This can leak sensitive content to Action logs and allow workflow-command style strings to appear in logs.

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
