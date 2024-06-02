import React from "react";
import { useSelector } from "../store";
import { State } from "../store/types";
import NavFooter from "./NavFooter";
import Playlist from "./Playlist";
import HeavyUselessUI from "./Shared/HeavyUselessUI";
import Sidebar from "./Sidebar";
import PerformanceBar from "./PerformanceBar";

const Routes: Record<State["currentRoute"], React.FC<any>> = {
  playlist: Playlist,
  artist: () => null,
};

const App = () => {
  const currentRoute = useSelector(state => state.currentRoute)
  const Route = Routes[currentRoute];

  return (
    <>
      <HeavyUselessUI />
      <div className="app-container">
        <div className="main-container">
          <Sidebar />
          <div className="route-container">
            <Route />
          </div>
          <PerformanceBar />
        </div>
        <NavFooter />
      </div>
    </>
  );
};

export default App
