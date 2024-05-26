import { Route, SubState } from "../../state/types";
import { useGetSong } from "../../state/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { useDispatch } from "../../state";
import { memo } from "react";
import PlayIcon from "./PlayIcon";

type SongProps = {
  id: SubState["Playlist"]["songs"][0];
};

const Song = (props: SongProps) => {
  const dispatch = useDispatch();
  const song = useGetSong(props.id)

  const { title, durationLabel, artist, artistId } = song;

  const routeToArtist = () =>
    dispatch(() => ({
      currentRoute: Route.artist,
      focusedId: artistId,
    }));

  return (
    <div className="song-root">
      <HeavyUselessUI />
      <PlayIcon songId={props.id} />
      <div className="song-title">{title}</div>
      <div className="song-artist" onClick={routeToArtist}>
        {artist}
      </div>
      <div className="song-duration">{durationLabel}</div>
    </div>
  );
};

export default memo(Song)
