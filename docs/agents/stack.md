# Stack & Build

How the engineering skills should run, test, and lint code in this repo. Skills like `/tdd`, `/diagnose`, and `/execute-prd` read from here so they apply the right commands instead of hard-coding a stack.

Edit the values below to match this repo. The section headings are the contract — skills look for them by name — so keep the headings; change the contents.

## Language and runtime

- **Language**: TypeScript (Node 22+)
- **Framework**: Astro 6
- **Package manager**: pnpm

## Build

- **Build**: `pnpm build` (`astro build`)
- **Dev server**: `pnpm dev` (`astro dev`)
- **Type-check**: `pnpm check` (`astro check`)

## Test

- **Test runner**: Vitest
- **Unit/integration tests**: `pnpm test` (`vitest run`)
- **Watch mode**: `pnpm test:watch`
- **Mock library**: Vitest's built-in `vi.mock` / `vi.fn`
- **DOM environment**: jsdom (configured in `vitest.config.ts`)
- **E2E / browser**: none currently

## Lint and format

- **Linter / formatter**: Biome (`biome.json`)
- **Lint command (CI mode)**: `pnpm lint` (`biome ci .`)
- **Pre-commit**: lefthook (`lefthook.yml`) runs lint on staged files.

## Validation gates

What every skill MUST run before declaring work done (committing, pushing, opening a PR):

1. `pnpm test` — all tests pass.
2. `pnpm lint` — no Biome violations.
3. `pnpm check` — TypeScript / Astro check passes.

If any gate fails, fix and re-run. Do **not** commit, push, or open a PR with a failing gate. Do **not** bypass hooks with `--no-verify`.

## Conventions

- **Commit prefixes**: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- **Branch names**: `<issue-number>-<slug>` for issue-driven work.
- **No emojis** in code, commits, or PR bodies unless the user explicitly asks.

---

## Notes for adapting this file to a different repo

When this file is generated for a different stack, keep the same headings and swap the contents. Examples:

- **Java + Spring Boot + Maven**: Maven for build (`mvn clean install`), `mvn test` / `mvn verify` for tests, JUnit 5 + Mockito, Testcontainers for integration, Spotless + Checkstyle for lint, validation gates run `mvn verify` (which chains test + Spotless + Checkstyle).
- **Java + Gradle**: `./gradlew build`, `./gradlew test`, same testing libraries.
- **Python + Poetry**: `poetry install`, `pytest`, `ruff` / `black`, `mypy`.
- **Go**: `go build ./...`, `go test ./...`, `golangci-lint run`.

The skills don't care which stack — they read this file and use whatever commands are declared.
