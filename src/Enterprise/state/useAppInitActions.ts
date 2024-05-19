import { useDispatch } from ".";
import { fetchPlaylistByUser, fetchRecentPlaylists, fetchSongs } from "../Api";

const useAppInitActions = () => {
  const dispatch = useDispatch();

  const initDashboard = async (userId: number) => {
    const { data } = await fetchRecentPlaylists(userId);
    const ids = data.map((playlist) => playlist.id);
    const nextPlaylists = Object.fromEntries(
      data.map((playlist) => [playlist.id, playlist])
    );

    dispatch(({ playlists }) => ({
      recentPlaylistIds: ids,
      playlists: {
        ...playlists,
        ...nextPlaylists,
      },
    }));
  };

  const initUserPlaylists = async (userId: number) => {
    const { data } = await fetchPlaylistByUser(userId);
    const ids = data.map((playlist) => playlist.id);
    const nextPlaylists = Object.fromEntries(
      data.map((playlist) => [playlist.id, playlist])
    );
    dispatch(({ playlists }) => ({
      playlistIds: ids,
      playlists: {
        ...playlists,
        ...nextPlaylists,
      },
    }));
  };

  const initPlaylistSongs = async (songIds: number[]) => {
    const { data } = await fetchSongs(songIds);
    const nextSongs = Object.fromEntries(data.map((song) => [song.id, song]));
    dispatch(({ songs }) => ({
      songs: {
        ...songs,
        ...nextSongs,
      },
    }));
  };

  return {
    initDashboard,
    initUserPlaylists,
    initPlaylistSongs,
  };
};

export default useAppInitActions;
