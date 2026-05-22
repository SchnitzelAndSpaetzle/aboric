import { describe, expect, it } from "vitest";
import { SECTIONS } from "./sections";

describe("SECTIONS", () => {
	it("lists the six sections in fixed order", () => {
		expect(SECTIONS.map((s) => s.id)).toEqual([
			"about",
			"experience",
			"projects",
			"music",
			"now",
			"contact",
		]);
	});

	it("assigns each section a 1-based numeric key matching its position", () => {
		for (const [index, section] of SECTIONS.entries()) {
			expect(section.key).toBe(String(index + 1));
		}
	});

	it("uses the section id as the label for each section", () => {
		for (const section of SECTIONS) {
			expect(section.label).toBe(section.id);
		}
	});
});
