import type { Appliance } from "@/types/appliance";
import type { Room } from "@/types/room";
import { applianceBaselineMonthlyKwh } from "./baseline";

export const DAYS_PER_MONTH = 30;
export const GRID_CO2_KG_PER_KWH = 0.42;
export const FT_RATE_BAHT_PER_KWH = 0.1972;
export const VAT_RATE = 0.07;
export const SERVICE_CHARGE_BAHT = 38.22;

const TARIFF_TIERS = [
  { upTo: 150, rate: 3.2484 },
  { upTo: 400, rate: 4.2218 },
  { upTo: Infinity, rate: 4.4217 },
];

export function applianceDailyKwh(appliance: Appliance): number {
  return (appliance.power * appliance.usage) / 1000;
}

export function applianceMonthlyKwh(appliance: Appliance): number {
  return applianceDailyKwh(appliance) * DAYS_PER_MONTH;
}

export function roomMonthlyKwh(room: Room): number {
  return (room.appliances ?? []).reduce(
    (sum, a) => sum + applianceMonthlyKwh(a),
    0,
  );
}

export function homeMonthlyKwh(rooms: Room[]): number {
  return rooms.reduce((sum, r) => sum + roomMonthlyKwh(r), 0);
}

export function roomBaselineMonthlyKwh(room: Room): number {
  return (room.appliances ?? []).reduce(
    (sum, a) => sum + applianceBaselineMonthlyKwh(a),
    0,
  );
}

export function homeBaselineMonthlyKwh(rooms: Room[]): number {
  return rooms.reduce((sum, r) => sum + roomBaselineMonthlyKwh(r), 0);
}

export function calcCostBaht(monthlyKwh: number): number {
  let energyCharge = 0;
  let prev = 0;
  for (const tier of TARIFF_TIERS) {
    const span = Math.min(monthlyKwh, tier.upTo) - prev;
    if (span <= 0) break;
    energyCharge += span * tier.rate;
    prev = tier.upTo;
  }
  const ft = monthlyKwh * FT_RATE_BAHT_PER_KWH;
  return (energyCharge + ft + SERVICE_CHARGE_BAHT) * (1 + VAT_RATE);
}

export function calcCo2Kg(monthlyKwh: number): number {
  return monthlyKwh * GRID_CO2_KG_PER_KWH;
}

export type EnergySummary = {
  monthlyKwh: number;
  baselineKwh: number;
  deltaKwh: number;
  costBaht: number;
  co2Kg: number;
};

export function summarizeEnergy(rooms: Room[]): EnergySummary {
  const monthlyKwh = homeMonthlyKwh(rooms);
  const baselineKwh = homeBaselineMonthlyKwh(rooms);
  return {
    monthlyKwh,
    baselineKwh,
    deltaKwh: monthlyKwh - baselineKwh,
    costBaht: calcCostBaht(monthlyKwh),
    co2Kg: calcCo2Kg(monthlyKwh),
  };
}
