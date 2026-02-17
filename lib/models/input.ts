export type UnitSystem = "SI" | "IP";

export type SolveMode =
  | "POWER"
  | "COLD_WATER"
  | "FLOW"
  | "CAPABILITY";

export interface ThermalInputs {
  waterFlow: number;      // m3/hr or gpm
  hotWaterTemp: number;   // °C or °F
  coldWaterTemp: number;
  wetBulbTemp: number;
  relativeHumidity: number;
  altitude: number;       // m or ft
  fillDerate?: number;
}

export interface GeometryInputs {
  towerWidth: number;
  towerLength: number;
  fillHeight: number;
  fanDiameter: number;
  plenumHeight: number;
}

export interface FanInputs {
  totalEfficiency: number;
  transmissionEfficiency: number;
  tipClearance: number;
}

export interface TowerInputModel {
  units: UnitSystem;
  solveMode: SolveMode;
  thermal: ThermalInputs;
  geometry: GeometryInputs;
  fan: FanInputs;
}
