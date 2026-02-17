import { TowerInputModel } from "@/lib/models/input";

/**
 * Placeholder "available KaV/L" correlation.
 * Later: replace with real fill-specific curve/table lookup.
 *
 * We make it monotonic with airflow so bisection is stable.
 */
export function availableKaVL(input: TowerInputModel, G_kgps: number): number {
  // monotonic increasing curve (fake)
  // Tune these constants later.
  const a = 0.5;
  const b = 0.08;
  return a + b * Math.log(Math.max(G_kgps, 1));
}
