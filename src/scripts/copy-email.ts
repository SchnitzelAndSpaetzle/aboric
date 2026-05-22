const COPIED_MS = 1400;
const DEFAULT_STATUS = " · click to copy";
const COPIED_STATUS = " ✓ copied";

function init(): void {
	const buttons =
		document.querySelectorAll<HTMLButtonElement>("[data-copy-email]");
	for (const button of buttons) {
		const status =
			button.parentElement?.querySelector<HTMLElement>("[data-copy-status]");
		let timer: ReturnType<typeof setTimeout> | undefined;
		button.addEventListener("click", async () => {
			const email = button.dataset.email ?? button.textContent ?? "";
			try {
				await navigator.clipboard.writeText(email);
			} catch {
				return;
			}
			if (!status) return;
			status.textContent = COPIED_STATUS;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				status.textContent = DEFAULT_STATUS;
			}, COPIED_MS);
		});
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
	init();
}
