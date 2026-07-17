import type {
  ScanResult,
  ApplianceData as ScanApplianceData,
} from "@/modules/room-scanner";
import type { Appliance } from "@/types/appliance";
import type { Room, Wall, DoorWindow } from "@/types/room";
import { baselineSeed } from "./energy";

const IGNORED_LABELS = new Set(["dishwasher"]);

function mapAppliance(a: ScanApplianceData, roomRotationDeg: number): Appliance {
  const isRoomPlan = a.source === "roomplan";
  const name = isRoomPlan ? a.category : a.label;
  const rotation =
    isRoomPlan && a.rotation !== undefined
      ? (-a.rotation * 180) / Math.PI
      : roomRotationDeg;
  const dimensions = isRoomPlan
    ? a.dimensions
    : a.realSize
      ? { x: a.realSize.width, y: a.realSize.height, z: a.realSize.width }
      : undefined;
  if (IGNORED_LABELS.has(name.toLowerCase())) {
    return {
      id: a.id,
      name,
      usage: 0,
      power: 0,
      position: a.position,
      dimensions,
      source: a.source,
      rotation,
    };
  }
  const { power, usage } = baselineSeed(name);
  return {
    id: a.id,
    name,
    usage,
    power,
    position: a.position,
    dimensions,
    source: a.source,
    rotation,
  };
}

function mapWall(w: ScanResult["walls"][number]): Wall {
  const halfLen = w.length / 2;
  return {
    id: w.id,
    length: w.length,
    position: {
      x: w.position.x - Math.cos(w.rotation) * halfLen,
      z: w.position.z - Math.sin(w.rotation) * halfLen,
    },
    rotation: (w.rotation * 180) / Math.PI,
  };
}

function computeRoomRotation(walls: ScanResult["walls"]): number {
  if (walls.length === 0) return 0;
  const offsets = walls.map((w) => {
    const deg = (w.rotation * 180) / Math.PI;
    const norm = ((deg % 90) + 90) % 90;
    return norm > 45 ? norm - 90 : norm;
  });
  const avg = offsets.reduce((a, b) => a + b, 0) / offsets.length;
  return -Math.round(avg);
}

function mapDoorWindow(d: ScanResult["doors"][number]): DoorWindow {
  return {
    id: d.id,
    position: d.position,
    dimensions: d.dimensions,
    rotation:
      d.rotation !== undefined ? (-d.rotation * 180) / Math.PI : undefined,
  };
}

export function mapScanToRoom(
  scan: ScanResult,
  roomId: string,
  roomName: string,
  existingPower?: number,
): Room {
  const offset = computeRoomRotation(scan.walls);
  return {
    id: roomId,
    name: roomName,
    power: existingPower ?? 0,
    applianceCount: scan.metadata.applianceCount,
    wallCount: scan.metadata.wallCount,
    doorCount: scan.metadata.doorCount,
    windowCount: scan.metadata.windowCount,
    rotation: -offset,
    walls: scan.walls.map(mapWall),
    appliances: scan.appliances.map((a) => mapAppliance(a, offset)),
    doors: scan.doors.map(mapDoorWindow),
    windows: scan.windows.map(mapDoorWindow),
  };
}

export function mapScanAppliances(
  appliances: ScanApplianceData[],
  roomRotationDeg = 0,
): Appliance[] {
  return appliances.map((a) => mapAppliance(a, roomRotationDeg));
}
