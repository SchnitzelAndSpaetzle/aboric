export type BuildTrackUrlInput = {
	videoId: string;
	playlistId: string;
	index: number;
};

/**
 * Build a YouTube watch URL with playlist context for a SOC track.
 * `index` is 1-based (the position the track occupies in the playlist).
 */
export function buildTrackUrl({
	videoId,
	playlistId,
	index,
}: BuildTrackUrlInput): string {
	return `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}&index=${index}`;
}
