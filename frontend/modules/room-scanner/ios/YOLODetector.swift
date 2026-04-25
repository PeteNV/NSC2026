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

    // Defines callback function to handle async data (optional closure)
    var onDetectionsFound: (([String: Any]) -> Void)?

    init() {
        // CoreML model loading is deferred - will attempt to load model lazily
        // For now, just initialize empty to prevent init failures from cascading
    }

    // Process frame function
    func processFrame(_ pixelBuffer: CVPixelBuffer) {
        // Prevent overlapping request
        guard !isProcessing else { return }

        // If vision model hasn't been loaded yet, try to load it now
        if visionModel == nil {
            loadModel()
        }

        guard let visionModel = visionModel else { return }
        isProcessing = true

        let request = VNCoreMLRequest(model: visionModel) { [weak self] request, error in
            self?.handleDetections(request: request)
            self?.isProcessing = false
        }

        // Since YOLOv8 expects the image to be processed cleanly
        request.imageCropAndScaleOption = .scaleFill

        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
        DispatchQueue.global(qos: .userInitiated).async {
            try? handler.perform([request])
        }
    }

    private func loadModel() {
        let config = MLModelConfiguration()

        // Try to load the CoreML model
        // This is wrapped in a catch-all because the model file might not exist yet
        if let mlModel = try? v1_patched(configuration: config).model {
            self.visionModel = try? VNCoreMLModel(for: mlModel)
        }
    }

    private func handleDetections(request: VNRequest) {
        guard let results = request.results as? [VNRecognizedObjectObservation], !results.isEmpty else { return }

        var detectedItems = [[String: Any]] = []

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
        if !detectedItems.isEmpty {
            let jsonPayload: [String: Any] = ["detections": detectedItems]
            // Send back to main thread
            DispatchQueue.main.async {
                self.onDetectionsFound?(jsonPayload)
            }
        }
    }
}
