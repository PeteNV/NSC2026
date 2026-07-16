import type {
  ScanResult,
  ApplianceData as ScanApplianceData,
} from "@/modules/room-scanner";
import type { Appliance } from "@/types/appliance";
import type { Room, Wall, DoorWindow } from "@/types/room";
import { baselineSeed } from "./energy";

const IGNORED_LABELS = new Set(["dishwasher"]);

function mapAppliance(a: ScanApplianceData): Appliance {
  const isRoomPlan = a.source === "roomplan";
  const name = isRoomPlan ? a.category : a.label;
  if (IGNORED_LABELS.has(name.toLowerCase())) {
    return {
      id: a.id,
      name,
      usage: 0,
      power: 0,
      position: a.position,
      dimensions: isRoomPlan ? a.dimensions : undefined,
      source: a.source,
    };
  }
  const { power, usage } = baselineSeed(name);
  return {
    id: a.id,
    name,
    usage,
    power,
    position: a.position,
    dimensions: isRoomPlan ? a.dimensions : undefined,
    source: a.source,
  };
}

function mapWall(w: ScanResult["walls"][number]): Wall {
  return {
    id: w.id,
    length: w.length,
    position: w.position,
    rotation: w.rotation,
  };
}

function mapDoorWindow(d: ScanResult["doors"][number]): DoorWindow {
  return {
    id: d.id,
    position: d.position,
    dimensions: d.dimensions,
  };
}

export function mapScanToRoom(
  scan: ScanResult,
  roomId: string,
  roomName: string,
  existingPower?: number,
): Room {
  return {
    id: roomId,
    name: roomName,
    power: existingPower ?? 0,
    applianceCount: scan.metadata.applianceCount,
    wallCount: scan.metadata.wallCount,
    doorCount: scan.metadata.doorCount,
    windowCount: scan.metadata.windowCount,
    walls: scan.walls.map(mapWall),
    appliances: scan.appliances.map(mapAppliance),
    doors: scan.doors.map(mapDoorWindow),
    windows: scan.windows.map(mapDoorWindow),
  };
}

export function mapScanAppliances(
  appliances: ScanApplianceData[],
): Appliance[] {
  return appliances.map(mapAppliance);
}
