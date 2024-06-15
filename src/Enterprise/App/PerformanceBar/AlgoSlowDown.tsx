import React, { memo, useLayoutEffect, useState } from "react";
import { initialState, useDispatch, useSelector } from "src/Enterprise/store";
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
  useSelector(state => state.performance.algorithmSlowdown)

  /**
   * Use vanilla to perform this operation ASAP
   */
  const showNotifier = (show: boolean) => {
    const node = document.querySelector('#algo-slowdown-notifier') as HTMLDivElement
    node.style.display = show ? 'block' : 'none'
  }

  useLayoutEffect(() => {
    showNotifier(false)
  }, [Math.random()])


  const updateStore = useDebounce((next: number) => {
    showNotifier(true)
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
      <div id="algo-slowdown-notifier" style={{ display: 'none', color: 'red' }}>
        Rerendering entire page, please wait...
      </div>
    </div>

  )
}

export default memo(AlgoSlowDown)
