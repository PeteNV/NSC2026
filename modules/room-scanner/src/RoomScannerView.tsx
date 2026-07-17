import {
  requireNativeViewManager,
  requireOptionalNativeModule,
} from "expo-modules-core";
import * as React from "react";
import { Platform, View } from "react-native";
import { RoomScannerViewProps } from "./RoomScanner.types";

let NativeView: any;
let viewAvailable = false;
let resolvedNativeViewName: string | null = null;

for (const moduleName of ["RoomScanner", "room-scanner"]) {
  const nativeModule = requireOptionalNativeModule(moduleName);

  if (!nativeModule) {
    continue;
  }

  try {
    NativeView = requireNativeViewManager(moduleName);
    viewAvailable = true;
    resolvedNativeViewName = moduleName;
    break;
  } catch (e) {
    console.log(`Failed to load ${moduleName} native view:`, e);
  }
}

if (!NativeView) {
  NativeView = View;
}

export const isRoomScannerViewAvailable = viewAvailable;
export const roomScannerNativeViewName = resolvedNativeViewName;

export default function RoomScannerView(props: RoomScannerViewProps) {
  const normalizedProps = {
    ...props,
    scanning: props.scanning ?? props.isScanning,
  };

  // 2. Render the native LiDAR view if available
  if (Platform.OS === "ios" && viewAvailable) {
    return <NativeView {...normalizedProps} style={[{ flex: 1 }, props.style]} />;
  }

  // 3. Fallback UI
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#300",
      }}
    >
      {/* This is the red screen. If you see this, viewAvailable is false. */}
    </View>
  );
}
