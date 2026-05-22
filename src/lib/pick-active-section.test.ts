import { describe, expect, it } from "vitest";
import { type ActiveEntry, pickActive } from "./pick-active-section";

function entry(
	id: string,
	isIntersecting: boolean,
	ratio: number,
): ActiveEntry {
	return { target: { id }, isIntersecting, intersectionRatio: ratio };
}

describe("pickActive", () => {
	it("returns the id of the one intersecting section", () => {
		expect(pickActive([entry("about", true, 0.6)], "experience")).toBe("about");
	});

	it("returns the entry with the largest intersection ratio when multiple intersect", () => {
		const entries = [
			entry("about", true, 0.2),
			entry("experience", true, 0.8),
			entry("projects", true, 0.5),
		];
		expect(pickActive(entries, "about")).toBe("experience");
	});

	it("ignores entries that are not currently intersecting", () => {
		const entries = [
			entry("about", false, 0.9),
			entry("experience", true, 0.3),
		];
		expect(pickActive(entries, "about")).toBe("experience");
	});

	it("falls back to `current` when no entries are intersecting", () => {
		const entries = [entry("about", false, 0), entry("experience", false, 0)];
		expect(pickActive(entries, "music")).toBe("music");
	});

	it("falls back to `current` when given an empty entries list", () => {
		expect(pickActive([], "now")).toBe("now");
	});
});
