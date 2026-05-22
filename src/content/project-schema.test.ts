import { describe, expect, it } from "vitest";
import { projectSchema } from "./project-schema";

const validProject = {
	title: "Output Management System",
	client: "AXA",
	type: "frontend",
	year: 2024,
	status: "live",
	stack: ["React", "Spring Boot"],
	url: "https://www.axa.ch/en/private-customers.html",
};

describe("projectSchema", () => {
	it("accepts a well-formed Project", () => {
		const result = projectSchema.safeParse(validProject);
		expect(result.success).toBe(true);
	});

	it("accepts a Project with no url (url is optional)", () => {
		const { url: _omit, ...noUrl } = validProject;
		const result = projectSchema.safeParse(noUrl);
		expect(result.success).toBe(true);
	});

	it("rejects an unknown Project type", () => {
		const result = projectSchema.safeParse({
			...validProject,
			type: "mobile",
		});
		expect(result.success).toBe(false);
	});

	it("rejects an unknown Project status", () => {
		const result = projectSchema.safeParse({
			...validProject,
			status: "draft",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a non-integer year", () => {
		const result = projectSchema.safeParse({
			...validProject,
			year: 2024.5,
		});
		expect(result.success).toBe(false);
	});

	it("rejects a year that is a string", () => {
		const result = projectSchema.safeParse({
			...validProject,
			year: "2024",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a stack that is not an array of strings", () => {
		const result = projectSchema.safeParse({
			...validProject,
			stack: "React, Spring Boot",
		});
		expect(result.success).toBe(false);
	});

	it("rejects an invalid url", () => {
		const result = projectSchema.safeParse({
			...validProject,
			url: "not a url",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a Project missing a required field", () => {
		const { client: _omit, ...missingClient } = validProject;
		const result = projectSchema.safeParse(missingClient);
		expect(result.success).toBe(false);
	});

	it("accepts the four Project types", () => {
		for (const type of ["frontend", "fullstack", "backend", "web"]) {
			const result = projectSchema.safeParse({ ...validProject, type });
			expect(result.success).toBe(true);
		}
	});

	it("accepts the two Project statuses", () => {
		for (const status of ["live", "closed"]) {
			const result = projectSchema.safeParse({ ...validProject, status });
			expect(result.success).toBe(true);
		}
	});
});
