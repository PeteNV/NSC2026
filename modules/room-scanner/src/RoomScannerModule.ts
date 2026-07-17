import { NativeModule, requireOptionalNativeModule } from 'expo';

import { RoomScannerModuleEvents } from './RoomScanner.types';

declare class RoomScannerModule extends NativeModule<RoomScannerModuleEvents> {
  isSupported: boolean;
}

const nativeModuleNames = ['RoomScanner', 'room-scanner'];

let nativeModule: RoomScannerModule | null = null;
let resolvedNativeModuleName: string | null = null;

for (const moduleName of nativeModuleNames) {
  const candidate = requireOptionalNativeModule<RoomScannerModule>(moduleName);

  if (candidate) {
    nativeModule = candidate;
    resolvedNativeModuleName = moduleName;
    break;
  }
}

export const roomScannerNativeModuleName = resolvedNativeModuleName;
export default nativeModule;
