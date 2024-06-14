import { useEffect, useState } from "react"
import { PlayState, State } from "../store/types"
import { fetchPlaylistByUser, fetchSongs } from "../Api"

const EnterpriseLocal = () => {
    const [playState, setPlayState] = useState(PlayState.paused)
    const [playlists, setPlaylists] = useState<State['playlists'][0][]>([])
    const [songs, setSongs] = useState<State['songs']>({})
    const [playlistSearchText, setPlaylistSearchText] = useState('')
    const [songSearchText, setSongSearchText] = useState('')
    const [currentPlaylistId, setCurrentPlaylistId] = useState<null | number>(null)

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

    
}