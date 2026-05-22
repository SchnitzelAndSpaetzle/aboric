import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { experienceSchema } from "./content/experience-schema";
import { profileSchema } from "./content/profile-schema";

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

export const collections = { profile, about, experience };
