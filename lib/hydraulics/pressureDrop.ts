export function pressureLoss(
  k: number,
  velocity: number,
  densityRatio: number
) {
  return k * Math.pow(velocity / 4008.7, 2) * densityRatio;
}
