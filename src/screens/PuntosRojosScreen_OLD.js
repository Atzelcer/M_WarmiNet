import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  TextInput,
  Vibration,
} from 'react-native';
import MapView, { Marker, Circle } from '../components/MapViewWeb';
import * as Haptics from 'expo-haptics';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { PUNTOS_ROJOS } from '../data/mockData';

export default function PuntosRojosScreen({ navigation }) {
  const [escenarioActual, setEscenarioActual] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [creandoPunto, setCreandoPunto] = useState(false);
  const [nuevoPunto, setNuevoPunto] = useState({
    descripcion: '',
    coordinate: null,
  });
  const [simulandoAcercamiento, setSimulandoAcercamiento] = useState(false);

  const handleMarkerPress = (punto) => {
    setPuntoSeleccionado(punto);
    setModalVisible(true);
  };

  const handleGracias = () => {
    if (puntoSeleccionado) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Gracias por tu confirmación',
        'Tu reporte ayuda a mantener segura a la comunidad'
      );
      setModalVisible(false);
    }
  };

  const simularAcercamiento = (punto) => {
    setSimulandoAcercamiento(true);
    
    // Vibrar y mostrar alerta
    Vibration.vibrate([0, 500, 200, 500]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    setTimeout(() => {
      Alert.alert(
        '⚠️ ALERTA DE ZONA PELIGROSA',
        `Estás a 20 metros de un punto rojo:\n\n${punto.descripcion}\n\nReportado el ${punto.fecha}`,
        [
          {
            text: 'Ver detalles',
            onPress: () => {
              setPuntoSeleccionado(punto);
              setModalVisible(true);
              setSimulandoAcercamiento(false);
            },
          },
          {
            text: 'Entendido',
            onPress: () => setSimulandoAcercamiento(false),
          },
        ]
      );
    }, 1000);
  };

  const iniciarCreacionPunto = () => {
    setCreandoPunto(true);
    Alert.alert(
      'Crear punto rojo',
      'Mantén pulsado en el mapa para seleccionar la ubicación'
    );
  };

  const handleMapLongPress = (event) => {
    if (creandoPunto) {
      setNuevoPunto({
        ...nuevoPunto,
        coordinate: event.nativeEvent.coordinate,
      });
      Alert.alert('Ubicación seleccionada', '¿Deseas agregar descripción y foto?', [
        {
          text: 'Continuar',
          onPress: () => {
            // Aquí iría la lógica para agregar foto y descripción
            Alert.alert(
              'Punto creado',
              'El punto rojo ha sido agregado al mapa (simulación)',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setCreandoPunto(false);
                    setNuevoPunto({ descripcion: '', coordinate: null });
                  },
                },
              ]
            );
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    }
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
        <Text style={styles.headerTitle}>Puntos Rojos Colaborativos</Text>
      </View>

      {/* Selector de escenarios */}
      <View style={styles.escenarioSelector}>
        <Text style={styles.escenarioLabel}>Escenarios de demo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.escenarioButton,
              escenarioActual === 1 && styles.escenarioButtonActive,
            ]}
            onPress={() => setEscenarioActual(1)}
          >
            <Text
              style={[
                styles.escenarioButtonText,
                escenarioActual === 1 && styles.escenarioButtonTextActive,
              ]}
            >
              1️⃣ Crear punto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.escenarioButton,
              escenarioActual === 2 && styles.escenarioButtonActive,
            ]}
            onPress={() => setEscenarioActual(2)}
          >
            <Text
              style={[
                styles.escenarioButtonText,
                escenarioActual === 2 && styles.escenarioButtonTextActive,
              ]}
            >
              2️⃣ Aviso cercano
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.escenarioButton,
              escenarioActual === 3 && styles.escenarioButtonActive,
            ]}
            onPress={() => setEscenarioActual(3)}
          >
            <Text
              style={[
                styles.escenarioButtonText,
                escenarioActual === 3 && styles.escenarioButtonTextActive,
              ]}
            >
              3️⃣ Otro punto
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={SUCRE_COORDINATES}
        showsUserLocation={true}
        onLongPress={handleMapLongPress}
      >
        {PUNTOS_ROJOS.map((punto) => (
          <React.Fragment key={punto.id}>
            <Marker
              coordinate={punto.coordinate}
              pinColor={COLORS.danger}
              onPress={() => handleMarkerPress(punto)}
            />
            {(escenarioActual === 2 || escenarioActual === 3) && (
              <Circle
                center={punto.coordinate}
                radius={20}
                fillColor="rgba(255, 0, 0, 0.1)"
                strokeColor={COLORS.danger}
                strokeWidth={2}
              />
            )}
          </React.Fragment>
        ))}

        {nuevoPunto.coordinate && (
          <Marker coordinate={nuevoPunto.coordinate} pinColor={COLORS.warning} />
        )}
      </MapView>

      {/* Controles según escenario */}
      <View style={styles.controls}>
        {escenarioActual === 1 && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={iniciarCreacionPunto}
          >
            <Text style={styles.createButtonText}>
              {creandoPunto ? '✓ Selecciona ubicación en mapa' : '📍 Crear punto rojo'}
            </Text>
          </TouchableOpacity>
        )}

        {(escenarioActual === 2 || escenarioActual === 3) && (
          <View>
            <Text style={styles.controlsTitle}>
              Simular acercamiento a punto:
            </Text>
            {PUNTOS_ROJOS.slice(
              escenarioActual === 2 ? 1 : 2,
              escenarioActual === 2 ? 2 : 3
            ).map((punto) => (
              <TouchableOpacity
                key={punto.id}
                style={styles.simularButton}
                onPress={() => simularAcercamiento(punto)}
              >
                <Text style={styles.simularButtonText}>
                  📍 {punto.descripcion.substring(0, 40)}...
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Modal de detalles */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠️ Zona Peligrosa</Text>

            {puntoSeleccionado && (
              <>
                <Image
                  source={puntoSeleccionado.foto}
                  style={styles.evidenciaImage}
                  resizeMode="cover"
                />

                <Text style={styles.modalDescripcion}>
                  {puntoSeleccionado.descripcion}
                </Text>

                <Text style={styles.modalFecha}>
                  Reportado: {puntoSeleccionado.fecha}
                </Text>

                <Text style={styles.modalGracias}>
                  👍 {puntoSeleccionado.gracias} personas agradecieron esta alerta
                </Text>

                <TouchableOpacity
                  style={styles.graciasButton}
                  onPress={handleGracias}
                >
                  <Text style={styles.graciasButtonText}>👍 Gracias</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.danger,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 5,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  escenarioSelector: {
    backgroundColor: '#fff3e0',
    padding: 12,
  },
  escenarioLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  escenarioButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.neutral,
  },
  escenarioButtonActive: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  escenarioButtonText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: 'bold',
  },
  escenarioButtonTextActive: {
    color: COLORS.white,
  },
  map: {
    flex: 1,
  },
  controls: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  simularButton: {
    backgroundColor: COLORS.warning,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  simularButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 15,
    textAlign: 'center',
  },
  evidenciaImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  modalDescripcion: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 12,
    lineHeight: 22,
  },
  modalFecha: {
    fontSize: 13,
    color: COLORS.neutral,
    marginBottom: 8,
  },
  modalGracias: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  graciasButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  graciasButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
