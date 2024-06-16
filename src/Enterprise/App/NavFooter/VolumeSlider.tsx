import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../store";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import useDebounce from "src/Enterprise/hooks/useDebounce";

type VolumeSliderProps = {
  onChange: (vol: number) => void;
  value: number;
}

export const VolumeSlider = (props: VolumeSliderProps) => {
  const { onChange, value: vol } = props
  const [value, setValue] = useState(100);

  useEffect(() => {
    setValue(vol);
  }, [vol]);

  useEffect(() => {
    update(value);
  }, [value]);

  const update = useDebounce(onChange, 200)

  return (
    <div className="volume-slider-container">
      {value === 0 ? <VolumeMuteIcon /> : <VolumeUpIcon />}
      <input
        type="range"
        min="0"
        max="100"
        onChange={(e) => setValue(Number(e.target.value))}
        value={value}
      />
    </div>
  );
}

const _VolumeSlider = () => {
  const volume = useSelector(state => state.dashboard.volume);

  const dispatch = useDispatch();

  const update = (value: number) => {
    dispatch(({ dashboard }) => ({
      dashboard: {
        ...dashboard,
        volume: value,
      },
    }));
  }

  return <VolumeSlider
    onChange={update}
    value={volume}
  />
};

export default memo(_VolumeSlider);
