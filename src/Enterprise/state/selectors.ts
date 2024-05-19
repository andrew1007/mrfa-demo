import { createSelector } from ".";
import { PlayState, State, SubState } from "./types";

const defaultSong: SubState["Song"] = {
  artist: "",
  artistId: 0,
  duration: 0,
  id: 0,
  source: "",
  title: "",
};

export const defaultPlaylist: SubState["Playlist"] = {
  id: 0,
  songs: [],
  title: "",
  userName: "",
};

const EMPTY_ARR: any[] = [];

const getPlaylistText = (state: State) => state.search.playlist;
type PlaylistText = ReturnType<typeof getPlaylistText>;

const getRecentPlaylistText = (state: State) => state.search.recentPlaylists;
type RecentPlaylistText = ReturnType<typeof getRecentPlaylistText>;

const getSongText = (state: State) => state.search.song;
type SongText = ReturnType<typeof getSongText>;

const getPlaylists = (state: State) => state.playlists;
type Playlists = ReturnType<typeof getPlaylists>;

const getPlaylistIds = (state: State) => state.playlistIds;
type PlaylistIds = ReturnType<typeof getPlaylistIds>;

const getRecentPlaylistIds = (state: State) => state.recentPlaylistIds;
type RecentPlaylistIds = ReturnType<typeof getRecentPlaylistIds>;

const getSongs = (state: State) => state.songs;
type Songs = ReturnType<typeof getSongs>;

const getFocusedId = (state: State) => state.focusedId;
type FocusedPlaylist = ReturnType<typeof getFocusedId>;

const getPlayState = (state: State) => state.dashboard.playState;
type CurrentPlayState = ReturnType<typeof getPlayState>;

type songOwnProps = {
  id: SubState["Playlist"]["songs"][0];
};
const getStateSong = (state: State, ownProps: songOwnProps) =>
  state.songs[ownProps.id] ?? defaultSong;
type StateSong = ReturnType<typeof getStateSong>;

const getQueueText = (state: State) => state.search.queue;
type QueueText = ReturnType<typeof getQueueText>;

const getSongQueueIds = (state: State) => state.queue.songIds;
type SongQueueIds = ReturnType<typeof getSongQueueIds>;

const getPlaylistSongIds = createSelector(
  [getPlaylists, getFocusedId],
  (playlists: Playlists, focusedId: FocusedPlaylist) => {
    return playlists[focusedId]?.songs ?? EMPTY_ARR;
  }
);
type PlaylistSongIds = ReturnType<typeof getPlaylistSongIds>;

export const getSearchedPlaylistIds = createSelector(
  [getPlaylistText, getPlaylists, getPlaylistIds],
  (searchText: PlaylistText, playlists: Playlists, ids: PlaylistIds) => {
    if (!searchText) return ids;

    const filtered = ids.filter((id) =>
      playlists[id]?.title.includes(searchText)
    );
    return filtered.length > 0 ? filtered : EMPTY_ARR;
  }
);

export const getSearchedRecentPlaylistIds = createSelector(
  [getRecentPlaylistText, getPlaylists, getRecentPlaylistIds],
  (
    searchText: RecentPlaylistText,
    playlists: Playlists,
    ids: RecentPlaylistIds
  ) => {
    if (!searchText) return ids;

    const filtered = ids.filter((id) =>
      playlists[id]?.title.includes(searchText)
    );

    return filtered.length > 0 ? filtered : EMPTY_ARR;
  }
);

export const getSearchedSongIds = createSelector(
  [getSongText, getSongs, getPlaylistSongIds],
  (searchText: SongText, songs: Songs, songIds: PlaylistSongIds) => {
    if (!searchText) return songIds;

    const filtered = songIds.filter((id) =>
      songs[id]?.title.includes(searchText)
    );

    return filtered.length > 0 ? filtered : EMPTY_ARR;
  }
);

export const makeGetSong = () =>
  createSelector([getStateSong], (song: StateSong) => {
    const { duration } = song;
    const minutes = Math.floor(duration / 60);
    const seconds = `0${duration - minutes * 60}`.slice(-2);
    return {
      ...song,
      durationLabel: `${minutes}:${seconds}`,
    };
  });

export const getSearchSongQueueIds = createSelector(
  [getQueueText, getSongs, getSongQueueIds],
  (searchText: QueueText, songs: Songs, songQueueIds: SongQueueIds) => {
    if (!searchText) return songQueueIds;

    const filtered = songQueueIds.filter((id) =>
      songs[id]?.title.includes(searchText)
    );

    return filtered.length > 0 ? filtered : EMPTY_ARR;
  }
);

export const getCurrentSong = (state: State) => {
  const { queue, songs } = state;
  const { position, songIds } = queue;

  return songs[songIds[position]] ?? defaultSong;
};

type playingOwnProps = {
  id: number;
};

const getId = (_: State, ownProps: playingOwnProps) => ownProps.id;

export const makeGetIsPlaying = () =>
  createSelector(
    [getCurrentSong, getPlayState, getId],
    (song: SubState["Song"], playState: CurrentPlayState, id: number) => {
      const isCurrentSong = song.id === id;
      return playState === PlayState.playing && isCurrentSong;
    }
  );
