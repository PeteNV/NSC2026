import ExpoModulesCore
import RoomPlan
import WebKit
import SwiftUI
import ARKit
import UIKit

@available(iOS 16.0, *)
public class RoomScannerView: ExpoView, RoomCaptureViewDelegate, ARSessionDelegate {
    // RoomPlan does room reconstruction while YOLO runs object detection on sampled frames.
    private var roomCaptureView: RoomCaptureView?
    private let roomCaptureSessionConfig = RoomCaptureSession.Configuration()
    private var yoloDetector: YOLODetector?
    private var yoloTracker = YOLOTracker()
    private var frameCounter = 0
    private let detectionFrameInterval = 15
    private let detectionOverlayView = UIView()
    private var lastLoggedDetectionDate = Date.distantPast

    let onScanComplete = EventDispatcher()
    let onObjectDetected = EventDispatcher()

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)

        detectionOverlayView.backgroundColor = .clear
        detectionOverlayView.isUserInteractionEnabled = false

        yoloDetector = YOLODetector()

        DispatchQueue.main.async {
            let roomCaptureView = RoomCaptureView(frame: self.bounds)
            roomCaptureView.delegate = self
            roomCaptureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            roomCaptureView.captureSession.arSession.delegate = self
            self.roomCaptureView = roomCaptureView
            self.addSubview(roomCaptureView)

            self.detectionOverlayView.frame = self.bounds
            self.detectionOverlayView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            self.addSubview(self.detectionOverlayView)
        }

        setupYOLOCallback()
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        roomCaptureView?.frame = bounds
        detectionOverlayView.frame = bounds
    }

    private func setupYOLOCallback() {
        guard let yoloDetector = yoloDetector else { return }
        yoloDetector.onDetectionsFound = { [weak self] jsonPayload in
            guard let self else { return }
            let hasDetections = self.renderDetections(from: jsonPayload)
            self.logDetections(from: jsonPayload, hasDetections: hasDetections)

            if hasDetections, let detections = jsonPayload["detections"] as? [[String: Any]] {
                self.yoloTracker.processDetections(detections)
            }
        }
    }

    @discardableResult
    private func renderDetections(from payload: [String: Any]) -> Bool {
        // Rebuilds the overlay from the latest detector output instead of diffing individual layers.
        detectionOverlayView.layer.sublayers?.forEach { $0.removeFromSuperlayer() }

        guard
            let detections = payload["detections"] as? [[String: Any]],
            !detections.isEmpty
        else {
            return false
        }

        CATransaction.begin()
        CATransaction.setDisableActions(true)

        for detection in detections {
            guard
                let label = detection["label"] as? String,
                let confidence = detection["confidence"] as? NSNumber,
                let boundingBox = detection["boundingBox"] as? [String: Any],
                let x = boundingBox["x"] as? NSNumber,
                let y = boundingBox["y"] as? NSNumber,
                let width = boundingBox["width"] as? NSNumber,
                let height = boundingBox["height"] as? NSNumber
            else {
                continue
            }

            let rect = convertNormalizedRect(
                x: CGFloat(truncating: x),
                y: CGFloat(truncating: y),
                width: CGFloat(truncating: width),
                height: CGFloat(truncating: height)
            )

            let boxLayer = CAShapeLayer()
            boxLayer.path = UIBezierPath(rect: rect).cgPath
            boxLayer.strokeColor = UIColor.systemGreen.cgColor
            boxLayer.fillColor = UIColor.systemGreen.withAlphaComponent(0.18).cgColor
            boxLayer.lineWidth = 2
            detectionOverlayView.layer.addSublayer(boxLayer)

            let textLayer = CATextLayer()
            textLayer.contentsScale = UIScreen.main.scale
            textLayer.fontSize = 13
            textLayer.foregroundColor = UIColor.white.cgColor
            textLayer.backgroundColor = UIColor.systemGreen.withAlphaComponent(0.9).cgColor
            textLayer.cornerRadius = 4
            textLayer.alignmentMode = .left
            textLayer.isWrapped = false
            textLayer.string = String(format: "%@ %.0f%%", label, confidence.floatValue * 100)
            textLayer.frame = CGRect(
                x: rect.minX,
                y: max(0, rect.minY - 24),
                width: min(bounds.width - rect.minX, 140),
                height: 20
            )
            detectionOverlayView.layer.addSublayer(textLayer)
        }

        CATransaction.commit()
        return true
    }

    private func convertNormalizedRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> CGRect {
        let viewWidth = detectionOverlayView.bounds.width
        let viewHeight = detectionOverlayView.bounds.height
        // Vision uses a normalized coordinate space with the origin at the lower-left.
        let convertedY = 1 - y - height

        return CGRect(
            x: x * viewWidth,
            y: convertedY * viewHeight,
            width: width * viewWidth,
            height: height * viewHeight
        )
    }

    private func logDetections(from payload: [String: Any], hasDetections: Bool) {
        guard let detections = payload["detections"] as? [[String: Any]] else {
            print("YOLO Detections: invalid payload")
            return
        }

        guard hasDetections else {
            return
        }

        let now = Date()
        // Limits console noise while preserving enough detail to confirm the detector is active.
        guard now.timeIntervalSince(lastLoggedDetectionDate) >= 0.5 else { return }
        lastLoggedDetectionDate = now

        let summary = detections.compactMap { detection -> String? in
            guard
                let label = detection["label"] as? String,
                let confidence = detection["confidence"] as? NSNumber
            else {
                return nil
            }
            return String(format: "%@ %.2f", label, confidence.floatValue)
        }.joined(separator: ", ")

        print("YOLO Detections (\(detections.count)): \(summary)")
    }

    public func session(_ session: ARSession, didUpdate frame: ARFrame) {
        frameCounter += 1

        // Samples every Nth AR frame so RoomPlan remains responsive while detection runs in parallel.
        if frameCounter % detectionFrameInterval == 0, let yoloDetector, yoloDetector.isReadyForNextFrame {
            let context = YOLODetector.FrameContext(
                cameraTransform: frame.camera.transform,
                intrinsics: frame.camera.intrinsics,
                imageResolution: frame.camera.imageResolution,
                depthMap: frame.sceneDepth?.depthMap ?? frame.smoothedSceneDepth?.depthMap
            )
            yoloDetector.processFrame(frame.capturedImage, context: context)
        }
    }

    func setScanning(_ scanning: Bool) {
        if scanning {
            yoloTracker.reset()
            roomCaptureView?.captureSession.run(configuration: roomCaptureSessionConfig)
        } else {
            roomCaptureView?.captureSession.stop()
            detectionOverlayView.layer.sublayers?.forEach { $0.removeFromSuperlayer() }
        }
    }

    public func captureView(shouldPresent roomDataForProcessing: CapturedRoomData, error: Error?) -> Bool {
        return true
    }

    public func captureView(didPresent processedResult: CapturedRoom, error: Error?) {
        let walls = processedResult.walls.map { wall -> [String: Any] in
            return [
                "id": wall.identifier.uuidString,
                "length": wall.dimensions.x,
                "height": wall.dimensions.y,
                "position": [
                    "x": wall.transform.columns.3.x,
                    "z": wall.transform.columns.3.z],
                "rotation": atan2(wall.transform.columns.0.z, wall.transform.columns.0.x)
            ]
        }

        let appliances = processedResult.objects.map { object -> [String: Any] in
            return [
                "id": object.identifier.uuidString,
                "category": "\(object.category)",
                "dimensions": [
                    "x": object.dimensions.x,
                    "y": object.dimensions.y,
                    "z": object.dimensions.z
                ],
                "confidence": "\(object.confidence)",
                "position": [
                    "x": object.transform.columns.3.x,
                    "y": object.transform.columns.3.y,
                    "z": object.transform.columns.3.z
                ]
            ]
        }

        let doors = processedResult.doors.map { door -> [String: Any] in
            return [
                "id": door.identifier.uuidString,
                "category": "\(door.category)",
                "dimensions": [
                    "x": door.dimensions.x,
                    "y": door.dimensions.y,
                    "z": door.dimensions.z
                ],
                "confidence": "\(door.confidence)",
                "position": [
                    "x": door.transform.columns.3.x,
                    "y": door.transform.columns.3.y,
                    "z": door.transform.columns.3.z
                ]
            ]
        }

        let windows = processedResult.windows.map { window -> [String: Any] in
            return [
                "id": window.identifier.uuidString,
                "category": "\(window.category)",
                "dimensions": [
                    "x": window.dimensions.x,
                    "y": window.dimensions.y,
                    "z": window.dimensions.z
                ],
                "confidence": "\(window.confidence)",
                "position": [
                    "x": window.transform.columns.3.x,
                    "y": window.transform.columns.3.y,
                    "z": window.transform.columns.3.z
                ]
            ]
        }

        let yoloDetections = yoloTracker.uniqueDetections

        var mergedAppliances: [[String: Any]] = appliances.map { dict in
            var item = dict
            item["source"] = "roomplan"
            return item
        }

        for yolo in yoloDetections {
            var item = yolo
            item["id"] = UUID().uuidString
            item["source"] = "yolo"
            mergedAppliances.append(item)
        }

        onScanComplete([
            "appliances": mergedAppliances,
            "walls": walls,
            "doors": doors,
            "windows": windows,
            "timestamp": Date().timeIntervalSince1970,
            "metadata": [
                "wallCount": processedResult.walls.count,
                "doorCount": processedResult.doors.count,
                "windowCount": processedResult.windows.count,
                "applianceCount": mergedAppliances.count
            ]
        ])
    }
}
