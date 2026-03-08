import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';

export default function CameraIDScreen({ navigation }) {
  const [anverso, setAnverso] = useState(null);
  const [reverso, setReverso] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (lado) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (lado === 'anverso') {
        setAnverso(result.assets[0].uri);
      } else {
        setReverso(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async (lado) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (lado === 'anverso') {
        setAnverso(result.assets[0].uri);
      } else {
        setReverso(result.assets[0].uri);
      }
    }
  };

  const validateCI = () => {
    if (!anverso || !reverso) {
      Alert.alert('Fotos incompletas', 'Por favor, captura ambas caras del CI');
      return;
    }

    setLoading(true);

    // Simulación de OCR - en una app real, aquí iría el análisis con ML
    setTimeout(() => {
      setLoading(false);
      
      // Simulación: detectar si es mujer u hombre
      // En la demo real, el nombre del archivo o un análisis determinaría esto
      // Por ahora, simulamos que siempre detecta mujer para permitir flujo
      
      const esMujer = simulateOCRDetection(anverso);
      
      if (esMujer) {
        Alert.alert(
          '[VALIDADO] Validación exitosa',
          'Eres mujer. Continúa con tu registro.',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('RegisterForm'),
            },
          ]
        );
      } else {
        Alert.alert(
          '[DENEGADO] Acceso denegado',
          'No puedes registrarte en la app. No cumples con las políticas de privacidad y acceso exclusivo para mujeres.',
          [
            {
              text: 'Entendido',
              onPress: () => navigation.navigate('Welcome'),
            },
          ]
        );
      }
    }, 3000);
  };

  // Simulación de OCR - Detecta si el CI es de mujer
  const simulateOCRDetection = (imageUri) => {
    // En una implementación real, aquí se analizaría el texto del CI
    // Para la demo, podemos usar el nombre del archivo o simular siempre true
    
    const filename = imageUri.toLowerCase();
    
    // Si el nombre contiene "mujer" o palabras como "soltera", "casada", etc.
    if (filename.includes('mujer') || filename.includes('woman')) {
      return true;
    }
    
    // Si contiene "hombre" u otros indicadores
    if (filename.includes('hombre') || filename.includes('man')) {
      return false;
    }
    
    // Por defecto, para facilitar la demo, retornamos true
    // En producción, esto sería un análisis real con ML
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificación de identidad</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verifica tu carnet de identidad</Text>
        <Text style={styles.subtitle}>
          Este proceso asegura que WarmiNet sea un espacio exclusivo para mujeres
        </Text>

        {/* Anverso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Anverso del CI</Text>
          {anverso ? (
            <Image source={{ uri: anverso }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>[DOC]</Text>
              <Text style={styles.placeholderSubtext}>Anverso del CI</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => takePhoto('anverso')}
            >
              <Text style={styles.actionButtonText}>[CAM] Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() => pickImage('anverso')}
            >
              <Text style={styles.actionButtonTextSecondary}>[GAL] Galería</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reverso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Reverso del CI</Text>
          {reverso ? (
            <Image source={{ uri: reverso }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>[DOC]</Text>
              <Text style={styles.placeholderSubtext}>Reverso del CI</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => takePhoto('reverso')}
            >
              <Text style={styles.actionButtonText}>[CAM] Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() => pickImage('reverso')}
            >
              <Text style={styles.actionButtonTextSecondary}>[GAL] Galería</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón validar */}
        <TouchableOpacity
          style={[
            styles.validateButton,
            (!anverso || !reverso) && styles.validateButtonDisabled,
          ]}
          onPress={validateCI}
          disabled={!anverso || !reverso || loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.validateButtonText}>Validar identidad</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingText}>
            Analizando documento con OCR simulado...
          </Text>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            [INFO] Para la demo: usa imágenes con nombres que contengan "mujer" o
            "hombre" para simular la detección OCR.
          </Text>
        </View>
      </View>
    </ScrollView>
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
    lineHeight: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.neutral,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.neutral,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonTextSecondary: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  validateButton: {
    backgroundColor: COLORS.secondary1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    elevation: 3,
  },
  validateButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  validateButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 14,
    marginBottom: 15,
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
});
