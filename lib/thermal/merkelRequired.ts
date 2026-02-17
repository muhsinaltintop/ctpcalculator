import { tchebycheff4 } from "./tchebycheff";
import { enthalpySat_kJkgda } from "@/lib/psychrometrics/moistAir";

export type MerkelInputsSI = {
  Th_C: number;
  Tc_C: number;

  // inlet bulk air enthalpy (kJ/kg_da)
  h_in_kJkgda: number;

  // total pressure (kPa)
  P_kPa: number;

  // mass flow ratio L/G where:
  // L = kg/s water
  // G = kg/s dry air
  LG: number;

  // optional derates
  fillDerate?: number; // e.g. 0.04
};

const CPW_kJkgK = 4.186; // liquid water specific heat

/**
 * Merkel required KaV/L:
 * KaV/L = ∫ dTw / (h_s(Tw) - h_a(Tw))
 *
 * We compute h_a(Tw) from heat balance:
 *  h_a(Tw) = h_in + (L/G)*Cpw*(Th - Tw)
 *
 * using Tchebycheff 4-point rule at 0.1,0.4,0.6,0.9 of range.
 */
export function merkelRequiredKaVL_SI(m: MerkelInputsSI): number {
  const { Th_C, Tc_C, h_in_kJkgda, P_kPa, LG } = m;

  if (!(Th_C > Tc_C)) throw new Error("Hot water temp must be > cold water temp.");
  if (!(LG > 0)) throw new Error("L/G must be > 0.");
  if (!(P_kPa > 10)) throw new Error("Pressure invalid.");

  const integral = tchebycheff4(
    (Tw_C) => {
      const hs = enthalpySat_kJkgda(Tw_C, P_kPa);
      const ha = h_in_kJkgda + LG * CPW_kJkgK * (Th_C - Tw_C);

      const denom = hs - ha;
      if (denom <= 0) {
        // physically: air enthalpy has exceeded saturation enthalpy at interface → impossible
        // this typically means airflow too low or conditions infeasible
        throw new Error(
          `Merkel integral invalid (hs-ha<=0) at Tw=${Tw_C.toFixed(2)}°C.`
        );
      }
      return 1 / denom;
    },
    Tc_C,
    Th_C
  );

  // Apply optional fill derate: user says "derate KaV/L by X%"
  // If they derate performance, "required" KaV/L effectively increases.
  // So we divide by (1 - derate) to demand more.
  const d = m.fillDerate ?? 0;
  if (d < 0 || d >= 0.5) throw new Error("Fill derate must be between 0 and <0.5");
  const adjusted = integral / (1 - d);

  return adjusted;
}
