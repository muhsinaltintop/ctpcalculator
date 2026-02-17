export function bisection(
  fn: (x: number) => number,
  lower: number,
  upper: number,
  tolerance = 1e-5,
  maxIter = 100
) {
  let a = lower;
  let b = upper;

  for (let i = 0; i < maxIter; i++) {
    const mid = (a + b) / 2;
    const fmid = fn(mid);

    if (Math.abs(fmid) < tolerance) {
      return mid;
    }

    if (fn(a) * fmid < 0) {
      b = mid;
    } else {
      a = mid;
    }
  }

  throw new Error("Solver did not converge");
}
