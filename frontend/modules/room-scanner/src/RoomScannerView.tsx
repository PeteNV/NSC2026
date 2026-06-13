import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
import { Platform, View } from "react-native";
import { RoomScannerViewProps } from "./RoomScanner.types";

let NativeView: any;
let viewAvailable = false;

try {
  // Try to load the modern Expo module view
  NativeView = requireNativeViewManager("RoomScanner");
  viewAvailable = true;
} catch (e) {
  // Fallback if not found
  NativeView = View;
  viewAvailable = false;
  console.log("Failed to load RoomScanner native view:", e);
}

// 1. Export the true/false status so your parent debug screen can see it!
export const isRoomScannerViewAvailable = viewAvailable;

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
