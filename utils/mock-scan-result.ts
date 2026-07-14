import type { ScanResult, RoomPlanObject } from "@/modules/room-scanner";
import type { Appliance } from "@/types/appliance";
import type { Room } from "@/types/room";
import { mapScanToRoom } from "./scan-mapper";

function wall(
  id: string,
  length: number,
  px: number,
  pz: number,
  rotation: number,
): ScanResult["walls"][number] {
  return { id, length, height: 2.7, position: { x: px, z: pz }, rotation };
}

function scanAppliance(
  id: string,
  category: string,
  px: number,
  pz: number,
  dx: number,
  dz: number,
): RoomPlanObject {
  return {
    id,
    category,
    dimensions: { x: dx, y: 0.5, z: dz },
    confidence: "medium",
    position: { x: px, y: 0, z: pz },
    source: "roomplan",
  };
}

function scanDoor(
  id: string,
  x: number,
  z: number,
): RoomPlanObject {
  return {
    id,
    category: "Door",
    dimensions: { x: 0.9, y: 2.1, z: 0.1 },
    confidence: "high",
    position: { x, y: 0, z },
    source: "roomplan",
  };
}

function scanWindow(
  id: string,
  x: number,
  z: number,
): RoomPlanObject {
  return {
    id,
    category: "Window",
    dimensions: { x: 1.2, y: 1.2, z: 0.1 },
    confidence: "high",
    position: { x, y: 1.0, z },
    source: "roomplan",
  };
}

function makeScanResult(
  id: string,
  w: number,
  d: number,
  doors: ScanResult["doors"],
  windows: ScanResult["windows"],
  appliances: ScanResult["appliances"],
): ScanResult {
  return {
    appliances,
    walls: [
      wall(`w-${id}-l`, d, 0, 0, 90),
      wall(`w-${id}-t`, w, 0, d, 0),
      wall(`w-${id}-r`, d, w, d, -90),
      wall(`w-${id}-b`, w, w, 0, 180),
    ],
    doors,
    windows,
    timestamp: Date.now(),
    metadata: {
      wallCount: 4,
      doorCount: doors.length,
      windowCount: windows.length,
      applianceCount: appliances.length,
    },
  };
}

const LIVING_SCAN = makeScanResult(
  "LR",
  6,
  4.5,
  [scanDoor("d-lr-1", 2.5, 0), scanDoor("d-lr-2", 6, 2)],
  [scanWindow("w-lr-1", 1.5, 4.5), scanWindow("w-lr-2", 4.0, 4.5)],
  [
    scanAppliance("a-sofa", "Sofa", 1.5, 1.5, 2.5, 1),
    scanAppliance("a-tv", "Television", 2.7, 0.3, 1.2, 0.1),
    scanAppliance("a-coffee", "Coffee Table", 3, 2.5, 1, 0.6),
    scanAppliance("a-ac", "Air Conditioner", 5.8, 2, 0.9, 0.3),
    scanAppliance("a-lamp", "Floor Lamp", 0.4, 3.5, 0.3, 0.3),
  ],
);

const KITCHEN_SCAN = makeScanResult(
  "KT",
  4,
  3.5,
  [scanDoor("d-kt-1", 2, 0)],
  [scanWindow("w-kt-1", 2.5, 3.5)],
  [
    scanAppliance("a-fridge", "Refrigerator", 0.3, 0.3, 0.8, 0.7),
    scanAppliance("a-stove", "Stove", 2, 0.3, 0.8, 0.6),
    scanAppliance("a-microwave", "Microwave", 3.5, 0.5, 0.5, 0.4),
    scanAppliance("a-sink", "Sink", 1, 3.2, 0.6, 0.5),
    scanAppliance("a-dishwasher", "Dishwasher", 0.3, 2, 0.6, 0.6),
  ],
);

const BEDROOM_SCAN = makeScanResult(
  "BD",
  4,
  4,
  [scanDoor("d-bd-1", 2, 0)],
  [scanWindow("w-bd-1", 2.5, 4)],
  [
    scanAppliance("a-bed", "Bed", 1, 1.5, 2, 2.2),
    scanAppliance("a-dresser", "Dresser", 3, 0.3, 1.5, 0.6),
    scanAppliance("a-nightstand", "Nightstand", 0.3, 2.5, 0.5, 0.5),
  ],
);

function makeBathroomScan(id: string, doorId: string): ScanResult {
  return makeScanResult(
    id,
    2.5,
    2,
    [scanDoor(doorId, 1.2, 0)],
    [],
    [
      scanAppliance("a-toilet", "Toilet", 0.8, 0.3, 0.5, 0.6),
      scanAppliance("a-shower", "Shower", 1.5, 0.3, 0.9, 0.9),
    ],
  );
}

export const MOCK_SCAN_RESULTS: ScanResult[] = [
  LIVING_SCAN,
  KITCHEN_SCAN,
  BEDROOM_SCAN,
  makeBathroomScan("BT1", "d-bt-1"),
  makeBathroomScan("BT2", "d-bt-2"),
  makeBathroomScan("BT3", "d-bt-3"),
  makeBathroomScan("BT4", "d-bt-4"),
];

const ROOM_NAMES = [
  "Living Room",
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Bathroom",
  "Bathroom",
  "Bathroom",
];

const ROOM_POWERS = [40, 50, 50, 40, 60, 60, 40];

const APPLIANCE_POWER: Record<string, { power: number; usage: number }> = {
  "a-sofa": { power: 0, usage: 0 },
  "a-tv": { power: 120, usage: 4 },
  "a-coffee": { power: 0, usage: 0 },
  "a-ac": { power: 1500, usage: 8 },
  "a-lamp": { power: 60, usage: 4 },
  "a-fridge": { power: 150, usage: 24 },
  "a-stove": { power: 2000, usage: 3 },
  "a-microwave": { power: 1200, usage: 1 },
  "a-sink": { power: 0, usage: 0 },
  "a-dishwasher": { power: 500, usage: 2 },
  "a-bed": { power: 0, usage: 0 },
  "a-dresser": { power: 0, usage: 0 },
  "a-nightstand": { power: 0, usage: 0 },
  "a-toilet": { power: 0, usage: 0 },
  "a-shower": { power: 0, usage: 0 },
};

function enrichAppliances(appliances?: Appliance[]): Appliance[] {
  if (!appliances) return [];
  return appliances.map((a) => ({
    ...a,
    ...(APPLIANCE_POWER[a.id] ?? { power: 0, usage: 0 }),
  }));
}

export const MOCK_ROOMS: Room[] = MOCK_SCAN_RESULTS.map((scan, i) => {
  const room = mapScanToRoom(scan, String(i + 1), ROOM_NAMES[i], ROOM_POWERS[i]);
  return {
    ...room,
    appliances: enrichAppliances(room.appliances),
  };
});

export const MOCK_APPLIANCES_BY_ROOM: Record<string, Appliance[]> =
  Object.fromEntries(MOCK_ROOMS.map((r) => [r.id, enrichAppliances(r.appliances)]));

export const MOCK_ALL_APPLIANCES: Appliance[] = Object.values(
  MOCK_APPLIANCES_BY_ROOM,
).flat();
