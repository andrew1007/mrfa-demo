import React, { memo } from "react";
import { useGetCurrentSong } from "src/Enterprise/state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

const CurrentSong = () => {
  const song = useGetCurrentSong()
  const { artist, title } = song;
  return (
    <div>
      <HeavyUselessUI />
      {title && (
        <>
          Now Playing:
          {title}-{artist}
        </>
      )}
    </div>
  );
};

export default memo(CurrentSong)
