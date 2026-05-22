// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";
import type { Profile } from "../content/profile-schema";

const stubProfile: Profile = {
	handle: "stub-handle",
	name: "STUB_NAME",
	tagline: "STUB_TAGLINE",
	location: "STUB_LOCATION",
	email: "stub@example.com",
	title: "STUB_TITLE",
	description: "STUB_DESCRIPTION",
	links: [{ label: "stub", url: "https://example.com" }],
	education: { school: "stub", degree: "stub", years: "stub" },
	skills: [{ group: "stub", items: "stub" }],
};

vi.mock("../content/profile", () => ({
	loadProfile: () => stubProfile,
}));

async function renderAboutSection(): Promise<Document> {
	const { default: AboutSection } = await import("./AboutSection.astro");
	const container = await AstroContainer.create();
	const html = await container.renderToString(AboutSection);
	return new JSDOM(html).window.document;
}

describe("AboutSection", () => {
	it("renders a #about section with §01 / about / hint header", async () => {
		const doc = await renderAboutSection();

		const section = doc.querySelector("section#about");
		expect(section).not.toBeNull();

		const head = section?.querySelector(".sec__head");
		expect(head?.querySelector(".sec__num")?.textContent?.trim()).toBe("§ 01");
		expect(head?.querySelector(".sec__title")?.textContent?.trim()).toBe(
			"about",
		);
		expect(head?.querySelector(".sec__hint")?.textContent?.trim()).toBe(
			"↓ scroll or press 'j'",
		);
	});

	it("renders the ASCII hero with profile name/tagline/location", async () => {
		const doc = await renderAboutSection();

		const hero = doc.querySelector("pre.ascii.ascii--hero");
		expect(hero).not.toBeNull();

		const text = hero?.textContent ?? "";
		expect(text).toContain("STUB_NAME");
		expect(text).toContain("STUB_TAGLINE");
		expect(text).toContain("STUB_LOCATION");
		expect(text.startsWith("┌")).toBe(true);
		expect(text.trimEnd().endsWith("┘")).toBe(true);
	});

	it("renders prose from about.md with inline #projects and #music anchors and a kbd hint", async () => {
		const doc = await renderAboutSection();

		const prose = doc.querySelector(".prose");
		expect(prose).not.toBeNull();

		expect(prose?.querySelector('a[href="#projects"]')).not.toBeNull();
		expect(prose?.querySelector('a[href="#music"]')).not.toBeNull();
		expect(prose?.querySelector("kbd")?.textContent?.trim()).toBe("?");
	});
});
