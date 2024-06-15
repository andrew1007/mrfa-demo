import { memo } from "react";
import { PlayState } from "../../store/types";
import { useSelector } from "../../store";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import usePlayerActions from "src/Enterprise/store/usePlayerActions";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const { paused, playing, idle } = PlayState;

const Hidden = () => <PlayCircleIcon style={{ visibility: 'hidden' }} />

export const PlayStateIcon = {
  [playing]: PauseCircleIcon,
  [paused]: PlayCircleIcon,
  [idle]: Hidden
};

type PlayStatusChangerProps = {
  onClick: () => void;
  status: `${PlayState}`
}

export const PlayStatusChanger = ({ onClick, status }: PlayStatusChangerProps) => {
  const Icon = PlayStateIcon[status]

  return (
    <div onClick={onClick}>
      <HeavyUselessUI />
      <Icon className="play-state-change-icon" />
    </div>
  );
}

const _PlayStatusChanger = () => {
  const status = useSelector((state) => state.dashboard.playState)
  const { togglePlayState } = usePlayerActions();

  const handleClick = () => {
    togglePlayState();
  };

  return <PlayStatusChanger onClick={handleClick} status={status} />
};

export default memo(_PlayStatusChanger);
