import { useEffect, useMemo, useState } from "react";
import { PlayState } from "src/Enterprise/store/types";
import { useDispatch, useSelector } from "../store";
import useHotkeys from "./useHotkeys";
import { useGetCurrentSong } from "../store/selectors";

const useAudioPlayer = () => {
  const { source: src } = useGetCurrentSong()
  const volume = useSelector(state => state.dashboard.volume);
  const playState = useSelector(state => state.dashboard.playState);
  const currentDuration = useSelector(state => state.dashboard.currentDuration);

  const dispatch = useDispatch();
  const audio = useMemo(() => new Audio(), []);
  const [innerTime, setInnerTime] = useState(0);

  useHotkeys(audio);

  useEffect(() => {
    if (src) {
      audio.pause();
      audio.currentTime = 0;
      setInnerTime(0);
      audio.src = src;
      audio.play();
    }
  }, [src]);

  useEffect(() => {
    dispatch((prevState) => ({
      dashboard: {
        ...prevState.dashboard,
        currentDuration: innerTime,
        totalDuration: Math.floor(audio.duration),
      },
    }));
  }, [innerTime]);

  useEffect(() => {
    if (Math.abs(innerTime - currentDuration) > 1 && innerTime) {
      audio.currentTime = currentDuration;
      setInnerTime(currentDuration);
    }
  }, [currentDuration, innerTime]);

  useEffect(() => {
    if (!src) return;
    const updateAppDuration = setInterval(() => {
      const current = Math.floor(audio.currentTime);
      const total = Math.floor(audio.duration);
      if (total !== current) {
        setInnerTime(current);
      } else {
        dispatch((prevState) => ({
          queue: {
            ...prevState.queue,
            position: prevState.queue.position + 1,
          },
        }));
      }
    }, 500);
    return () => {
      clearInterval(updateAppDuration);
    };
  }, [src]);

  useEffect(() => {
    const playHandlers = {
      [PlayState.paused]: () => audio.pause(),
      [PlayState.playing]: () => audio.play(),
      [PlayState.idle]: () => audio.pause(),
    };
    playHandlers[playState]?.();
  }, [playState]);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume]);
};

export default useAudioPlayer;
