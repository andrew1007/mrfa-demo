import { Route, SubState } from "../../state/types";
import { useGetIsPlaying, useGetSong } from "../../state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { useDispatch, useSelector } from "../../state";
import usePlayerActions from "src/Enterprise/state/usePlayerActions";
import { memo } from "react";

type SongProps = {
  id: SubState["Playlist"]["songs"][0];
};

const Song = (props: SongProps) => {
  const dispatch = useDispatch();
  const { togglePlayState, setCurrentSong } = usePlayerActions();
  const song = useGetSong(props.id)
  const isPlaying = useGetIsPlaying(props.id);
  const playlistId = useSelector(state => state.focusedId);

  const { title, durationLabel, artist, artistId, id } = song;

  const routeToArtist = () =>
    dispatch(() => ({
      currentRoute: Route.artist,
      focusedId: artistId,
    }));

  const updateSong = () => {
    if (isPlaying) {
      togglePlayState();
    } else {
      setCurrentSong({
        playlistId,
        songId: id,
      });
    }
  };

  return (
    <div className="song-root">
      <HeavyUselessUI />
      <div className="song-icon" onClick={updateSong}>
        <div className={isPlaying ? "pause" : "play"} />
      </div>
      <div className="song-title">{title}</div>
      <div className="song-artist" onClick={routeToArtist}>
        {artist}
      </div>
      <div className="song-duration">{durationLabel}</div>
    </div>
  );
};

export default memo(Song)
