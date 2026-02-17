import { TowerInputModel } from "../models/input";
import { pressureLoss } from "./pressureDrop";

export type PressureBreakdown = {
  inlet: number;
  fill: number;
  eliminator: number;
  total: number;
};

export function computeTotalPressure(input: TowerInputModel, airflow_kgps: number): PressureBreakdown {
  const area = Math.max(input.geometry.towerWidth * input.geometry.towerLength, 1e-6);
  const velocity = airflow_kgps / area;

  const inlet = pressureLoss(2.15, velocity, 1);
  const fill = pressureLoss(3.0, velocity, 1);
  const eliminator = pressureLoss(2.5, velocity, 1);

  return {
    inlet,
    fill,
    eliminator,
    total: inlet + fill + eliminator,
  };
}
