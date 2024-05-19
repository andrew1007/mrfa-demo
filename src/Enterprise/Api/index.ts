import { SubState } from "../state/types";
import mockPlaylists, { mockRecentPlaylists } from "./mockPlaylists";
import mockSongs from "./mockSongs";

function makeApiMock<res, args>(cb: (...args: args[]) => res) {
  return (...args: args[]) => Promise.resolve(cb(...args));
}

export const fetchPlaylistByUser = makeApiMock((userId: number) => ({
  data: mockPlaylists,
}));

export const fetchSongs = makeApiMock((songIds: number[]) => ({
  data: songIds.map(
    (id) => mockSongs.find((song) => song.id === id) as SubState["Song"]
  ),
}));

type loginParams = {
  userName: string;
  password: string;
};
export const login = makeApiMock(({ userName, password }: loginParams) => ({
  data: {
    publicId: 10,
    token: "a8fgsdfgasdflxvbcnjlxhusdf847419ae",
    userName: "Andrew",
  },
}));

export const fetchRecentPlaylists = makeApiMock((userId: number) => ({
  data: mockRecentPlaylists,
}));
