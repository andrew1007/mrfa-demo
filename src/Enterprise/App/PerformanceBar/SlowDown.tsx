import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { initialState, useDispatch } from "src/Enterprise/store";

const tiers = [0, 1, 2, 3];
const labels = ['none', 'low', 'moderate', 'severe']

type OnChange = React.InputHTMLAttributes<HTMLInputElement>['onChange']

function getClosest(arr: number[], val: number) {
  return arr.reduce(function (prev, curr) {
    return (Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
  });
}

const SlowDown = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState(0)

  const updateStore = useCallback(debounce((next: number) => {
    dispatch(({ performance }) => ({
      ...initialState,
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
      <div>
        {labels[value]}
      </div>
    </div>

  )
}

export default SlowDown
