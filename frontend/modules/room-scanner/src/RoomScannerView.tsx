import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

export type RoomScannerViewProps = {
  isScanning: boolean;
  onScanComplete: (event: any) => void;
} & ViewProps;

const NativeView: React.ComponentType<RoomScannerViewProps> =
  requireNativeViewManager('RoomScanner');

export default function RoomScannerView(props: RoomScannerViewProps) {
  return <NativeView {...props} />;
}
