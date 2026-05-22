import { describe, expect, it } from "vitest";
import { experienceSchema } from "./experience-schema";

const validJob = {
	company: "3ap",
	role: "Software Developer",
	start: "Jan 2022",
	end: "present",
	location: "Belgrade",
	url: "https://3ap.ch/",
	note: "Building software solutions for various clients.",
};

describe("experienceSchema", () => {
	it("accepts a complete, well-formed job entry", () => {
		const result = experienceSchema.safeParse(validJob);
		expect(result.success).toBe(true);
	});

	it("rejects an entry missing a required field", () => {
		const { company: _omit, ...missingCompany } = validJob;
		const result = experienceSchema.safeParse(missingCompany);
		expect(result.success).toBe(false);
	});

	it("rejects an entry where url is not a URL", () => {
		const result = experienceSchema.safeParse({
			...validJob,
			url: "not-a-url",
		});
		expect(result.success).toBe(false);
	});

	it("rejects an entry where a field has the wrong type", () => {
		const result = experienceSchema.safeParse({
			...validJob,
			start: 2022,
		});
		expect(result.success).toBe(false);
	});
});
