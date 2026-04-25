//
//  scanner-test.tsx
//  
//
//  Created by Nattanan Vimuktanan on 4/5/26.
//

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { NativeModules } from 'react-native';
import RoomScannerModule from '../modules/room-scanner/src/RoomScannerModule';
import RoomScannerView, { isRoomScannerViewAvailable } from '../modules/room-scanner/src/RoomScannerView';

export default function ScannerTest() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanData, setScanData] = useState<any>(null);
    const [latestObject, setLatestObject] = useState<string | null>(null);
    const nativeUnimoduleProxy = NativeModules.NativeUnimoduleProxy;
    const moduleConstants = nativeUnimoduleProxy?.modulesConstants?.RoomScanner ?? null;
    const hasRoomScannerModuleConstant = Boolean(moduleConstants);
    const roomScannerIsSupportedFlag = RoomScannerModule?.isSupported ?? null;
    const hasRoomScannerViewManager = Boolean(nativeUnimoduleProxy?.viewManagersMetadata?.RoomScanner);

    const isSupported = (RoomScannerModule?.isSupported ?? false) && isRoomScannerViewAvailable;
    
    const handleObjectDetected = (event: any) => {
      const { detections } = event.nativeEvent;
      if (detections.length > 0) {
        const topHit = detections[0].label;
        setLatestObject(topHit.replace('_', ' ')); // "air_conditioner" -> "air conditioner"
      }
    };

    const handleScanComplete = (event: any) => {
      console.log('Scan Data Received:', event.nativeEvent);
      setScanData(event.nativeEvent);
      setLatestObject(null); // Clear latest object on scan complete
      setIsScanning(false);
    }

  return (
    <View style={styles.container}>
    {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        {isSupported ? (
          <>
          <RoomScannerView
            style={StyleSheet.absoluteFill}
            isScanning={isScanning}
            onScanComplete={handleScanComplete}
            onObjectDetected={handleObjectDetected}
          />
          
          {/* Real-time YOLO Detection Overlay */}
          {latestObject && isScanning && (
            <View style={styles.detectionOverlay}>
              <Text style={styles.detectionText}>Target Locked: {latestObject}</Text>
            </View>
          )}
          </>
        ) : (
          <View style={styles.unsupportedState}>
            <Text style={styles.unsupportedTitle}>Room scanning is unavailable on this device.</Text>
            {/* Available on Pro iPhone models with iOS 16+, starting with the iPhone 12 Pro and later */}
            <Text style={styles.unsupportedCopy}>
              RoomPlan requires iOS 16 or later on a device with a LiDAR Scanner. 
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>Debug gates</Text>
          <Text style={styles.debugLine}>moduleConstant: {String(hasRoomScannerModuleConstant)}</Text>
          <Text style={styles.debugLine}>moduleIsSupported: {String(roomScannerIsSupportedFlag)}</Text>
          <Text style={styles.debugLine}>viewManagerMetadata: {String(hasRoomScannerViewManager)}</Text>
          <Text style={styles.debugLine}>isRoomScannerViewAvailable: {String(isRoomScannerViewAvailable)}</Text>
          <Text style={styles.debugLine}>finalIsSupported: {String(isSupported)}</Text>
        </View>
        <Button
          title={isScanning ? 'Stop Scanning' : 'Start Room Scan'}
          onPress={() => setIsScanning(!isScanning)}
          disabled={!isSupported}
        />

        <ScrollView style={styles.results}>
          <Text style={styles.title}>Results:</Text>
          <Text>{scanData ? JSON.stringify(scanData, null, 2) : 'No data yet...'}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scannerContainer: { flex: 2, backgroundColor: '#222' },
  detectionOverlay: {
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      backgroundColor: 'rgba(52, 199, 89, 0.85)',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    detectionText: { 
      color: '#fff', 
      fontSize: 16, 
      fontWeight: '800', 
      textTransform: 'capitalize',
      letterSpacing: 0.5
    },
  unsupportedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#4b1614',
  },
  unsupportedTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  unsupportedCopy: {
    color: '#f5d6d1',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  controls: { flex: 1, backgroundColor: '#fff', padding: 20 },
  debugPanel: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  debugTitle: { fontWeight: '700', marginBottom: 4 },
  debugLine: { fontSize: 12, color: '#333' },
  results: { marginTop: 10, backgroundColor: '#f4f4f4', padding: 10 },
  title: { fontWeight: 'bold', marginBottom: 5 },
});
