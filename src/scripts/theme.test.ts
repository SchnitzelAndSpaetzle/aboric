import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTheme, setTheme, toggleTheme } from "./theme";

function stubPrefersDark(prefersDark: boolean): void {
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches: query === "(prefers-color-scheme: dark)" ? prefersDark : false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}));
}

describe("theme controller", () => {
	beforeEach(() => {
		localStorage.clear();
		delete document.documentElement.dataset.theme;
	});

	it("setTheme writes the dataset attribute and persists to localStorage", () => {
		setTheme("light");
		expect(document.documentElement.dataset.theme).toBe("light");
		expect(localStorage.getItem("theme")).toBe("light");
	});

	it("setTheme works with dark too", () => {
		document.documentElement.dataset.theme = "light";
		setTheme("dark");
		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
	});

	it("getTheme returns the value stored in localStorage when present", () => {
		localStorage.setItem("theme", "light");
		expect(getTheme()).toBe("light");
	});

	it("getTheme falls back to prefers-color-scheme: dark when nothing is stored", () => {
		stubPrefersDark(true);
		expect(getTheme()).toBe("dark");
	});

	it("getTheme falls back to light when the system does not prefer dark", () => {
		stubPrefersDark(false);
		expect(getTheme()).toBe("light");
	});

	it("localStorage wins over the system preference", () => {
		localStorage.setItem("theme", "dark");
		stubPrefersDark(false);
		expect(getTheme()).toBe("dark");
	});

	it("toggleTheme flips dark to light and persists", () => {
		setTheme("dark");
		toggleTheme();
		expect(document.documentElement.dataset.theme).toBe("light");
		expect(localStorage.getItem("theme")).toBe("light");
	});

	it("toggleTheme flips light to dark and persists", () => {
		setTheme("light");
		toggleTheme();
		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
	});

	describe("when storage access is blocked", () => {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		it("getTheme falls back to the system preference when getItem throws", () => {
			vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
				throw new Error("storage blocked");
			});
			stubPrefersDark(false);
			expect(getTheme()).toBe("light");
		});

		it("setTheme still updates the dataset attribute when setItem throws", () => {
			vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
				throw new Error("storage blocked");
			});
			setTheme("light");
			expect(document.documentElement.dataset.theme).toBe("light");
		});

		it("toggleTheme still flips the dataset attribute when storage throws", () => {
			document.documentElement.dataset.theme = "dark";
			vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
				throw new Error("storage blocked");
			});
			vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
				throw new Error("storage blocked");
			});
			stubPrefersDark(true);
			toggleTheme();
			expect(document.documentElement.dataset.theme).toBe("light");
		});
	});
});
