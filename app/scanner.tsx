import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoomScannerModule from "../modules/room-scanner/src/RoomScannerModule";
import RoomScannerView, {
    isRoomScannerViewAvailable,
} from "../modules/room-scanner/src/RoomScannerView";
import type { ScanResult } from "../modules/room-scanner/src/RoomScanner.types";
import { useScanResult } from "../hooks/useScanResult";

export default function FullScreenScanner() {
    const insets = useSafeAreaInsets();
    const [isScanning, setIsScanning] = useState(false);
    const { setLastResult } = useScanResult();
    const isSupported =
        (RoomScannerModule?.isSupported ?? false) && isRoomScannerViewAvailable;

    const handleScanComplete = (event: { nativeEvent: ScanResult }) => {
        console.log("Scan Data Received:", event.nativeEvent);
        setLastResult(event.nativeEvent);
        setIsScanning(false);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {isSupported ? (
                <RoomScannerView
                    style={styles.scanner}
                    scanning={isScanning}
                    onScanComplete={handleScanComplete}
                />
            ) : (
                <View style={styles.unsupported}>
                    <Text style={styles.unsupportedTitle}>
                        Room scanning is unavailable on this device.
                    </Text>
                    <Text style={styles.unsupportedCopy}>
                        RoomPlan requires iOS 16 or later on a device with a
                        LiDAR Scanner.
                    </Text>
                </View>
            )}

            <View style={styles.overlay}>
                <Button
                    title="Close"
                    onPress={() => router.back()}
                    color="#666"
                />
                <View style={{ width: 12 }} />
                <Button
                    title={isScanning ? "Stop Scanning" : "Start Room Scan"}
                    onPress={() => setIsScanning(!isScanning)}
                    disabled={!isSupported}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    scanner: { flex: 1 },
    unsupported: {
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
    overlay: {
        position: "absolute",
        bottom: 40,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "center",
    },
});
