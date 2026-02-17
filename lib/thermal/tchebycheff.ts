const TCHEBYCHEFF_POINTS = [0.1, 0.4, 0.6, 0.9] as const;

export function tchebycheff4(
  fn: (x: number) => number,
  lower: number,
  upper: number
): number {
  if (!(upper > lower)) throw new Error("Upper bound must be greater than lower bound.");

  const dx = upper - lower;
  const sum = TCHEBYCHEFF_POINTS
    .map((p) => lower + p * dx)
    .map((x) => fn(x))
    .reduce((a, b) => a + b, 0);

  return dx * (sum / TCHEBYCHEFF_POINTS.length);
}

export { TCHEBYCHEFF_POINTS };
