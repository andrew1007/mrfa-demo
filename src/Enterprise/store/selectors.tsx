import { useMemo } from "react";
import { createSelector, useSelector } from ".";
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

export const getShouldMissCache = (state: State) => state.performance.cacheMiss ? Math.random() : 0

const getPlaylistText = (state: State) => state.search.playlist;
type PlaylistText = ReturnType<typeof getPlaylistText>;

const getSongText = (state: State) => state.search.song;
type SongText = ReturnType<typeof getSongText>;
const getPlaylists = (state: State) => state.playlists;
type Playlists = ReturnType<typeof getPlaylists>;

const getPlaylistIds = (state: State) => state.playlistIds;
type PlaylistIds = ReturnType<typeof getPlaylistIds>;

const getFocusedId = (state: State) => state.focusedId;
type FocusedPlaylist = ReturnType<typeof getFocusedId>;
const getSongs = (state: State) => state.songs;
type Songs = ReturnType<typeof getSongs>;

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

const getQueue = (state: State) => state.queue;
type Queue = ReturnType<typeof getQueue>;

const getPlaylistSongIds = createSelector(
  [getPlaylists, getFocusedId, getShouldMissCache],
  (playlists: Playlists, focusedId: FocusedPlaylist) => {
    return playlists[focusedId]?.songs ?? EMPTY_ARR;
  }
);
type PlaylistSongIds = ReturnType<typeof getPlaylistSongIds>;

export const getSearchedPlaylistIds = createSelector(
  [getPlaylistText, getPlaylists, getPlaylistIds, getShouldMissCache],
  (searchText: PlaylistText, playlists: Playlists, ids: PlaylistIds) => {
    if (!searchText) return ids;

    const filtered = ids.filter((id) =>
      playlists[id]?.title.toLowerCase().includes(searchText.toLowerCase())
    );
    return filtered.length > 0 ? filtered : EMPTY_ARR;
  }
);

export const useGetSearchedPlaylistIds = () => {
  return useSelector(getSearchedPlaylistIds);
};
export const getSearchedSongIds = createSelector(
  [getSongText, getSongs, getPlaylistSongIds, getShouldMissCache],
  (searchText: SongText, songs: Songs, songIds: PlaylistSongIds) => {
    if (!searchText) return songIds;
    const text = searchText.toLowerCase()
    const filtered = songIds.filter((id) =>
      songs[id]?.title.toLowerCase().includes(text) || songs[id]?.artist.toLowerCase().includes(text)
    );

    return filtered.length > 0 ? filtered : EMPTY_ARR as typeof filtered;
  }
);

export const useGetSearchedSongIds = () => useSelector(getSearchedSongIds);

const makeGetStateSong = (id: number) => (state: State) =>
  state.songs[id] ?? defaultSong;

const makeGetSong = (id: number) =>
  createSelector([makeGetStateSong(id), getShouldMissCache], (song: StateSong) => {
    const { duration } = song;
    const minutes = Math.floor(duration / 60);
    const seconds = `0${duration - minutes * 60}`.slice(-2);
    return {
      ...song,
      durationLabel: `${minutes}:${seconds}`,
    };
  });

export const useGetSong = (id: number) => {
  const getSong = useMemo(() => makeGetSong(id), [id]);
  return useSelector(getSong);
};

const getSearchSongQueueIds = createSelector(
  [getQueueText, getSongs, getSongQueueIds, getShouldMissCache],
  (searchText: QueueText, songs: Songs, songQueueIds: SongQueueIds) => {
    if (!searchText) return songQueueIds;

    const filtered = songQueueIds.filter((id) =>
      songs[id]?.title.includes(searchText)
    );

    return filtered.length > 0 ? filtered : EMPTY_ARR as typeof filtered;
  }
);

export const useGetSearchSongQueueIds = () =>
  useSelector(getSearchSongQueueIds);

export const getCurrentSong = createSelector(
  [getQueue, getSongs, getShouldMissCache],
  (queue: Queue, songs: Songs) => {
    const { position, songIds } = queue;
    return songs[songIds[position]] ?? defaultSong;
  }
);

export const useGetCurrentSong = () => useSelector(getCurrentSong);

const makeGetIsCurrentSong = (id: number) => createSelector(
  [getCurrentSong, getShouldMissCache, getShouldMissCache], (currentSong: ReturnType<typeof getCurrentSong>) => {
    return currentSong.id === id
  }
)

export const useGetIsFocusedSong = (id: number) => {
  const getIsCurrentSong = useMemo(() => makeGetIsCurrentSong(id), [id])
  return useSelector(getIsCurrentSong);
}

const makeGetIsPlaying = (id: number) =>
  createSelector(
    [getCurrentSong, getPlayState, getShouldMissCache],
    (song: SubState["Song"], playState: CurrentPlayState) => {
      const isCurrentSong = song.id === id;
      return playState === PlayState.playing && isCurrentSong;
    }
  );

export const useGetIsPlaying = (id: number) => {
  const getIsPlaying = useMemo(() => makeGetIsPlaying(id), [id]);
  return useSelector(getIsPlaying);
};

export const useGetRerenderForceIfFlagged = () => {
  const slowdown = useSelector((state) => state.performance.slowdown)
  const iterations = slowdown * 10000
  useSelector(getShouldMissCache)
  for (let i = 0; i < iterations; i++) {
    <div />
  }
}