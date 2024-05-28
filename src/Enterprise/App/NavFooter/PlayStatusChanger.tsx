import { memo } from "react";
import { PlayState } from "../../state/types";
import { useSelector } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";

const { paused, playing, idle } = PlayState;

const playStateClassName = {
  [playing]: "pause",
  [paused]: "play",
  [idle]: ""
};

const PlayStatusChanger = () => {
  const status = useSelector((state) => state.dashboard.playState)
  const { togglePlayState } = usePlayerActions();

  const handleClick = () => {
    togglePlayState();
  };

  return (
    <div onClick={handleClick}>
      <HeavyUselessUI />
      <div className={playStateClassName[status]} />
    </div>
  );
};

export default memo(PlayStatusChanger);