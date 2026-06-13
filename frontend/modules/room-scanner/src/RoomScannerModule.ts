import { NativeModule, requireOptionalNativeModule } from 'expo';

import { RoomScannerModuleEvents } from './RoomScanner.types';

declare class RoomScannerModule extends NativeModule<RoomScannerModuleEvents> {
  isSupported: boolean;
}

export default requireOptionalNativeModule<RoomScannerModule>('RoomScanner');
