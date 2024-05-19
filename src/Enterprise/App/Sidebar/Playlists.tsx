import React from "react";
import { getSearchedPlaylistIds } from "src/Enterprise/state/selectors";
import { applyState, State } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import SearchBar from "../Shared/SearchBar";
import PlaylistEntry from "./PlaylistEntry";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const Playlists: Component = (props) => {
  const { playlistIds } = props;
  return (
    <>
      <SearchBar field="playlist" placeholder="search playlists" />
      <HeavyUselessUI />
      {playlistIds.map((id) => (
        <PlaylistEntry id={id} key={id} />
      ))}
    </>
  );
};

const mappedState = () => (state: State) => ({
  playlistIds: getSearchedPlaylistIds(state),
});

export default applyState(mappedState)(Playlists);
