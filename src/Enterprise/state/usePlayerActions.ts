import { useDispatch } from ".";
import { PlayState } from "./types";

const { paused, playing } = PlayState;

type CurrentSongParams = {
  playlistId?: number;
  songId: number;
};

const usePlayerActions = () => {
  const dispatch = useDispatch();

  const togglePlayState = () => {
    dispatch(({ dashboard }) => {
      const isPaused = dashboard.playState === PlayState.paused;
      return {
        dashboard: {
          ...dashboard,
          playState: isPaused ? playing : paused,
        },
      };
    });
  };

  const setCurrentSong = (params: CurrentSongParams) => {
    dispatch((prevState) => {
      const { playlists, queue, dashboard, focusedId } = prevState;

      const { playlistId = focusedId, songId } = params;

      const playlistSongIds = playlists[playlistId].songs;
      const newPlaylist = playlistId !== queue.playlistId;
      const position = playlistSongIds.findIndex((id) => id === songId);

      return {
        queue: {
          ...queue,
          songIds: newPlaylist ? playlistSongIds : queue.songIds,
          position,
          playlistId,
        },
        dashboard: {
          ...dashboard,
          playState: PlayState.playing,
        },
      };
    });
  };

  return {
    togglePlayState,
    setCurrentSong,
  };
};

export default usePlayerActions;
