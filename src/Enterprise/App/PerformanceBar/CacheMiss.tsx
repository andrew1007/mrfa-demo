import { useDispatch, useSelector } from "src/Enterprise/store"
import HelpToolTip from "../Shared/HelpTooltip"

const CacheMiss = () => {
  const dispatch = useDispatch()
  const miss = useSelector((state) => state.performance.cacheMiss)

  return (
    <div>
      <input
        type="checkbox"
        checked={miss}
        onChange={(e) => {
          dispatch(({ performance }) => ({
            performance: {
              ...performance,
              cacheMiss: e.target.checked
            }
          }))
        }} />
      Force Rerenders <HelpToolTip desc="Forces some components to miss their cache, triggering a rerender on every store update" />
    </div>
  )
}

export default CacheMiss
