export type ActiveEntry = {
	target: { id: string };
	isIntersecting: boolean;
	intersectionRatio: number;
};

export function pickActive(entries: ActiveEntry[], current: string): string {
	const visible = entries.filter((e) => e.isIntersecting);
	if (visible.length === 0) {
		return current;
	}
	const best = visible.reduce((a, b) =>
		b.intersectionRatio > a.intersectionRatio ? b : a,
	);
	return best.target.id;
}
