export type BisectionOptions = {
  tolerance?: number;
  maxIter?: number;
};

export type BracketOptions = {
  initialLower: number;
  initialUpper: number;
  growthFactor?: number;
  maxExpansions?: number;
};

export function ensureBracket(
  fn: (x: number) => number,
  options: BracketOptions
): { lower: number; upper: number } {
  let lower = options.initialLower;
  let upper = options.initialUpper;
  const growth = options.growthFactor ?? 1.8;
  const maxExpansions = options.maxExpansions ?? 20;

  if (!(upper > lower)) throw new Error("Upper bound must be > lower bound.");

  let fLower = fn(lower);
  let fUpper = fn(upper);

  for (let i = 0; i <= maxExpansions; i++) {
    if (fLower === 0) return { lower, upper: lower };
    if (fUpper === 0) return { lower: upper, upper };
    if (fLower * fUpper < 0) return { lower, upper };

    const width = upper - lower;
    lower = Math.max(1e-9, lower - width * (growth - 1) * 0.5);
    upper = upper + width * (growth - 1);
    fLower = fn(lower);
    fUpper = fn(upper);
  }

  throw new Error("Failed to bracket root after expansion.");
}

export function bisection(
  fn: (x: number) => number,
  lower: number,
  upper: number,
  options: BisectionOptions = {}
): number {
  const tolerance = options.tolerance ?? 1e-6;
  const maxIter = options.maxIter ?? 100;

  let a = lower;
  let b = upper;
  let fa = fn(a);
  let fb = fn(b);

  if (fa === 0) return a;
  if (fb === 0) return b;
  if (fa * fb > 0) throw new Error("Bisection requires a valid sign-changing bracket.");

  for (let i = 0; i < maxIter; i++) {
    const mid = 0.5 * (a + b);
    const fm = fn(mid);

    if (Math.abs(fm) < tolerance || Math.abs(b - a) < tolerance) {
      return mid;
    }

    if (fa * fm < 0) {
      b = mid;
      fb = fm;
    } else {
      a = mid;
      fa = fm;
    }
  }

  throw new Error(`Solver did not converge within ${maxIter} iterations.`);
}
