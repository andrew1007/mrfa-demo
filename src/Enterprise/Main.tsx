import React, { useEffect } from "react";
import App from "./App";
import useAudioPlayer from "./hooks/useAudioPlayer";
import { applyState, State, useDispatch } from "./state";
import { getCurrentSong } from "./state/selectors";
import { Route } from "./state/types";
import useAppInitActions from "./state/useAppInitActions";

type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type NoProps = Record<string, never>;
type MainComponent = React.FunctionComponent<NoProps & StateProps>;

const MainHOC = (Component: React.FC<any>) => {
  const MemoedComponent = React.memo(Component);
  const Main: MainComponent = (props) => {
    const dispatch = useDispatch();

    const { initDashboard, initPlaylistSongs, initUserPlaylists } =
      useAppInitActions();

    const { userId, songIds, playState, volume, currentDuration, source } =
      props;

    useAudioPlayer({
      playState,
      volume,
      src: source,
      currentDuration,
    });

    const init = () => {
      dispatch(() => ({
        currentRoute: Route.login,
      }));
    };

    useEffect(() => {
      init();
    }, []);

    useEffect(() => {
      if (userId) {
        initDashboard(userId);
        initUserPlaylists(userId);
      }
    }, [userId]);

    useEffect(() => {
      if (songIds.length > 0) {
        initPlaylistSongs(songIds);
      }
    }, [songIds]);

    return <MemoedComponent />;
  };
  return Main;
};

const EMPTY: any[] = [];

const mappedState = () => (state: State) => ({
  userId: state.user.userId,
  songIds: state.playlists[state.focusedId]?.songs ?? EMPTY,
  source: getCurrentSong(state)?.source,
  volume: state.dashboard.volume,
  playState: state.dashboard.playState,
  currentDuration: state.dashboard.currentDuration,
});

export default applyState(mappedState)(MainHOC(App));
