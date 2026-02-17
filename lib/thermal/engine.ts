import { TowerInputModel } from "../models/input";
import { computeRequiredKaVL } from "./required";

/**
 * Legacy compatibility wrapper for UI experiments.
 * For a given airflow, returns required KaV/L from the v1 SI thermal engine.
 */
export function computeKaVLForAirflow(input: TowerInputModel, airflow_kgps: number): number {
  return computeRequiredKaVL(input, airflow_kgps);
}
