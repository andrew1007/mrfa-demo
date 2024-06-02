import { Route, SubState } from "../../store/types";
import { useMissedCacheGetSong } from "../../store/selectors";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { useDispatch } from "../../store";
import { memo } from "react";
import PlayIcon from "./PlayIcon";

type SongProps = {
  id: SubState["Playlist"]["songs"][0];
};

const CacheMissSong = (props: SongProps) => {
  const dispatch = useDispatch();
  const song = useMissedCacheGetSong(props.id)

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

export default memo(CacheMissSong)
