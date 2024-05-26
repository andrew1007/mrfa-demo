import React, { memo } from "react";
import { useGetSearchSongQueueIds } from "src/Enterprise/state/selectors";
import { applyState, State } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import SearchBar from "../Shared/SearchBar";
import QueueEntry from "./QueueEntry";

type NoParentProps = Record<string, never>;
type Component = React.FunctionComponent<NoParentProps>;

const Queue: Component = () => {
  const ids = useGetSearchSongQueueIds()
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

export default memo(Queue);
