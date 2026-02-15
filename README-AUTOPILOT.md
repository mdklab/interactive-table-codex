# Codex Autopilot Kit (Pro-friendly)

## What this does
- Uses GitHub labels as a status machine.
- Delegates work to Codex via @codex comments.
- Runs CI on every PR.
- Opens a daily Release Candidate issue.

## Setup checklist
1) Copy these files into your repo root.
2) Replace @YOUR_GITHUB_HANDLE in autopilot-release-train.yml
3) Enable branch protection for main (require CI).
4) Connect repo in Codex Cloud, enable Code Review & Automatic reviews.
5) Run workflow: "Autopilot - Bootstrap Labels"

## Run your first mission
- Create a Mission issue with acceptance criteria.
- Add labels: autopilot:refine + status:backlog
- After tasks are created, ensure tasks have: status:ready + autopilot:enabled
- Autopilot scheduler will pick up tasks.
