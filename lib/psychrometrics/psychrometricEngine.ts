import { saturationPressure_kPa } from "./saturation";
import {
  humidityRatioFromPw,
  relativeHumidity,
  enthalpy_kJkgda,
} from "./moistAir";

export type InletAirState = {
  dbt_C: number;
  w: number;     // kg/kg dry air
  h: number;     // kJ/kg dry air
};

/**
 * Given WBT (°C), RH (0..1), and total pressure (kPa),
 * solve for DBT using a sling-psychrometer style relation.
 *
 * Strategy:
 *  - For a guess DBT, compute Pw using Twb and psychrometric constant gamma,
 *    then humidity ratio w.
 *  - Compute RH_pred from (DBT, w). Adjust DBT until RH_pred ~= RH_target.
 */
export function inletAirFromWbtRhPressure(
  Twb_C: number,
  RH_target: number,
  P_kPa: number
): InletAirState {
  if (!(RH_target > 0 && RH_target <= 1)) {
    throw new Error("RH must be in (0, 1].");
  }
  if (!(P_kPa > 10)) {
    throw new Error("Pressure (kPa) looks invalid.");
  }

  // Reasonable initial bracket:
  // DBT must be >= WBT (usually), but we allow a small margin.
  let lo = Twb_C;
  let hi = Twb_C + 40;

  const fn = (Tdb: number) => {
    // Psychrometric constant (kPa/°C): gamma*P is often used with P in kPa
    // gamma ≈ 0.00066*(1+0.00115*Twb)
    const gamma = 0.00066 * (1 + 0.00115 * Twb_C);

    const Pws_wb = saturationPressure_kPa(Twb_C);

    // Sling psychrometer approximation for vapor pressure:
    // Pw = Pws(Twb) - gamma * P * (Tdb - Twb)
    const Pw = Pws_wb - gamma * P_kPa * (Tdb - Twb_C);

    // avoid negatives / > P
    const Pw_clamped = Math.min(Math.max(Pw, 0.001), P_kPa * 0.99);

    const w = humidityRatioFromPw(Pw_clamped, P_kPa);
    const RH_pred = relativeHumidity(Tdb, w, P_kPa);

    return { w, RH_pred };
  };

  // Bisection on RH error
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const { w, RH_pred } = fn(mid);

    const err = RH_pred - RH_target;
    if (Math.abs(err) < 1e-4) {
      return { dbt_C: mid, w, h: enthalpy_kJkgda(mid, w) };
    }
    // If predicted RH too high -> DBT too low (generally), increase DBT
    if (err > 0) lo = mid;
    else hi = mid;
  }

  const mid = (lo + hi) / 2;
  const { w } = fn(mid);
  return { dbt_C: mid, w, h: enthalpy_kJkgda(mid, w) };
}
