import ExpoModulesCore
import RoomPlan
import WebKit

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
@available(iOS 16.0, *)
public class RoomScannerView: ExpoView, RoomCaptureViewDelegate {
    private var roomCaptureView: RoomCaptureView?
    private let roomCaptureSessionConfig = RoomCaptureSession.Configuration()
    
    let onScanComplete = EventDispatcher()

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)

        DispatchQueue.main.async {
            let roomCaptureView = RoomCaptureView(frame: self.bounds)
            roomCaptureView.delegate = self
            roomCaptureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            self.roomCaptureView = roomCaptureView
            self.addSubview(roomCaptureView)
        }
    }

    func setScanning(_ scanning: Bool) {
        if scanning {
            roomCaptureView?.captureSession.run(configuration: roomCaptureSessionConfig)
        } else {
            roomCaptureView?.captureSession.stop()
        }
    }
    
    // RoomCaptureViewDelegate
    public func captureView(shouldPresent roomDataForProcessing: CapturedRoomData, error: Error?) -> Bool {
        return true
    }
    
    public func captureView(didPresent processedResult: CapturedRoom, error: Error?) {
        // Borrow Mapping Logic from https://github.com/fordat/expo-roomplan
        // Mapp walls for floorplan outline, use react-native-svg for 2D map??
        let walls = processedResult.walls.map { wall -> [String: Any] in
            return [
                "id": wall.identifier.uuidString,
                "length": wall.dimensions.x,
                "height": wall.dimensions.y,
                // Center point of the wall on the floor
                "position": [
                    "x": wall.transform.columns.3.x,
                    "z": wall.transform.columns.3.z],
                // Which way the wall faces
                "rotation": atan2(wall.transform.columns.0.z, wall.transform.columns.0.x)
            ]
        }
        
        let appliances = processedResult.objects.map { object -> [String: Any] in
            return [
                "id": object.identifier.uuidString, // Object ID
                "category": "\(object.category)", // eg. "refrigerator"
                "dimensions": [
                    "x": object.dimensions.x, // Width
                    "y": object.dimensions.y, // Height
                    "z": object.dimensions.z // Depth
                ],
                "confidence": "\(object.confidence)",
                // Position in room for 2D/3D mapping
                "position": [
                    "x": object.transform.columns.3.x,
                    "y": object.transform.columns.3.y,
                    "z": object.transform.columns.3.z
                ]
            ]
        }
        // JSON data
        onScanComplete([
            "appliances": appliances,
            "walls": walls,
            "timestamp": Date().timeIntervalSince1970,
            "metadata": [
                "wallCount": processedResult.walls.count,
                "doorCount": processedResult.doors.count,
                "windowCount": processedResult.windows.count
            ]
        ])
    }
}
