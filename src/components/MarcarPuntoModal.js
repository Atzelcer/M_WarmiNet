import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { COLORS } from '../constants/colors';

export default function MarcarPuntoModal({ visible, onClose, onSave }) {
  const [evidencia, setEvidencia] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setEvidencia(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const seleccionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setEvidencia(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const publicarPunto = async () => {
    if (!evidencia || !descripcion.trim()) {
      Alert.alert(
        'Datos incompletos',
        'Por favor agrega una foto y una descripción del peligro'
      );
      return;
    }

    setLoading(true);

    try {
      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      
      const nuevoPunto = {
        id: Date.now(),
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        descripcion: descripcion.trim(),
        evidencia: evidencia,
        fecha: new Date().toISOString(),
        reportadoPor: 'Usuario actual',
      };

      // Guardar punto (simulado)
      onSave(nuevoPunto);

      Alert.alert(
        '✅ Punto marcado',
        'Tu reporte ha sido publicado. ¡Gracias por ayudar a otras mujeres!',
        [{ text: 'OK', onPress: () => handleClose() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el punto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEvidencia(null);
    setDescripcion('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📍 Marcar Punto Peligroso</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Sección de evidencia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Evidencia fotográfica</Text>
            <Text style={styles.sectionSubtitle}>
              Toma una foto del lugar o sube una desde tu galería
            </Text>

            {evidencia ? (
              <View style={styles.evidenciaContainer}>
                <Image source={{ uri: evidencia }} style={styles.evidenciaImage} />
                <TouchableOpacity
                  style={styles.removeEvidenciaButton}
                  onPress={() => setEvidencia(null)}
                >
                  <Text style={styles.removeEvidenciaText}>✕ Eliminar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.evidenciaButtons}>
                <TouchableOpacity
                  style={[styles.evidenciaButton, { backgroundColor: COLORS.primary }]}
                  onPress={tomarFoto}
                >
                  <Text style={styles.evidenciaButtonIcon}>📷</Text>
                  <Text style={styles.evidenciaButtonText}>Tomar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.evidenciaButton, { backgroundColor: COLORS.secondary1 }]}
                  onPress={seleccionarFoto}
                >
                  <Text style={styles.evidenciaButtonIcon}>🖼️</Text>
                  <Text style={styles.evidenciaButtonText}>Subir foto</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Descripción del peligro</Text>
            <Text style={styles.sectionSubtitle}>
              Describe qué pasó y por qué este lugar es peligroso
            </Text>

            <TextInput
              style={styles.descripcionInput}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Ej: Lugar oscuro con poca iluminación, varias personas sospechosas merodeando..."
              placeholderTextColor={COLORS.neutral}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.caracteresContador}>
              {descripcion.length}/500 caracteres
            </Text>
          </View>

          {/* Información adicional */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ℹ️ Tu reporte será visible para otras usuarias de WarmiNet.
              Ayudas a construir una red de seguridad para todas. Tu nombre se mantendrá anónimo.
            </Text>
          </View>
        </ScrollView>

        {/* Botón publicar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.publicarButton, loading && styles.publicarButtonDisabled]}
            onPress={publicarPunto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.publicarButtonText}>✓ Publicar punto</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.neutral,
    marginBottom: 15,
  },
  evidenciaButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  evidenciaButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  evidenciaButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  evidenciaButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  evidenciaContainer: {
    position: 'relative',
  },
  evidenciaImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
  },
  removeEvidenciaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(220, 20, 60, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  removeEvidenciaText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descripcionInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    color: COLORS.primary,
    minHeight: 150,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  caracteresContador: {
    fontSize: 12,
    color: COLORS.neutral,
    textAlign: 'right',
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  publicarButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5,
  },
  publicarButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  publicarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
