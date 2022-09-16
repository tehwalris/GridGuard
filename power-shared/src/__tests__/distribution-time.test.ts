import { getNextDistributionTime } from "../distribution-time";

describe("getNextDistributionTime", () => {
  test("always returns values in the correct range and monotonically decreases", () => {
    const totalToDistribute = Math.floor(Math.random() * 50);
    const bounds = { low: Math.random() * 5, high: Math.random() * 5 };
    bounds.high += bounds.low;

    let lastTime = Infinity;
    for (let i = 0; i <= totalToDistribute; i++) {
      const time = getNextDistributionTime({
        totalToDistribute,
        alreadyDistributed: i,
        bounds,
      });
      expect(time).toBeGreaterThanOrEqual(bounds.low);
      expect(time).toBeLessThanOrEqual(bounds.high);
      expect(time).toBeLessThanOrEqual(lastTime);
      lastTime = time;
    }
  });
});
