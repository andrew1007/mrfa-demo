import { useGetIsFocusedSong, useGetIsPlaying } from "../../store/selectors";
import { useSelector } from "../../store";
import usePlayerActions from "src/Enterprise/store/usePlayerActions";
import { MouseEventHandler, memo } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

type PlayIconProps = {
  isCurrentSong: boolean;
  onClick: MouseEventHandler<HTMLDivElement>
  isPlaying: boolean;
}

export const PlayIcon = (props: PlayIconProps) => {
  const { isCurrentSong, isPlaying, onClick } = props

  return (
    <div className={`song-icon ${isCurrentSong ? 'song-icon-playing' : ''}`} onClick={onClick}>
      {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
    </div>
  );
}

type _PlayIconProps = {
  songId: number;
};

const _PlayIcon = (props: _PlayIconProps) => {
  const { songId } = props
  const { togglePlayState, setCurrentSong } = usePlayerActions();
  const isPlaying = useGetIsPlaying(songId);
  const playlistId = useSelector(state => state.focusedId);
  const isCurrentSong = useGetIsFocusedSong(songId)

  const updateSong: React.DOMAttributes<HTMLDivElement>['onClick'] = (e) => {
    e.stopPropagation()
    if (isPlaying) {
      togglePlayState();
    } else {
      setCurrentSong({
        playlistId,
        songId,
      });
    }
  };

  return <PlayIcon
    isCurrentSong={isCurrentSong}
    onClick={updateSong}
    isPlaying={isPlaying}
  />
};

export default memo(_PlayIcon)
