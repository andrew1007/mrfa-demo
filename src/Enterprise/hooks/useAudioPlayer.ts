import { useEffect, useMemo, useState } from "react";
import { PlayState } from "src/Enterprise/store/types";
import { useDispatch, useSelector } from "../store";
import { useGetCurrentSong } from "../store/selectors";
import useBaseAudioPlayer from "./useBaseAudioPlayer";

const useAudioPlayer = () => {
  const { source: src } = useGetCurrentSong();
  const volume = useSelector((state) => state.dashboard.volume);
  const playState = useSelector((state) => state.dashboard.playState);
  const currentDuration = useSelector(
    (state) => state.dashboard.currentDuration
  );

  const dispatch = useDispatch();

  useBaseAudioPlayer({
    currentDuration,
    onDurationChange: ({ currentDuration, totalDuration }) => {
      dispatch((prevState) => ({
        dashboard: {
          ...prevState.dashboard,
          currentDuration,
          totalDuration: Math.floor(totalDuration),
        },
      }));
    },
    playState,
    src,
    volume,
  });
};

export default useAudioPlayer;
