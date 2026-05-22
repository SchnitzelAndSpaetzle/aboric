// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";
import type { Profile } from "../content/profile-schema";

const stubProfile: Profile = {
	handle: "stub-handle",
	name: "stub name",
	tagline: "stub tagline",
	location: "stub location",
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

async function renderLayout(): Promise<Document> {
	const { default: Layout } = await import("./Layout.astro");
	const container = await AstroContainer.create();
	const html = await container.renderToString(Layout);
	return new JSDOM(html).window.document;
}

describe("Layout", () => {
	it("renders <title> from profile.title", async () => {
		const doc = await renderLayout();
		expect(doc.querySelector("title")?.textContent).toBe("STUB_TITLE");
	});

	it("renders <meta name=description> from profile.description", async () => {
		const doc = await renderLayout();
		const meta = doc.querySelector('meta[name="description"]');
		expect(meta?.getAttribute("content")).toBe("STUB_DESCRIPTION");
	});
});
