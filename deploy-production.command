#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
cd "$script_dir"

workflow_file="deploy-production.yml"
branch="${1:-main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required. Install it with: brew install gh"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This script must be run from inside the Git repository."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
fi

if ! git show-ref --verify --quiet "refs/heads/$branch"; then
  echo "Local branch '$branch' does not exist."
  exit 1
fi

git fetch origin "$branch" --quiet

local_sha="$(git rev-parse "$branch")"
remote_sha="$(git rev-parse "origin/$branch")"

if [[ "$local_sha" != "$remote_sha" ]]; then
  echo "Local '$branch' does not match 'origin/$branch'. Push or pull before deploying."
  exit 1
fi

echo "Triggering production deployment for '$branch' at commit $local_sha"
gh workflow run "$workflow_file" --ref "$branch"

echo
echo "Deployment queued. Follow the latest run with:"
echo "gh run list --workflow $workflow_file --limit 1"
echo "gh run watch"
