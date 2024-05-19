import React, { useState } from "react";
import { applyState, State } from "../../state";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import Playlists from "./Playlists";
import Queue from "./Queue";

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

type Tabs = "playlist" | "queue";
const Sidebar: Component = (props) => {
  const { userName, playlistCount } = props;
  const [tab, setTab] = useState<Tabs>("playlist");

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

const mappedState = () => (state: State) => ({
  userName: state.user.userName,
  playlistCount: state.playlistIds.length,
});

export default applyState(mappedState)(Sidebar);
