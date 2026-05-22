import { parse } from "yaml";
import profileYaml from "./profile.yaml?raw";
import { type Profile, profileSchema } from "./profile-schema";

export function loadProfile(): Profile {
	return profileSchema.parse(parse(profileYaml));
}
