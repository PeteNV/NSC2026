//
//  scanner-test.tsx
//  
//
//  Created by Nattanan Vimuktanan on 4/5/26.
//

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import RoomScannerModule from '../../modules/room-scanner/src/RoomScannerModule';
import RoomScannerView from '../../modules/room-scanner/src/RoomScannerView';

export default function ScannerTest() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  const isSupported = RoomScannerModule?.isSupported ?? false;

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        {isSupported ? (
          <RoomScannerView
            style={StyleSheet.absoluteFill}
            isScanning={isScanning}
            onScanComplete={(event) => {
              console.log('Scan Data Received:', event.nativeEvent);
              setScanData(event.nativeEvent);
              setIsScanning(false);
            }}
          />
        ) : (
          <View style={styles.unsupportedState}>
            <Text style={styles.unsupportedTitle}>Room scanning is unavailable on this device.</Text>
            <Text style={styles.unsupportedCopy}>
              RoomPlan requires iOS 16 or later on a device with a LiDAR Scanner.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
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
  results: { marginTop: 10, backgroundColor: '#f4f4f4', padding: 10 },
  title: { fontWeight: 'bold', marginBottom: 5 },
});
