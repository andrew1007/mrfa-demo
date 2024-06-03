const chunkArr = <T extends any[]>(arr: T, count: number) => {
  const newArr = []
  const currArr = [...arr]
  while (currArr.length > 0) {
    const curr = currArr.splice(0, count).join(' ')
    newArr.push(curr)
  }
  return newArr
}

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Id semper risus in hendrerit gravida. Nunc id cursus metus aliquam eleifend mi in. Mauris augue neque gravida in fermentum et sollicitudin. Id diam maecenas ultricies mi eget mauris. Mi bibendum neque egestas congue. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Enim nulla aliquet porttitor lacus luctus accumsan. Eget nunc lobortis mattis aliquam faucibus purus in massa.Amet risus nullam eget felis eget. Ac ut consequat semper viverra nam. Erat velit scelerisque in dictum non consectetur a. Felis imperdiet proin fermentum leo vel orci porta non pulvinar. Amet consectetur adipiscing elit ut. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Adipiscing vitae proin sagittis nisl rhoncus mattis. Vulputate mi sit amet mauris commodo quis. Nulla pellentesque dignissim enim sit amet venenatis urna cursus eget. Netus et malesuada fames ac turpis egestas maecenas.Orci dapibus ultrices in iaculis nunc. Mauris vitae ultricies leo integer malesuada. Leo duis ut diam quam nulla. Ullamcorper eget nulla facilisi etiam dignissim diam. Malesuada fames ac turpis egestas sed tempus. Eget nulla facilisi etiam dignissim diam quis enim lobortis. Pellentesque id nibh tortor id aliquet lectus proin nibh nisl. Tempus egestas sed sed risus pretium quam vulputate. Viverra adipiscing at in tellus integer. Malesuada fames ac turpis egestas maecenas pharetra. Vitae congue eu consequat ac felis donec. Nisi est sit amet facilisis magna.Duis ut diam quam nulla porttitor massa id neque. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Arcu non odio euismod lacinia. Posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Pretium vulputate sapien nec sagittis. Nunc sed blandit libero volutpat. Orci ac auctor augue mauris augue neque gravida in fermentum. Orci sagittis eu volutpat odio facilisis. Scelerisque purus semper eget duis at tellus. Molestie at elementum eu facilisis sed odio morbi quis commodo. Et odio pellentesque diam volutpat commodo sed egestas. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Vulputate sapien nec sagittis aliquam.Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Ac placerat vestibulum lectus mauris ultrices eros in. Turpis in eu mi bibendum neque egestas congue quisque egestas. Eu turpis egestas pretium aenean pharetra magna. Gravida in fermentum et sollicitudin ac. Tempus imperdiet nulla malesuada pellentesque elit eget. Quis varius quam quisque id diam vel. In vitae turpis massa sed. Hac habitasse platea dictumst quisque sagittis purus sit. Malesuada fames ac turpis egestas. A condimentum vitae sapien pellentesque habitant morbi tristique. Pellentesque dignissim enim sit amet venenatis urna cursus. Volutpat lacus laoreet non curabitur gravida arcu. In tellus integer feugiat scelerisque varius morbi enim. Nunc lobortis mattis aliquam faucibus purus in massa. Quam vulputate dignissim suspendisse in. Nullam vehicula ipsum a arcu cursus vitae. At volutpat diam ut venenatis tellus in metus vulputate. Sed velit dignissim sodales ut eu sem.".split(' ')

const songSrcs = Array(100)
  .fill(null)
  .map(
    (_, idx) =>
      require("../resources/legacyAlli-RF-Sensitized.mp3")
  );

const artists = chunkArr(loremIpsum, 3)

const mockSongs = songSrcs.map((src, idx) => ({
  id: idx + 1,
  duration: 2 * 60 + 52,
  title: `song #${idx}`,
  source: src,
  artist: artists[idx],
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
