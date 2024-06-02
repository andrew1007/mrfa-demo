import { useGetIsFocusedSong, useGetIsPlaying } from "../../store/selectors";
import {  useSelector } from "../../store";
import usePlayerActions from "src/Enterprise/store/usePlayerActions";
import { memo } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
type PlayIconProps = {
  songId: number;
};

const PlayIcon = (props: PlayIconProps) => {
  const { songId } = props
  const { togglePlayState, setCurrentSong } = usePlayerActions();
  const isPlaying = useGetIsPlaying(songId);
  const playlistId = useSelector(state => state.focusedId);
  const isCurrentSong = useGetIsFocusedSong(songId)

  const updateSong = () => {
    if (isPlaying) {
      togglePlayState();
    } else {
      setCurrentSong({
        playlistId,
        songId,
      });
    }
  };

  return (
    <div className={`song-icon ${isCurrentSong ? 'song-icon-playing' : ''}`} onClick={updateSong}>
      {isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
    </div>
  );
};

export default memo(PlayIcon)
