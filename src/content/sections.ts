export type Section = {
	id: string;
	label: string;
	key: string;
};

export const SECTIONS: readonly Section[] = [
	{ id: "about", label: "about", key: "1" },
	{ id: "experience", label: "experience", key: "2" },
	{ id: "projects", label: "projects", key: "3" },
	{ id: "music", label: "music", key: "4" },
	{ id: "now", label: "now", key: "5" },
	{ id: "contact", label: "contact", key: "6" },
] as const;
