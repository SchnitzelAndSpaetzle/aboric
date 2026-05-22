import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { profileSchema } from "./content/profile-schema";

const profile = defineCollection({
	loader: glob({ pattern: "profile.yaml", base: "./src/content" }),
	schema: profileSchema,
});

const about = defineCollection({
	loader: glob({ pattern: "about.md", base: "./src/content" }),
});

export const collections = { profile, about };
