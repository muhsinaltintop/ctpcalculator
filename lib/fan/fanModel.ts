import { computeEffectiveEfficiencies } from "./efficiency";

export function calculatePowerKW(params: {
  airflow: number;
  totalPressure: number;
  totalFanEfficiency: number;        // 85 or 0.85
  transmissionEfficiency: number;    // 95 or 0.95
  tipClearance: number;
  fanDiameter: number;
}) {
  const eff = computeEffectiveEfficiencies({
    totalFanEfficiency: params.totalFanEfficiency,
    transmissionEfficiency: params.transmissionEfficiency,
    tipClearance: params.tipClearance,
    fanDiameter: params.fanDiameter,
  });

  // Power equation: (Airflow * Pressure) / (EffFan * EffTrans)
  // NOTE: Units must be consistent with your airflow & pressure conventions.
  const power =
    (params.airflow * params.totalPressure) /
    (eff.effectiveFanEfficiency * eff.effectiveTransmissionEfficiency);

  return { powerKW: power, efficiency: eff };
}
