import type { ExperienceEntry } from "./experience-schema";

const MONTHS: Record<string, number> = {
	jan: 1,
	feb: 2,
	mar: 3,
	apr: 4,
	may: 5,
	jun: 6,
	jul: 7,
	aug: 8,
	sep: 9,
	sept: 9,
	oct: 10,
	nov: 11,
	dec: 12,
};

/**
 * Parse a free-form start/end string into a comparable integer (YYYYMM).
 * Accepts: "Jan 2022", "2022-01", "2022". Returns 0 for unparseable input.
 */
function parseMonthYear(input: string): number {
	const trimmed = input.trim().toLowerCase();

	// "YYYY-MM" or "YYYY-M"
	const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})$/);
	if (isoMatch) {
		const year = Number(isoMatch[1]);
		const month = Number(isoMatch[2]);
		return year * 100 + month;
	}

	// "Mon YYYY" or "Month YYYY"
	const monthMatch = trimmed.match(/^([a-z]+)\s+(\d{4})$/);
	if (monthMatch) {
		const name = monthMatch[1];
		const month = MONTHS[name] ?? MONTHS[name.slice(0, 3)];
		const year = Number(monthMatch[2]);
		if (month) return year * 100 + month;
	}

	// Bare "YYYY"
	const yearMatch = trimmed.match(/^(\d{4})$/);
	if (yearMatch) {
		return Number(yearMatch[1]) * 100 + 1;
	}

	return 0;
}

function isCurrent(end: string): boolean {
	return /\b(?:present|current|now)\b/i.test(end);
}

/**
 * Sort experience entries: the "current" job (end containing "present"/"current"/"now")
 * first, then by `start` descending. Stable for equal keys; pure (no input mutation).
 */
export function sortExperience(
	entries: readonly ExperienceEntry[],
): ExperienceEntry[] {
	return entries
		.map((entry, index) => ({ entry, index }))
		.sort((a, b) => {
			const aCurrent = isCurrent(a.entry.end);
			const bCurrent = isCurrent(b.entry.end);
			if (aCurrent !== bCurrent) return aCurrent ? -1 : 1;

			const aStart = parseMonthYear(a.entry.start);
			const bStart = parseMonthYear(b.entry.start);
			if (aStart !== bStart) return bStart - aStart;

			return a.index - b.index;
		})
		.map(({ entry }) => entry);
}
