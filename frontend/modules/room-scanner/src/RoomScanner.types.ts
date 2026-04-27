import { ViewProps } from "react-native";

export type ApplianceData = {
  id: string;
  category: string;
  dimensions: { x: number; y: number; z: number };
  confidence: string;
  position: { x: number; y: number; z: number };
};

export type WallData = {
  id: string;
  length: number;
  height: number;
  position: { x: number; z: number };
  rotation: number;
};

// Matches JSON output from Swift
export type RoomScannerProps = {
  isScanning?: boolean;
  onScanComplete?: (event: {
    nativeEvent: {
      appliances: ApplianceData[];
      walls: WallData[];
      timestamp: number;
      metadata: {
        wallCount: number;
        doorCount: number;
        windowCount: number;
      };
    };
  }) => void;
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

export type ScanResult = {
  appliances: any[];
  walls: any[];
  metadata: {
    wallCount: number;
    doorCount: number;
    windowCount: number;
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
