import React from "react";
import { makeGetIsPlaying, makeGetSong } from "../../state/selectors";
import { applyState, State, useDispatch } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";

type ParentProps = {
  id: number;
};
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<ParentProps & StateProps>;

const QueueEntry: Component = (props) => {
  const dispatch = useDispatch();
  const { togglePlayState, setCurrentSong } = usePlayerActions();

  const { song, isPlaying } = props;
  const { title, id, durationLabel } = song;

  const updateQueuePosition = () => {
    dispatch(({ queue }) => ({
      queue: {
        ...queue,
        position: queue.songIds.findIndex((songId) => songId === id),
      },
    }));
  };

  const updateSong = () => {
    if (isPlaying) {
      togglePlayState();
    } else {
      updateQueuePosition();
      setCurrentSong({
        songId: id,
      });
    }
  };

  return (
    <div className="queue-entry-root">
      <HeavyUselessUI />
      <div onClick={updateSong}>
        <div className={isPlaying ? "pause" : "play"} />
      </div>
      <span>{title}</span>
      <span>{durationLabel}</span>
    </div>
  );
};

const mappedState = () => {
  const getSong = makeGetSong();
  const getIsPlaying = makeGetIsPlaying();

  return (state: State, ownProps: ParentProps) => ({
    song: getSong(state, ownProps),
    isPlaying: getIsPlaying(state, ownProps),
  });
};

export default applyState<ParentProps>(mappedState)(QueueEntry);
