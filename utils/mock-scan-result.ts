import type { RoomPlanObject, ScanResult } from "@/modules/room-scanner";
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
  const halfLen = length / 2;
  return {
    id,
    length,
    height: 2.7,
    position: {
      x: px + Math.cos(rotation) * halfLen,
      z: pz + Math.sin(rotation) * halfLen,
    },
    rotation,
  };
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

function scanDoor(id: string, x: number, z: number): RoomPlanObject {
  return {
    id,
    category: "Door",
    dimensions: { x: 0.9, y: 2.1, z: 0.1 },
    confidence: "high",
    position: { x, y: 0, z },
    source: "roomplan",
  };
}

function scanWindow(id: string, x: number, z: number): RoomPlanObject {
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
  const r90 = Math.PI / 2;
  const r180 = Math.PI;
  return {
    appliances,
    walls: [
      wall(`w-${id}-l`, d, 0, 0, r90),
      wall(`w-${id}-t`, w, 0, d, 0),
      wall(`w-${id}-r`, d, w, d, -r90),
      wall(`w-${id}-b`, w, w, 0, r180),
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
    scanAppliance("a-sofa", "Sofa", 2.75, 2.0, 2.5, 1),
    scanAppliance("a-tv", "Television", 3.3, 0.35, 1.2, 0.1),
    scanAppliance("a-coffee", "Coffee Table", 3.5, 2.8, 1, 0.6),
    scanAppliance("a-ac", "Air Conditioner", 5.45, 2.15, 0.3, 0.9),
    scanAppliance("a-lamp", "Floor Lamp", 0.55, 3.65, 0.3, 0.3),
  ],
);

const KITCHEN_SCAN = makeScanResult(
  "KT",
  4,
  3.5,
  [scanDoor("d-kt-1", 2, 0)],
  [scanWindow("w-kt-1", 2.5, 3.5)],
  [
    scanAppliance("a-fridge", "Refrigerator", 0.8, 0.7, 0.8, 0.7),
    scanAppliance("a-stove", "Stove", 2.4, 0.6, 0.8, 0.6),
    scanAppliance("a-microwave", "Microwave", 3.75, 0.7, 0.5, 0.4),
    scanAppliance("a-sink", "Sink", 1.3, 3.25, 0.6, 0.5),
    scanAppliance("a-dishwasher", "Dishwasher", 0.6, 2.3, 0.6, 0.6),
  ],
);

const BEDROOM_SCAN = makeScanResult(
  "BD",
  4,
  4,
  [scanDoor("d-bd-1", 2, 0)],
  [scanWindow("w-bd-1", 2.5, 4)],
  [
    scanAppliance("a-bed", "Bed", 2.0, 2.6, 2, 2.2),
    scanAppliance("a-dresser", "Dresser", 3.25, 0.6, 1.5, 0.6),
    scanAppliance("a-nightstand", "Nightstand", 0.55, 2.75, 0.5, 0.5),
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
      scanAppliance("a-toilet", "Toilet", 1.05, 0.6, 0.5, 0.6),
      scanAppliance("a-shower", "Shower", 1.95, 0.9, 0.9, 0.9),
    ],
  );
}

export const MOCK_SCAN_RESULTS: ScanResult[] = [
  LIVING_SCAN,
  KITCHEN_SCAN,
  BEDROOM_SCAN,
  makeBathroomScan("BT1", "d-bt-1"),
];

const ROOM_NAMES = ["Living Room", "Kitchen", "Bedroom", "Bathroom"];

const ROOM_POWERS = [40, 50, 50, 40];

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

const ROOM_ORIGINS = [
  { x: 0, z: 0 },
  { x: 6, z: 0 },
  { x: 0, z: 5 },
  { x: 4, z: 5 },
];

export const MOCK_ROOMS: Room[] = MOCK_SCAN_RESULTS.map((scan, i) => {
  const room = mapScanToRoom(
    scan,
    String(i + 1),
    ROOM_NAMES[i],
    ROOM_POWERS[i],
  );
  return {
    ...room,
    appliances: enrichAppliances(room.appliances),
    origin: ROOM_ORIGINS[i],
  };
});

export const MOCK_APPLIANCES_BY_ROOM: Record<string, Appliance[]> =
  Object.fromEntries(
    MOCK_ROOMS.map((r) => [r.id, enrichAppliances(r.appliances)]),
  );

export const MOCK_ALL_APPLIANCES: Appliance[] = Object.values(
  MOCK_APPLIANCES_BY_ROOM,
).flat();
