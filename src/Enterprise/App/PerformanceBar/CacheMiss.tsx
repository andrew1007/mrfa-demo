import { useDispatch, useSelector } from "src/Enterprise/store"

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
        Force Rerenders
    </div>
  )
}

export default CacheMiss
