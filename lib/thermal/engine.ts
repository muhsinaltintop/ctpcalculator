import { calculateKaVL } from "./merkelRequired";

/**
 * Bu fonksiyon airflow verilince KaV/L üretir.
 * Şu an basitleştirilmiş model kullanıyoruz.
 * Sonradan gerçek Merkel + psychrometrics bağlanacak.
 */
export function computeKaVLForAirflow(
  input: any,
  airflow: number
) {
  const L = input.thermal.waterFlow;

  const LG = L / airflow;

  // Basitleştirilmiş model:
  // airflow artarsa KaVL artar gibi davranıyoruz
  const simulatedKaVL = 0.8 * Math.log(airflow) * LG;

  return simulatedKaVL;
}
