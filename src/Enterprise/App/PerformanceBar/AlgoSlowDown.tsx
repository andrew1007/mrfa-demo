import React, { memo, useState } from "react";
import { initialState, useDispatch } from "src/Enterprise/store";
import HelpToolTip from "../Shared/HelpTooltip";
import useDebounce from "src/Enterprise/hooks/useDebounce";

const tiers = [0, 1, 2, 3];
const labels = ['low', 'moderate', 'high', 'extreme']

type OnChange = React.InputHTMLAttributes<HTMLInputElement>['onChange']

function getClosest(arr: number[], val: number) {
  return arr.reduce(function (prev, curr) {
    return (Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
  });
}

const AlgoSlowDown = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState(initialState.performance.algorithmSlowdown)

  const updateStore = useDebounce((next: number) => {
    dispatch(({ performance }) => ({
      performance: {
        ...performance,
        algorithmSlowdown: next
      }
    }))
  }, 500)

  const update: OnChange = (value) => {
    const next = getClosest(tiers, Number(value.target.value))
    setValue(next)
    updateStore(next)
  }

  return (
    <div>
      <div>
        Algorithm Complexity: {labels[value]}
        <HelpToolTip desc="Increases algorithmic complexity to components" />
      </div>
      <input
        onChange={update}
        type="range"
        min={Math.min(...tiers)}
        value={value}
        max={Math.max(...tiers)}
        step="1"
        list="ticks"
      />
    </div>

  )
}

export default memo(AlgoSlowDown)
