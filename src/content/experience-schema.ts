import { z } from "astro/zod";

export const experienceSchema = z.object({
	company: z.string(),
	role: z.string(),
	start: z.string(),
	end: z.string(),
	location: z.string(),
	url: z.url(),
	note: z.string(),
});

export type ExperienceEntry = z.infer<typeof experienceSchema>;
