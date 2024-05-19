import React from "react";
import { applyState } from "../state";
import { State } from "../state/types";
import Dashboard from "./Dashboard";
import Login from "./Login";
import NavBar from "./NavBar";
import NavFooter from "./NavFooter";
import Playlist from "./Playlist";
import HeavyUselessUI from "./Shared/HeavyUselessUI";
import Sidebar from "./Sidebar";

const Routes: Record<State["currentRoute"], React.FC<any>> = {
  dashboard: Dashboard,
  login: Login,
  playlist: Playlist,
  artist: () => null,
};

type NoParentProps = Record<string, never>;
type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<NoParentProps & StateProps>;

const App: Component = (props) => {
  const Route = Routes[props.currentRoute];

  return (
    <div>
      <HeavyUselessUI />
      <NavBar />
      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />
        <div className="route-container">
          <Route />
        </div>
      </div>
      <NavFooter />
    </div>
  );
};

const mappedState = () => (state: State) => ({
  currentRoute: state.currentRoute,
});

export default applyState(mappedState)(App);
