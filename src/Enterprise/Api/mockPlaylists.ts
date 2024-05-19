import { getRandomSongIds } from "./mockSongs";

const mockPlaylists = Array(10)
  .fill(null)
  .map((_, idx) => ({
    title: `playlist #${idx + 1}`,
    userName: "Andrew",
    songs: getRandomSongIds(),
    id: idx + 1,
  }));

export const mockRecentPlaylists = mockPlaylists.filter(
  () => Math.random() < 0.5
);

export default mockPlaylists;
