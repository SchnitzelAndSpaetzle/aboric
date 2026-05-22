// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import HelpOverlay from "./HelpOverlay.astro";

async function renderOverlay(): Promise<Document> {
	const container = await AstroContainer.create();
	const html = await container.renderToString(HelpOverlay);
	return new JSDOM(html).window.document;
}

describe("HelpOverlay", () => {
	it("starts hidden", async () => {
		const doc = await renderOverlay();
		const overlay = doc.querySelector<HTMLElement>("[data-help-overlay]");
		expect(overlay).not.toBeNull();
		expect(overlay?.hasAttribute("hidden")).toBe(true);
	});

	it("renders every advertised shortcut row", async () => {
		const doc = await renderOverlay();
		const text =
			doc
				.querySelector("[data-help-overlay]")
				?.textContent?.replace(/\s+/g, " ")
				.trim() ?? "";
		for (const key of [
			"j",
			"k",
			"↑",
			"↓",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"t",
			"?",
			"Esc",
			"g g",
			"G",
		]) {
			expect(text).toContain(key);
		}
	});

	it("exposes a backdrop and an [esc] close button", async () => {
		const doc = await renderOverlay();
		expect(doc.querySelector("[data-help-backdrop]")).not.toBeNull();
		const closeBtn = doc.querySelector<HTMLButtonElement>("[data-help-close]");
		expect(closeBtn).not.toBeNull();
		expect(closeBtn?.textContent?.toLowerCase()).toContain("esc");
	});
});
