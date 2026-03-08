const LOCATION_CONFIG = {
  region: 'us-east-1',
  mapName: 'warminet-map',
  placeIndexName: 'warminet-places',
  routeCalculatorName: 'warminet-routes',
  geofenceCollectionName: 'warminet-safe-zones',
  trackerName: 'warminet-user-tracker',
};

export const AWSLocationService = {
  searchPlaceIndexForText: async (text, biasPosition) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = [
          {
            placeId: 'place_001',
            relevance: 0.98,
            place: {
              label: 'Mercado Central, Sucre, Bolivia',
              geometry: {
                point: [-65.26180, -19.04790],
              },
              addressNumber: 'S/N',
              street: 'Calle Ravelo',
              municipality: 'Sucre',
              subRegion: 'Oropeza',
              region: 'Chuquisaca',
              country: 'BOL',
              postalCode: '0000',
            },
          },
          {
            placeId: 'place_002',
            relevance: 0.85,
            place: {
              label: 'Plaza 25 de Mayo, Sucre, Bolivia',
              geometry: {
                point: [-65.25980, -19.04720],
              },
              street: 'Calle Arenales',
              municipality: 'Sucre',
              subRegion: 'Oropeza',
              region: 'Chuquisaca',
              country: 'BOL',
            },
          },
        ];

        console.log('[AWS Location] Búsqueda de lugares:', text, results.length, 'resultados');
        resolve({
          success: true,
          results,
          summary: {
            text,
            biasPosition,
            dataSource: 'Esri',
            maxResults: 10,
          },
        });
      }, 1200);
    });
  },

  searchPlaceIndexForPosition: async (position) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[AWS Location] Geocodificación inversa:', position);
        resolve({
          success: true,
          results: [
            {
              placeId: 'place_reverse_001',
              distance: 0,
              relevance: 1.0,
              place: {
                label: 'Calle German Busch, Sucre, Chuquisaca, Bolivia',
                geometry: {
                  point: position,
                },
                addressNumber: '125',
                street: 'Calle German Busch',
                municipality: 'Sucre',
                subRegion: 'Oropeza',
                region: 'Chuquisaca',
                country: 'BOL',
                postalCode: '0000',
              },
            },
          ],
          summary: {
            position,
            dataSource: 'Esri',
            maxResults: 1,
          },
        });
      }, 1000);
    });
  },

  calculateRoute: async (departurePosition, destinationPosition, travelMode = 'Walking') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const distance = Math.sqrt(
          Math.pow(destinationPosition[0] - departurePosition[0], 2) +
            Math.pow(destinationPosition[1] - departurePosition[1], 2)
        ) * 111000;

        const duration = distance / (travelMode === 'Walking' ? 1.4 : 10);

        const steps = [
          {
            startPosition: departurePosition,
            endPosition: [
              departurePosition[0] + (destinationPosition[0] - departurePosition[0]) * 0.3,
              departurePosition[1] + (destinationPosition[1] - departurePosition[1]) * 0.3,
            ],
            distance: distance * 0.3,
            durationSeconds: duration * 0.3,
            geometryOffset: 0,
          },
          {
            startPosition: [
              departurePosition[0] + (destinationPosition[0] - departurePosition[0]) * 0.3,
              departurePosition[1] + (destinationPosition[1] - departurePosition[1]) * 0.3,
            ],
            endPosition: [
              departurePosition[0] + (destinationPosition[0] - departurePosition[0]) * 0.7,
              departurePosition[1] + (destinationPosition[1] - departurePosition[1]) * 0.7,
            ],
            distance: distance * 0.4,
            durationSeconds: duration * 0.4,
            geometryOffset: 1,
          },
          {
            startPosition: [
              departurePosition[0] + (destinationPosition[0] - departurePosition[0]) * 0.7,
              departurePosition[1] + (destinationPosition[1] - departurePosition[1]) * 0.7,
            ],
            endPosition: destinationPosition,
            distance: distance * 0.3,
            durationSeconds: duration * 0.3,
            geometryOffset: 2,
          },
        ];

        console.log(
          '[AWS Location] Ruta calculada:',
          distance.toFixed(0),
          'm,',
          (duration / 60).toFixed(1),
          'min'
        );

        resolve({
          success: true,
          legs: [
            {
              startPosition: departurePosition,
              endPosition: destinationPosition,
              distance: distance,
              durationSeconds: duration,
              steps,
              geometry: {
                lineString: [
                  departurePosition,
                  ...steps.map((s) => s.endPosition),
                ],
              },
            },
          ],
          summary: {
            routeBBox: [
              Math.min(departurePosition[0], destinationPosition[0]),
              Math.min(departurePosition[1], destinationPosition[1]),
              Math.max(departurePosition[0], destinationPosition[0]),
              Math.max(departurePosition[1], destinationPosition[1]),
            ],
            dataSource: 'Esri',
            distance: distance,
            durationSeconds: duration,
            distanceUnit: 'Meters',
          },
        });
      }, 1500);
    });
  },

  batchUpdateDevicePosition: async (trackerName, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = updates.map((update, index) => ({
          deviceId: update.deviceId,
          sampleTime: update.sampleTime,
          receivedTime: new Date().toISOString(),
          position: update.position,
          positionProperties: update.positionProperties || {},
        }));

        console.log('[AWS Location] Posiciones actualizadas:', results.length);
        resolve({
          success: true,
          errors: [],
        });
      }, 600);
    });
  },

  getDevicePosition: async (trackerName, deviceId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[AWS Location] Posición de dispositivo:', deviceId);
        resolve({
          success: true,
          deviceId,
          sampleTime: new Date().toISOString(),
          receivedTime: new Date().toISOString(),
          position: [-65.26180, -19.04790],
          accuracy: {
            horizontal: 15.5,
          },
          positionProperties: {
            batteryLevel: 85,
            speed: 0,
            heading: 0,
          },
        });
      }, 500);
    });
  },

  getDevicePositionHistory: async (trackerName, deviceId, startTime, endTime) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const positions = Array.from({ length: 10 }, (_, i) => ({
          deviceId,
          sampleTime: new Date(Date.now() - (9 - i) * 60000).toISOString(),
          receivedTime: new Date(Date.now() - (9 - i) * 60000 + 500).toISOString(),
          position: [
            -65.26180 + Math.random() * 0.01 - 0.005,
            -19.04790 + Math.random() * 0.01 - 0.005,
          ],
          accuracy: {
            horizontal: 10 + Math.random() * 10,
          },
        }));

        console.log('[AWS Location] Historial de posiciones:', positions.length);
        resolve({
          success: true,
          devicePositions: positions,
        });
      }, 1000);
    });
  },

  putGeofence: async (collectionName, geofenceId, geometry) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[AWS Location] Geofence creado:', geofenceId);
        resolve({
          success: true,
          geofenceId,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        });
      }, 700);
    });
  },

  listGeofences: async (collectionName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const geofences = [
          {
            geofenceId: 'safe-zone-mercado-central',
            geometry: {
              circle: {
                center: [-65.26180, -19.04790],
                radius: 500,
              },
            },
            status: 'ACTIVE',
            createTime: '2026-03-01T10:00:00Z',
          },
          {
            geofenceId: 'danger-zone-area-oscura',
            geometry: {
              circle: {
                center: [-65.26280, -19.04550],
                radius: 200,
              },
            },
            status: 'ACTIVE',
            createTime: '2026-03-02T15:30:00Z',
          },
        ];

        console.log('[AWS Location] Geofences listados:', geofences.length);
        resolve({
          success: true,
          entries: geofences,
        });
      }, 800);
    });
  },

  batchEvaluateGeofences: async (collectionName, devicePositionUpdates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = devicePositionUpdates.map((update) => ({
          deviceId: update.deviceId,
          sampleTime: update.sampleTime,
          position: update.position,
          geofenceEvents: [
            {
              geofenceId: 'safe-zone-mercado-central',
              eventType: Math.random() > 0.5 ? 'ENTER' : 'EXIT',
              geofenceProperties: {
                zoneName: 'Mercado Central',
                type: 'SAFE',
              },
            },
          ],
        }));

        console.log('[AWS Location] Geofences evaluados:', results.length);
        resolve({
          success: true,
          errors: [],
        });
      }, 900);
    });
  },
};

export const SafeRouteService = {
  analyzeRoute: async (departure, destination) => {
    const routeResult = await AWSLocationService.calculateRoute(
      [departure.longitude, departure.latitude],
      [destination.longitude, destination.latitude],
      'Walking'
    );

    if (!routeResult.success) {
      return { success: false, error: 'No se pudo calcular la ruta' };
    }

    const dangerZones = await AWSLocationService.listGeofences(
      LOCATION_CONFIG.geofenceCollectionName
    );

    const dangerousGeofences = dangerZones.entries.filter(
      (g) => g.geofenceId.includes('danger')
    );

    const safetyScore = Math.max(0.5, 1 - dangerousGeofences.length * 0.1);

    console.log('[Safe Route] Análisis completado - Score:', safetyScore);

    return {
      success: true,
      route: routeResult,
      safetyScore,
      dangerZones: dangerousGeofences.length,
      recommendations: {
        avoidNight: dangerousGeofences.length > 2,
        useMainStreets: true,
        estimatedSafety: safetyScore > 0.7 ? 'HIGH' : safetyScore > 0.5 ? 'MEDIUM' : 'LOW',
      },
    };
  },

  trackUserPosition: async (userId, position) => {
    return await AWSLocationService.batchUpdateDevicePosition(
      LOCATION_CONFIG.trackerName,
      [
        {
          deviceId: userId,
          sampleTime: new Date().toISOString(),
          position: [position.longitude, position.latitude],
          positionProperties: {
            appVersion: '1.0.0',
            batteryLevel: 85,
          },
        },
      ]
    );
  },

  checkProximityToDangerZones: async (userId, position) => {
    const evaluation = await AWSLocationService.batchEvaluateGeofences(
      LOCATION_CONFIG.geofenceCollectionName,
      [
        {
          deviceId: userId,
          sampleTime: new Date().toISOString(),
          position: [position.longitude, position.latitude],
        },
      ]
    );

    return evaluation;
  },
};

export default AWSLocationService;
