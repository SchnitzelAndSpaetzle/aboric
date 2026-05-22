#!/usr/bin/env bash
# Apply .github/rulesets/main.json to the current GitHub repo.
#
# Idempotent: finds an existing ruleset with the same name and updates it,
# otherwise creates a new one. Requires `gh` authenticated as a repo admin
# and `jq` on PATH.
#
# Usage:
#   ./scripts/apply-ruleset.sh                   # uses current repo from `gh repo view`
#   ./scripts/apply-ruleset.sh owner/repo        # target a specific repo

set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
RULESET_FILE=".github/rulesets/main.json"

if [[ ! -f "$RULESET_FILE" ]]; then
  echo "error: $RULESET_FILE not found (run from repo root)" >&2
  exit 1
fi

NAME=$(jq -r .name "$RULESET_FILE")
EXISTING_ID=$(gh api --paginate "repos/$REPO/rulesets?includes_parents=false&targets=branch" | jq -r --arg n "$NAME" '.[] | select(.name == $n) | .id' | head -n1)

if [[ -n "$EXISTING_ID" ]]; then
  echo "Updating ruleset '$NAME' (id=$EXISTING_ID) on $REPO"
  gh api --method PUT "repos/$REPO/rulesets/$EXISTING_ID" --input "$RULESET_FILE" >/dev/null
else
  echo "Creating ruleset '$NAME' on $REPO"
  gh api --method POST "repos/$REPO/rulesets" --input "$RULESET_FILE" >/dev/null
fi

echo "Done."
