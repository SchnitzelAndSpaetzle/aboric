/**
 * Pure sort for Project entries.
 *
 * Orders Projects by `year` DESC, then by `slug` ASC as a tie-breaker.
 * Has no DOM and no Astro dependency: takes anything with a `slug` and a
 * `data.year`, and returns a new array sorted in place-independent order.
 */

export type SortableProject = {
	slug: string;
	data: { year: number };
};

export function sortProjects<
	T extends { slug: string; data: { year: number } },
>(entries: T[]): T[] {
	return [...entries].sort((a, b) => {
		if (a.data.year !== b.data.year) {
			return b.data.year - a.data.year;
		}
		if (a.slug < b.slug) return -1;
		if (a.slug > b.slug) return 1;
		return 0;
	});
}
