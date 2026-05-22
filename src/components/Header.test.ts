// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import Header from "./Header.astro";

async function renderHeader(): Promise<Document> {
	const container = await AstroContainer.create();
	const html = await container.renderToString(Header);
	return new JSDOM(html).window.document;
}

describe("Header", () => {
	it("renders the terminal path '~/{handle} · about' with a dimmed '~/'", async () => {
		const doc = await renderHeader();
		const path = doc.querySelector(".header__path");
		expect(path).not.toBeNull();
		expect(path?.textContent?.replace(/\s+/g, " ").trim()).toBe(
			"~/aboric · about",
		);
		const dimmed = path?.querySelector(".dim");
		expect(dimmed?.textContent).toBe("~/");
	});

	it("renders six section anchor links with key and label", async () => {
		const doc = await renderHeader();
		const links = doc.querySelectorAll<HTMLAnchorElement>(".header__nav a");
		expect(links).toHaveLength(6);

		const expected = [
			{ id: "about", key: "1" },
			{ id: "experience", key: "2" },
			{ id: "projects", key: "3" },
			{ id: "music", key: "4" },
			{ id: "now", key: "5" },
			{ id: "contact", key: "6" },
		];
		for (const [index, anchor] of links.entries()) {
			const { id, key } = expected[index];
			expect(anchor.getAttribute("href")).toBe(`#${id}`);
			expect(anchor.textContent?.replace(/\s+/g, " ").trim()).toBe(
				`[${key}] ${id}`,
			);
		}
	});

	it("keeps the theme toggle button wired to data-theme-toggle", async () => {
		const doc = await renderHeader();
		const toggle = doc.querySelector("[data-theme-toggle]");
		expect(toggle).not.toBeNull();
		expect(toggle?.tagName).toBe("BUTTON");
	});

	it("exposes the current section id via [data-current-section]", async () => {
		const doc = await renderHeader();
		const el = doc.querySelector<HTMLElement>("[data-current-section]");
		expect(el).not.toBeNull();
		expect(el?.textContent?.trim()).toBe("about");
	});
});
