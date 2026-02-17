export function tchebycheff4(
  fn: (x: number) => number,
  lower: number,
  upper: number
): number {
  const points = [0.1, 0.4, 0.6, 0.9];
  const dx = upper - lower;

  const sum = points
    .map((p) => lower + p * dx)
    .map((x) => fn(x))
    .reduce((a, b) => a + b, 0);

  return dx * (sum / 4);
}
