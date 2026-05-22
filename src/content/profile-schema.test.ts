import { describe, expect, it } from "vitest";
import { profileSchema } from "./profile-schema";

const validProfile = {
	handle: "aboric",
	name: "aleksandar borić",
	tagline: "software developer · making music on the side",
	location: "belgrade, serbia · cet",
	email: "aboric@tuta.io",
	title: "~/aboric · developer + music",
	description: "a. boric — software engineer and music maker. no tracking.",
	links: [
		{ label: "github", url: "https://github.com/aboric" },
		{ label: "linkedin", url: "https://www.linkedin.com/in/aboric" },
	],
	education: {
		school: "Singidunum University",
		degree: "Master's in Informatics and Computing",
		years: "2008 – 2013",
	},
	skills: [
		{ group: "frontend", items: "HTML5, JavaScript, TypeScript" },
		{ group: "backend", items: "C#, .NET, Java" },
	],
};

describe("profileSchema", () => {
	it("accepts a complete, well-formed Profile", () => {
		const result = profileSchema.safeParse(validProfile);
		expect(result.success).toBe(true);
	});

	it("rejects a Profile missing a required field", () => {
		const { email: _omit, ...missingEmail } = validProfile;
		const result = profileSchema.safeParse(missingEmail);
		expect(result.success).toBe(false);
	});

	it("rejects a Profile where a field has the wrong type", () => {
		const result = profileSchema.safeParse({
			...validProfile,
			links: "not-an-array",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a Profile with an invalid email", () => {
		const result = profileSchema.safeParse({
			...validProfile,
			email: "not-an-email",
		});
		expect(result.success).toBe(false);
	});
});
