import React from "react";
import { Route, State } from "../../state/types";
import { applyState, useDispatch } from "../../state";
import { defaultPlaylist } from "src/Enterprise/state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type ParentProps = {
  id: State["playlistIds"][0];
};
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<ParentProps & StateProps>;

const PlaylistEntry: Component = (props) => {
  const dispatch = useDispatch();

  const { playlist } = props;
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

const mappedState = () => (state: State, ownProps: ParentProps) => ({
  playlist: state.playlists[ownProps.id] ?? defaultPlaylist,
});

export default applyState<ParentProps>(mappedState)(PlaylistEntry);
