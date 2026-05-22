import { describe, expect, it } from "vitest";
import { loadProfile } from "./profile";

describe("loadProfile", () => {
	it("returns a Profile validated against the schema", () => {
		const profile = loadProfile();
		expect(profile.handle).toBe("aboric");
		expect(profile.name).toBe("aleksandar borić");
		expect(profile.email).toBe("aboric@tuta.io");
		expect(profile.links.length).toBeGreaterThan(0);
		expect(profile.education.school).toBe("Singidunum University");
		expect(profile.skills.length).toBeGreaterThan(0);
	});
});
