import { memo } from "react";
import { useSelector } from "../../store";
import { defaultPlaylist } from "src/Enterprise/store/selectors";

type PlaylistTitleProps = {
  title: string;
  userName: string;
}

export const PlaylistTitle = ({ title, userName }: PlaylistTitleProps) => {
  return (
    <div className="playlist-title-container">
      <div className="playlist-title">{title}</div>
      <div className="playlist-owner">by {userName}</div>
    </div>
  );
}

const _PlaylistTitle = () => {
  const playlist = useSelector(state => state.playlists[state.focusedId] ?? defaultPlaylist);
  const { title, userName } = playlist;
  return <PlaylistTitle
    title={title}
    userName={userName}
  />
};

export default memo(_PlaylistTitle);
