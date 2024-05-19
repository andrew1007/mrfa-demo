import React from "react";
import { getSearchedSongIds } from "src/Enterprise/state/selectors";
import { applyState, State } from "../../state";
import Song from "./Song";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const Songs: Component = (props) => {
  const { ids } = props;
  return (
    <div className="songs-root">
      <HeavyUselessUI />
      {ids.map((id) => (
        <Song id={id} key={id} />
      ))}
    </div>
  );
};

const mappedState = () => (state: State) => ({
  ids: getSearchedSongIds(state),
});

export default applyState(mappedState)(Songs);
