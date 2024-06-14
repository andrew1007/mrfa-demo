import React, { memo } from "react";
import { useGetCurrentSong } from "src/Enterprise/store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

type CurrentSongProps = {
  song: ReturnType<typeof useGetCurrentSong>
}

export const CurrentSong = (props: CurrentSongProps) => {
  const { artist, title } = props.song;
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
  )
}

const _CurrentSong = () => {
  const song = useGetCurrentSong()
  return <CurrentSong song={song} />
};

export default memo(_CurrentSong)
