import assert from "assert";

const RAMP_UNTIL = 0.3;

function mix(p: number, a: number, b: number): number {
  return (1 - p) * a + p * b;
}

export function getNextDistributionTime({
  alreadyDistributed,
  totalToDistribute,
  bounds,
}: {
  alreadyDistributed: number;
  totalToDistribute: number;
  bounds: { low: number; high: number };
}): number {
  assert(bounds.low <= bounds.high);

  const p = alreadyDistributed / totalToDistribute;
  assert(p >= 0 && p <= 1);

  if (p < RAMP_UNTIL) {
    return mix(p / RAMP_UNTIL, bounds.high, bounds.low);
  }
  return bounds.low;
}
