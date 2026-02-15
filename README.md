# interactive-table-codex

Minimal static frontend app demonstrating a sortable and filterable table.

## Commands
- `make setup`
- `make fmt`
- `make lint`
- `make test`
- `make build`
- `make ci`
- `make dev`

## GitHub Pages deployment
- Workflow: `.github/workflows/deploy-pages.yml`
- Trigger: pushes to `main` (plus manual `workflow_dispatch`)
- Expected URL: `https://<org-or-user>.github.io/interactive-table-codex/`

### Rollback notes
1. Open the latest failed or undesired deployment run in the **Actions** tab.
2. Revert the commit on `main` that produced the bad artifact.
3. Push the revert commit to `main` to trigger a fresh deployment of the previous known-good static output.
