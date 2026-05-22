import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { experienceSchema } from "./content/experience-schema";
import { musicSchema } from "./content/music-schema";
import { profileSchema } from "./content/profile-schema";
import { projectSchema } from "./content/project-schema";

const profile = defineCollection({
	loader: glob({ pattern: "profile.yaml", base: "./src/content" }),
	schema: profileSchema,
});

const about = defineCollection({
	loader: glob({ pattern: "about.md", base: "./src/content" }),
});

const experience = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/experience" }),
	schema: experienceSchema,
});

const projects = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
	schema: projectSchema,
});

const music = defineCollection({
	loader: glob({ pattern: "music.yaml", base: "./src/content" }),
	schema: musicSchema,
});

const now = defineCollection({
	loader: glob({ pattern: "now.md", base: "./src/content" }),
	schema: z.object({
		updated: z.coerce.date(),
	}),
});

export const collections = { profile, about, experience, projects, music, now };
