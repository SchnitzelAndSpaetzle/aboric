import { SECTIONS } from "../content/sections";
import { pickActive } from "../lib/pick-active-section";

const target = document.querySelector<HTMLElement>("[data-current-section]");
const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(
	(el): el is HTMLElement => el !== null,
);

if (target && sections.length > 0 && "IntersectionObserver" in window) {
	let current = target.textContent?.trim() || SECTIONS[0].id;
	const lastEntries = new Map<string, IntersectionObserverEntry>();

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				lastEntries.set(entry.target.id, entry);
			}
			const next = pickActive(
				Array.from(lastEntries.values()).map((e) => ({
					target: { id: e.target.id },
					isIntersecting: e.isIntersecting,
					intersectionRatio: e.intersectionRatio,
				})),
				current,
			);
			if (next !== current) {
				current = next;
				target.textContent = current;
			}
		},
		{ rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
	);

	for (const section of sections) observer.observe(section);
}
