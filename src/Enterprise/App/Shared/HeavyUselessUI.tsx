import { useSelector } from "src/Enterprise/store";

const HeavyUselessUI = () => {
  const slowdown = useSelector((state) => state.performance.slowdown)
  const algoSlowdown = useSelector((state) => state.performance.algorithmSlowdown)
  const iterations = slowdown * 400

  for (let i = 0; i < algoSlowdown * 10000; i++) {
    JSON.parse(JSON.stringify({}))
  }

  return (
    <>
      {Array(iterations)
        .fill(null)
        .map((_, idx) => (
          <div style={{
            borderRadius: 1000
          }} key={idx} />
        ))}
    </>
  )
};

export default HeavyUselessUI;
