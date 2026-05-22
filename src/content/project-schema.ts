import { z } from "astro/zod";

export const PROJECT_TYPES = [
	"frontend",
	"fullstack",
	"backend",
	"web",
] as const;
export const PROJECT_STATUSES = ["live", "closed"] as const;

export const projectSchema = z.object({
	title: z.string(),
	client: z.string(),
	type: z.enum(PROJECT_TYPES),
	year: z.number().int(),
	status: z.enum(PROJECT_STATUSES),
	stack: z.array(z.string()),
	url: z.url().optional(),
});

export type Project = z.infer<typeof projectSchema>;
