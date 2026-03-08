# Configuración de AWS para WarmiNet

Este proyecto integra servicios de AWS de forma simulada para demostración.

## Servicios AWS configurados:

### 1. AWS Amplify
- **Propósito**: Framework para integración con servicios AWS
- **Estado**: Configurado en modo simulado
- **Archivo**: `src/services/awsService.js`

### 2. Amazon Cognito
- **Propósito**: Autenticación y gestión de usuarios
- **User Pool ID**: `us-east-1_WARMINET` (simulado)
- **Client ID**: `warminet-client-id` (simulado)
- **Funcionalidad**: Login simulado, generación de tokens

### 3. AWS Lambda
- **Propósito**: Funciones serverless para lógica backend
- **Función demo**: `demoComplete`
- **Funcionalidad**: Se invoca cuando se completan simulaciones

### 4. Amazon SNS (Simple Notification Service)
- **Propósito**: Envío de notificaciones SMS
- **Funcionalidad**: Notificaciones simuladas a:
  - Personas de confianza
  - Policía (110)
  - Confirmaciones de llegada

## Configuración para producción (opcional):

Si deseas conectar servicios AWS reales:

### Paso 1: Crear cuenta AWS
1. Ve a https://aws.amazon.com
2. Crea una cuenta (Free Tier disponible)
3. Configura región: `us-east-1`

### Paso 2: Configurar Cognito
```bash
# Instalar AWS CLI
npm install -g @aws-amplify/cli

# Configurar Amplify
amplify configure

# Agregar autenticación
amplify add auth
amplify push
```

### Paso 3: Crear función Lambda
1. En AWS Console → Lambda
2. Crear función: `warminet-demo-complete`
3. Runtime: Node.js 18.x
4. Código básico:
```javascript
exports.handler = async (event) => {
    console.log('Demo completada:', event);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' })
    };
};
```

### Paso 4: Configurar SNS
1. En AWS Console → SNS
2. Crear tema: `warminet-alerts`
3. Configurar permisos para envío de SMS

### Paso 5: Actualizar configuración
Edita `src/services/awsService.js` con tus credenciales reales:
```javascript
const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'TU_USER_POOL_ID',
      userPoolClientId: 'TU_CLIENT_ID',
    }
  },
  API: {
    REST: {
      WarmiNetAPI: {
        endpoint: 'TU_API_GATEWAY_URL',
        region: 'us-east-1'
      }
    }
  }
};
```

## Nota para demo:
La app funciona completamente sin AWS real. Todas las funciones están simuladas localmente para permitir pruebas sin configuración adicional.
