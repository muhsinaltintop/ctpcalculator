// src/lib/fan/efficiency.ts

export type EfficiencyInput = {
  /** Total fan efficiency as fraction (0.85) OR percent (85). */
  totalFanEfficiency: number;

  /** Transmission efficiency as fraction (0.95) OR percent (95). */
  transmissionEfficiency: number;

  /** Tip clearance (same length unit as fanDiameter) */
  tipClearance: number;

  /** Fan diameter (same length unit as tipClearance) */
  fanDiameter: number;
};

export type EfficiencyResult = {
  /** Total fan efficiency after tip-clearance derate (fraction 0..1) */
  effectiveFanEfficiency: number;

  /** Transmission efficiency normalized (fraction 0..1) */
  effectiveTransmissionEfficiency: number;

  /** tip clearance ratio = clearance / diameter (e.g. 0.012 = 1.2%) */
  tipClearanceRatio: number;

  /** derate factor applied to fan efficiency (fraction 0..1) */
  tipClearanceDerateFactor: number;

  /** optional warnings for UI */
  warnings: string[];
};

/** STAR rule you mentioned: error if clearance > 1.5% of diameter */
export const MAX_TIP_CLEARANCE_RATIO = 0.015;

/**
 * Normalize efficiency input to fraction.
 * Allows user input as 85 or 0.85.
 */
export function normalizeEfficiency(x: number, label: string): number {
  if (!Number.isFinite(x)) throw new Error(`${label} is not a finite number.`);
  if (x <= 0) throw new Error(`${label} must be > 0.`);
  // If user gave percent (e.g. 85), convert to fraction
  const val = x > 1 ? x / 100 : x;
  if (val <= 0 || val > 1) throw new Error(`${label} must be between 0 and 1 (or 0..100%).`);
  return val;
}

/**
 * Linear placeholder derate curve.
 * NOTE: This is NOT Brentwood proprietary. It's a safe v1 default.
 * Later we can swap to table interpolation to match STAR behavior.
 *
 * Returns a factor (0..1) that multiplies base fan efficiency.
 */
export function tipClearanceDerateFactorLinear(ratio: number): number {
  // ratio is e.g. 0.010 for 1.0%
  // minimal derate at 0, increasing toward limit
  // This is intentionally conservative and simple.
  const k = 5; // slope: at 1% => factor 0.95
  const factor = 1 - k * ratio;
  // clamp to avoid negative values
  return Math.max(0.5, Math.min(1, factor));
}

/**
 * Generic 1D linear interpolation over a curve.
 * curveX must be sorted ascending and same length as curveY.
 */
export function interp1(curveX: number[], curveY: number[], x: number): number {
  if (curveX.length !== curveY.length || curveX.length < 2) {
    throw new Error("interp1: invalid curve arrays.");
  }
  if (x <= curveX[0]) return curveY[0];
  if (x >= curveX[curveX.length - 1]) return curveY[curveY.length - 1];

  for (let i = 0; i < curveX.length - 1; i++) {
    const x0 = curveX[i];
    const x1 = curveX[i + 1];
    if (x >= x0 && x <= x1) {
      const y0 = curveY[i];
      const y1 = curveY[i + 1];
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  // should never hit
  return curveY[curveY.length - 1];
}

/**
 * Optional: Use a table-based derate curve (more STAR-like).
 * Provide ratio breakpoints and derate factors.
 * Example:
 *   ratios = [0.000, 0.005, 0.010, 0.015]
 *   factors= [1.000, 0.985, 0.960, 0.920]
 */
export function tipClearanceDerateFactorTable(
  ratio: number,
  ratios: number[],
  factors: number[]
): number {
  const f = interp1(ratios, factors, ratio);
  return Math.max(0.5, Math.min(1, f));
}

/**
 * Apply tip clearance derate to base fan efficiency.
 * Throws if clearance ratio exceeds allowed limit (1.5%).
 */
export function applyTipClearanceDerate(
  baseFanEfficiency: number,
  tipClearance: number,
  fanDiameter: number,
  mode: "LINEAR" | "TABLE" = "LINEAR",
  table?: { ratios: number[]; factors: number[] }
): {
  effectiveFanEfficiency: number;
  ratio: number;
  derateFactor: number;
  warnings: string[];
} {
  const warnings: string[] = [];

  const eff = normalizeEfficiency(baseFanEfficiency, "Total fan efficiency");

  if (!Number.isFinite(tipClearance) || tipClearance < 0) {
    throw new Error("Tip clearance must be a finite non-negative number.");
  }
  if (!Number.isFinite(fanDiameter) || fanDiameter <= 0) {
    throw new Error("Fan diameter must be a finite positive number.");
  }

  const ratio = tipClearance / fanDiameter;

  if (ratio > MAX_TIP_CLEARANCE_RATIO) {
    throw new Error(
      `Tip clearance exceeds 1.5% of fan diameter (ratio=${(ratio * 100).toFixed(2)}%).`
    );
  }

  // mild warning threshold (you can tweak)
  if (ratio > 0.012) {
    warnings.push("Tip clearance is high; fan efficiency may be significantly reduced.");
  }

  let derateFactor: number;

  if (mode === "TABLE") {
    if (!table) throw new Error("TABLE mode requires a derate table.");
    derateFactor = tipClearanceDerateFactorTable(ratio, table.ratios, table.factors);
  } else {
    derateFactor = tipClearanceDerateFactorLinear(ratio);
  }

  const effectiveFanEfficiency = eff * derateFactor;

  return { effectiveFanEfficiency, ratio, derateFactor, warnings };
}

/**
 * Main helper: compute both effective fan efficiency + transmission efficiency.
 * Returns normalized fractions and warning list for UI.
 */
export function computeEffectiveEfficiencies(input: EfficiencyInput): EfficiencyResult {
  const totalFanEff = normalizeEfficiency(input.totalFanEfficiency, "Total fan efficiency");
  const transEff = normalizeEfficiency(input.transmissionEfficiency, "Transmission efficiency");

  const tip = applyTipClearanceDerate(
    totalFanEff,
    input.tipClearance,
    input.fanDiameter,
    "LINEAR"
    // Later, switch to "TABLE" and provide { ratios, factors } once you have curve data
  );

  return {
    effectiveFanEfficiency: tip.effectiveFanEfficiency,
    effectiveTransmissionEfficiency: transEff,
    tipClearanceRatio: tip.ratio,
    tipClearanceDerateFactor: tip.derateFactor,
    warnings: tip.warnings,
  };
}
