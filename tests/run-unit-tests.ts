import * as assert from "node:assert/strict";
import { saturationPressure_kPa } from "../lib/psychrometrics/saturation";
import { enthalpy_kJkgda, relativeHumidity } from "../lib/psychrometrics/moistAir";
import { inletAirFromWbtRhPressure } from "../lib/psychrometrics/psychrometricEngine";
import { tchebycheff4, TCHEBYCHEFF_POINTS } from "../lib/thermal/tchebycheff";
import { merkelRequiredKaVL_SI } from "../lib/thermal/merkelRequired";
import { bisection, ensureBracket } from "../lib/solver/rootFinder";
import { MAX_TIP_CLEARANCE_RATIO, computeEffectiveEfficiencies } from "../lib/fan/efficiency";

let checks = 0;

function check(name: string, fn: () => void) {
  fn();
  checks += 1;
  console.log(`PASS: ${name}`);
}

check("saturation pressure near 25°C", () => {
  const p = saturationPressure_kPa(25);
  assert.ok(p > 3.0 && p < 3.3);
});

check("enthalpy increases with humidity ratio", () => {
  const h1 = enthalpy_kJkgda(30, 0.010);
  const h2 = enthalpy_kJkgda(30, 0.020);
  assert.ok(h2 > h1);
});

check("psychrometric solve approximately matches RH target", () => {
  const s = inletAirFromWbtRhPressure(25, 0.6, 101.325);
  assert.ok(Math.abs(s.rh - 0.6) < 0.01);
});

check("relative humidity bounded in normal case", () => {
  const s = inletAirFromWbtRhPressure(24, 0.5, 101.325);
  const rh = relativeHumidity(s.dbt_C, s.w, 101.325);
  assert.ok(rh > 0 && rh <= 1.1);
});

check("Tchebycheff uses expected 4 points", () => {
  assert.deepEqual(TCHEBYCHEFF_POINTS, [0.1, 0.4, 0.6, 0.9]);
});

check("Tchebycheff integral of constant", () => {
  const value = tchebycheff4(() => 2, 30, 40);
  assert.ok(Math.abs(value - 20) < 1e-9);
});

check("Merkel required KaV/L positive in sane regime", () => {
  const req = merkelRequiredKaVL_SI({
    Th_C: 40,
    Tc_C: 30,
    h_in_kJkgda: 40,
    P_kPa: 101.325,
    LG: 0.5,
    fillDerate: 0.04,
  });
  assert.ok(req > 0);
});

check("Bracket expansion finds root for shifted linear function", () => {
  const bracket = ensureBracket((x) => x - 12, {
    initialLower: 1,
    initialUpper: 2,
    growthFactor: 2,
    maxExpansions: 10,
  });
  assert.ok(bracket.lower < 12 && bracket.upper > 12);
});

check("Bisection converges on known root", () => {
  const root = bisection((x) => x * x - 4, 1, 4);
  assert.ok(Math.abs(root - 2) < 1e-4);
});

check("Tip clearance over 1.5% throws hard error", () => {
  assert.throws(() =>
    computeEffectiveEfficiencies({
      totalFanEfficiency: 85,
      transmissionEfficiency: 95,
      tipClearance: MAX_TIP_CLEARANCE_RATIO * 10,
      fanDiameter: 1,
    })
  );
});

check("Tip clearance within limit produces efficiency", () => {
  const eff = computeEffectiveEfficiencies({
    totalFanEfficiency: 85,
    transmissionEfficiency: 95,
    tipClearance: 0.01,
    fanDiameter: 1,
  });
  assert.ok(eff.effectiveFanEfficiency > 0 && eff.effectiveFanEfficiency <= 1);
});

console.log(`\nAll checks passed: ${checks}`);
