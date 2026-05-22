import { parse } from "yaml";
import musicYaml from "./music.yaml?raw";
import { type Music, musicSchema } from "./music-schema";

export function loadMusic(): Music {
	return musicSchema.parse(parse(musicYaml));
}
