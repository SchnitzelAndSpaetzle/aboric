import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { type Profile, profileSchema } from "./profile-schema";

const PROFILE_PATH = resolve(process.cwd(), "src/content/profile.yaml");

export function loadProfile(): Profile {
	const raw = readFileSync(PROFILE_PATH, "utf8");
	const data = parse(raw);
	return profileSchema.parse(data);
}
