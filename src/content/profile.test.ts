// @vitest-environment node
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadProfile } from "./profile";

describe("loadProfile", () => {
	const originalCwd = process.cwd();
	afterEach(() => {
		process.chdir(originalCwd);
		vi.resetModules();
	});

	it("returns a Profile validated against the schema", () => {
		const profile = loadProfile();
		expect(profile.handle).toBe("aboric");
		expect(profile.name).toBe("aleksandar borić");
		expect(profile.email).toBe("aboric@tuta.io");
		expect(profile.links.length).toBeGreaterThan(0);
		expect(profile.education.school).toBe("Singidunum University");
		expect(profile.skills.length).toBeGreaterThan(0);
	});

	it("resolves profile.yaml relative to its own module, not process.cwd()", async () => {
		vi.resetModules();
		process.chdir(tmpdir());
		const { loadProfile: freshLoad } = await import("./profile");
		const profile = freshLoad();
		expect(profile.handle).toBe("aboric");
	});
});
