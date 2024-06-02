import { useSelector } from "src/Enterprise/store";

const HeavyUselessUI = () => {
  return null
  const slowdown = useSelector(state => state.performance.slowdown)
  const iterations = slowdown * 1000

  Array(iterations).fill(null).forEach(() => JSON.parse(JSON.stringify({})))

  return (
    <>
      {Array(slowdown * 100)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} />
        ))}
    </>
  )
};

export default HeavyUselessUI;
