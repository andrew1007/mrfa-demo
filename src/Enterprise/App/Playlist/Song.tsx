import React from "react";
import { Route, State, SubState } from "../../state/types";
import { makeGetIsPlaying, makeGetSong } from "../../state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { applyState, useDispatch } from "../../state";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";

type ParentProps = {
  id: SubState["Playlist"]["songs"][0];
};
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<ParentProps & StateProps>;

const Song: Component = (props) => {
  const dispatch = useDispatch();
  const { togglePlayState, setCurrentSong } = usePlayerActions();

  const { song, playlistId, isPlaying } = props;
  const { title, durationLabel, artist, artistId, id } = song;

  const routeToArtist = () =>
    dispatch(() => ({
      currentRoute: Route.artist,
      focusedId: artistId,
    }));

  const updateSong = () => {
    if (isPlaying) {
      togglePlayState();
    } else {
      setCurrentSong({
        playlistId,
        songId: id,
      });
    }
  };

  return (
    <div className="song-root">
      <HeavyUselessUI />
      <div className="song-icon" onClick={updateSong}>
        <div className={isPlaying ? "pause" : "play"} />
      </div>
      <div className="song-title">{title}</div>
      <div className="song-artist" onClick={routeToArtist}>
        {artist}
      </div>
      <div className="song-duration">{durationLabel}</div>
    </div>
  );
};

const mappedState = () => {
  const getSong = makeGetSong();
  const getIsPlaying = makeGetIsPlaying();
  return (state: State, ownProps: ParentProps) => {
    return {
      song: getSong(state, ownProps),
      playlistId: state.focusedId,
      isPlaying: getIsPlaying(state, ownProps),
    };
  };
};

export default applyState(mappedState)(Song);
