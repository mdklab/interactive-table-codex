# Evidence Pack — Fix codex-signal poller workflow dispatch ref

## What changed
- Updated `.github/workflows/codex-signal-poller.yml` to dispatch `require-codex-signal.yml` using `pr.head.ref` instead of `pr.head.sha`.
- Updated poller log output to report the branch ref used for dispatch.

## Why
- GitHub workflow dispatch requires a branch or tag name for `ref`.
- Using a commit SHA can return HTTP 422 and halt dispatching for later PRs in the polling loop.

## How to verify
### Automated
- `make ci`:
  - Result: pass
  - Notes: Completed format/lint/test/build checks successfully.

### Manual (if needed)
- Steps:
  1. Run the `Poll Codex signal` workflow manually from Actions.
  2. Confirm logs show `ref=<branch-name>` for each non-fork PR.
  3. Confirm no 422 error from `createWorkflowDispatch` due to invalid ref format.
- Expected:
  - Dispatch requests use branch refs and complete for eligible PRs.

## Risk assessment
- Risk level: low
- Potential regressions:
  - If `pr.head.ref` is unavailable for an edge-case PR payload, dispatch could fail for that PR.
- Rollback plan:
  - Revert this change to restore prior behavior.
