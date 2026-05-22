import { describe, expect, it } from "vitest";
import { buildTrackUrl } from "./track-url";

describe("buildTrackUrl", () => {
	it("builds a YouTube watch URL with playlist context and 1-based index", () => {
		const url = buildTrackUrl({
			videoId: "E3-uug-inkM",
			playlistId: "OLAK5uy_mG_3VGLrAKtzGS0a8huv4saw2OdDi9H3Q",
			index: 1,
		});
		expect(url).toBe(
			"https://www.youtube.com/watch?v=E3-uug-inkM&list=OLAK5uy_mG_3VGLrAKtzGS0a8huv4saw2OdDi9H3Q&index=1",
		);
	});

	it("uses the provided index verbatim (1-based, not zero-padded)", () => {
		const url = buildTrackUrl({
			videoId: "vid",
			playlistId: "pl",
			index: 5,
		});
		expect(url).toBe("https://www.youtube.com/watch?v=vid&list=pl&index=5");
	});
});
