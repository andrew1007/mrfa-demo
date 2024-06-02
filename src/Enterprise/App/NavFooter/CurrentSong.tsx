import React, { memo } from "react";
import { useGetCurrentSong } from "src/Enterprise/store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

const CurrentSong = () => {
  const song = useGetCurrentSong()
  const { artist, title } = song;
  return (
    <div>
      <HeavyUselessUI />
      <div>
        Now Playing:
      </div>
      <div>
        {title ? `${title}-${artist}` : '--'}
      </div>
    </div>
  );
};

export default memo(CurrentSong)
