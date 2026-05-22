import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Astro 6 splits the content-layer data store between two paths:
 *   - `astro sync` / `astro build` write it to `node_modules/.astro/` (the
 *     production "cacheDir").
 *   - Vitest runs via `getViteConfig` in serve mode, where the
 *     content-virtual-mod plugin reads it from `.astro/` (the "dotAstroDir").
 * So we sync once and stage a copy in `.astro/` so `getEntry()` works during
 * tests on a cold checkout (e.g. CI after `pnpm install`).
 */
const cacheStore = fileURLToPath(
	new URL("./node_modules/.astro/data-store.json", import.meta.url),
);
const dotAstroDir = fileURLToPath(new URL("./.astro/", import.meta.url));
const dotStore = `${dotAstroDir}data-store.json`;

export default function setup(): void {
	const result = spawnSync("pnpm", ["astro", "sync"], { stdio: "inherit" });
	if (result.status !== 0) {
		throw new Error("vitest setup: `pnpm astro sync` failed");
	}
	if (!existsSync(cacheStore)) {
		throw new Error(
			`vitest setup: expected ${cacheStore} after \`astro sync\``,
		);
	}
	mkdirSync(dotAstroDir, { recursive: true });
	copyFileSync(cacheStore, dotStore);
}
