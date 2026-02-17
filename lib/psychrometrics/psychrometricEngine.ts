import { saturationPressure_kPa } from "./saturation";
import {
  humidityRatioFromPw,
  relativeHumidity,
  enthalpy_kJkgda,
} from "./moistAir";

export type InletAirState = {
  dbt_C: number;
  w: number;
  h: number;
  rh: number;
};

export function inletAirFromWbtRhPressure(
  Twb_C: number,
  RH_target: number,
  P_kPa: number
): InletAirState {
  if (!(RH_target > 0 && RH_target <= 1)) throw new Error("RH must be in (0, 1].");
  if (!(P_kPa > 10)) throw new Error("Pressure (kPa) looks invalid.");

  const lo0 = Twb_C;
  const hi0 = Twb_C + 40;
  let lo = lo0;
  let hi = hi0;

  const evalAtTdb = (Tdb_C: number) => {
    const gamma = 0.00066 * (1 + 0.00115 * Twb_C);
    const Pws_wb = saturationPressure_kPa(Twb_C);
    const Pw = Pws_wb - gamma * P_kPa * (Tdb_C - Twb_C);
    const Pw_clamped = Math.min(Math.max(Pw, 0.001), P_kPa * 0.99);
    const w = humidityRatioFromPw(Pw_clamped, P_kPa);
    const rh = relativeHumidity(Tdb_C, w, P_kPa);
    return { w, rh, h: enthalpy_kJkgda(Tdb_C, w) };
  };

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const state = evalAtTdb(mid);
    const err = state.rh - RH_target;

    if (Math.abs(err) < 1e-5) {
      return { dbt_C: mid, w: state.w, h: state.h, rh: state.rh };
    }

    if (err > 0) lo = mid;
    else hi = mid;
  }

  const mid = (lo + hi) / 2;
  const state = evalAtTdb(mid);

  if (mid < lo0 - 1e-6 || mid > hi0 + 1e-6) {
    throw new Error("DBT solve escaped bracket.");
  }

  return { dbt_C: mid, w: state.w, h: state.h, rh: state.rh };
}
