import { ViewProps } from "react-native";

export type RoomPlanObject = {
  id: string;
  category: string;
  dimensions: { x: number; y: number; z: number };
  confidence: string;
  position: { x: number; y: number; z: number };
  source: "roomplan";
};

export type YOLOAppliance = {
  id: string;
  label: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  firstSeen: number;
  lastSeen: number;
  frameCount: number;
  source: "yolo";
};

export type ApplianceData = RoomPlanObject | YOLOAppliance;

export type WallData = {
  id: string;
  length: number;
  height: number;
  position: { x: number; z: number };
  rotation: number;
};

export type DoorWindowData = RoomPlanObject;

export type ScanResult = {
  appliances: ApplianceData[];
  walls: WallData[];
  doors: DoorWindowData[];
  windows: DoorWindowData[];
  timestamp: number;
  metadata: {
    wallCount: number;
    doorCount: number;
    windowCount: number;
    applianceCount: number;
  };
};

export type RoomScannerProps = {
  isScanning?: boolean;
  onScanComplete?: (event: { nativeEvent: ScanResult }) => void;
} & ViewProps;

export type YOLODetection = {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type RoomScannerViewProps = {
  scanning?: boolean;
  isScanning?: boolean;
  onObjectDetected?: (event: {
    nativeEvent: { detections: YOLODetection[] };
  }) => void;
  onScanComplete?: (event: { nativeEvent: ScanResult }) => void;
  style?: any;
};

export type RoomScannerModuleEvents = {
  onScanComplete: (payload: ScanResult) => void;
  onObjectDetected: (payload: { detections: YOLODetection[] }) => void;
};
