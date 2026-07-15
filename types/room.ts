import type { Appliance } from "./appliance";

export type Wall = {
  id: string;
  length: number;
  position: { x: number; z: number };
  rotation: number;
};

export type DoorWindow = {
  id: string;
  position: { x: number; y: number; z: number };
  dimensions: { x: number; y: number; z: number };
};

export type Room = {
  id: string;
  name: string;
  power: number;
  applianceCount: number;
  wallCount: number;
  doorCount: number;
  windowCount: number;
  origin?: { x: number; z: number };
  walls?: Wall[];
  appliances?: Appliance[];
  doors?: DoorWindow[];
  windows?: DoorWindow[];
};
