import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function FaceVerificationScreen({ navigation }) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraReady, setCameraReady] = useState(true);

  useEffect(() => {
    // Simulación sin cámara real para evitar crashes
    setCameraReady(true);
  }, []);

  const startScan = () => {
    if (!cameraReady) {
      Alert.alert('Cámara no lista', 'Espera a que la cámara esté lista');
      return;
    }

    setScanning(true);
    setProgress(0);

    // Simular escaneo progresivo
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }
        return prev + 2;
      });
    }, 100); // 5 segundos total (100 pasos de 50ms)
  };

  const completeScan = () => {
    setTimeout(() => {
      setScanning(false);
      Alert.alert(
        '[VERIFICADO] Rostro verificado correctamente',
        'Bienvenida a WarmiNet',
        [
          {
            text: 'Entrar a la app',
            onPress: () => navigation.navigate('HomeMap'),
          },
        ]
      );
    }, 500);
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificación de rostro</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verifica tu identidad</Text>
        <Text style={styles.subtitle}>
          Coloca tu rostro en el centro del recuadro
        </Text>

        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            <View style={styles.faceFrame}>
              <Text style={styles.faceIcon}>[ROSTRO]</Text>
              {scanning && (
                <View style={styles.scanLine}>
                  <View style={styles.scanLineBar} />
                </View>
              )}
            </View>
            <Text style={styles.cameraSubtext}>Simulación de verificación facial</Text>
          </View>
        </View>

        {scanning && (
          <View style={styles.progressContainer}>
            <Text style={styles.scanningText}>Verificando rostro...</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {!scanning && (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScan}
            disabled={!cameraReady}
          >
            <Text style={styles.scanButtonText}>
              [INICIAR] Comenzar verificación
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            [INFO] Esta verificación asegura que eres tú quien está registrándose.
            Tu rostro se usará para futuras autenticaciones de seguridad.
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.neutral,
    marginBottom: 25,
  },
  cameraContainer: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  faceFrame: {
    width: 250,
    height: 320,
    borderWidth: 4,
    borderColor: COLORS.secondary1,
    borderRadius: 150,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLineBar: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.secondary1,
    shadowColor: COLORS.secondary1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary1,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.neutral,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.neutral,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  faceIcon: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  cameraSubtext: {
    fontSize: 14,
    color: COLORS.neutral,
    textAlign: 'center',
    marginTop: 20,
  },
  webCameraPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  webCameraText: {
    fontSize: 120,
    marginBottom: 20,
  },
  webCameraSubtext: {
    fontSize: 16,
    color: COLORS.neutral,
    textAlign: 'center',
  },
});
