import React from "react";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import CurrentSong from "./CurrentSong";
import PlayStatusChanger from "./PlayStatusChanger";
import SongProgress from "./SongProgress";
import VolumeSlider from "./VolumeSlider";

type NoParentProps = Record<string, never>;
type Component = React.FunctionComponent<NoParentProps>;

const NavFooter: Component = () => {
  return (
    <>
      <HeavyUselessUI />
      <div className="nav-footer-container" >
        <CurrentSong />
        <div>
          <PlayStatusChanger />
          <SongProgress />
        </div>
        <VolumeSlider />
      </div>
    </>
  );
};

export default React.memo(NavFooter);
