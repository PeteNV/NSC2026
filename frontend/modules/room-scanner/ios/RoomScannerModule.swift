import ExpoModulesCore
import RoomPlan

@available(iOS 16.0, *)
public class RoomScannerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RoomScanner") // Module Nmae

    Constant("isSupported") {
      RoomCaptureSession.isSupported
    }

    View(RoomScannerView.self) {
      Prop("isScanning") { (view: RoomScannerView, prop: Bool) in
        view.setScanning(prop)
      }

      Events("onScanComplete")
    }
  }
}
