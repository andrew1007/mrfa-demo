import { PlayIcon } from "../App/Playlist/PlayIcon";
import { PlaylistTitle } from "../App/Playlist/PlaylistTitle";
import { Song } from "../App/Playlist/Song";
import HeavyUselessUI from "../App/Shared/HeavyUselessUI";
import { State } from "../store";
import { PlayState } from "../store/types";

type PlaylistProps = {
  playlist: State['playlists'][0]
  onSongSearch: (text: string) => void
  songSearchText: string
  songs: State['songs'][0][]
  onSongChange: (id: number) => void
  focusedSongId: number;
  playState: PlayState;
  onSongToggle: () => void;
}

const Playlist = (props: PlaylistProps) => {
  const { playlist, onSongSearch, songSearchText, songs, onSongChange, focusedSongId, playState, onSongToggle } = props

  return (
    <div className="playlist-root">
      <PlaylistTitle
        title={playlist.title}
        userName={playlist.userName}
      />
      <div className="playlist-search-container">
        <input
          value={songSearchText}
          onChange={(e) => onSongSearch(e.currentTarget.value)}
          placeholder="search playlists"
        />
      </div>
      <div className="songs-root">
        <HeavyUselessUI />
        {songs.map((song) => {
          const isCurrentSong = focusedSongId === song.id
          return <Song
            key={song.id}
            artist={song.artist}
            durationLabel={''}
            onDoubleClick={() => onSongChange(song.id)}
            title={song.title}
          >
            <PlayIcon
              isCurrentSong={isCurrentSong}
              isPlaying={isCurrentSong && playState === PlayState.playing}
              onClick={onSongToggle}
            />
          </Song>
        })}
      </div>
      <HeavyUselessUI />
    </div>
  );
};

export default Playlist;