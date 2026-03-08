import React, { useState, useEffect } from 'react';
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
import { TIPOS_POST } from '../data/posts';
import { useUser } from '../context/UserContext';

export default function CrearPostModal({ visible, onClose, onSave }) {
  const { userData } = useUser();
  const [fotos, setFotos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('ZONA_PELIGROSA');
  const [ubicacion, setUbicacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  useEffect(() => {
    if (visible) {
      obtenerUbicacion();
    }
  }, [visible]);

  const obtenerUbicacion = async () => {
    try {
      setObteniendoUbicacion(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos tu ubicación para el post');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        nombre: address[0]?.street || address[0]?.name || 'Ubicación actual',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    } finally {
      setObteniendoUbicacion(false);
    }
  };

  const tomarFoto = async () => {
    if (fotos.length >= 3) {
      Alert.alert('Límite alcanzado', 'Puedes subir máximo 3 fotos');
      return;
    }

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
        setFotos([...fotos, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const seleccionarFotos = async () => {
    if (fotos.length >= 3) {
      Alert.alert('Límite alcanzado', 'Puedes subir máximo 3 fotos');
      return;
    }

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
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        setFotos([...fotos, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const eliminarFoto = (index) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    setFotos(nuevasFotos);
  };

  const publicarPost = async () => {
    if (!descripcion.trim()) {
      Alert.alert('Descripción requerida', 'Por favor describe qué está pasando');
      return;
    }

    if (fotos.length === 0) {
      Alert.alert(
        'Sin evidencia',
        '¿Estás segura de publicar sin fotos? Las evidencias ayudan más a la comunidad.',
        [
          { text: 'Agregar fotos', style: 'cancel' },
          { text: 'Publicar sin fotos', onPress: () => enviarPost() },
        ]
      );
      return;
    }

    await enviarPost();
  };

  const enviarPost = async () => {
    setLoading(true);

    try {
      const nuevoPost = {
        id: Date.now(),
        usuaria: userData?.formData?.nombreCompleto || 'Usuaria Anónima',
        avatar: '👤',
        fecha: new Date().toLocaleString('es-BO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        ubicacion: ubicacion,
        descripcion: descripcion.trim(),
        evidencias: fotos,
        tipo: tipoSeleccionado,
        reacciones: {
          apoyo: 0,
          gracias: 0,
        },
      };

      onSave(nuevoPost);

      Alert.alert(
        '✅ Post publicado',
        'Tu reporte ha sido compartido con la comunidad. ¡Gracias por ayudarnos a estar más seguras!',
        [{ text: 'OK', onPress: () => handleClose() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar el post. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFotos([]);
    setDescripcion('');
    setTipoSeleccionado('ZONA_PELIGROSA');
    setUbicacion(null);
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
          <Text style={styles.headerTitle}>📢 Nuevo Post</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Tipo de situación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏷️ ¿Qué está pasando?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.entries(TIPOS_POST).map(([key, tipo]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.tipoChip,
                    tipoSeleccionado === key && {
                      backgroundColor: tipo.color,
                      borderColor: tipo.color,
                    },
                  ]}
                  onPress={() => setTipoSeleccionado(key)}
                >
                  <Text style={styles.tipoEmoji}>{tipo.emoji}</Text>
                  <Text
                    style={[
                      styles.tipoLabel,
                      tipoSeleccionado === key && styles.tipoLabelActive,
                    ]}
                  >
                    {tipo.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Ubicación</Text>
            {obteniendoUbicacion ? (
              <View style={styles.ubicacionLoading}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.ubicacionLoadingText}>Obteniendo ubicación...</Text>
              </View>
            ) : ubicacion ? (
              <View style={styles.ubicacionCard}>
                <Text style={styles.ubicacionIcon}>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ubicacionNombre}>{ubicacion.nombre}</Text>
                  <Text style={styles.ubicacionCoords}>
                    {ubicacion.latitude.toFixed(5)}, {ubicacion.longitude.toFixed(5)}
                  </Text>
                </View>
                <TouchableOpacity onPress={obtenerUbicacion}>
                  <Text style={styles.ubicacionRefresh}>🔄</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.ubicacionButton} onPress={obtenerUbicacion}>
                <Text style={styles.ubicacionButtonText}>📍 Obtener ubicación</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Fotos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Evidencia fotográfica (máx. 3)</Text>
            
            {fotos.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fotosPreview}>
                {fotos.map((foto, index) => (
                  <View key={index} style={styles.fotoContainer}>
                    <Image source={{ uri: foto }} style={styles.fotoImage} />
                    <TouchableOpacity
                      style={styles.fotoEliminar}
                      onPress={() => eliminarFoto(index)}
                    >
                      <Text style={styles.fotoEliminarText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {fotos.length < 3 && (
              <View style={styles.fotosButtons}>
                <TouchableOpacity style={styles.fotoButton} onPress={tomarFoto}>
                  <Text style={styles.fotoButtonIcon}>📷</Text>
                  <Text style={styles.fotoButtonText}>Tomar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.fotoButton} onPress={seleccionarFotos}>
                  <Text style={styles.fotoButtonIcon}>🖼️</Text>
                  <Text style={styles.fotoButtonText}>Subir foto</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Describe la situación</Text>
            <Text style={styles.sectionSubtitle}>
              Comparte detalles que ayuden a otras mujeres a estar seguras
            </Text>

            <TextInput
              style={styles.descripcionInput}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Ej: Grupo de personas sospechosas merodeando la zona. Tuve que cambiar de calle. Recomiendo evitar este lugar en la noche..."
              placeholderTextColor={COLORS.neutral}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={800}
            />
            <Text style={styles.caracteresContador}>
              {descripcion.length}/800 caracteres
            </Text>
          </View>

          {/* Información */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💜 Tu post será visible para todas las usuarias de WarmiNet. 
              Tu identidad se mantendrá protegida y solo se mostrará tu nombre 
              (puedes usar un alias en tu perfil).
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Botón publicar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.publicarButton, loading && styles.publicarButtonDisabled]}
            onPress={publicarPost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.publicarButtonText}>📢 Publicar ahora</Text>
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
    fontSize: 20,
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
  tipoChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  tipoLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tipoLabelActive: {
    color: 'white',
  },
  ubicacionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
  },
  ubicacionLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.neutral,
  },
  ubicacionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.secondary1,
  },
  ubicacionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  ubicacionNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ubicacionCoords: {
    fontSize: 12,
    color: COLORS.neutral,
    marginTop: 3,
  },
  ubicacionRefresh: {
    fontSize: 24,
  },
  ubicacionButton: {
    backgroundColor: COLORS.secondary1,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  ubicacionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fotosPreview: {
    marginBottom: 15,
  },
  fotoContainer: {
    position: 'relative',
    marginRight: 10,
  },
  fotoImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  fotoEliminar: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(220, 20, 60, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoEliminarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fotosButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  fotoButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  fotoButtonIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  fotoButtonText: {
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
    minHeight: 180,
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
    borderRadius: 15,
    marginTop: 10,
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
    backgroundColor: COLORS.primary,
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
