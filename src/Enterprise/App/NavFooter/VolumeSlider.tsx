import { ChangeEventHandler, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../store";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import useDebounce from "src/Enterprise/hooks/useDebounce";

type VolumeSliderProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: number;
}

export const VolumeSlider = (props: VolumeSliderProps) => {
  const { onChange, value } = props
  return (
    <div className="volume-slider-container">
      {value === 0 ? <VolumeMuteIcon /> : <VolumeUpIcon />}
      <input
        type="range"
        min="0"
        max="100"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

const _VolumeSlider = () => {
  const volume = useSelector(state => state.dashboard.volume);

  const dispatch = useDispatch();
  const [value, setValue] = useState(100);

  const update = useDebounce((value: number) => {
    dispatch(({ dashboard }) => ({
      dashboard: {
        ...dashboard,
        volume: value,
      },
    }));
  }, 200)

  useEffect(() => {
    setValue(volume);
  }, [volume]);

  useEffect(() => {
    update(value);
  }, [value]);

  return <VolumeSlider
    onChange={(e) => setValue(Number(e.target.value))}
    value={value}
  />
};

export default memo(_VolumeSlider);
