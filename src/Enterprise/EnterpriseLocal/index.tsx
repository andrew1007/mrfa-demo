import { useEffect, useState } from "react"
import { PlayState, State } from "../store/types"
import { fetchPlaylistByUser, fetchSongs } from "../Api"
import Sidebar from "./Sidebar"
import Playlist from "./Playlist"
import HeavyUselessUI from "../App/Shared/HeavyUselessUI"
import NavFooter from "../App/NavFooter"
import Credit from "../App/Credit"

const EnterpriseLocal = () => {
  const [playState, setPlayState] = useState(PlayState.paused)
  const [playlists, setPlaylists] = useState<State['playlists'][0][]>([])
  const [songs, setSongs] = useState<State['songs']>({})
  const [playlistSearchText, setPlaylistSearchText] = useState('')
  const [songSearchText, setSongSearchText] = useState('')
  const [currentPlaylistId, setCurrentPlaylistId] = useState<number>(-1)
  const [currentSongId, setCurrentSongId] = useState<number>(-1)
  const [userName, setUserName] = useState('')

  const fetchPlaylists = async () => {
    const { data } = await fetchPlaylistByUser(10);
    setPlaylists(data)
    setCurrentPlaylistId(data[0].id)
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchSongsByIds = async (songIds: number[]) => {
    const { data } = await fetchSongs(songIds);
    const songs = Object.fromEntries(data.map((song) => [song.id, song]));
    setSongs(songs)
  }

  useEffect(() => {
    const currentPlaylist = playlists.find(({ id }) => id === currentPlaylistId)
    fetchSongsByIds(currentPlaylist?.songs ?? [])
  }, [currentPlaylistId])

  const handleSongChange = (id: number) => {
    setCurrentSongId(id)
  }

  const handleSongSearch = (text: string) => {
    setSongSearchText(text)
  }

  const handleSongToggle = () => {
    
  }

  const parsedSongs = () => {
    return []
  }

  return (
    <div>
      <HeavyUselessUI />
      <div className="app-container">
        <div className="main-container">
          <Sidebar
            count={playlists.length}
            focusedId={currentPlaylistId}
            onPlaylistClick={(id) => setCurrentPlaylistId(id)}
            onPlaylistSearch={(text) => setPlaylistSearchText(text)}
            playlistSearchText={playlistSearchText}
            playlists={playlists}
            userName={userName}
          />
          <div className="route-container">
            <Playlist
              focusedSongId={currentSongId}
              onSongChange={handleSongChange}
              onSongSearch={handleSongSearch}
              onSongToggle={handleSongToggle}
              playState={playState}
              playlist={playlists.find(({ id }) => id === currentPlaylistId) as State['playlists'][0]}
              songSearchText={songSearchText}
              songs={parsedSongs()}
            />
          </div>
        </div>
        <NavFooter />
      </div>
      <Credit />
    </div>
  )
}

export default EnterpriseLocal
