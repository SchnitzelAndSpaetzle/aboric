import { z } from "astro/zod";

export const profileSchema = z.object({
	handle: z.string(),
	name: z.string(),
	tagline: z.string(),
	location: z.string(),
	email: z.email(),
	title: z.string(),
	description: z.string(),
	links: z
		.array(
			z.object({
				label: z.string(),
				url: z.url(),
			}),
		)
		.min(1),
	education: z.object({
		school: z.string(),
		degree: z.string(),
		years: z.string(),
	}),
	skills: z
		.array(
			z.object({
				group: z.string(),
				items: z.string(),
			}),
		)
		.min(1),
});

export type Profile = z.infer<typeof profileSchema>;
