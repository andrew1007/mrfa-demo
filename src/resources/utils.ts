/**
 * Simulate computationally heavy algorithms
 */
export const heavy = () => {
  for (let i = 0; i < 500; i++) {
    JSON.stringify({});
  }
};