import React from "react";

const HeavyUselessUI = () => (
  <>
    {Array(50)
      .fill(null)
      .map((_, idx) => (
        <div key={idx} />
      ))}
  </>
);

export default HeavyUselessUI;
