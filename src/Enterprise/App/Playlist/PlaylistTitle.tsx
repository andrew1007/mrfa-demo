import { memo } from "react";
import { useSelector } from "../../store";
import { defaultPlaylist } from "src/Enterprise/store/selectors";

const PlaylistTitle = () => {
  const playlist = useSelector(state => state.playlists[state.focusedId] ?? defaultPlaylist);
  const { title, userName } = playlist;

  return (
    <div className="playlist-title-container">
      <div className="playlist-title">{title}</div>
      <div className="playlist-owner">by {userName}</div>
    </div>
  );
};

export default memo(PlaylistTitle);
