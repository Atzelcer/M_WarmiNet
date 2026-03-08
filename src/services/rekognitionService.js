const REKOGNITION_CONFIG = {
  region: 'us-east-1',
  collectionId: 'warminet-faces-collection',
  minConfidence: 90,
  maxFaces: 1,
};

export const RekognitionService = {
  analyzeFace: async (imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Rekognition] Analizando rostro...');
        resolve({
          success: true,
          faceDetails: {
            boundingBox: {
              width: 0.45,
              height: 0.62,
              left: 0.28,
              top: 0.19,
            },
            ageRange: {
              low: 20,
              high: 35,
            },
            gender: {
              value: 'Female',
              confidence: 99.8,
            },
            emotions: [
              { type: 'CALM', confidence: 98.5 },
              { type: 'HAPPY', confidence: 1.2 },
              { type: 'SURPRISED', confidence: 0.3 },
            ],
            smile: {
              value: false,
              confidence: 95.2,
            },
            eyeglasses: {
              value: false,
              confidence: 98.7,
            },
            sunglasses: {
              value: false,
              confidence: 99.9,
            },
            beard: {
              value: false,
              confidence: 99.5,
            },
            mustache: {
              value: false,
              confidence: 99.8,
            },
            eyesOpen: {
              value: true,
              confidence: 99.6,
            },
            mouthOpen: {
              value: false,
              confidence: 97.4,
            },
            confidence: 99.95,
            landmarks: [
              { type: 'eyeLeft', x: 0.35, y: 0.42 },
              { type: 'eyeRight', x: 0.65, y: 0.42 },
              { type: 'nose', x: 0.50, y: 0.58 },
              { type: 'mouthLeft', x: 0.38, y: 0.72 },
              { type: 'mouthRight', x: 0.62, y: 0.72 },
            ],
            pose: {
              roll: -0.5,
              yaw: 2.3,
              pitch: 1.8,
            },
            quality: {
              brightness: 78.5,
              sharpness: 94.2,
            },
          },
        });
      }, 1800);
    });
  },

  compareFaces: async (sourceImage, targetImage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const similarity = 85 + Math.random() * 15;
        console.log('[Rekognition] Comparando rostros - Similitud:', similarity.toFixed(2));
        resolve({
          success: true,
          faceMatches: [
            {
              similarity: similarity,
              face: {
                confidence: 99.9,
                boundingBox: {
                  width: 0.45,
                  height: 0.62,
                  left: 0.28,
                  top: 0.19,
                },
              },
            },
          ],
          sourceImageFace: {
            confidence: 99.95,
            boundingBox: {
              width: 0.48,
              height: 0.64,
              left: 0.26,
              top: 0.18,
            },
          },
          unmatchedFaces: [],
        });
      }, 2200);
    });
  },

  detectLabels: async (imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Rekognition] Detectando objetos en imagen...');
        resolve({
          success: true,
          labels: [
            { name: 'Person', confidence: 99.9 },
            { name: 'Woman', confidence: 98.7 },
            { name: 'Street', confidence: 95.3 },
            { name: 'Urban', confidence: 92.1 },
            { name: 'Building', confidence: 88.5 },
            { name: 'Outdoor', confidence: 97.8 },
          ],
        });
      }, 1500);
    });
  },

  detectText: async (imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Rekognition] Detectando texto en imagen...');
        resolve({
          success: true,
          textDetections: [
            {
              detectedText: 'CALLE',
              type: 'LINE',
              confidence: 96.8,
              geometry: {
                boundingBox: {
                  width: 0.25,
                  height: 0.08,
                  left: 0.15,
                  top: 0.35,
                },
              },
            },
          ],
        });
      }, 1600);
    });
  },

  indexFace: async (imageData, externalImageId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faceId = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('[Rekognition] Rostro indexado:', faceId);
        resolve({
          success: true,
          faceRecords: [
            {
              face: {
                faceId,
                boundingBox: {
                  width: 0.45,
                  height: 0.62,
                  left: 0.28,
                  top: 0.19,
                },
                imageId: externalImageId,
                externalImageId,
                confidence: 99.95,
              },
              faceDetail: {
                confidence: 99.95,
              },
            },
          ],
        });
      }, 2000);
    });
  },

  searchFacesByImage: async (imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Rekognition] Buscando rostros similares...');
        resolve({
          success: true,
          searchedFaceConfidence: 99.5,
          faceMatches: [
            {
              similarity: 98.7,
              face: {
                faceId: `face_${Date.now()}_match`,
                confidence: 99.8,
                externalImageId: 'user_profile_001',
              },
            },
          ],
        });
      }, 2500);
    });
  },

  detectModerationLabels: async (imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Rekognition] Analizando contenido inapropiado...');
        resolve({
          success: true,
          moderationLabels: [],
          moderationModelVersion: '6.1',
          contentSafe: true,
        });
      }, 1400);
    });
  },
};

export default RekognitionService;
