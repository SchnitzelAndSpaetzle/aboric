import { describe, expect, it } from "vitest";
import { buildAsciiHero } from "./ascii-hero";

describe("buildAsciiHero", () => {
	it("frames the three lines in a 7-row box with corner glyphs", () => {
		const lines = buildAsciiHero({
			name: "aleksandar borić",
			tagline: "software developer · making music on the side",
			location: "belgrade, serbia · cet",
		}).split("\n");

		expect(lines).toHaveLength(7);
		expect(lines[0].startsWith("┌")).toBe(true);
		expect(lines[0].endsWith("┐")).toBe(true);
		expect(lines[6].startsWith("└")).toBe(true);
		expect(lines[6].endsWith("┘")).toBe(true);
	});

	it("renders every row at the same width, driven by the longest of name/tagline/location", () => {
		const lines = buildAsciiHero({
			name: "x",
			tagline: "this is the longest line of the three on purpose",
			location: "y",
		}).split("\n");

		const widths = new Set(lines.map((l) => [...l].length));
		expect(widths.size).toBe(1);
	});

	it("grows the box when the name gets longer (auto-fit, not fixed width)", () => {
		const shortName = buildAsciiHero({
			name: "a",
			tagline: "t",
			location: "l",
		}).split("\n")[0];
		const longName = buildAsciiHero({
			name: "a-very-long-name-that-should-stretch-the-box",
			tagline: "t",
			location: "l",
		}).split("\n")[0];

		expect([...longName].length).toBeGreaterThan([...shortName].length);
	});

	it("renders content lines in name/tagline/location order, inset by 3 spaces", () => {
		const lines = buildAsciiHero({
			name: "NAME",
			tagline: "TAGLINE",
			location: "LOCATION",
		}).split("\n");

		expect(lines[2]).toMatch(/^│ {3}NAME +│$/);
		expect(lines[3]).toMatch(/^│ {3}TAGLINE +│$/);
		expect(lines[4]).toMatch(/^│ {3}LOCATION +│$/);
	});
});
