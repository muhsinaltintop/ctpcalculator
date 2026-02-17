import { TowerInputModel } from "@/lib/models/input";
import { inletAirFromWbtRhPressure } from "@/lib/psychrometrics/psychrometricEngine";
import { merkelRequiredKaVL_SI } from "./merkelRequired";

/**
 * v1 SI assumptions:
 * - waterFlow is m3/hr
 * - convert to kg/s using rho=1000 kg/m3
 * - airflow G is kg/s dry air (solver variable)
 * - pressure derived from altitude using simple ISA approximation (kPa)
 */
function pressureFromAltitude_kPa(alt_m: number): number {
  // Simple barometric formula approximation (valid-ish for low altitudes)
  // P = 101.325 * (1 - 2.25577e-5*h)^5.25588
  const P = 101.325 * Math.pow(1 - 2.25577e-5 * alt_m, 5.25588);
  return P;
}

function waterFlow_m3hr_to_kgps(m3hr: number): number {
  const rho = 1000; // kg/m3
  return (m3hr * rho) / 3600;
}

export function computeRequiredKaVL(input: TowerInputModel, G_kgps: number): number {
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
