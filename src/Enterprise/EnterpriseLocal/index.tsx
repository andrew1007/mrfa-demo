import { useEffect, useState } from "react"
import { PlayState, State } from "../store/types"
import { fetchPlaylistByUser, fetchSongs } from "../Api"
import Sidebar from "./Sidebar"
import Playlist from "./Playlist"
import HeavyUselessUI from "../App/Shared/HeavyUselessUI"
import NavFooter from "../App/NavFooter"
import Footer from "./Footer"

const EnterpriseLocal = () => {
  const [playState, setPlayState] = useState(PlayState.idle)
  const [playlists, setPlaylists] = useState<State['playlists'][0][]>([])
  const [songs, setSongs] = useState<State['songs']>({})
  const [playlistSearchText, setPlaylistSearchText] = useState('')
  const [songSearchText, setSongSearchText] = useState('')
  const [currentPlaylistId, setCurrentPlaylistId] = useState<number>(-1)
  const [currentSongId, setCurrentSongId] = useState<number>(-1)
  const [userName] = useState('Andrew')
  const [volume, setVolume] = useState(0)

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
    const { idle, paused, playing } = PlayState
    setPlayState(prev => [paused, idle].includes(prev) ? playing : paused)
  }

  const getCurrentPlaylist = () => {
    const zeroState: State['playlists'][0] = {
      id: 0,
      songs: [],
      title: '',
      userName: ''
    }
    return playlists.find(({ id }) => id === currentPlaylistId) ?? zeroState
  }

  const getCurrentSong = () => {
    const zeroState: State['songs'][0] = {
      artist: '',
      artistId: 0,
      duration: 0,
      id: 0,
      source: '',
      title: ''
    }
    return songs[currentSongId] ?? zeroState
  }

  const parsedSongs = () => {
    return getCurrentPlaylist().songs
      .map(id => songs[id])
      .filter(Boolean)
      .map(
        song => {
          const visible = [song.artist, song.title].some(text => {
            return text.toLocaleLowerCase().includes(songSearchText.toLocaleLowerCase())
          })
          return {
            song,
            visible
          }
        }
      )
  }

  const handlePlayStatusChange = () => {

  }

  const handleVolumeChange = () => {

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
              playlist={getCurrentPlaylist()}
              songSearchText={songSearchText}
              songs={parsedSongs()}
            />
          </div>
        </div>
        <Footer
          currentDuration={10}
          onPlayStatusChange={handlePlayStatusChange}
          onVolumeChange={handleVolumeChange}
          playState={playState}
          song={getCurrentSong()}
          volume={volume}
        />
      </div>
    </div>
  )
}

export default EnterpriseLocal
