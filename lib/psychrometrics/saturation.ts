// SI: temperature in °C, output in kPa
export function saturationPressure_kPa(Tc: number): number {
  if (!Number.isFinite(Tc)) throw new Error("Temperature must be finite.");

  // Buck equation over liquid water, practical range ~ -20..50°C.
  const es_hPa =
    6.1121 * Math.exp((18.678 - Tc / 234.5) * (Tc / (257.14 + Tc)));

  return es_hPa / 10; // hPa -> kPa
}
