import React, { memo, useEffect, useLayoutEffect, useState } from "react";
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

const SlowDown = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState(initialState.performance.slowdown)
  useSelector(state => state.performance.slowdown)

  /**
   * Use vanilla to perform this operation ASAP
   */
  const showNotifier = (show: boolean) => {
    const node = document.querySelector('#slowdown-notifier') as HTMLDivElement
    node.style.display = show ? 'block' : 'none'
  }

  useLayoutEffect(() => {
    showNotifier(false)
  }, [Math.random()])

  const updateStore = useDebounce((next: number) => {
    showNotifier(true)
    dispatch(({ performance }) => {
      return {
        performance: {
          ...performance,
          slowdown: next
        }
      }
    })
  }, 500)

  const update: OnChange = (value) => {
    const next = getClosest(tiers, Number(value.target.value))
    setValue(next)
    updateStore(next)
  }

  return (
    <div>
      <div>
        HTML Complexity: {labels[value]}
        <HelpToolTip desc="Adds larges amounts of HTML (hidden) to components" />
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
      <div id="slowdown-notifier" style={{ display: 'none', color: 'red' }}>
        Remounting HTML, please wait...
      </div>
    </div>

  )
}

export default memo(SlowDown)
