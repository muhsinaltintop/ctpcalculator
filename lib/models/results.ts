export interface SolveForPowerResult {
  airflow_kgps: number;
  pressureDrop_Pa: number;
  power_kW: number;
  warnings: string[];
  diagnostics: {
    effectiveFanEfficiency: number;
    effectiveTransmissionEfficiency: number;
    tipClearanceRatio: number;
    tipClearanceDerateFactor: number;
  };
}
