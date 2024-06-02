import { Route, State } from "../../store/types";
import { useDispatch, useSelector } from "../../store";
import { defaultPlaylist } from "src/Enterprise/store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { memo } from "react";

type PlaylistEntryProps = {
  id: State["playlistIds"][0];
};

const PlaylistEntry = (props: PlaylistEntryProps) => {
  const dispatch = useDispatch();
  const playlist = useSelector(state => state.playlists[props.id] ?? defaultPlaylist);

  const { title, songs, id } = playlist;

  const routeToPlaylist = () => {
    dispatch(() => ({
      currentRoute: Route.playlist,
      focusedId: id,
    }));
  };

  return (
    <button onClick={routeToPlaylist}>
      <HeavyUselessUI />
      {title} ({songs.length})
    </button>
  );
};

export default memo(PlaylistEntry);
