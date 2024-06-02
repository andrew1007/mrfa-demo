import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { initialState, useDispatch } from "src/Enterprise/store";
import HelpToolTip from "../Shared/HelpTooltip";

const tiers = [0, 1, 2, 3];
const labels = ['low', 'moderate', 'high', 'extreme']

type OnChange = React.InputHTMLAttributes<HTMLInputElement>['onChange']

function getClosest(arr: number[], val: number) {
  return arr.reduce(function (prev, curr) {
    return (Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
  });
}

const SlowDown = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState(initialState.performance.slowdown)

  const updateStore = useCallback(debounce((next: number) => {
    dispatch(({ performance }) => ({
      performance: {
        ...performance,
        slowdown: next
      }
    }))
  }, 500), [])

  const update: OnChange = (value) => {
    const next = getClosest(tiers, Number(value.target.value))
    setValue(next)
    updateStore(next)
  }

  return (
    <div>
      <div>
        UI Complexity: {labels[value]}
        <HelpToolTip desc="Increases algorithmic complexity and adds larges amounts of HTML (hidden) to components" />
      </div>
      <input
        id="yearslider"
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

export default SlowDown
