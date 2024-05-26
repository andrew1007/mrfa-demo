import { Route, SubState } from "../../state/types";
import { useGetIsPlaying, useGetSong } from "../../state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { useDispatch, useSelector } from "../../state";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";
import { memo } from "react";

type PlayIconProps = {
  songId: number;
};

const PlayIcon = (props: PlayIconProps) => {
  const { togglePlayState, setCurrentSong } = usePlayerActions();
  const song = useGetSong(props.songId)
  const isPlaying = useGetIsPlaying(props.songId);
  const playlistId = useSelector(state => state.focusedId);

  const { id } = song;

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
    <div className="song-icon" onClick={updateSong}>
      <div className={isPlaying ? "pause" : "play"} />
    </div>
  );
};

export default memo(PlayIcon)
