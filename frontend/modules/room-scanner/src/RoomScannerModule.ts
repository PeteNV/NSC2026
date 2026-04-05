import { NativeModule, requireNativeModule } from 'expo';

import { RoomScannerModuleEvents } from './RoomScanner.types';

declare class RoomScannerModule extends NativeModule<RoomScannerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RoomScannerModule>('RoomScanner');
