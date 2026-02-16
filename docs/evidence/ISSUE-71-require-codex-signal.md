# Evidence Pack — Harden `require-codex-signal` trigger compatibility

## What changed
- Updated `.github/workflows/require-codex-signal.yml` to allow multiple Codex bot logins (`codex`, `chatgpt-codex-connector`, `openai-codex`) instead of a single hard-coded login.
- Added PR number fallback extraction from `comment.pull_request_url` for `pull_request_review_comment` payloads that omit `pull_request.number`.
- Kept gate logic unchanged otherwise: the check still passes on either a Codex `+1` reaction or a non-Codex reply to a Codex comment.

## Why
- Prevent false-negative required checks when Codex comments/reactions come from alternate allowed bot identities.
- Ensure inline review-comment events can always resolve their target PR and evaluate the `codex-reviewed` gate.

## How to verify
### Automated
- `make ci`
  - Result: ✅ pass

## Risk assessment
- Risk level: low
- Potential regressions:
  - If future Codex bot identities are added but not listed in `CODEX_LOGINS`, they will not count until added.
- Rollback plan:
  - Revert the workflow changes in `.github/workflows/require-codex-signal.yml`.
