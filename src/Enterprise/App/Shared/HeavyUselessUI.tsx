import { useSelector } from "src/Enterprise/store";

const HeavyUselessUI = () => {
  const slowdown = useSelector((state) => state.performance.slowdown)
  const iterations = slowdown * 400

  for (let i = 0; i < slowdown * 10000; i++) {
    JSON.parse(JSON.stringify({}))
  }

  return (
    <>
      {Array(iterations)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} />
        ))}
    </>
  )
};

export default HeavyUselessUI;
