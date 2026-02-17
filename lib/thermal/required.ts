import { TowerInputModel } from "../models/input";
import { inletAirFromWbtRhPressure } from "../psychrometrics/psychrometricEngine";
import { merkelRequiredKaVL_SI } from "./merkelRequired";

export function pressureFromAltitude_kPa(alt_m: number): number {
  if (!Number.isFinite(alt_m)) throw new Error("Altitude must be finite.");
  return 101.325 * Math.pow(1 - 2.25577e-5 * alt_m, 5.25588);
}

export function waterFlow_m3hr_to_kgps(m3hr: number): number {
  if (!(m3hr > 0)) throw new Error("Water flow must be > 0.");
  const rho = 1000;
  return (m3hr * rho) / 3600;
}

export function computeRequiredKaVL(input: TowerInputModel, G_kgps: number): number {
  if (!(G_kgps > 0)) throw new Error("Airflow (G) must be > 0.");

  const P_kPa = pressureFromAltitude_kPa(input.thermal.altitude);
  const inlet = inletAirFromWbtRhPressure(
    input.thermal.wetBulbTemp,
    input.thermal.relativeHumidity,
    P_kPa
  );

  const L_kgps = waterFlow_m3hr_to_kgps(input.thermal.waterFlow);
  const LG = L_kgps / G_kgps;

  return merkelRequiredKaVL_SI({
    Th_C: input.thermal.hotWaterTemp,
    Tc_C: input.thermal.coldWaterTemp,
    h_in_kJkgda: inlet.h,
    P_kPa,
    LG,
    fillDerate: input.thermal.fillDerate ?? 0,
  });
}
