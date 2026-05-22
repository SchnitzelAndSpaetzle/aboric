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

The parent stays slim — it holds the topo order, the `issue → { branch, prUrl }` map, the Phase-2 decisions, and the HITL list. **Each issue's actual implementation runs in a fresh `Agent` subagent** so the parent's context doesn't grow with every TDD loop, file read, and test run.

For each AFK issue in topo order, the **parent** does:

1. **Pre-flight: resume if work already exists.** `gh pr list --state all --head <n>-<slug> --json number,state,url,body`.
   - PR open/merged referencing issue #<n> → record `{ branch, prUrl }` and **skip to the next issue**.
   - PR closed (not merged) → stop and ask the user.
   - Branch exists on `origin` or locally but no PR linked → mark the issue as **resume mode** (subagent reuses the branch).
   - Otherwise → fresh mode.

2. **Base branch:**
   - No blockers, or all blockers closed → `main`.
   - One unresolved blocker processed in this run → that blocker's branch.
   - Multiple unresolved blockers → topologically latest; warn the user.
   - Unresolved blocker outside this PRD's AFK set → stop and ask.

3. **Set up the worktree.** Always created by the parent so the base branch is controlled:
   - Fresh + stacked (base ≠ main): `git worktree add .claude/worktrees/<n>-<slug> -b <n>-<slug> <base>`.
   - Fresh + non-stacked: `git worktree add .claude/worktrees/<n>-<slug> -b <n>-<slug> origin/main`.
   - Resume mode: `git worktree add .claude/worktrees/<n>-<slug> <n>-<slug>` (no `-b`).
   - Branch naming `<n>-<slug>` matches the repo convention.

4. **TDD confirm** (one-liner): "Use /tdd for issue #<n>? [yes/no]". Default `yes` unless the issue is clearly docs/config.

5. **Spawn a subagent** (general-purpose) with a **self-contained** prompt. The subagent will not see the parent's conversation, so the prompt must include everything it needs:
   - Absolute path to the worktree (instruct it: "Call `EnterWorktree(path='<abs-path>')` as your first action").
   - The full issue body (title, `## What to build`, `## Acceptance criteria`).
   - The base branch name (so it knows what its PR targets).
   - TDD flag — if yes, instruct it to follow `.claude/skills/tdd/SKILL.md`; if no, implement directly.
   - The Phase-2 architectural decisions (copy them verbatim from the PRD comment).
   - Pointers to `CONTEXT.md` and any relevant ADRs.
   - Commit style (`feat:/fix:/test:`, end final commit with `Closes #<n>`).
   - PR conventions: `gh pr create --draft --base <base> --title "<type>: <issue title> (closes #<n>)" --body "<heredoc with ## Summary + ## Test plan>"`.
   - Hard rules (no merging, no `--no-verify`, no amending base-branch commits).
   - **Return contract**: the subagent's final message must contain only the PR URL on a line of its own (e.g. `PR_URL: https://github.com/.../pull/123`). Anything else is for the parent's transcript only.

6. **Record + clean up.** Parse the PR URL from the subagent's reply. Record `{ branch: "<n>-<slug>", prUrl }` in the map. Run `git worktree remove .claude/worktrees/<n>-<slug>` from the parent's cwd. If `git worktree remove` refuses due to uncommitted changes, surface the diff and stop — do **not** auto-discard.

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
