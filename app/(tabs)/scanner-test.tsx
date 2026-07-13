//
//  scanner-test.tsx
//
//
//  Created by Nattanan Vimuktanan on 4/5/26.
//

import React, { useState } from "react";
import {
    Button,
    NativeModules,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoomScannerModule, {
    roomScannerNativeModuleName,
} from "../../modules/room-scanner/src/RoomScannerModule";
import RoomScannerView, {
    isRoomScannerViewAvailable,
    roomScannerNativeViewName,
} from "../../modules/room-scanner/src/RoomScannerView";
import type { ScanResult } from "../../modules/room-scanner/src/RoomScanner.types";
import { mapScanToRoom } from "../../utils/scan-mapper";
import { MOCK_SCAN_RESULTS } from "../../utils/mock-scan-result";
import type { Room } from "../../types/room";

const Clipboard = NativeModules.Clipboard;

export default function ScannerTest() {
  const insets = useSafeAreaInsets();
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<ScanResult | null>(null);
  const [mappedRoom, setMappedRoom] = useState<Room | null>(null);
  const [copied, setCopied] = useState(false);
  const nativeUnimoduleProxy = NativeModules.NativeUnimoduleProxy;
  const moduleConstants =
    nativeUnimoduleProxy?.modulesConstants?.RoomScanner ??
    nativeUnimoduleProxy?.modulesConstants?.["room-scanner"] ??
    null;
  const hasRoomScannerModuleConstant = Boolean(moduleConstants);
  const roomScannerIsSupportedFlag = RoomScannerModule?.isSupported ?? null;
  const hasRoomScannerViewManager = Boolean(
    nativeUnimoduleProxy?.viewManagersMetadata?.RoomScanner ??
    nativeUnimoduleProxy?.viewManagersMetadata?.["room-scanner"],
  );
  const isSupported =
    (RoomScannerModule?.isSupported ?? false) && isRoomScannerViewAvailable;

  const handleTestCoupler = () => {
    const room = mapScanToRoom(MOCK_SCAN_RESULTS[0], "test-room-1", "Kitchen");
    setMappedRoom(room);
    console.log("Mapped Room:", JSON.stringify(room, null, 2));
  };

  const handleCopy = () => {
    if (!scanData) return;
    const json = JSON.stringify(scanData, null, 2);
    if (Clipboard?.setString) {
      Clipboard.setString(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.scannerContainer}>
        {isSupported ? (
          <RoomScannerView
            style={{ flex: 1 }}
            scanning={isScanning}
            onScanComplete={(event) => {
              console.log("Scan Data Received:", event.nativeEvent);
              setScanData(event.nativeEvent);
              setIsScanning(false);
            }}
          />
        ) : (
          <View style={styles.unsupportedState}>
            <Text style={styles.unsupportedTitle}>
              Room scanning is unavailable on this device.
            </Text>
            <Text style={styles.unsupportedCopy}>
              RoomPlan requires iOS 16 or later on a device with a LiDAR
              Scanner.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>Debug</Text>
          <Text style={styles.debugLine}>
            nativeModuleName: {String(roomScannerNativeModuleName)}
          </Text>
          <Text style={styles.debugLine}>
            nativeViewName: {String(roomScannerNativeViewName)}
          </Text>
          <Text style={styles.debugLine}>
            moduleConstant: {String(hasRoomScannerModuleConstant)}
          </Text>
          <Text style={styles.debugLine}>
            moduleIsSupported: {String(roomScannerIsSupportedFlag)}
          </Text>
          <Text style={styles.debugLine}>
            viewManagerMetadata: {String(hasRoomScannerViewManager)}
          </Text>
          <Text style={styles.debugLine}>
            isRoomScannerViewAvailable: {String(isRoomScannerViewAvailable)}
          </Text>
          <Text style={styles.debugLine}>
            finalIsSupported: {String(isSupported)}
          </Text>
        </View>
        <Button
          title={isScanning ? "Stop Scanning" : "Start Room Scan"}
          onPress={() => setIsScanning(!isScanning)}
          disabled={!isSupported}
        />

        <View style={{ height: 8 }} />

        <Button
          title="Test Coupler (Mock → Room)"
          onPress={handleTestCoupler}
          color="#4a90d9"
        />

        <ScrollView style={styles.results}>
          <View style={styles.resultHeader}>
            <Text style={styles.title}>Scan Result (raw):</Text>
            {scanData && (
              <Button
                title={copied ? "Copied!" : "Copy JSON"}
                onPress={handleCopy}
              />
            )}
          </View>
          <Text>
            {scanData ? JSON.stringify(scanData, null, 2) : "No data yet..."}
          </Text>

          {mappedRoom && (
            <>
              <Text style={styles.sectionTitle}>Mapped Room (flat):</Text>
              <Text>
                {JSON.stringify(mappedRoom, null, 2)}
              </Text>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scannerContainer: { flex: 2, backgroundColor: "#222" },
  unsupportedState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#4b1614",
  },
  unsupportedTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  unsupportedCopy: {
    color: "#f5d6d1",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  controls: { flex: 1, backgroundColor: "#fff", padding: 20 },
  debugPanel: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  debugTitle: { fontWeight: "700", marginBottom: 4 },
  debugLine: { fontSize: 12, color: "#333" },
  results: { marginTop: 10, backgroundColor: "#f4f4f4", padding: 10 },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: { fontWeight: "bold" },
  sectionTitle: { fontWeight: "bold", marginTop: 16, marginBottom: 5 },
});
