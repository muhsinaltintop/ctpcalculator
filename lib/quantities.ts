// lib/quantities.ts

/* ------------------ */
/* Quantity Type      */
/* ------------------ */

export type Quantity =
  | "temperature"
  | "waterFlow"
  | "airFlow"
  | "length"
  | "pressure";

/* ------------------ */
/* Quantity Meta Map  */
/* ------------------ */

export const QuantityMeta = {
  temperature: {
    siUnit: "°C",
    ipUnit: "°F",
  },

  waterFlow: {
    siUnit: "m³/h",
    ipUnit: "gpm",
  },

  airFlow: {
    siUnit: "m³/s",
    ipUnit: "cfm",
  },

  length: {
    siUnit: "m",
    ipUnit: "ft",
  },

  pressure: {
    siUnit: "Pa",
    ipUnit: "inH₂O",
  },
} as const satisfies Record<
  Quantity,
  {
    siUnit: string;
    ipUnit: string;
  }
>;
