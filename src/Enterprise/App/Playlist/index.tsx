import React from "react";
import { applyState, State } from "../../state";
import Songs from "./Songs";
import SearchBar from "../Shared/SearchBar";
import { defaultPlaylist } from "src/Enterprise/state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type ParentProps = {
  id: State["playlistIds"][0];
};
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<ParentProps & StateProps>;

const Playlist: Component = (props) => {
  const { title, userName } = props.playlist;
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

const mappedState = () => (state: State) => ({
  playlist: state.playlists[state.focusedId] ?? defaultPlaylist,
});

export default applyState<ParentProps>(mappedState)(Playlist);
