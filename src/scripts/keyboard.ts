import { SECTIONS } from "../content/sections";
import { route } from "../lib/keyboard-router";
import { toggleTheme } from "./theme";

const overlay = document.querySelector<HTMLElement>("[data-help-overlay]");
const panel = overlay?.querySelector<HTMLElement>("[data-help-panel]") ?? null;
const backdrop =
	overlay?.querySelector<HTMLElement>("[data-help-backdrop]") ?? null;
const closeBtn =
	overlay?.querySelector<HTMLElement>("[data-help-close]") ?? null;
const openBtns = document.querySelectorAll<HTMLElement>("[data-help-open]");

let lastGAt: number | null = null;
let lastFocus: HTMLElement | null = null;

function isOverlayOpen(): boolean {
	return !!overlay && !overlay.hasAttribute("hidden");
}

function openHelp(): void {
	if (!overlay || isOverlayOpen()) return;
	lastFocus =
		document.activeElement instanceof HTMLElement
			? document.activeElement
			: null;
	overlay.removeAttribute("hidden");
	(panel ?? overlay).focus();
}

function closeOverlay(): void {
	if (!overlay || !isOverlayOpen()) return;
	overlay.setAttribute("hidden", "");
	lastFocus?.focus();
	lastFocus = null;
}

function focusableInOverlay(): HTMLElement[] {
	if (!overlay) return [];
	return Array.from(
		overlay.querySelectorAll<HTMLElement>(
			'button, [href], [tabindex]:not([tabindex="-1"])',
		),
	).filter((el) => !el.hasAttribute("disabled"));
}

function getHeaderOffset(): number {
	const header = document.querySelector<HTMLElement>(".header");
	return header?.getBoundingClientRect().height ?? 0;
}

function scrollToSection(id: string): void {
	const section = document.getElementById(id);
	if (!section) return;
	const top =
		section.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
	window.scrollTo({ top, behavior: "smooth" });
}

function getCurrentSectionId(): string {
	const el = document.querySelector<HTMLElement>("[data-current-section]");
	const id = el?.textContent?.trim();
	return id && SECTIONS.some((s) => s.id === id) ? id : SECTIONS[0].id;
}

function isInputTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return true;
	return target.isContentEditable;
}

window.addEventListener("keydown", (event) => {
	if (event.metaKey || event.ctrlKey || event.altKey) return;

	// Focus trap while the overlay is open.
	if (isOverlayOpen() && event.key === "Tab") {
		const focusable = focusableInOverlay();
		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement as HTMLElement | null;
		if (event.shiftKey && (active === first || !overlay?.contains(active))) {
			event.preventDefault();
			last.focus();
		} else if (
			!event.shiftKey &&
			(active === last || !overlay?.contains(active))
		) {
			event.preventDefault();
			first.focus();
		}
		return;
	}

	const action = route({
		key: event.key,
		shiftKey: event.shiftKey,
		currentSectionId: getCurrentSectionId(),
		lastGAt,
		now: event.timeStamp,
		fromInput: isInputTarget(event.target),
	});

	// Track 'g' taps for the double-tap detection regardless of whether this
	// tap produced an action (the first 'g' returns null, the second produces
	// scrollTop). Reset on anything else.
	if (event.key === "g" && !event.shiftKey) {
		lastGAt = action?.type === "scrollTop" ? null : event.timeStamp;
	} else {
		lastGAt = null;
	}

	if (!action) return;

	event.preventDefault();
	switch (action.type) {
		case "jump":
			scrollToSection(action.id);
			break;
		case "toggleTheme":
			toggleTheme();
			break;
		case "openHelp":
			openHelp();
			break;
		case "closeOverlay":
			closeOverlay();
			break;
		case "scrollTop":
			window.scrollTo({ top: 0, behavior: "smooth" });
			break;
		case "scrollBottom":
			window.scrollTo({
				top: document.documentElement.scrollHeight,
				behavior: "smooth",
			});
			break;
	}
});

for (const btn of openBtns) {
	btn.addEventListener("click", openHelp);
}
backdrop?.addEventListener("click", closeOverlay);
closeBtn?.addEventListener("click", closeOverlay);
