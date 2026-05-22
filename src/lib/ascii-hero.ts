export type AsciiHeroInput = {
	name: string;
	tagline: string;
	location: string;
};

export function buildAsciiHero({
	name,
	tagline,
	location,
}: AsciiHeroInput): string {
	const lines = [name, tagline, location];
	const inset = 3;
	const content = Math.max(...lines.map((l) => [...l].length));
	const width = content + inset * 2;
	const border = "─".repeat(width);
	const pad = (s: string) =>
		`│${" ".repeat(inset)}${s.padEnd(content)}${" ".repeat(inset)}│`;
	const blank = `│${" ".repeat(width)}│`;
	return [
		`┌${border}┐`,
		blank,
		pad(name),
		pad(tagline),
		pad(location),
		blank,
		`└${border}┘`,
	].join("\n");
}
