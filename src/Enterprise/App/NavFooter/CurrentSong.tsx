import React from "react";
import { getCurrentSong } from "src/Enterprise/state/selectors";
import { applyState, State } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const CurrentSong: Component = (props) => {
  const { song } = props;
  const { artist, title } = song;
  return (
    <div>
      <HeavyUselessUI />
      {title && (
        <>
          Now Playing:
          {title}-{artist}
        </>
      )}
    </div>
  );
};

const mappedState = () => (state: State) => ({
  song: getCurrentSong(state),
});

export default applyState(mappedState)(CurrentSong);
