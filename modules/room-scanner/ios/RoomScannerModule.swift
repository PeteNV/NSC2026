import ExpoModulesCore
import RoomPlan

@available(iOS 16.0, *)
public class RoomScannerModule: Module {
  public func definition() -> ModuleDefinition {
    // Exposes the native RoomPlan integration to JavaScript as `RoomScanner`
    Name("RoomScanner")

    // Lets JavaScript check RoomPlan availability before attempting to present the scanner
    Constant("isSupported") {
      RoomCaptureSession.isSupported
    }

    View(RoomScannerView.self) {
      // Forwards scan completion and object-detection updates emitted by the native view
      Events("onScanComplete", "onObjectDetected")

      // Starts or stops the capture workflow based on the React `scanning` prop (property).
      Prop("scanning") { (view: RoomScannerView, scanning: Bool) in
        view.setScanning(scanning)
      }
    }
  }
}
