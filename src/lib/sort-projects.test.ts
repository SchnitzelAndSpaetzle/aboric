import { describe, expect, it } from "vitest";
import { type SortableProject, sortProjects } from "./sort-projects";

const entry = (slug: string, year: number): SortableProject => ({
	slug,
	data: { year },
});

describe("sortProjects", () => {
	it("returns an empty array for empty input", () => {
		expect(sortProjects([])).toEqual([]);
	});

	it("returns the single entry unchanged for single-entry input", () => {
		const only = [entry("axa-oms", 2024)];
		expect(sortProjects(only)).toEqual(only);
	});

	it("orders by year descending", () => {
		const input = [entry("old", 2016), entry("new", 2024), entry("mid", 2021)];
		const sorted = sortProjects(input).map((p) => p.slug);
		expect(sorted).toEqual(["new", "mid", "old"]);
	});

	it("breaks ties by slug ascending within the same year", () => {
		const input = [
			entry("zzz-late", 2021),
			entry("aaa-early", 2021),
			entry("mmm-mid", 2021),
		];
		const sorted = sortProjects(input).map((p) => p.slug);
		expect(sorted).toEqual(["aaa-early", "mmm-mid", "zzz-late"]);
	});

	it("is stable for already-sorted input", () => {
		const input = [
			entry("axa-oms", 2024),
			entry("swica-calc", 2023),
			entry("zhaw-cpa", 2023),
			entry("oakhurst", 2022),
		];
		const sorted = sortProjects(input).map((p) => p.slug);
		expect(sorted).toEqual(["axa-oms", "swica-calc", "zhaw-cpa", "oakhurst"]);
	});

	it("does not mutate the input array", () => {
		const input = [entry("b", 2020), entry("a", 2024)];
		const snapshot = input.map((p) => p.slug);
		sortProjects(input);
		expect(input.map((p) => p.slug)).toEqual(snapshot);
	});
});
