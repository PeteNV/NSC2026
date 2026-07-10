//
//  YOLODetector.swift
//  
//
//  Created by Nattanan Vimuktanan on 4/23/26.
//
//
//  This file takes an image frame, asks CoreML model, and returns JSON
//

import Foundation
import CoreML
import Vision
import ARKit

class YOLODetector {
    // Snapshot of the ARFrame that a detection was run against. Carries the camera
    // pose, lens intrinsics, and LiDAR depth so 2D boxes can be lifted into the 3D space.
    struct FrameContext {
        let cameraTransform: simd_float4x4
        let intrinsics: simd_float3x3
        let imageResolution: CGSize
        let depthMap: CVPixelBuffer?
    }

    private var visionModel: VNCoreMLModel?
    private var isProcessing = false

    // Context for the frame currently being processed. Set on `processFrame`,
    // consumed when Vision returns results.
    private var currentContext: FrameContext?

    // Runs model inference on a background queue so camera capture stays responsive
    private let processingQueue = DispatchQueue(label: "RoomScanner.YOLODetector", qos: .userInitiated)
    
    // Protects `isProcessing` from being read/written by multiple threads at once
    private let stateQueue = DispatchQueue(label: "RoomScanner.YOLODetector.state")

    // Defines callback function to handle async data (optional closure)
    var onDetectionsFound: (([String: Any]) -> Void)?

    init() {
        // CoreML model loading is deferred - will attempt to load model lazily
        // For now, just initialize empty to prevent init failures from cascading
    }

    var isReadyForNextFrame: Bool {
        stateQueue.sync { !isProcessing }
    }

    // Process frame function
    func processFrame(_ pixelBuffer: CVPixelBuffer, context: FrameContext? = nil) {
        // Prevent overlapping requests by skipping frame if the previous one is still being processed
        guard beginProcessing() else { return }

        // Retain the AR context alongside the frame so detections can be back-projected to 3D.
        currentContext = context

        // If vision model hasn't been loaded yet, try to load it now
        if visionModel == nil {
            print("YOLO: Attempting to load model...")
            loadModel()
        }

        guard let visionModel = visionModel else {
            finishProcessing()
            return
        }
        // Make a copy as the original camera buffer might be reused after this method returns
        guard let copiedPixelBuffer = copyPixelBuffer(pixelBuffer) else {
            print("YOLO Error: Failed to copy camera frame for processing.")
            finishProcessing()
            return
        }

        let request = VNCoreMLRequest(model: visionModel) { [weak self] request, error in
            self?.handleDetections(request: request)
            self?.finishProcessing()
        }

        // Since YOLOv8 expects the image to be processed cleanly
        request.imageCropAndScaleOption = .scaleFill

        let handler = VNImageRequestHandler(cvPixelBuffer: copiedPixelBuffer, orientation: .up, options: [:])
        processingQueue.async {
            try? handler.perform([request])
        }
    }

    private func beginProcessing() -> Bool {
        // In Swift, guard is an exit check
        // If processing is already in progress, return false immediately
        stateQueue.sync {
            guard !isProcessing else {
                return false
            }
            isProcessing = true
            return true
        }
    }

    private func finishProcessing() {
        stateQueue.async {
            self.isProcessing = false
        }
    }

    private func copyPixelBuffer(_ source: CVPixelBuffer) -> CVPixelBuffer? {
        let width = CVPixelBufferGetWidth(source)
        let height = CVPixelBufferGetHeight(source)
        let pixelFormat = CVPixelBufferGetPixelFormatType(source)
        let attachments = CVBufferCopyAttachments(source, .shouldPropagate)

        var copy: CVPixelBuffer?
        let status = CVPixelBufferCreate(
            kCFAllocatorDefault,
            width,
            height,
            pixelFormat,
            attachments,
            &copy
        )

        guard status == kCVReturnSuccess, let copy else {
            return nil
        }

        CVPixelBufferLockBaseAddress(source, .readOnly)
        CVPixelBufferLockBaseAddress(copy, [])
        defer {
            CVPixelBufferUnlockBaseAddress(copy, [])
            CVPixelBufferUnlockBaseAddress(source, .readOnly)
        }

        if CVPixelBufferIsPlanar(source) {
            let planeCount = CVPixelBufferGetPlaneCount(source)
            for planeIndex in 0..<planeCount {
                guard
                    let sourceBaseAddress = CVPixelBufferGetBaseAddressOfPlane(source, planeIndex),
                    let copyBaseAddress = CVPixelBufferGetBaseAddressOfPlane(copy, planeIndex)
                else {
                    return nil
                }

                let sourceBytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(source, planeIndex)
                let copyBytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(copy, planeIndex)
                let rows = CVPixelBufferGetHeightOfPlane(source, planeIndex)
                let bytesToCopy = min(sourceBytesPerRow, copyBytesPerRow)

                for row in 0..<rows {
                    memcpy(
                        copyBaseAddress.advanced(by: row * copyBytesPerRow),
                        sourceBaseAddress.advanced(by: row * sourceBytesPerRow),
                        bytesToCopy
                    )
                }
            }
        } else {
            guard
                let sourceBaseAddress = CVPixelBufferGetBaseAddress(source),
                let copyBaseAddress = CVPixelBufferGetBaseAddress(copy)
            else {
                return nil
            }

            let sourceBytesPerRow = CVPixelBufferGetBytesPerRow(source)
            let copyBytesPerRow = CVPixelBufferGetBytesPerRow(copy)
            let rows = CVPixelBufferGetHeight(source)
            let bytesToCopy = min(sourceBytesPerRow, copyBytesPerRow)

            for row in 0..<rows {
                memcpy(
                    copyBaseAddress.advanced(by: row * copyBytesPerRow),
                    sourceBaseAddress.advanced(by: row * sourceBytesPerRow),
                    bytesToCopy
                )
            }
        }

        return copy
    }

    private func loadModel() {
        // For debugging purposes
        // CoreML models can be shipped either in an already compiled .mlmodelc or .mlpackage
        let config = MLModelConfiguration()

        guard let modelURL = modelPackageURL() else {
            print("YOLO Error: Could not find model in bundles.")
            return
        }

        let resolvedModelURL: URL
        if modelURL.pathExtension == "mlpackage" {
            guard let compiledModelURL = try? MLModel.compileModel(at: modelURL) else {
                print("YOLO Error: Failed to compile model package.")
                return
            }
            resolvedModelURL = compiledModelURL
        } else {
            resolvedModelURL = modelURL
        }

        guard let mlModel = try? MLModel(contentsOf: resolvedModelURL, configuration: config) else {
            print("YOLO Error: Failed to load MLModel from contents.")
            return
        }

        self.visionModel = try? VNCoreMLModel(for: mlModel)
    }

    private func modelPackageURL() -> URL? {
        // Search likely resource bundles first, then fall back to all loaded bundles
        // This is defensive because packaging can differ between app targets, pods, and frameworks (Xcode)
        let modelName = "v1_patched"
        let moduleBundle = Bundle(for: YOLODetector.self)

        let resourceBundleNames = [
            "RoomScannerResources",
            "RoomScanner_RoomScannerResources",
            "RoomScanner-RoomScannerResources"
        ]

        for resourceName in resourceBundleNames {
            if let resourceBundleURL = moduleBundle.url(forResource: resourceName, withExtension: "bundle"),
               let resourceBundle = Bundle(url: resourceBundleURL) {
                if let url = resourceBundle.url(forResource: modelName, withExtension: "mlmodelc") {
                    print("YOLO: Found compiled model in \(resourceName)")
                    return url
                }

                if let url = resourceBundle.url(forResource: modelName, withExtension: "mlpackage") {
                    print("YOLO: Found raw package in \(resourceName)")
                    return url
                }
            }
        }

        let candidateBundles = [moduleBundle, Bundle.main] + Bundle.allBundles + Bundle.allFrameworks
        var seenBundlePaths = Set<String>()

        for bundle in candidateBundles where seenBundlePaths.insert(bundle.bundlePath).inserted {
            if let url = bundle.url(forResource: modelName, withExtension: "mlmodelc") {
                print("YOLO: Found compiled model in bundle \(bundle.bundlePath).")
                return url
            }
        }

        for bundle in candidateBundles where bundle.url(forResource: modelName, withExtension: "mlpackage") != nil {
            if let url = bundle.url(forResource: modelName, withExtension: "mlpackage") {
                print("YOLO: Found raw model package in bundle \(bundle.bundlePath).")
                return url
            }
        }

        print("YOLO Error: Could not find \(modelName) in any bundle.")
        return nil
    }

    private func handleDetections(request: VNRequest) {
        // Consume the context captured for this frame, then clear it for the next one.
        let context = currentContext
        currentContext = nil

        // Convert Vision/CoreML results into a simple dictionary/JSON-like structure
        guard let results = request.results as? [VNRecognizedObjectObservation] else {
            DispatchQueue.main.async {
                // Back to the main thread before invoking the callback
                // because UI-related code usually must run there.
                self.onDetectionsFound?(["detections": []])
            }
            return
        }

        var detectedItems: [[String: Any]] = []

        for observation in results {
            guard let topLabel = observation.labels.first else { continue }

            // Detection threshold set at above 50% confidence
            if topLabel.confidence > 0.50 {
                var item: [String: Any] = [
                    "label": topLabel.identifier,
                    "confidence": topLabel.confidence,
                    "boundingBox": [
                        "x": observation.boundingBox.origin.x,
                        "y": observation.boundingBox.origin.y,
                        "width": observation.boundingBox.width,
                        "height": observation.boundingBox.height
                    ]
                ]

                // Lift the 2D box into 3D world space using the LiDAR depth for this frame.
                if let context, let spatial = spatialInfo(for: observation.boundingBox, context: context) {
                    item["position"] = [
                        "x": spatial.position.x,
                        "y": spatial.position.y,
                        "z": spatial.position.z
                    ]
                    item["realSize"] = [
                        "width": spatial.size.width,
                        "height": spatial.size.height
                    ]
                    item["depth"] = spatial.depth
                }

                detectedItems.append(item)
            }
        }
        let jsonPayload: [String: Any] = ["detections": detectedItems]
        DispatchQueue.main.async {
            self.onDetectionsFound?(jsonPayload)
        }
    }

    // MARK: - 3D back-projection

    private struct SpatialInfo {
        let position: simd_float3
        let size: CGSize
        let depth: Float
    }

    // Turns a normalized Vision bounding box into a world-space position and real-world
    // metric size by sampling the LiDAR depth map and applying the camera intrinsics.
    private func spatialInfo(for boundingBox: CGRect, context: FrameContext) -> SpatialInfo? {
        guard let depthMap = context.depthMap else { return nil }

        // Vision boxes are normalized with the origin at the lower-left; convert the
        // center to normalized top-left space so it maps onto the image/depth buffers.
        let centerXNorm = boundingBox.midX
        let centerYNorm = 1 - boundingBox.midY

        guard let depth = sampleDepth(depthMap, atNormalizedX: centerXNorm, y: centerYNorm),
              depth > 0, depth.isFinite else {
            return nil
        }

        // Intrinsics are expressed relative to the full image resolution (top-left origin).
        let fx = context.intrinsics.columns.0.x
        let fy = context.intrinsics.columns.1.y
        let cx = context.intrinsics.columns.2.x
        let cy = context.intrinsics.columns.2.y

        let imageWidth = Float(context.imageResolution.width)
        let imageHeight = Float(context.imageResolution.height)

        // Center of the box in image pixels (top-left origin).
        let px = Float(centerXNorm) * imageWidth
        let py = Float(centerYNorm) * imageHeight

        // Back-project the pixel to camera space. ARKit camera space is +X right,
        // +Y up, looking down -Z, while image space is +X right, +Y down.
        let xCam = (px - cx) / fx * depth
        let yCam = -(py - cy) / fy * depth
        let zCam = -depth

        let cameraPoint = simd_float4(xCam, yCam, zCam, 1)
        let worldPoint = context.cameraTransform * cameraPoint

        // Real-world size via the pinhole model: metersPerPixel = depth / focalLength.
        let boxPixelWidth = Float(boundingBox.width) * imageWidth
        let boxPixelHeight = Float(boundingBox.height) * imageHeight
        let realWidth = boxPixelWidth * depth / fx
        let realHeight = boxPixelHeight * depth / fy

        return SpatialInfo(
            position: simd_float3(worldPoint.x, worldPoint.y, worldPoint.z),
            size: CGSize(width: CGFloat(realWidth), height: CGFloat(realHeight)),
            depth: depth
        )
    }

    // Reads a single depth sample (meters) from the DepthFloat32 LiDAR buffer at a
    // normalized top-left coordinate.
    private func sampleDepth(_ depthMap: CVPixelBuffer, atNormalizedX x: CGFloat, y: CGFloat) -> Float? {
        guard CVPixelBufferGetPixelFormatType(depthMap) == kCVPixelFormatType_DepthFloat32 else {
            return nil
        }

        CVPixelBufferLockBaseAddress(depthMap, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(depthMap, .readOnly) }

        let width = CVPixelBufferGetWidth(depthMap)
        let height = CVPixelBufferGetHeight(depthMap)
        guard width > 0, height > 0, let base = CVPixelBufferGetBaseAddress(depthMap) else {
            return nil
        }

        let clampedX = min(max(x, 0), 1)
        let clampedY = min(max(y, 0), 1)
        let col = min(Int(clampedX * CGFloat(width)), width - 1)
        let row = min(Int(clampedY * CGFloat(height)), height - 1)

        let bytesPerRow = CVPixelBufferGetBytesPerRow(depthMap)
        let rowPtr = base.advanced(by: row * bytesPerRow)
        let value = rowPtr.assumingMemoryBound(to: Float32.self)[col]

        return value.isFinite && value > 0 ? value : nil
    }
}
