import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { RoomScannerProps } from './RoomScanner.types';

// Connects to 'Name("RoomScanner") inside RoomScannerModule.swift
const NativeView: React.ComponentType<RoomScannerViewProps> =
  requireNativeViewManager('RoomScanner');

export default function RoomScannerView(props: RoomScannerViewProps) {
  return <NativeView {...props} />;
}
