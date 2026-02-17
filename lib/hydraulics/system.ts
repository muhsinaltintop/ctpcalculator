import { pressureLoss } from "./pressureDrop";

export function computeTotalPressure(
  airflow: number
) {
  const velocity = airflow / 10000;

  const inlet = pressureLoss(2.15, velocity, 1);
  const fill = pressureLoss(3.0, velocity, 1);
  const eliminator = pressureLoss(2.5, velocity, 1);

  return inlet + fill + eliminator;
}
