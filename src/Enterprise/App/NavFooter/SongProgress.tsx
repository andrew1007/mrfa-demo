import { debounce } from "lodash";
import React, {
  ChangeEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "../../store";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

const SongProgress = () => {
  const { total, current, currentDuration, totalDuration } = useSongProgressSelector();
  const progressRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const dispatch = useDispatch();

  useEffect(() => {
    progressRef.current.value = `${currentDuration}`;
  }, [currentDuration]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {total ? `${current}` : "--"}
      <input
        ref={progressRef}
        min={0}
        max={totalDuration || 0}
        defaultValue={0}
        onChange={updateProgress}
        type="range"
      />
      {total ? `${total}` : "--"}
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

const useSongProgressSelector = () => {
  const currentDuration = useSelector(state => state.dashboard.currentDuration)
  const totalDuration = useSelector(state => state.dashboard.totalDuration)
  return {
    current: secondsToSongDuration(currentDuration),
    total: secondsToSongDuration(totalDuration),
    currentDuration,
    totalDuration,
  }
}

export default memo(SongProgress);
