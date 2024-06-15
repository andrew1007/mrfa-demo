import { ChangeEventHandler, useEffect, useRef } from "react";
import { PlayStateIcon } from "../App/NavFooter/PlayStatusChanger";
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
  onVolumeChange: ChangeEventHandler<HTMLInputElement>;
  volume: number
}

const Footer = (props: FooterProps) => {
  const progressRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const { song, playState, onPlayStatusChange, currentDuration, onVolumeChange, volume } = props
  const { artist, title, duration } = song

  useEffect(() => {
    progressRef.current.value = `${currentDuration}`;
  }, [currentDuration]);

  const Icon = PlayStateIcon[playState]

  const handleSongProgressUpdate = () => { }

  const handleVolumeChange = () => {
    onVolumeChange
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
          <div onClick={() => onPlayStatusChange(
            playState === PlayState.paused ? PlayState.playing : PlayState.paused
          )}>
            <HeavyUselessUI />
            <Icon className="play-state-change-icon" />
          </div>
          <SongProgress
            total={secondsToSongDuration(duration)}
            current={secondsToSongDuration(10)}
            onChange={handleSongProgressUpdate}
            totalDuration={duration}
            ref={progressRef}
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