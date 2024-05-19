import { useGetSearchedSongIds } from "src/Enterprise/state/selectors";
import Song from "./Song";
import HeavyUselessUI from "../Shared/HeavyUselessUI";

const Songs = () => {
  const ids = useGetSearchedSongIds()

  return (
    <div className="songs-root">
      <HeavyUselessUI />
      {ids.map((id) => (
        <Song id={id} key={id} />
      ))}
    </div>
  );
};

export default Songs
