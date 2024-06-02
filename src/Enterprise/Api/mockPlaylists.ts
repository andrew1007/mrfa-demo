import { getRandomSongIds } from "./mockSongs";

const titles = [
  'Liked Songs',
  'Rock!',
  'Indie/Alt Rock',
  'Sort of Metal',
  'Hip Hop',
  'Electronic',
  'Everything Good'
]

const mockPlaylists = titles
  .map((title, idx) => ({
    title,
    userName: "Andrew",
    songs: getRandomSongIds(),
    id: idx + 1,
  }));

export const mockRecentPlaylists = mockPlaylists.filter(
  () => Math.random() < 0.5
);

export default mockPlaylists;
