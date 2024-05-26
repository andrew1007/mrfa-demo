import { memo, useState } from "react";
import { useSelector } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import Playlists from "./Playlists";
import Queue from "./Queue";

type Tabs = "playlist" | "queue";
const Sidebar = () => {
  const [tab, setTab] = useState<Tabs>("playlist");
  const userName = useSelector(state => state.user.userName);
  const playlistCount = useSelector(state => state.playlistIds.length);
  const updateTab = (tab: Tabs) => () => setTab(tab);

  return (
    <div>
      <HeavyUselessUI />
      <div>
        {userName}'s playlists ({playlistCount})
      </div>
      <div>
        <div onClick={updateTab("playlist")}>Playlist</div>
        <div onClick={updateTab("queue")}>Queue</div>
      </div>
      {tab === "playlist" && <Playlists />}
      {tab === "queue" && <Queue />}
    </div>
  );
};

export default memo(Sidebar);
