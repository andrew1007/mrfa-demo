import { PlayStatusChanger } from "../App/NavFooter/PlayStatusChanger";
import { secondsToSongDuration, SongProgress } from "../App/NavFooter/SongProgress";
import { VolumeSlider } from "../App/NavFooter/VolumeSlider";
import HeavyUselessUI from "../App/Shared/HeavyUselessUI";
import type { useGetCurrentSong } from "../store/selectors";
import { PlayState } from "../store/types";

type FooterProps = {
  song: ReturnType<typeof useGetCurrentSong>
  playState: PlayState
  onPlayStatusChange: (nextPlayState: PlayState) => void;
  currentDuration: number;
  onVolumeChange: (nextVol: number) => void;
  volume: number
  totalDuration: number;
  onSongProgressChange: (nextProgress: number) => void;
}

const Footer = (props: FooterProps) => {
  const {
    song,
    playState,
    onSongProgressChange,
    onPlayStatusChange,
    currentDuration,
    totalDuration,
    onVolumeChange,
    volume
    
  } = props
  const { artist, title, duration } = song

  const handleSongProgressUpdate = (e: any) => {
    const newProgress = Number(e.target.value);
    onSongProgressChange(newProgress)
  }

  const handleVolumeChange = (nextVol: number) => {
    onVolumeChange(nextVol)
  }

  return (
    <>
      <HeavyUselessUI />
      <div className="nav-footer-container" >
        <div>
          <HeavyUselessUI />
          <div>
            Now Playing:
          </div>
          <div>
            {title ? `${title}-${artist}` : '--'}
          </div>
        </div>
        <div>
          <PlayStatusChanger
            onClick={() => onPlayStatusChange(
              playState === PlayState.paused ? PlayState.playing : PlayState.paused
            )}
            status={playState}
          />
          <SongProgress
            total={secondsToSongDuration(duration)}
            current={secondsToSongDuration(currentDuration)}
            onChange={handleSongProgressUpdate}
            totalDuration={totalDuration}
            currentDuration={currentDuration}
          />
        </div>
        <VolumeSlider
          onChange={handleVolumeChange}
          value={volume}
        />
      </div>

    </>
  )
};

export default Footer;