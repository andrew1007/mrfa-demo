import { SubState } from "../../store/types";
import { useGetSong } from "../../store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { useSelector } from "../../store";
import React, { MouseEventHandler, memo } from "react";
import PlayIcon from "./PlayIcon";
import usePlayerActions from "src/Enterprise/store/usePlayerActions";

type SongProps = {
  children: React.ReactNode // PlayIcon
  onDoubleClick: MouseEventHandler<HTMLDivElement>;
  title: string;
  artist: string;
  durationLabel: string;
};

export const Song = (props: SongProps) => {
  const { children, artist, durationLabel, onDoubleClick, title } = props

  return (
    <>
      <div className="song-root" onDoubleClick={onDoubleClick}>
        {children}
        <div className="song-title">{title}</div>
        <div className="song-artist">
          {artist}
        </div>
        <div className="song-duration">{durationLabel}</div>
      </div>
      <HeavyUselessUI />
    </>
  );
}

type _SongProps = {
  id: SubState["Playlist"]["songs"][0];
};

const _Song = (props: _SongProps) => {
  const song = useGetSong(props.id)
  const { setCurrentSong } = usePlayerActions();
  const playlistId = useSelector(state => state.focusedId);
  const { title, durationLabel, artist } = song;

  const play = () => {
    setCurrentSong({
      songId: song.id,
      playlistId
    })
  }

  return <Song
    onDoubleClick={play}
    title={title}
    artist={artist}
    durationLabel={durationLabel}
  >
    <PlayIcon songId={props.id} />
  </Song>
};

export default memo(_Song)
