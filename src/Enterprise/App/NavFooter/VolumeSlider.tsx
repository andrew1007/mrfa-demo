import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { applyState, State, useDispatch } from "../../state";

type StateProps = ReturnType<ReturnType<typeof mappedState>>;
type Component = React.FunctionComponent<StateProps>;

const VolumeSlider: Component = (props) => {
  const { volume } = props;
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

const mappedState = () => (state: State) => ({
  volume: state.dashboard.volume,
});

export default applyState(mappedState)(VolumeSlider);
