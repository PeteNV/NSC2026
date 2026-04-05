import { viewProps } from 'react-native';

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
    }
  }) => void;
} & ViewProps;
