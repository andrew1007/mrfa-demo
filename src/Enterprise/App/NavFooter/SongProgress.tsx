import { debounce } from "lodash";
import React, {
  ChangeEventHandler,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import useDebounce from "src/Enterprise/hooks/useDebounce";
import { useDispatch, useSelector } from "../../store";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type Selector = ReturnType<typeof useSongProgressSelector>

type SongProgressProps = {
  total: Selector['total'];
  current: Selector['current'];
  totalDuration: Selector['totalDuration'];
  onChange: ChangeEventHandler<HTMLInputElement>
  currentDuration: number;
}

export const SongProgress = (props: SongProgressProps) => {
  const { total, current, totalDuration, onChange, currentDuration } = props
  const progressRef = useRef() as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    progressRef.current.value = `${currentDuration}`;
  }, [currentDuration]);

  return (
    <div>
      {total ? `${current}` : "--"}

      <input
        ref={progressRef}
        min={0}
        max={totalDuration || 0}
        defaultValue={0}
        onChange={onChange}
        type="range"
      />
      {total ? `${total}` : "--"}
      <HeavyUselessUI />
    </div>
  )
}

const _SongProgress = () => {
  const { total, current, currentDuration, totalDuration } = useSongProgressSelector();
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateProgress: ChangeEventHandler<HTMLInputElement> = useDebounce(
    (e) => {
      const newProgress = Number(e.target.value);
      dispatch(({ dashboard }) => ({
        dashboard: {
          ...dashboard,
          currentDuration: newProgress,
        },
      }));
    }, 100)

  return <SongProgress
    total={total}
    current={current}
    currentDuration={currentDuration}
    totalDuration={totalDuration}
    onChange={updateProgress}
  />
};

export const secondsToSongDuration = (time: number) => {
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

export default memo(_SongProgress);
