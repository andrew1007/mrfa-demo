import makeProvider from "src/library/makeProvider";
import { Route, State } from "./types";

const initialState: State = {
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
  currentRoute: Route.login,
  dashboard: {
    currentDuration: 0,
    totalDuration: 0,
    playState: "idle",
    volume: 100,
  },
  queue: {
    playlistId: 0,
    position: 0,
    songIds: [],
  },
};

export type { State };

export const { Provider, applyState, createSelector, useDispatch } =
  makeProvider(initialState);
