import React from "react";
import { useSelector } from "../state";
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

const App = () => {
  const currentRoute = useSelector(state => state.currentRoute)
  const Route = Routes[currentRoute];

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

export default App
