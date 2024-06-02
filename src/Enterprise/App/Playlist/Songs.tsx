import { useGetPlaylistSongs, useGetSearchedSongIds } from "src/Enterprise/store/selectors";
import Song from "./Song";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { memo } from "react";

const Songs = () => {
  const searchedIds = useGetSearchedSongIds()
  const songIds = useGetPlaylistSongs()

  return (
    <div className="songs-root">
      <HeavyUselessUI />
      {songIds.map((id) => (
        <div
          key={id}
          style={{
            display: searchedIds.has(id) ? 'block' : 'none'
          }}
        >
          <Song id={id} />
        </div>
      ))}
    </div>
  );
};

export default memo(Songs)
