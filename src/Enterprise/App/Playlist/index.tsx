import { memo } from "react";
import Songs from "./Songs";
import SearchBar from "../Shared/SearchBar";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import PlaylistTitle from "./PlaylistTitle";

const Playlist = () => {
  return (
    <div className="playlist-root">
      <PlaylistTitle />
      <div className="playlist-search-container">
        <SearchBar field="song" placeholder="search for a song" />
      </div>
      <Songs />
      <HeavyUselessUI />
    </div>
  );
};

export default memo(Playlist);
