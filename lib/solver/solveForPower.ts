import { bisection } from "./rootFinder";
import { TowerInputModel } from "@/lib/models/input";
import { computeRequiredKaVL } from "@/lib/thermal/required";
import { availableKaVL } from "@/lib/thermal/fillCorrelations";

export function solveForAirflowForPower(input: TowerInputModel): number {
  // Solve f(G)=available-required = 0
  return bisection(
    (G) => {
      const req = computeRequiredKaVL(input, G);
      const avail = availableKaVL(input, G);
      return avail - req;
    },
    1,      // 1 kg/s
    300     // 300 kg/s (expand later)
  );
}
