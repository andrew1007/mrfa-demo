import { debounce } from "lodash";
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { applyState, State, useDispatch } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const SongProgress: Component = (props) => {
  const { total, current, currentDuration, totalDuration } = props;
  const progressRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const dispatch = useDispatch();

  useEffect(() => {
    progressRef.current.value = `${currentDuration}`;
  }, [currentDuration]);

  const updateProgress = useCallback(
    debounce<ChangeEventHandler<HTMLInputElement>>((e) => {
      const newProgress = Number(e.target.value);
      dispatch(({ dashboard }) => ({
        dashboard: {
          ...dashboard,
          currentDuration: newProgress,
        },
      }));
    }, 100),
    []
  );

  return (
    <div>
      <input
        ref={progressRef}
        min={0}
        max={totalDuration || 0}
        defaultValue={0}
        onChange={updateProgress}
        type="range"
      />
      {total ? `${current} / ${total}` : "-- / --"}
      <HeavyUselessUI />
    </div>
  );
};

const secondsToSongDuration = (time: number) => {
  if (!Number(time)) return "";
  const minutes = Math.floor(time / 60);
  const seconds = `0${time - minutes * 60}`.slice(-2);
  return `${minutes}:${seconds}`;
};

const mappedState = () => (state: State) => {
  const { dashboard } = state;
  const { currentDuration, totalDuration } = dashboard;

  return {
    current: secondsToSongDuration(currentDuration),
    total: secondsToSongDuration(totalDuration),
    currentDuration,
    totalDuration,
  };
};

export default applyState(mappedState)(SongProgress);
