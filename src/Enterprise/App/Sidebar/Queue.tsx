import React from "react";
import { getSearchSongQueueIds } from "src/Enterprise/state/selectors";
import { applyState, State } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import SearchBar from "../Shared/SearchBar";
import QueueEntry from "./QueueEntry";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const Queue: Component = (props) => {
  const { ids } = props;
  return (
    <>
      <SearchBar field="queue" placeholder="search queues" />
      <HeavyUselessUI />
      <div className="queue-root">
        {ids.map((id) => (
          <QueueEntry id={id} key={id} />
        ))}
      </div>
    </>
  );
};

const mappedState = () => (state: State) => ({
  ids: getSearchSongQueueIds(state),
});

export default applyState(mappedState)(Queue);
