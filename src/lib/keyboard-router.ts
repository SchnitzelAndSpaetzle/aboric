import { SECTIONS } from "../content/sections";

export const G_DOUBLE_TAP_MS = 400;

export type Action =
	| { type: "jump"; id: string }
	| { type: "toggleTheme" }
	| { type: "openHelp" }
	| { type: "closeOverlay" }
	| { type: "scrollTop" }
	| { type: "scrollBottom" };

export type RouteInput = {
	key: string;
	shiftKey: boolean;
	currentSectionId: string;
	lastGAt: number | null;
	now: number;
	fromInput: boolean;
};

export function route(input: RouteInput): Action | null {
	if (input.fromInput) {
		return null;
	}
	const byKey = SECTIONS.find((s) => s.key === input.key);
	if (byKey) {
		return { type: "jump", id: byKey.id };
	}
	if (input.key === "j" || input.key === "ArrowDown") {
		const index = SECTIONS.findIndex((s) => s.id === input.currentSectionId);
		const next = SECTIONS[Math.min(index + 1, SECTIONS.length - 1)];
		return { type: "jump", id: next.id };
	}
	if (input.key === "k" || input.key === "ArrowUp") {
		const index = SECTIONS.findIndex((s) => s.id === input.currentSectionId);
		const prev = SECTIONS[Math.max(index - 1, 0)];
		return { type: "jump", id: prev.id };
	}
	if (input.key === "g") {
		if (
			input.lastGAt !== null &&
			input.now - input.lastGAt <= G_DOUBLE_TAP_MS
		) {
			return { type: "scrollTop" };
		}
		return null;
	}
	if (input.key === "G") {
		return { type: "scrollBottom" };
	}
	if (input.key === "t" || input.key === "T") {
		return { type: "toggleTheme" };
	}
	if (input.key === "?") {
		return { type: "openHelp" };
	}
	if (input.key === "Escape") {
		return { type: "closeOverlay" };
	}
	return null;
}
