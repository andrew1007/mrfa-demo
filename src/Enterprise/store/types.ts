export enum Route {
  playlist = "playlist",
  artist = "artist",
}

export enum PlayState {
  playing = "playing",
  paused = "paused",
  idle = "idle",
}

type Playlist = {
  title: string;
  userName: string;
  songs: number[];
  id: number;
};

type Song = {
  id: number;
  duration: number;
  title: string;
  source: string;
  artist: string;
  artistId: number;
};

export type SubState = {
  Playlist: Playlist;
  Song: Song;
};

export type State = {
  user: {
    userId: number;
    userName: string;
  };
  playlistIds: number[];
  playlists: Record<number, SubState["Playlist"]>;
  songs: Record<number, SubState["Song"]>;
  focusedId: number;
  search: {
    playlist: string;
    song: string;
  };
  currentRoute: keyof typeof Route;
  dashboard: {
    currentDuration: number;
    totalDuration: number;
    playState: keyof typeof PlayState;
    volume: number;
  };
  queue: {
    position: number;
    songIds: number[];
    playlistId: number;
  };
  performance: {
    slowdown: number,
    algorithmSlowdown: number;
  }
};
