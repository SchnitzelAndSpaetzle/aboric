import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { profileSchema } from "./content/profile-schema";

const profile = defineCollection({
	loader: glob({ pattern: "profile.yaml", base: "./src/content" }),
	schema: profileSchema,
});

export const collections = { profile };
