import { memo } from "react";
import HeavyUselessUI from "../App/Shared/HeavyUselessUI";
import { State } from "../store";
import { PlaylistEntry } from "../App/Sidebar/PlaylistEntry";

type SidebarProps = {
  userName: string;
  count: number;
  onPlaylistSearch: (text: string) => void;
  playlistSearchText: string;
  playlists: State['playlists'][0][]
  focusedId: number
  onPlaylistClick: (id: number) => void;
}

const Sidebar = (props: SidebarProps) => {
  const {
    count,
    userName,
    onPlaylistSearch,
    playlistSearchText,
    playlists,
    focusedId,
    onPlaylistClick,
  } = props

  return (
    <div>
      <HeavyUselessUI />
      <div>
        {userName}'s playlists ({count})
      </div>
      <input
        value={playlistSearchText}
        onChange={(e) => onPlaylistSearch(e.currentTarget.value)}
        placeholder="search playlists"
      />
      <HeavyUselessUI />
      {playlists.map(playlist => {
        return <PlaylistEntry
          count={playlist.songs.length}
          isFocused={focusedId === playlist.id}
          onClick={() => onPlaylistClick(playlist.id)}
          title={playlist.title}
          key={playlist.id}
        />
      })}
    </div>
  );
};

export default memo(Sidebar);
