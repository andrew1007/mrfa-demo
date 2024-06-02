// const songSrcs: string[] = [
//     'song1',
//     'song2',
//     'song3',
//     'song4',
//     'song5',
//     'song6',
//     'song7',
//     'song8',
//     'song9',
//     'song10',
//     'song11',
//     'song12',
//     'song13',
//     'song14',
//     'song15',
//     'song16',
//     'song17',
//     'song18',
//     'song19',
//     'song20',
// ]

const songSrcs = Array(100)
  .fill(null)
  .map(
    (_, idx) =>
      require("../resources/legacyAlli-RF-Sensitized.mp3")
  );

const random = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const artists = ["Horses", "Twice", "Forks", "Tabletross"];

const mockSongs = songSrcs.map((src, idx) => ({
  id: idx + 1,
  duration: 0,
  title: `song #${idx}`,
  source: src,
  artist: random(artists),
  artistId: idx + 1,
}));

const twentyPercentChange = () => Math.random() < 0.5;

export const getRandomSongIds = () => {
  const songIds = mockSongs.map(({ id }) => id);
  return songIds.length > 10 ? songIds.filter(twentyPercentChange) : songIds;
};

export const getSongsById = (ids: number[]) => {
  return mockSongs.filter(({ id }) => ids.includes(id));
};

export default mockSongs;
