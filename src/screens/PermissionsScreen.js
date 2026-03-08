import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import { COLORS } from '../constants/colors';

export default function PermissionsScreen({ navigation }) {
  const [locationStatus, setLocationStatus] = useState('checking');
  const [cameraStatus, setCameraStatus] = useState('checking');
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    setLoading(true);

    try {
      // Solicitar permisos de ubicación
      const locationResult = await Location.requestForegroundPermissionsAsync();
      setLocationStatus(locationResult.status === 'granted' ? 'granted' : 'denied');

      // Solicitar permisos de cámara
      const cameraResult = await Camera.requestCameraPermissionsAsync();
      setCameraStatus(cameraResult.status === 'granted' ? 'granted' : 'denied');

      setLoading(false);

      // Si ambos están concedidos, continuar
      if (locationResult.status === 'granted' && cameraResult.status === 'granted') {
        Alert.alert(
          '✅ Permisos concedidos',
          'Todos los permisos necesarios han sido otorgados. ¡Bienvenida a WarmiNet!',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.replace('Welcome'),
            },
          ]
        );
      } else {
        let message = 'Algunos permisos no fueron concedidos:\n\n';
        if (locationResult.status !== 'granted') {
          message += '❌ Ubicación: Necesaria para mapas y trayectos seguros\n';
        }
        if (cameraResult.status !== 'granted') {
          message += '❌ Cámara: Necesaria para verificación de identidad\n';
        }
        message += '\nLa app puede tener funcionalidad limitada sin estos permisos.';
        
        Alert.alert('⚠️ Permisos incompletos', message, [
          { text: 'Intentar de nuevo', onPress: requestPermissions },
          { text: 'Continuar de todas formas', onPress: () => navigation.replace('Welcome') },
        ]);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Hubo un problema al solicitar permisos: ' + error.message);
    }
  };

  useEffect(() => {
    // Verificar permisos existentes al cargar
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    const locationPerm = await Location.getForegroundPermissionsAsync();
    const cameraPerm = await Camera.getCameraPermissionsAsync();

    setLocationStatus(locationPerm.status === 'granted' ? 'granted' : 'not-determined');
    setCameraStatus(cameraPerm.status === 'granted' ? 'granted' : 'not-determined');

    // Si ya tiene todos los permisos, navegar directamente
    if (locationPerm.status === 'granted' && cameraPerm.status === 'granted') {
      setTimeout(() => navigation.replace('Welcome'), 1000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'granted':
        return '✅';
      case 'denied':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '⚪';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'granted':
        return 'Concedido';
      case 'denied':
        return 'Denegado';
      case 'checking':
        return 'Verificando...';
      default:
        return 'Pendiente';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>🛡️ WarmiNet</Text>
        <Text style={styles.subtitle}>Configuración inicial de permisos</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.infoTitle}>🔒 Permisos necesarios</Text>
        <Text style={styles.infoText}>
          Para brindarte la mejor experiencia y seguridad, WarmiNet necesita acceso a:
        </Text>

        <View style={styles.permissionCard}>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionIcon}>📍</Text>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>Ubicación</Text>
              <Text style={styles.permissionDesc}>
                Para mapas, puntos rojos y trayectos seguros
              </Text>
            </View>
            <Text style={styles.statusIcon}>{getStatusIcon(locationStatus)}</Text>
          </View>
          <Text style={styles.statusText}>{getStatusText(locationStatus)}</Text>
        </View>

        <View style={styles.permissionCard}>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionIcon}>📷</Text>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>Cámara</Text>
              <Text style={styles.permissionDesc}>
                Para verificación de identidad y evidencias
              </Text>
            </View>
            <Text style={styles.statusIcon}>{getStatusIcon(cameraStatus)}</Text>
          </View>
          <Text style={styles.statusText}>{getStatusText(cameraStatus)}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermissions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>
              {locationStatus === 'granted' && cameraStatus === 'granted'
                ? '✅ Permisos concedidos - Continuar'
                : '🔓 Conceder permisos'}
            </Text>
          )}
        </TouchableOpacity>

        {(locationStatus === 'granted' || cameraStatus === 'granted') && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.replace('Welcome')}
          >
            <Text style={styles.skipButtonText}>Saltar y continuar →</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            ℹ️ Tus datos están protegidos. Solo se usan para las funcionalidades de la app y nunca se comparten con terceros.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.neutral,
    marginBottom: 25,
    lineHeight: 20,
  },
  permissionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  permissionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 3,
  },
  permissionDesc: {
    fontSize: 12,
    color: COLORS.neutral,
  },
  statusIcon: {
    fontSize: 24,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.neutral,
    marginTop: 5,
    textAlign: 'right',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  skipButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 18,
  },
});
