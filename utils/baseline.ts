import type { Appliance } from "@/types/appliance";

export type BaselineClass =
  | "air_conditioner"
  | "air_fryer"
  | "air_purifier"
  | "blender"
  | "coffee_machine"
  | "desktop"
  | "electric_kettle"
  | "electric_whisker"
  | "fan"
  | "hair_dryer"
  | "induction_cooker"
  | "iron"
  | "laptop"
  | "light"
  | "microwave"
  | "oven"
  | "printer"
  | "refrigerator"
  | "rice_cooker"
  | "router"
  | "screen"
  | "stove"
  | "toaster"
  | "vacuum"
  | "washing_machine";

export type ApplianceBaseline = {
  powerMinW: number | null;
  powerMaxW: number | null;
  monthlyKwhMin: number;
  monthlyKwhMax: number;
  monthlyKwhMid: number;
};

export const APPLIANCE_BASELINE: Record<BaselineClass, ApplianceBaseline> = {
  air_conditioner: { powerMinW: 1000, powerMaxW: 3500, monthlyKwhMin: 180, monthlyKwhMax: 600, monthlyKwhMid: 390 },
  air_fryer: { powerMinW: 1200, powerMaxW: 2000, monthlyKwhMin: 10, monthlyKwhMax: 30, monthlyKwhMid: 20 },
  air_purifier: { powerMinW: 20, powerMaxW: 100, monthlyKwhMin: 5, monthlyKwhMax: 36, monthlyKwhMid: 20.5 },
  blender: { powerMinW: 300, powerMaxW: 1000, monthlyKwhMin: 1, monthlyKwhMax: 5, monthlyKwhMid: 3 },
  coffee_machine: { powerMinW: 800, powerMaxW: 2000, monthlyKwhMin: 10, monthlyKwhMax: 30, monthlyKwhMid: 20 },
  desktop: { powerMinW: 220, powerMaxW: 700, monthlyKwhMin: 40, monthlyKwhMax: 170, monthlyKwhMid: 105 },
  electric_kettle: { powerMinW: 1000, powerMaxW: 2500, monthlyKwhMin: 15, monthlyKwhMax: 30, monthlyKwhMid: 22.5 },
  electric_whisker: { powerMinW: 300, powerMaxW: 1000, monthlyKwhMin: 1, monthlyKwhMax: 5, monthlyKwhMid: 3 },
  fan: { powerMinW: 30, powerMaxW: 75, monthlyKwhMin: 5, monthlyKwhMax: 18, monthlyKwhMid: 11.5 },
  hair_dryer: { powerMinW: 800, powerMaxW: 2000, monthlyKwhMin: 2, monthlyKwhMax: 8, monthlyKwhMid: 5 },
  induction_cooker: { powerMinW: 1500, powerMaxW: 3000, monthlyKwhMin: 50, monthlyKwhMax: 100, monthlyKwhMid: 75 },
  iron: { powerMinW: 1000, powerMaxW: 2500, monthlyKwhMin: 3, monthlyKwhMax: 12, monthlyKwhMid: 7.5 },
  laptop: { powerMinW: 20, powerMaxW: 100, monthlyKwhMin: 3.6, monthlyKwhMax: 24, monthlyKwhMid: 13.8 },
  light: { powerMinW: 5, powerMaxW: 20, monthlyKwhMin: 1.2, monthlyKwhMax: 7.2, monthlyKwhMid: 4.2 },
  microwave: { powerMinW: 600, powerMaxW: 1200, monthlyKwhMin: 3, monthlyKwhMax: 6, monthlyKwhMid: 4.5 },
  oven: { powerMinW: 2000, powerMaxW: 4000, monthlyKwhMin: 30, monthlyKwhMax: 60, monthlyKwhMid: 45 },
  printer: { powerMinW: 20, powerMaxW: 1000, monthlyKwhMin: 2, monthlyKwhMax: 20, monthlyKwhMid: 11 },
  refrigerator: { powerMinW: null, powerMaxW: null, monthlyKwhMin: 33, monthlyKwhMax: 50, monthlyKwhMid: 41.7 },
  rice_cooker: { powerMinW: 600, powerMaxW: 1500, monthlyKwhMin: 15, monthlyKwhMax: 60, monthlyKwhMid: 37.5 },
  router: { powerMinW: 5, powerMaxW: 30, monthlyKwhMin: 3, monthlyKwhMax: 11, monthlyKwhMid: 7 },
  screen: { powerMinW: 50, powerMaxW: 200, monthlyKwhMin: 6, monthlyKwhMax: 30, monthlyKwhMid: 18 },
  stove: { powerMinW: 1500, powerMaxW: 3000, monthlyKwhMin: 50, monthlyKwhMax: 100, monthlyKwhMid: 75 },
  toaster: { powerMinW: 700, powerMaxW: 1500, monthlyKwhMin: 3, monthlyKwhMax: 9, monthlyKwhMid: 6 },
  vacuum: { powerMinW: 1000, powerMaxW: 2500, monthlyKwhMin: 10, monthlyKwhMax: 30, monthlyKwhMid: 20 },
  washing_machine: { powerMinW: 1000, powerMaxW: 2500, monthlyKwhMin: 16, monthlyKwhMax: 50, monthlyKwhMid: 33 },
};

const NAME_ALIASES: Record<string, BaselineClass> = {
  television: "screen",
  tv: "screen",
  monitor: "screen",
  computer: "desktop",
  pc: "desktop",
  fridge: "refrigerator",
  ceiling_fan: "fan",
  led_lights: "light",
  led_lamp: "light",
  lamp: "light",
  floor_lamp: "light",
  coffee_maker: "coffee_machine",
  kettle: "electric_kettle",
  vacuum_cleaner: "vacuum",
  whisker: "electric_whisker",
  mixer: "electric_whisker",
  hand_mixer: "electric_whisker",
};

function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function resolveBaselineClass(name: string): BaselineClass | null {
  const key = normalize(name);
  if (key in APPLIANCE_BASELINE) return key as BaselineClass;
  return NAME_ALIASES[key] ?? null;
}

export function applianceBaseline(name: string): ApplianceBaseline | null {
  const cls = resolveBaselineClass(name);
  return cls ? APPLIANCE_BASELINE[cls] : null;
}

export function applianceBaselineMonthlyKwh(appliance: Appliance): number {
  return applianceBaseline(appliance.name)?.monthlyKwhMid ?? 0;
}
