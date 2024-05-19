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
    <div>
      <HeavyUselessUI />
      <CurrentSong />
      <SongProgress />
      <PlayStatusChanger />
      <VolumeSlider />
    </div>
  );
};

export default React.memo(NavFooter);
