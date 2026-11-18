# CI gate uses Biome instead of ESLint, and is enforced via branch protection

PRs to `main` must pass a single CI job that runs `biome ci` (lint + format), `astro check`, `astro build`, and `vitest run`. Branch protection on `main` makes this check required, requires PRs, and enforces linear history. Biome was picked over the ecosystem-default ESLint because this is a one-person Astro portfolio: a single Rust binary that bundles lint + format means one config file and zero plugin churn, which matters more here than ESLint's larger rule catalogue or its native `.astro` support (the linted surface is just `src/scripts/*.ts` plus tests — `.astro` correctness is already covered by `astro check`).

## Considered options

- **ESLint + eslint-plugin-astro + Prettier** — the conventional choice. Rejected: too much config and dependency surface for the rule coverage we'd actually use.
- **`astro check` + Prettier only, no JS linter** — minimal. Rejected: gives up style/bug-pattern enforcement entirely.
- **No CI gate at all** — rejected: defeats the goal of "each PR is ok to merge."

## Consequences

- `.astro` files are not linted by Biome. Their correctness relies on `astro check` and `astro build`. If `.astro` template logic grows complex, revisit.
- Branch protection requires admin access to apply; the ruleset is stored as JSON in this repo so it can be re-applied if the GitHub config drifts.
- Local pre-push runs the same checks via lefthook so contributors (you) don't ping-pong with CI on whitespace.
