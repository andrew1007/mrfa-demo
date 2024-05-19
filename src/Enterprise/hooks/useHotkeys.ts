import { useEffect, useState } from "react";
import { useDispatch } from "../state";
import usePlayerActions from "../state/usePlayerActions";

const useHotkeys = (audio: HTMLAudioElement) => {
  const dispatch = useDispatch();
  const { togglePlayState } = usePlayerActions();
  const [prevVolume, setPrevVolume] = useState(100);

  useEffect(() => {
    if (audio.volume) {
      setPrevVolume(audio.volume * 100);
    }
  }, [audio.volume]);

  useEffect(() => {
    const hotkeys = {
      " ": () => {
        if (audio.src) togglePlayState();
      },
      m: () =>
        dispatch(({ dashboard }) => ({
          dashboard: {
            ...dashboard,
            volume: dashboard.volume ? 0 : prevVolume,
          },
        })),
      "ctrl+ArrowRight": () =>
        dispatch(({ queue }) => ({
          queue: {
            ...queue,
            position: (queue.position + 1) % queue.songIds.length,
          },
        })),
      "ctrl+ArrowLeft": () =>
        dispatch(({ queue }) => {
          const nextPos = queue.position - 1;

          return {
            queue: {
              ...queue,
              position: nextPos < 0 ? queue.songIds.length - 1 : nextPos,
            },
          };
        }),
    };

    const trigger = (e: KeyboardEvent) => {
      let key = e.key;
      if (e.ctrlKey) {
        key = `ctrl+${key}`;
      }
      // @ts-expect-error
      const triggeredHotkey = hotkeys[key]
      if (triggeredHotkey) {
        e.preventDefault();
        triggeredHotkey();
      }
    };

    document.addEventListener("keydown", trigger);
    return () => {
      document.removeEventListener("keydown", trigger);
    };
  }, [prevVolume, audio]);
};

export default useHotkeys;
