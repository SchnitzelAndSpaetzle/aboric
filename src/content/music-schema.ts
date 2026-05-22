import { z } from "astro/zod";

export const musicSchema = z.object({
	bandcamp: z.url(),
	spotify: z.url(),
	youtube: z.url(),
	playlistId: z.string().min(1),
	tracks: z
		.array(
			z.object({
				title: z.string().min(1),
				videoId: z.string().min(1),
			}),
		)
		.min(1),
});

export type Music = z.infer<typeof musicSchema>;
export type MusicTrack = Music["tracks"][number];
