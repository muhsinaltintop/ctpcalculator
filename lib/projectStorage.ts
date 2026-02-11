export const PROJECT_KEY = "ctp.project";

export type ProjectInformation = {
  projectName: string;
  units: "SI" | "IP";
  towerType: "Counterflow";
  country: string;
  city: string;
};

export type ProjectState = {
  projectInformation?: ProjectInformation;
  thermalConditions?: ThermalConditions;
  towerGeometry?: TowerGeometry;
  fillSection?: FillSection;
  fanPlenum?: FanPlenum;
};



export type SolveFor =
  | "towerCapability"
  | "power"
  | "coldWater"
  | "waterFlow";

export type ThermalConditions = {
  /* --- NEW (core) --- */
  solveFor: SolveFor;

  /* --- USER INPUTS --- */
  power?: number;              // HP or kW (solveFor=power)
  coldWater?: number;          // CWT
  totalFlow?: number;          // Water flow

  wetBulb: number;
  relativeHumidity: number;
  range?: number;

  /* --- ALTITUDE / PRESSURE TOGGLE --- */
  altitude?: number;           // m
  barometricPressure?: number; // kPa
};


export const THERMAL_DEFAULTS: ThermalConditions = {
  solveFor: "towerCapability",

  coldWater: 30,
  totalFlow: 250,

  wetBulb: 25,
  relativeHumidity: 30,
  range: 10,

  altitude: 850,
};

export const THERMAL_POWER_DEFAULTS: ThermalConditions = {
  solveFor: "power",

  power: 75, //kW
  coldWater: 30,

  wetBulb: 25,
  relativeHumidity: 30,
  range: 10,

  altitude: 850,
};



export type TowerGeometry = {
  numberOfCells: number;
  cellArrangement: "Inline" | "BackToBack";
  airInletConfig: "BothEndsOpen" | "OneEndOpen";
  louverType: "CL80-3.2";
  louverCoefficient: number;
  inletObstruction: number;
  inletHeight: number;
};

export const TOWER_GEOMETRY_DEFAULTS: TowerGeometry = {
  numberOfCells: 1,
  cellArrangement: "Inline",
  airInletConfig: "BothEndsOpen",
  louverType: "CL80-3.2",
  louverCoefficient: 2.15,
  inletObstruction: 0,
  inletHeight: 2,
};

export type FillSection = {
  fillType: "Film" | "Splash";
  fillHeight: number;
  surfaceFactor: number;
  merkelKa: number;
};

export const FILL_SECTION_DEFAULTS: FillSection = {
  fillType: "Film",
  fillHeight: 1.8,
  surfaceFactor: 1.0,
  merkelKa: 1.2,
};

export type FanPlenum = {
  fanType: "Axial" | "Centrifugal";
  airFlowRate: number;      // m3/s
  fanEfficiency: number;    // %
  plenumLossCoeff: number;  // dimensionless
  staticPressure: number;   // Pa
};

export const FAN_PLENUM_DEFAULTS: FanPlenum = {
  fanType: "Axial",
  airFlowRate: 85,
  fanEfficiency: 65,
  plenumLossCoeff: 0.3,
  staticPressure: 180,
};


export function loadProject(): ProjectState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProject(state: ProjectState) {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(state));
}

export function resetProject() {
  localStorage.removeItem(PROJECT_KEY);
}

export function resetThermalConditions() {
  const project = loadProject();

  saveProject({
    ...project,
    thermalConditions: undefined,
  });
}

export function resetProjectInformation() {
  const project = loadProject();

  saveProject({
    ...project,
    projectInformation: undefined,
  });
}

export function resetTowerGeometry() {
  const project = loadProject();

  saveProject({
    ...project,
    towerGeometry: undefined,
  });
}

export function resetFillSection() {
  const project = loadProject();

  saveProject({
    ...project,
    fillSection: undefined,
  });
}

export function resetFanPlenum() {
  const project = loadProject();

  saveProject({
    ...project,
    fanPlenum: undefined,
  });
}
