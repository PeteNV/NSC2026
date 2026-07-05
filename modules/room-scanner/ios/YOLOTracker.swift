//
//  YOLOTracker.swift
//  NSC2026
//
//  Tracks YOLO detections across frames to deduplicate the same object
//  being detected repeatedly. Uses IoU (Intersection over Union) matching.
//

import Foundation
import CoreGraphics

struct TrackedDetection {
    let label: String
    var confidence: Float
    var boundingBox: CGRect
    let firstSeen: TimeInterval
    var lastSeenAt: TimeInterval
    var frameCount: Int

    func toDictionary() -> [String: Any] {
        return [
            "label": label,
            "confidence": confidence,
            "boundingBox": [
                "x": boundingBox.origin.x,
                "y": boundingBox.origin.y,
                "width": boundingBox.width,
                "height": boundingBox.height
            ],
            "firstSeen": firstSeen,
            "lastSeen": lastSeenAt,
            "frameCount": frameCount
        ]
    }
}

class YOLOTracker {
    private var trackedObjects: [TrackedDetection] = []
    private let iouThreshold: Float = 0.3
    private let confirmationFrames: Int = 1
    private var lock = os_unfair_lock()

    var uniqueDetections: [[String: Any]] {
        os_unfair_lock_lock(&lock)
        defer { os_unfair_lock_unlock(&lock) }
        return trackedObjects
            .filter { $0.frameCount >= confirmationFrames }
            .map { $0.toDictionary() }
    }

    func processDetections(_ detections: [[String: Any]]) {
        guard !detections.isEmpty else { return }

        let now = Date().timeIntervalSince1970
        os_unfair_lock_lock(&lock)
        defer { os_unfair_lock_unlock(&lock) }

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

            let rect = CGRect(
                x: CGFloat(truncating: x),
                y: CGFloat(truncating: y),
                width: CGFloat(truncating: width),
                height: CGFloat(truncating: height)
            )
            let conf = confidence.floatValue

            var matched = false
            for i in 0..<trackedObjects.count where trackedObjects[i].label == label {
                let existing = trackedObjects[i]
                let iou = computeIoU(rect, existing.boundingBox)

                if iou > iouThreshold {
                    if conf > existing.confidence {
                        trackedObjects[i].confidence = conf
                    }
                    trackedObjects[i].boundingBox = rect
                    trackedObjects[i].lastSeenAt = now
                    trackedObjects[i].frameCount += 1
                    matched = true
                    break
                }
            }

            if !matched {
                let tracked = TrackedDetection(
                    label: label,
                    confidence: conf,
                    boundingBox: rect,
                    firstSeen: now,
                    lastSeenAt: now,
                    frameCount: 1
                )
                trackedObjects.append(tracked)
            }
        }
    }

    func reset() {
        os_unfair_lock_lock(&lock)
        defer { os_unfair_lock_unlock(&lock) }
        trackedObjects.removeAll()
    }

    private func computeIoU(_ a: CGRect, _ b: CGRect) -> Float {
        let intersection = a.intersection(b)
        if intersection.isNull { return 0 }
        let areaA = a.width * a.height
        let areaB = b.width * b.height
        let areaIntersection = intersection.width * intersection.height
        let areaUnion = areaA + areaB - areaIntersection
        return Float(areaIntersection / areaUnion)
    }
}
