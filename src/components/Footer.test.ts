// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import Footer from "./Footer.astro";

async function renderFooter(): Promise<Document> {
	const container = await AstroContainer.create();
	const html = await container.renderToString(Footer);
	return new JSDOM(html).window.document;
}

describe("Footer", () => {
	it("renders the copyright line with the profile name and privacy hints", async () => {
		const doc = await renderFooter();
		const row = doc.querySelector(".footer__row");
		const text = row?.textContent?.replace(/\s+/g, " ").trim() ?? "";
		const year = new Date().getFullYear();
		expect(text).toContain(
			`© ${year} aleksandar borić · no cookies · no tracking`,
		);
	});

	it("includes the 'press ? for shortcuts' hint", async () => {
		const doc = await renderFooter();
		const text = doc.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
		expect(text).toContain("press ? for shortcuts");
	});
});
