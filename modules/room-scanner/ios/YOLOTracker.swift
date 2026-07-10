//
//  YOLOTracker.swift
//  NSC2026
//
//  Tracks YOLO detections across frames to deduplicate the same object
//  being detected repeatedly. Uses IoU (Intersection over Union) matching.
//

import Foundation
import CoreGraphics
import simd

struct TrackedDetection {
    let label: String
    var confidence: Float
    var boundingBox: CGRect
    let firstSeen: TimeInterval
    var lastSeenAt: TimeInterval
    var frameCount: Int

    // World-space centroid and real-world metric size fused from LiDAR depth.
    // Optional because detections on non-LiDAR frames carry no spatial data.
    var position: simd_float3?
    var realSize: CGSize?
    var depth: Float?
    // Number of frames that contributed a spatial sample, used for the running average.
    var spatialSampleCount: Int

    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = [
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

        if let position {
            dict["position"] = [
                "x": position.x,
                "y": position.y,
                "z": position.z
            ]
        }
        if let realSize {
            dict["realSize"] = [
                "width": realSize.width,
                "height": realSize.height
            ]
        }
        if let depth {
            dict["depth"] = depth
        }

        return dict
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
            let spatial = parseSpatial(detection)

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
                    mergeSpatial(into: &trackedObjects[i], sample: spatial)
                    matched = true
                    break
                }
            }

            if !matched {
                var tracked = TrackedDetection(
                    label: label,
                    confidence: conf,
                    boundingBox: rect,
                    firstSeen: now,
                    lastSeenAt: now,
                    frameCount: 1,
                    position: nil,
                    realSize: nil,
                    depth: nil,
                    spatialSampleCount: 0
                )
                mergeSpatial(into: &tracked, sample: spatial)
                trackedObjects.append(tracked)
            }
        }
    }

    func reset() {
        os_unfair_lock_lock(&lock)
        defer { os_unfair_lock_unlock(&lock) }
        trackedObjects.removeAll()
    }

    // MARK: - Spatial fusion

    private struct SpatialSample {
        let position: simd_float3
        let size: CGSize
        let depth: Float
    }

    // Extracts the optional 3D fields the detector attaches when LiDAR depth is available.
    private func parseSpatial(_ detection: [String: Any]) -> SpatialSample? {
        guard
            let position = detection["position"] as? [String: Any],
            let px = position["x"] as? NSNumber,
            let py = position["y"] as? NSNumber,
            let pz = position["z"] as? NSNumber,
            let size = detection["realSize"] as? [String: Any],
            let sw = size["width"] as? NSNumber,
            let sh = size["height"] as? NSNumber,
            let depth = detection["depth"] as? NSNumber
        else {
            return nil
        }

        return SpatialSample(
            position: simd_float3(px.floatValue, py.floatValue, pz.floatValue),
            size: CGSize(width: CGFloat(truncating: sw), height: CGFloat(truncating: sh)),
            depth: depth.floatValue
        )
    }

    // Incremental cumulative average so the reported position/size stabilizes across frames.
    private func mergeSpatial(into tracked: inout TrackedDetection, sample: SpatialSample?) {
        guard let sample else { return }

        let n = Float(tracked.spatialSampleCount)
        let nextN = n + 1

        if let existing = tracked.position {
            tracked.position = (existing * n + sample.position) / nextN
        } else {
            tracked.position = sample.position
        }

        if let existingSize = tracked.realSize {
            let w = (Float(existingSize.width) * n + Float(sample.size.width)) / nextN
            let h = (Float(existingSize.height) * n + Float(sample.size.height)) / nextN
            tracked.realSize = CGSize(width: CGFloat(w), height: CGFloat(h))
        } else {
            tracked.realSize = sample.size
        }

        if let existingDepth = tracked.depth {
            tracked.depth = (existingDepth * n + sample.depth) / nextN
        } else {
            tracked.depth = sample.depth
        }

        tracked.spatialSampleCount += 1
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
