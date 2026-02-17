import { tchebycheff4 } from "./tchebycheff";
import { enthalpySat_kJkgda } from "../psychrometrics/moistAir";

export type MerkelInputsSI = {
  Th_C: number;
  Tc_C: number;
  h_in_kJkgda: number;
  P_kPa: number;
  LG: number;
  fillDerate?: number;
};

const CPW_kJkgK = 4.186;

export function merkelRequiredKaVL_SI(m: MerkelInputsSI): number {
  const { Th_C, Tc_C, h_in_kJkgda, P_kPa, LG } = m;

  if (!(Th_C > Tc_C)) throw new Error("Hot water temp must be > cold water temp.");
  if (!(LG > 0)) throw new Error("L/G must be > 0.");
  if (!(P_kPa > 10)) throw new Error("Pressure invalid.");

  const requiredBase = tchebycheff4((Tw_C) => {
    const hs = enthalpySat_kJkgda(Tw_C, P_kPa);
    const ha = h_in_kJkgda + LG * CPW_kJkgK * (Th_C - Tw_C);
    const denominator = hs - ha;

    if (denominator <= 0) {
      throw new Error(
        `Merkel integral invalid (hs-ha<=0) at Tw=${Tw_C.toFixed(2)}°C.`
      );
    }

    return 1 / denominator;
  }, Tc_C, Th_C);

  const derate = m.fillDerate ?? 0;
  if (derate < 0 || derate >= 1) {
    throw new Error("Fill derate must be in [0, 1). ");
  }

  return requiredBase / (1 - derate);
}
