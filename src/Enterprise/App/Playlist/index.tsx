import { memo } from "react";
import { useSelector } from "../../store";
import Songs from "./Songs";
import SearchBar from "../Shared/SearchBar";
import { defaultPlaylist } from "src/Enterprise/store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

const Playlist = () => {
  const playlist = useSelector(state => state.playlists[state.focusedId] ?? defaultPlaylist);
  const { title, userName } = playlist;

  return (
    <div className="playlist-root">
      <div>{title}</div>
      <div>by {userName}</div>
      <SearchBar field="song" placeholder="search for a song" />
      <Songs />
      <HeavyUselessUI />
    </div>
  );
};

export default memo(Playlist);
