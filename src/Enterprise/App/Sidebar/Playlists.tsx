import { memo } from "react";
import { useGetSearchedPlaylistIds } from "src/Enterprise/store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import SearchBar from "../Shared/SearchBar";
import PlaylistEntry from "./PlaylistEntry";

const Playlists = () => {
  const playlistIds = useGetSearchedPlaylistIds();
  return (
    <>
      <SearchBar field="playlist" placeholder="search playlists" />
      <HeavyUselessUI />
      <div className="playlist-container">
        {playlistIds.map((id) => (
          <PlaylistEntry id={id} key={id} />
        ))}
      </div>
    </>
  );
};

export default memo(Playlists)
