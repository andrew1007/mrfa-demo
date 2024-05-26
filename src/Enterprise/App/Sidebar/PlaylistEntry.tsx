import { Route, State } from "../../state/types";
import { useDispatch, useSelector } from "../../state";
import { defaultPlaylist } from "src/Enterprise/state/selectors";
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
    <div onClick={routeToPlaylist}>
      <HeavyUselessUI />
      {title} ({songs.length})
    </div>
  );
};

export default memo(PlaylistEntry);
