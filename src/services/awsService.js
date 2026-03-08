// Amplify comentado temporalmente para evitar errores en Windows con node:sea
// import { Amplify } from 'aws-amplify';

// Configuración simulada de AWS Amplify
const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_WARMINET', // Simulado
      userPoolClientId: 'warminet-client-id', // Simulado
    }
  },
  API: {
    REST: {
      WarmiNetAPI: {
        endpoint: 'https://api-warminet-demo.com',
        region: 'us-east-1'
      }
    }
  }
};

// Inicializar Amplify (modo simulado sin dependencia real)
export const initAWS = () => {
  try {
    // Amplify.configure(awsConfig); // Comentado temporalmente
    console.log('✅ AWS Amplify en modo simulado (sin dependencia real)');
    return true;
  } catch (error) {
    console.log('⚠️ AWS Amplify en modo simulado:', error.message);
    return false;
  }
};

// Simulación de login con Cognito
export const simulateCognitoLogin = async (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🔐 Login simulado con Cognito');
      resolve({
        success: true,
        token: 'demo-token-' + Date.now(),
        user: {
          username,
          attributes: {
            email: username + '@warminet.com',
            verified: true,
          },
        },
      });
    }, 1500);
  });
};

// Simulación de función Lambda
export const invokeLambdaDemo = async (functionName, payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`⚡ Lambda ${functionName} invocada con:`, payload);
      resolve({
        statusCode: 200,
        body: {
          message: 'Demo completada exitosamente',
          timestamp: new Date().toISOString(),
          data: payload,
        },
      });
    }, 1000);
  });
};

// Simulación de notificación SNS
export const sendSNSNotification = async (phoneNumber, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📱 SNS notificación enviada a ${phoneNumber}:`, message);
      resolve({
        success: true,
        messageId: 'sns-' + Date.now(),
        destination: phoneNumber,
      });
    }, 800);
  });
};
