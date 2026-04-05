//
//  scanner-test.tsx
//  
//
//  Created by Nattanan Vimuktanan on 4/5/26.
//

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { RoomScannerView } from '../modules/room-scanner';

export default function ScannerTest() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<any>(null);

  return (
    <View style={styles.container}>
      {/* 1. The Native Scanner View */}
      <View style={styles.scannerContainer}>
        <RoomScannerView
          style={StyleSheet.absoluteFill}
          isScanning={isScanning}
          onScanComplete={(event) => {
            console.log("Scan Data Received:", event.nativeEvent);
            setScanData(event.nativeEvent);
            setIsScanning(false); // Stop scanning once we get results
          }}
        />
      </View>

      {/* 2. The Controls */}
      <View style={styles.controls}>
        <Button
          title={isScanning ? "Stop Scanning" : "Start Room Scan"}
          onPress={() => setIsScanning(!isScanning)}
        />
        
        <ScrollView style={styles.results}>
          <Text style={styles.title}>Results:</Text>
          <Text>{scanData ? JSON.stringify(scanData, null, 2) : "No data yet..."}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scannerContainer: { flex: 2, backgroundColor: '#222' },
  controls: { flex: 1, backgroundColor: '#fff', padding: 20 },
  results: { marginTop: 10, backgroundColor: '#f4f4f4', padding: 10 },
  title: { fontWeight: 'bold', marginBottom: 5 }
});
