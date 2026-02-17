import { TowerInputModel } from "../models/input";
import { SolveForPowerResult } from "../models/results";
import { computeRequiredKaVL } from "../thermal/required";
import { availableKaVL } from "../thermal/fillCorrelations";
import { bisection, ensureBracket } from "./rootFinder";
import { computeTotalPressure } from "../hydraulics/system";
import { computeEffectiveEfficiencies } from "../fan/efficiency";

function kaVLEquation(input: TowerInputModel) {
  return (G: number) => {
    const req = computeRequiredKaVL(input, G);
    const avail = availableKaVL(input, G);
    return avail - req;
  };
}

export function solveForAirflowForPower(input: TowerInputModel): number {
  const equation = kaVLEquation(input);
  const bracket = ensureBracket(equation, {
    initialLower: 1,
    initialUpper: 300,
    growthFactor: 2,
    maxExpansions: 16,
  });

  return bisection(equation, bracket.lower, bracket.upper, {
    tolerance: 1e-6,
    maxIter: 120,
  });
}

export function solveForPower(input: TowerInputModel): SolveForPowerResult {
  const airflow_kgps = solveForAirflowForPower(input);
  const pressure = computeTotalPressure(input, airflow_kgps);

  const efficiency = computeEffectiveEfficiencies({
    totalFanEfficiency: input.fan.totalEfficiency,
    transmissionEfficiency: input.fan.transmissionEfficiency,
    tipClearance: input.fan.tipClearance,
    fanDiameter: input.geometry.fanDiameter,
  });

  const power_kW =
    (airflow_kgps * pressure.total) /
    (efficiency.effectiveFanEfficiency * efficiency.effectiveTransmissionEfficiency * 1000);

  return {
    airflow_kgps,
    pressureDrop_Pa: pressure.total,
    power_kW,
    warnings: efficiency.warnings,
    diagnostics: {
      effectiveFanEfficiency: efficiency.effectiveFanEfficiency,
      effectiveTransmissionEfficiency: efficiency.effectiveTransmissionEfficiency,
      tipClearanceRatio: efficiency.tipClearanceRatio,
      tipClearanceDerateFactor: efficiency.tipClearanceDerateFactor,
    },
  };
}
