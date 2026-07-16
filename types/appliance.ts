export type Appliance = {
  id: string;
  name: string;
  usage: number;
  power: number;
  position?: { x: number; y: number; z: number };
  dimensions?: { x: number; y: number; z: number };
  rotation?: number;
  source?: "roomplan" | "yolo" | "manual";
};
