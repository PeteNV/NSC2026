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
    private var visionModel: VNCoreMLModel?
    private var isProcessing = false
    private let processingQueue = DispatchQueue(label: "RoomScanner.YOLODetector", qos: .userInitiated)
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
    func processFrame(_ pixelBuffer: CVPixelBuffer) {
        // Prevent overlapping requests
        guard beginProcessing() else { return }

        // If vision model hasn't been loaded yet, try to load it now
        if visionModel == nil {
            print("YOLO: Attempting to load model...")
            loadModel()
        }

        guard let visionModel = visionModel else {
            finishProcessing()
            return
        }

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
        guard let results = request.results as? [VNRecognizedObjectObservation] else {
            DispatchQueue.main.async {
                self.onDetectionsFound?(["detections": []])
            }
            return
        }

        var detectedItems: [[String: Any]] = []

        for observation in results {
            guard let topLabel = observation.labels.first else { continue }

            // Above 50% confidence
            if topLabel.confidence > 0.50 {
                let item: [String: Any] = [
                    "label": topLabel.identifier,
                    "confidence": topLabel.confidence,
                    "boundingBox": [
                        "x": observation.boundingBox.origin.x,
                        "y": observation.boundingBox.origin.y,
                        "width": observation.boundingBox.width,
                        "height": observation.boundingBox.height
                    ]
                ]
                detectedItems.append(item)
            }
        }
        let jsonPayload: [String: Any] = ["detections": detectedItems]
        DispatchQueue.main.async {
            self.onDetectionsFound?(jsonPayload)
        }
    }
}
