import { initialState, useDispatch, useSelector } from "src/Enterprise/store"

const CacheMiss = () => {
  const dispatch = useDispatch()
  const miss = useSelector((state) => state.performance.cacheMiss)

  return (
    <input
      type="checkbox"
      checked={miss}
      onChange={(e) => {
        dispatch(({ performance }) => ({
          ...initialState,
          performance: {
            ...performance,
            cacheMiss: e.target.checked
          }
        }))
      }} />
  )
}

export default CacheMiss
