import makeProvider from "src/library/makeProvider";
import { Route, State } from "./types";

export const initialState: State = {
  user: {
    userId: 0,
    userName: "",
  },
  playlistIds: [],
  playlists: {},
  songs: {},
  focusedId: 0,
  recentPlaylistIds: [],
  search: {
    playlist: "",
    recentPlaylists: "",
    song: "",
    queue: "",
  },
  currentRoute: Route.playlist,
  dashboard: {
    currentDuration: 0,
    totalDuration: 0,
    playState: "idle",
    volume: 5,
  },
  queue: {
    playlistId: 0,
    position: 0,
    songIds: [],
  },
  performance: {
    cacheMiss: false,
    slowdown: 1,
  }
};

export type { State };

export const { Provider, applyState, createSelector, useDispatch, useSelector } =
  makeProvider(initialState);
