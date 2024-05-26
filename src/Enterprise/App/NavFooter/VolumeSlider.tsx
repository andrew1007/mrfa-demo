import { debounce } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../state";

const VolumeSlider = () => {
  const volume = useSelector(state => state.dashboard.volume);

  const dispatch = useDispatch();
  const [value, setValue] = useState(100);

  const update = useCallback(
    debounce((value: number) => {
      dispatch(({ dashboard }) => ({
        dashboard: {
          ...dashboard,
          volume: value,
        },
      }));
    }, 200),
    []
  );

  useEffect(() => {
    setValue(volume);
  }, [volume]);

  useEffect(() => {
    update(value);
  }, [value]);

  return (
    <input
      type="range"
      min="0"
      max="100"
      onChange={(e) => setValue(Number(e.target.value))}
      value={value}
    />
  );
};

export default memo(VolumeSlider);
