export type UnitSystem = "SI" | "IP";

/* ---------- Temperature ---------- */
export const C_to_F = (c: number) => (c * 9) / 5 + 32;
export const F_to_C = (f: number) => ((f - 32) * 5) / 9;

/* ---------- Length ---------- */
export const m_to_ft = (m: number) => m * 3.28084;
export const ft_to_m = (ft: number) => ft / 3.28084;

/* ---------- Flow ---------- */
// water flow
export const m3h_to_gpm = (v: number) => v * 4.40287;
export const gpm_to_m3h = (v: number) => v / 4.40287;

// air flow
export const m3s_to_cfm = (v: number) => v * 2118.88;
export const cfm_to_m3s = (v: number) => v / 2118.88;

/* ---------- Pressure ---------- */
export const Pa_to_inH2O = (pa: number) => pa / 249.0889;
export const inH2O_to_Pa = (v: number) => v * 249.0889;
