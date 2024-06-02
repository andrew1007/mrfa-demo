import { SubState } from "../../store/types";
import { useGetSong } from "../../store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { useSelector } from "../../store";
import { memo } from "react";
import PlayIcon from "./PlayIcon";
import usePlayerActions from "src/Enterprise/store/usePlayerActions";

type SongProps = {
  id: SubState["Playlist"]["songs"][0];
};

const Song = (props: SongProps) => {
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

  return (
    <>
      <div className="song-root" onDoubleClick={play}>
        <PlayIcon songId={props.id} />
        <div className="song-title">{title}</div>
        <div className="song-artist">
          {artist}
        </div>
        <div className="song-duration">{durationLabel}</div>
      </div>
      <HeavyUselessUI />
    </>
  );
};

export default memo(Song)
