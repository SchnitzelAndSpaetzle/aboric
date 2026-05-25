const button = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
const panel = document.querySelector<HTMLElement>("[data-nav-panel]");

function setOpen(open: boolean): void {
	if (!button || !panel) return;
	button.setAttribute("aria-expanded", open ? "true" : "false");
	if (open) {
		panel.removeAttribute("hidden");
	} else {
		panel.setAttribute("hidden", "");
	}
}

button?.addEventListener("click", () => {
	const open = button.getAttribute("aria-expanded") === "true";
	setOpen(!open);
});

panel?.addEventListener("click", (event) => {
	const target = event.target as HTMLElement | null;
	if (target?.closest("a")) setOpen(false);
});

document.addEventListener("keydown", (event) => {
	if (event.key !== "Escape") return;
	if (button?.getAttribute("aria-expanded") === "true") setOpen(false);
});
