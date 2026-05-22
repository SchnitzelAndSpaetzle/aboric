---
name: execute-prd
description: Execute a PRD by walking its child issues one at a time in fresh worktrees, doing TDD, and opening stacked draft PRs. Use when the user has a PRD issue ready (typically produced by /to-prd + /to-issues) and wants to ship the work as a reviewable PR stack.
---

# Execute PRD

Picks up where `/to-prd` and `/to-issues` left off. Given a PRD issue, walks its child issues in dependency order, implementing each in its own worktree (TDD by default), and opens a draft PR per issue — stacked so dependent PRs target their blocker's branch.

Issue-tracker, triage-label, and domain-docs conventions should already be loaded — run `/setup-matt-pocock-skills` if not. See `docs/agents/{issue-tracker,triage-labels,domain}.md`.

## Invocation

`/execute-prd <prd-issue-number-or-url>` — required. If missing, ask the user; do not guess.

## Process

### 1. Load context

- Fetch the PRD: `gh issue view <n> --comments`. Extract Problem Statement, Implementation Decisions, Testing Decisions.
- Discover candidates: `gh issue list --state open --search "Parent: #<n>" --json number,title,body,labels,comments`. The search is fuzzy. **Filter** to issues whose body has a `## Parent` section linking issue #<n> (e.g. `[#<n> — …](…/issues/<n>)`).
- Read `CONTEXT.md` and any `docs/adr/` files touching the PRD's area.
- Build the dependency graph from each child's `## Blocked by` section. Resolve referenced blockers with `gh issue view <m> --json state`. **Closed blockers are treated as merged** — base = `main`; do not branch off a deleted branch.
- Classify each child as **HITL** if its title ends with `(HITL)` or its body explicitly marks it; otherwise **AFK**. (HITL issues still carry `ready-for-agent`; the label alone is not a discriminator.)
- Topologically sort AFK issues over unresolved blockers only. **Cyclic graph → stop and report.**

### 2. Architecture clarification

Scan Implementation and Testing Decisions for gaps: unnamed module interfaces, ADR contradictions (surface per `docs/agents/domain.md`), unclear test boundaries. Ask the user only the smallest set of questions needed to start — do **not** re-run `/grill-with-docs`. Record answers as a single PRD comment (`gh issue comment <n>`).

### 3. Present the execution plan

Show: ordered AFK issues with planned base branch; per-issue TDD default; deferred HITL issues with a one-line reason. Get go-ahead; iterate on reorder/split/merge if asked.

### 4. Execute loop (sequential, one issue at a time)

Track `issue → { branch, prUrl }` so dependents can find their base. For each AFK issue in topo order:

0. **Pre-flight: resume if work already exists.** Check `gh pr list --state all --head <n>-<slug> --json number,state,url,body`.
   - PR open/merged and its body references issue #<n> → record `{ branch, prUrl }` and **skip to the next issue**.
   - PR closed (not merged) → stop and ask the user.
   - Branch exists on `origin` or locally but no PR is linked → **reuse** the branch: `git worktree add <path> <n>-<slug>` (no `-b`), then jump to step 3 (TDD confirm); commits push to the existing branch and a draft PR is opened at the end as usual.
   - Otherwise → proceed with steps 1–7 fresh.

1. **Base branch:**
   - No blockers, or all blockers closed → `main`.
   - One unresolved blocker (processed in this run) → that blocker's branch.
   - Multiple unresolved blockers → topologically latest; warn the user.
   - Unresolved blocker outside this PRD's AFK set (HITL, other PRD) → stop and ask; do not fall back to `main`.

2. **Worktree:**
   - Stacked (base ≠ main): `git worktree add .claude/worktrees/<n>-<slug> -b <n>-<slug> <base>`, then `EnterWorktree(path=…)`.
   - Non-stacked (base = main): `EnterWorktree(name="<n>-<slug>")` — branches from `origin/main` automatically.
   - Branch naming `<n>-<slug>` matches the repo convention (e.g. `4-about-section-ascii-hero-prose`).

3. **TDD confirm:** one-liner "Use /tdd for this issue? [yes/no]". Default `yes` unless the issue is clearly docs/config (only `README`, `docs/`, or config files; no code paths).

4. **Implement:** TDD path follows `.claude/skills/tdd/SKILL.md` against Acceptance Criteria; non-TDD implements directly. Use `CONTEXT.md` vocabulary in identifiers and test names. Run `pnpm test` in the loop and `pnpm lint` before committing.

5. **Commit + push.** Use the repo's `feat: …` / `fix: …` / `test: …` style. End the final commit body with `Closes #<n>`.

6. **Draft PR:** `gh pr create --draft --base <base> --title "<type>: <issue title> (closes #<n>)" --body "<heredoc with ## Summary bullets and ## Test plan checklist>"`. Record `{ branch, prUrl }`.

7. **Exit worktree:** `ExitWorktree(action: "remove")`. The branch is on the remote; the local worktree is disposable. If `ExitWorktree` refuses due to uncommitted changes, surface the diff and stop — do **not** auto-discard.

### 5. Final report

List created draft PRs in merge order, skipped HITL issues with reasons, and any worktrees that failed to clean up. Stop. The user reviews and merges PRs one by one; GitHub auto-retargets dependents to `main` as each blocker merges.

## Hard rules

- **Never merge** a PR; **never close** an issue (`Closes #N` does it via merge).
- **Never amend** a commit on a base branch; always new commits on the child branch.
- **Don't modify the PRD body** — only allowed write is the Phase 2 comment.
- **No `--no-verify`**, no skipping hooks. If lint or pre-commit fails, fix and re-commit.
- **Cyclic graph** → stop and report. Don't guess an order.
- **Child whose `## Parent` ≠ this PRD** → skip and warn.
- **One issue at a time**, even when AFK issues share no blockers.
