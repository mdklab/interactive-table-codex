# AGENTS.md — Project working agreements (Codex + humans)

## North Star
Ship small, safe, verifiable changes. Every PR must be easy to review and easy to roll back.

## Definition of Done (DoD)
- CI is green (`make ci`).
- Evidence Pack updated (see docs/evidence/TEMPLATE.md).
- Tests added/updated for new behavior (or explicitly justified in Evidence Pack).
- No secrets, tokens, PII in logs or code.
- PR is small. If not small, split into multiple PRs.

## PR size rule
Target: <= 400 changed lines (add+del). If larger, stop and propose a split plan.

## Commands (single source of truth)
- `make ci`     # run everything required for merge
- `make test`
- `make lint`
- `make fmt`
- `make dev`

If these targets are missing or broken, your first task is to fix/define them.

## Evidence Pack
For any code change PR, add/update:
- `docs/evidence/ISSUE-<number>-<slug>.md`

## Review priorities
- P0: security, data integrity, authz, secrets
- P1: correctness and regressions
- P2: maintainability
