import { Route, State } from "../../store/types";
import { useDispatch, useSelector } from "../../store";
import { defaultPlaylist } from "src/Enterprise/store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { MouseEventHandler, memo } from "react";

type PlaylistEntryProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
  isFocused: boolean;
  title: string;
  count: number;
}

export const PlaylistEntry = (props: PlaylistEntryProps) => {
  const { onClick, isFocused, count, title } = props
  return (
    <button onClick={onClick} className={isFocused ? 'focused-playlist-entry' : ''}>
      <HeavyUselessUI />
      {title} ({count})
    </button>
  );
}

type _PlaylistEntryProps = {
  id: State["playlistIds"][0];
};

const _PlaylistEntry = (props: _PlaylistEntryProps) => {
  const dispatch = useDispatch();
  const playlist = useSelector(state => state.playlists[props.id] ?? defaultPlaylist);
  const isFocused = useSelector(state => state.focusedId === props.id)
  const { title, songs, id } = playlist;

  const routeToPlaylist = () => {
    dispatch(() => ({
      currentRoute: Route.playlist,
      focusedId: id,
    }));
  };

  return <PlaylistEntry
    onClick={routeToPlaylist}
    isFocused={isFocused}
    title={title}
    count={songs.length}
  />
};

export default memo(_PlaylistEntry);
