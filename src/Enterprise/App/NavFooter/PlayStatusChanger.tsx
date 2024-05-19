import React from "react";
import { PlayState } from "../../state/types";
import { applyState, State } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;

const { paused, playing, idle } = PlayState;

const playStateClassName = {
  [playing]: "pause",
  [paused]: "play",
  [idle]: ""
};

type Component = React.FunctionComponent<NoParentProps & StateProps>;

const PlayStatusChanger: Component = (props) => {
  const { status } = props;
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

const mappedState = () => (state: State) => ({
  status: state.dashboard.playState,
});

export default applyState(mappedState)(PlayStatusChanger);
