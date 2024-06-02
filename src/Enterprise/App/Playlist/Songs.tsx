import { useGetSearchedSongIds } from "src/Enterprise/store/selectors";
import Song from "./Song";
import HeavyUselessUI from "../Shared/HeavyUselessUI";
import { memo, useState } from "react";
import SongCacheMiss from "./SongCacheMiss";

const Songs = () => {
  const ids = useGetSearchedSongIds()
  const [missCache, setMissCache] = useState(false)

  return (
    <div className="songs-root">
      <input type="checkbox" onChange={(e) => setMissCache(e.target.checked)}>
      </input>
      <label>
        intentionally miss song cache
      </label>
      <HeavyUselessUI />
      {ids.map((id) => (
        missCache ?
          <SongCacheMiss id={id} key={id} />
          :
          <Song id={id} key={id} />
      ))}
    </div>
  );
};

export default memo(Songs)
