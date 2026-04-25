import ExpoModulesCore
import RoomPlan

@available(iOS 16.0, *)
public class RoomScannerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RoomScanner")

    Constant("isSupported") {
      RoomCaptureSession.isSupported
    }

    View(RoomScannerView.self) {
      Events("onScanComplete", "onObjectDetected")

      Prop("scanning") { (view: RoomScannerView, scanning: Bool) in
        view.setScanning(scanning)
      }
    }
  }
}
