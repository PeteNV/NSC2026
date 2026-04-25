import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
import { NativeModules, View } from "react-native";
import { RoomScannerViewProps } from "./RoomScanner.types";

const viewManagersMetadata = NativeModules.NativeUnimoduleProxy?.viewManagersMetadata ?? {};
const roomScannerModule = NativeModules.NativeUnimoduleProxy?.modulesConstants?.RoomScanner ?? null;

function debugLog(hypothesisId: string, message: string, data: Record<string, unknown>) {
  // #region agent log
  fetch("http://127.0.0.1:7361/ingest/27a670c6-387b-4182-b229-95f8b143735b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "fbbefc" },
    body: JSON.stringify({
      sessionId: "fbbefc",
      runId: "initial",
      hypothesisId,
      location: "frontend/modules/room-scanner/src/RoomScannerView.tsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

debugLog("H1", "room scanner metadata snapshot", {
  hasNativeUnimoduleProxy: Boolean(NativeModules.NativeUnimoduleProxy),
  hasRoomScannerViewManager: Boolean(viewManagersMetadata.RoomScanner),
  viewManagerKeys: Object.keys(viewManagersMetadata).slice(0, 20),
});
debugLog("H2", "room scanner module constants snapshot", {
  hasRoomScannerModuleConstants: Boolean(roomScannerModule),
  roomScannerModuleKeys: roomScannerModule ? Object.keys(roomScannerModule) : [],
});

export const isRoomScannerViewAvailable = Boolean(viewManagersMetadata.RoomScanner);

const NativeView = isRoomScannerViewAvailable ? requireNativeViewManager("RoomScanner") : View;

export default function RoomScannerView(props: RoomScannerViewProps) {
  React.useEffect(() => {
    debugLog("H3", "room scanner view render path", {
      isRoomScannerViewAvailable,
      nativeViewType: isRoomScannerViewAvailable ? "RoomScanner(native)" : "View(fallback)",
      propKeys: Object.keys(props ?? {}),
    });
  }, [props]);

  return <NativeView {...props} />;
}
