import { saturationPressure_kPa } from "./saturation";

// humidity ratio from partial pressure (kPa)
export function humidityRatioFromPw(Pw_kPa: number, P_kPa: number): number {
  return 0.62198 * Pw_kPa / (P_kPa - Pw_kPa);
}

// partial pressure from humidity ratio (kPa)
export function pwFromHumidityRatio(w: number, P_kPa: number): number {
  return (w * P_kPa) / (0.62198 + w);
}

// saturated humidity ratio at Tc (°C), P (kPa)
export function humidityRatioSat(Tc: number, P_kPa: number): number {
  const Pws = saturationPressure_kPa(Tc);
  return humidityRatioFromPw(Pws, P_kPa);
}

// enthalpy of moist air in kJ/kg_dry_air (ASHRAE form)
export function enthalpy_kJkgda(Tdb_C: number, w: number): number {
  return 1.006 * Tdb_C + w * (2501 + 1.86 * Tdb_C);
}

// saturated air enthalpy at interface temperature (Tw), kJ/kg_da
export function enthalpySat_kJkgda(T_C: number, P_kPa: number): number {
  const ws = humidityRatioSat(T_C, P_kPa);
  return enthalpy_kJkgda(T_C, ws);
}

// relative humidity from Tdb + w
export function relativeHumidity(Tdb_C: number, w: number, P_kPa: number): number {
  const Pw = pwFromHumidityRatio(w, P_kPa);
  const Pws = saturationPressure_kPa(Tdb_C);
  return Pw / Pws;
}
