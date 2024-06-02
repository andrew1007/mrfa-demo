import { memo } from "react";
import { useSelector } from "../../store";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import Playlists from "./Playlists";

const Sidebar = () => {
  const userName = useSelector(state => state.user.userName);
  const playlistCount = useSelector(state => state.playlistIds.length);

  return (
    <div>
      <HeavyUselessUI />
      <div>
        {userName}'s playlists ({playlistCount})
      </div>
      <Playlists />
    </div>
  );
};

export default memo(Sidebar);
