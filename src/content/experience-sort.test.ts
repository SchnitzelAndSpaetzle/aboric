import { describe, expect, it } from "vitest";
import type { ExperienceEntry } from "./experience-schema";
import { sortExperience } from "./experience-sort";

function job(overrides: Partial<ExperienceEntry>): ExperienceEntry {
	return {
		company: "Company",
		role: "Role",
		start: "Jan 2010",
		end: "Jan 2012",
		location: "Belgrade",
		url: "https://example.com/",
		note: "Note",
		...overrides,
	};
}

describe("sortExperience", () => {
	it("returns an empty array unchanged", () => {
		expect(sortExperience([])).toEqual([]);
	});

	it("returns a single entry unchanged", () => {
		const only = job({ company: "only", start: "Jan 2020" });
		expect(sortExperience([only])).toEqual([only]);
	});

	it("orders entries by start descending", () => {
		const old = job({ company: "old", start: "Jan 2010", end: "Jan 2012" });
		const mid = job({ company: "mid", start: "Apr 2017", end: "Jan 2022" });
		const newer = job({ company: "newer", start: "Feb 2022", end: "Dec 2024" });

		const sorted = sortExperience([old, newer, mid]);
		expect(sorted.map((e) => e.company)).toEqual(["newer", "mid", "old"]);
	});

	it("places the 'present' job first regardless of input order", () => {
		const old = job({ company: "old", start: "Jan 2010", end: "Jan 2012" });
		const current = job({
			company: "current",
			start: "Jan 2022",
			end: "present",
		});
		const past = job({
			company: "past",
			start: "Apr 2017",
			end: "Jan 2022",
		});

		const sorted = sortExperience([old, past, current]);
		expect(sorted[0].company).toBe("current");
	});

	it("treats 'Present' (any case) as the current job", () => {
		const past = job({ company: "past", start: "Jan 2010", end: "Jan 2012" });
		const current = job({
			company: "current",
			start: "Jan 2022",
			end: "Present",
		});
		const sorted = sortExperience([past, current]);
		expect(sorted[0].company).toBe("current");
	});

	it("does not treat substrings like 'unknown' as the current job", () => {
		const newer = job({ company: "newer", start: "Jan 2022", end: "Dec 2024" });
		const odd = job({ company: "odd", start: "Jan 2010", end: "unknown" });
		const sorted = sortExperience([odd, newer]);
		expect(sorted[0].company).toBe("newer");
	});

	it("is stable when two entries have the same start", () => {
		const a = job({ company: "a", start: "Jan 2018" });
		const b = job({ company: "b", start: "Jan 2018" });
		const c = job({ company: "c", start: "Jan 2018" });
		const sorted = sortExperience([a, b, c]);
		expect(sorted.map((e) => e.company)).toEqual(["a", "b", "c"]);
	});

	it("does not mutate its input", () => {
		const a = job({ company: "a", start: "Jan 2010" });
		const b = job({ company: "b", start: "Jan 2020" });
		const input = [a, b];
		sortExperience(input);
		expect(input.map((e) => e.company)).toEqual(["a", "b"]);
	});
});
