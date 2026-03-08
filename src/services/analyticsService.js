const PINPOINT_CONFIG = {
  region: 'us-east-1',
  appId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  projectId: 'warminet-mobile-app',
};

export const PinpointService = {
  putEvents: async (events) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Pinpoint] Eventos registrados:', events.length);
        resolve({
          success: true,
          eventsResponse: {
            results: events.reduce((acc, event) => {
              acc[event.eventId] = {
                eventId: event.eventId,
                statusCode: 202,
                message: 'Accepted',
              };
              return acc;
            }, {}),
          },
        });
      }, 600);
    });
  },

  trackSessionStart: async (userId, sessionId) => {
    const event = {
      eventId: `session_start_${Date.now()}`,
      eventType: '_session.start',
      timestamp: new Date().toISOString(),
      session: {
        id: sessionId,
        startTimestamp: new Date().toISOString(),
      },
      attributes: {
        userId,
        platform: 'Android',
        appVersion: '1.0.0',
      },
    };

    return await PinpointService.putEvents([event]);
  },

  trackSessionEnd: async (userId, sessionId, duration) => {
    const event = {
      eventId: `session_end_${Date.now()}`,
      eventType: '_session.stop',
      timestamp: new Date().toISOString(),
      session: {
        id: sessionId,
        duration,
        stopTimestamp: new Date().toISOString(),
      },
      attributes: {
        userId,
        sessionDuration: duration.toString(),
      },
    };

    return await PinpointService.putEvents([event]);
  },

  trackCustomEvent: async (userId, eventType, attributes = {}, metrics = {}) => {
    const event = {
      eventId: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      timestamp: new Date().toISOString(),
      attributes: {
        userId,
        ...attributes,
      },
      metrics,
    };

    return await PinpointService.putEvents([event]);
  },

  trackPanicButton: async (userId, location) => {
    return await PinpointService.trackCustomEvent(
      userId,
      'panic_button_pressed',
      {
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        severity: 'HIGH',
      },
      {
        responseTime: 1200,
      }
    );
  },

  trackRouteCompletion: async (userId, routeData) => {
    return await PinpointService.trackCustomEvent(
      userId,
      'route_completed',
      {
        origin: routeData.origin,
        destination: routeData.destination,
        status: routeData.status,
      },
      {
        distance: routeData.distance,
        duration: routeData.duration,
      }
    );
  },

  trackPostCreation: async (userId, postType) => {
    return await PinpointService.trackCustomEvent(
      userId,
      'post_created',
      {
        postType,
        hasEvidence: 'true',
      },
      {
        evidenceCount: 2,
      }
    );
  },

  sendPushNotification: async (userId, title, body, data = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Pinpoint] Push notification enviada:', userId, title);
        resolve({
          success: true,
          messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          deliveryStatus: 'SUCCESSFUL',
          userId,
          notification: {
            title,
            body,
            data,
          },
        });
      }, 800);
    });
  },

  sendCampaignMessage: async (campaignId, endpoints) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Pinpoint] Campaña enviada:', campaignId, endpoints.length, 'usuarios');
        resolve({
          success: true,
          campaignId,
          messagesSent: endpoints.length,
          messagesDelivered: Math.floor(endpoints.length * 0.95),
          messagesFailed: Math.ceil(endpoints.length * 0.05),
        });
      }, 1500);
    });
  },

  updateEndpoint: async (userId, endpointData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Pinpoint] Endpoint actualizado:', userId);
        resolve({
          success: true,
          endpointResponse: {
            id: userId,
            address: endpointData.address,
            channelType: endpointData.channelType || 'GCM',
            demographic: endpointData.demographic || {},
            location: endpointData.location || {},
            user: {
              userId,
              userAttributes: endpointData.userAttributes || {},
            },
            creationDate: new Date().toISOString(),
          },
        });
      }, 500);
    });
  },

  getEndpoint: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Pinpoint] Endpoint obtenido:', userId);
        resolve({
          success: true,
          endpointResponse: {
            id: userId,
            address: 'fcm-token-example',
            channelType: 'GCM',
            demographic: {
              platform: 'Android',
              platformVersion: '13',
              locale: 'es_BO',
            },
            location: {
              country: 'BO',
              city: 'Sucre',
              region: 'Chuquisaca',
            },
            user: {
              userId,
            },
            optOut: 'NONE',
            creationDate: '2026-03-01T10:00:00Z',
            effectiveDate: new Date().toISOString(),
          },
        });
      }, 400);
    });
  },

  createSegment: async (segmentName, dimensions) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const segmentId = `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('[Pinpoint] Segmento creado:', segmentName);
        resolve({
          success: true,
          segmentResponse: {
            id: segmentId,
            name: segmentName,
            segmentType: 'DIMENSIONAL',
            dimensions,
            creationDate: new Date().toISOString(),
            lastModifiedDate: new Date().toISOString(),
          },
        });
      }, 700);
    });
  },

  getCampaignActivities: async (campaignId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activities = [
          {
            id: `act_${Date.now()}_1`,
            campaignId,
            result: 'SUCCESS',
            successfulEndpointCount: 487,
            totalEndpointCount: 512,
            treatmentId: '0',
            executionMetrics: {
              DeliveryRate: '95.12',
              EngagementRate: '12.5',
            },
            start: new Date(Date.now() - 3600000).toISOString(),
            end: new Date(Date.now() - 1800000).toISOString(),
          },
        ];

        console.log('[Pinpoint] Actividades de campaña:', activities.length);
        resolve({
          success: true,
          activitiesResponse: {
            item: activities,
          },
        });
      }, 900);
    });
  },
};

export const AnalyticsService = {
  recordUserAction: async (userId, action, properties = {}) => {
    return await PinpointService.trackCustomEvent(userId, `user_${action}`, properties);
  },

  recordScreenView: async (userId, screenName, duration) => {
    return await PinpointService.trackCustomEvent(
      userId,
      'screen_view',
      { screenName },
      { viewDuration: duration }
    );
  },

  recordFeatureUsage: async (userId, featureName) => {
    return await PinpointService.trackCustomEvent(
      userId,
      'feature_used',
      { featureName },
      { usageCount: 1 }
    );
  },

  recordError: async (userId, errorType, errorMessage) => {
    return await PinpointService.trackCustomEvent(
      userId,
      'app_error',
      {
        errorType,
        errorMessage: errorMessage.substring(0, 100),
        timestamp: new Date().toISOString(),
      }
    );
  },

  getAnalyticsSummary: async (startDate, endDate) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Analytics] Resumen generado:', startDate, '-', endDate);
        resolve({
          success: true,
          summary: {
            totalUsers: 1247,
            activeUsers: 892,
            newUsers: 156,
            sessions: 3421,
            averageSessionDuration: 245,
            panicButtonPresses: 23,
            routesCompleted: 678,
            postsCreated: 89,
            retentionRate: 0.78,
            engagementRate: 0.65,
          },
          topFeatures: [
            { name: 'PuntosRojos', usageCount: 2341 },
            { name: 'TrayectoSeguro', usageCount: 1876 },
            { name: 'Panico', usageCount: 234 },
            { name: 'Feed', usageCount: 987 },
          ],
        });
      }, 1200);
    });
  },
};

export default PinpointService;
