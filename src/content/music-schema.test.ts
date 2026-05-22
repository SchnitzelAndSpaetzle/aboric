import { describe, expect, it } from "vitest";
import { musicSchema } from "./music-schema";

const validMusic = {
	bandcamp: "https://streetofcrocodiles.bandcamp.com",
	spotify: "https://open.spotify.com/artist/2D1U7DMfjy9DddHPM25jOl",
	youtube: "https://www.youtube.com/@street_of_crocodiles",
	playlistId: "OLAK5uy_mG_3VGLrAKtzGS0a8huv4saw2OdDi9H3Q",
	tracks: [
		{ title: "track 02", videoId: "E3-uug-inkM" },
		{ title: "track 05", videoId: "B0e3iv-fqGg" },
	],
};

describe("musicSchema", () => {
	it("accepts a complete, well-formed Music object", () => {
		const result = musicSchema.safeParse(validMusic);
		expect(result.success).toBe(true);
	});

	it("rejects a track missing videoId", () => {
		const result = musicSchema.safeParse({
			...validMusic,
			tracks: [{ title: "track 02" }],
		});
		expect(result.success).toBe(false);
	});

	it("rejects a malformed bandcamp URL", () => {
		const result = musicSchema.safeParse({
			...validMusic,
			bandcamp: "not-a-url",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a missing playlistId", () => {
		const { playlistId: _omit, ...missingPlaylist } = validMusic;
		const result = musicSchema.safeParse(missingPlaylist);
		expect(result.success).toBe(false);
	});
});
