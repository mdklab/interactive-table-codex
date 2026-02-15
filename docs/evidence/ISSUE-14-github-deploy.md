# Evidence Pack — Set up GitHub-native deployment workflow and publish static app

## What changed
- Added `actions/configure-pages@v5` to the deploy workflow so GitHub Pages metadata is initialized before uploading/deploying artifacts.
- Added a dedicated GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that builds the static app and deploys `dist/` to GitHub Pages.
- Configured safe deployment behavior: deploys only on `main` pushes or manual dispatch, with serialized `github-pages` concurrency.
- Documented the expected Pages URL and rollback procedure in `README.md`.

## Why
- Issue #14 requires a GitHub-native, reproducible deployment path for the static frontend with visible workflow status and a clear rollback playbook.
- Follow-up: deployment was not becoming visible on the Pages URL because the workflow did not run the standard Pages configuration step expected by GitHub Pages environments.

## How to verify
### Automated
- `make ci`:
  - Result: PASS
  - Notes: Install, format, lint, tests, and build all succeed locally after adding the Pages configuration step.

### Manual (if needed)
- Steps:
  1. Merge this PR into `main`.
  2. Open **Actions** and verify the "Deploy static app to GitHub Pages" workflow runs successfully.
  3. Open the environment URL from the deploy job output and confirm the app loads.
- Expected:
  - A green deploy workflow run.
  - The app is reachable at `https://<org-or-user>.github.io/interactive-table-codex/`.

## Risk assessment
- Risk level: low
- Potential regressions:
  - GitHub Pages repository settings (source/environment permissions) may need to be enabled if not already configured.
- Rollback plan:
  - Revert the commit introducing `.github/workflows/deploy-pages.yml` and README deployment docs; push revert to `main`.
