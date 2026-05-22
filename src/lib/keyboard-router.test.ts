import { describe, expect, it } from "vitest";
import type { RouteInput } from "./keyboard-router";
import { route } from "./keyboard-router";

function input(overrides: Partial<RouteInput> = {}): RouteInput {
	return {
		key: "",
		shiftKey: false,
		currentSectionId: "about",
		lastGAt: null,
		now: 0,
		fromInput: false,
		...overrides,
	};
}

describe("keyboard router", () => {
	it("maps '1' to a jump to the about section", () => {
		expect(route(input({ key: "1" }))).toEqual({ type: "jump", id: "about" });
	});

	it.each([
		["1", "about"],
		["2", "experience"],
		["3", "projects"],
		["4", "music"],
		["5", "now"],
		["6", "contact"],
	])("maps numeric key '%s' to a jump to '%s'", (key, id) => {
		expect(route(input({ key }))).toEqual({ type: "jump", id });
	});

	it.each(["j", "ArrowDown"])("'%s' jumps to the next section", (key) => {
		expect(route(input({ key, currentSectionId: "about" }))).toEqual({
			type: "jump",
			id: "experience",
		});
		expect(route(input({ key, currentSectionId: "music" }))).toEqual({
			type: "jump",
			id: "now",
		});
	});

	it.each(["j", "ArrowDown"])("'%s' clamps at the last section", (key) => {
		expect(route(input({ key, currentSectionId: "contact" }))).toEqual({
			type: "jump",
			id: "contact",
		});
	});

	it.each(["k", "ArrowUp"])("'%s' jumps to the previous section", (key) => {
		expect(route(input({ key, currentSectionId: "experience" }))).toEqual({
			type: "jump",
			id: "about",
		});
		expect(route(input({ key, currentSectionId: "contact" }))).toEqual({
			type: "jump",
			id: "now",
		});
	});

	it.each(["k", "ArrowUp"])("'%s' clamps at the first section", (key) => {
		expect(route(input({ key, currentSectionId: "about" }))).toEqual({
			type: "jump",
			id: "about",
		});
	});

	it("a single 'g' tap returns null (waits for the second tap)", () => {
		expect(route(input({ key: "g", now: 1000, lastGAt: null }))).toBeNull();
	});

	it("'g g' within 400ms returns scrollTop", () => {
		expect(route(input({ key: "g", now: 1300, lastGAt: 1000 }))).toEqual({
			type: "scrollTop",
		});
	});

	it("a second 'g' outside the 400ms window returns null", () => {
		expect(route(input({ key: "g", now: 1500, lastGAt: 1000 }))).toBeNull();
	});

	it("'G' (shift+g) returns scrollBottom", () => {
		expect(route(input({ key: "G", shiftKey: true }))).toEqual({
			type: "scrollBottom",
		});
	});

	it.each(["t", "T"])("'%s' returns toggleTheme", (key) => {
		expect(route(input({ key }))).toEqual({ type: "toggleTheme" });
	});

	it("'?' returns openHelp", () => {
		expect(route(input({ key: "?", shiftKey: true }))).toEqual({
			type: "openHelp",
		});
	});

	it("'Escape' returns closeOverlay", () => {
		expect(route(input({ key: "Escape" }))).toEqual({ type: "closeOverlay" });
	});

	it("'/' is a no-op (command palette out of scope)", () => {
		expect(route(input({ key: "/" }))).toBeNull();
	});

	it.each([
		"q",
		"x",
		"Tab",
		"Enter",
		" ",
	])("unknown key '%s' returns null", (key) => {
		expect(route(input({ key }))).toBeNull();
	});

	it.each([
		"1",
		"j",
		"k",
		"ArrowDown",
		"g",
		"G",
		"t",
		"?",
		"Escape",
	])("returns null when the event came from an INPUT/TEXTAREA target ('%s')", (key) => {
		expect(route(input({ key, fromInput: true }))).toBeNull();
	});
});
