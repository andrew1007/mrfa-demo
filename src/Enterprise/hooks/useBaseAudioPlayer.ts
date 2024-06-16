import { useEffect, useMemo, useState } from "react";
import { PlayState } from "src/Enterprise/store/types";

type BaseAudioPlayerParams = {
  volume: number;
  playState: `${PlayState}`;
  currentDuration: number;
  src: string;
  onDurationChange: ({
    currentDuration,
    totalDuration,
  }: {
    currentDuration: number;
    totalDuration: number;
  }) => void;
};

const useBaseAudioPlayer = (params: BaseAudioPlayerParams) => {
  const { currentDuration, playState, src, volume, onDurationChange } = params;

  const audio = useMemo(() => new Audio(), []);
  const [innerTime, setInnerTime] = useState(0);

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
    onDurationChange({
      currentDuration: innerTime,
      totalDuration: audio.duration,
    });
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
      setInnerTime(current);
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

export default useBaseAudioPlayer;
