import { useGetIsPlaying, useGetSong } from "../../state/selectors";
import { useDispatch } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";

type QueueEntryProps = {
  id: number;
};

const QueueEntry = (props: QueueEntryProps) => {
  const song = useGetSong(props.id)
  const dispatch = useDispatch();
  const { togglePlayState, setCurrentSong } = usePlayerActions();

  const isPlaying = useGetIsPlaying(props.id);
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

export default QueueEntry
