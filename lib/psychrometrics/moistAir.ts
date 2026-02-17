import { saturationPressure_kPa } from "./saturation";

const EPS = 0.62198;

export function humidityRatioFromPw(Pw_kPa: number, P_kPa: number): number {
  if (!(P_kPa > 0)) throw new Error("Total pressure must be > 0.");
  if (!(Pw_kPa > 0 && Pw_kPa < P_kPa)) {
    throw new Error("Vapor pressure must be in (0, P). ");
  }
  return (EPS * Pw_kPa) / (P_kPa - Pw_kPa);
}

export function pwFromHumidityRatio(w: number, P_kPa: number): number {
  if (!(w >= 0)) throw new Error("Humidity ratio must be >= 0.");
  if (!(P_kPa > 0)) throw new Error("Total pressure must be > 0.");
  return (w * P_kPa) / (EPS + w);
}

export function humidityRatioSat(Tc: number, P_kPa: number): number {
  const Pws = saturationPressure_kPa(Tc);
  // keep margin from total pressure for numerical safety at low pressure/high Tc
  return humidityRatioFromPw(Math.min(Pws, P_kPa * 0.999), P_kPa);
}

// Enthalpy of moist air in kJ/kg dry air
export function enthalpy_kJkgda(Tdb_C: number, w: number): number {
  return 1.006 * Tdb_C + w * (2501 + 1.86 * Tdb_C);
}

export function enthalpySat_kJkgda(T_C: number, P_kPa: number): number {
  const ws = humidityRatioSat(T_C, P_kPa);
  return enthalpy_kJkgda(T_C, ws);
}

export function relativeHumidity(Tdb_C: number, w: number, P_kPa: number): number {
  const Pw = pwFromHumidityRatio(w, P_kPa);
  const Pws = saturationPressure_kPa(Tdb_C);
  return Pw / Pws;
}
