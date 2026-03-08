import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
  Modal,
} from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapViewWeb';
// import { Video } from 'expo-av';
// import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { INCIDENTES_PANICO, USUARIOS_DEMO } from '../data/mockData';
import { sendSNSNotification } from '../services/awsService';

export default function PanicoScreen({ navigation }) {
  const [incidenteActual, setIncidenteActual] = useState(0);
  const [panicoActivado, setPanicoActivado] = useState(false);
  const [presionando, setPresionando] = useState(false);
  const [tiempoPresion, setTiempoPresion] = useState(0);
  const [grabando, setGrabando] = useState(false);
  const [confirmaciones, setConfirmaciones] = useState(0);
  const [alertaPolicia, setAlertaPolicia] = useState(false);
  const [modalEvidencias, setModalEvidencias] = useState(false);

  const timerRef = useRef(null);

  const incidente = INCIDENTES_PANICO[incidenteActual];

  useEffect(() => {
    if (presionando) {
      timerRef.current = setInterval(() => {
        setTiempoPresion((prev) => {
          if (prev >= 3) {
            clearInterval(timerRef.current);
            activarPanico();
            return 3;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (tiempoPresion > 0 && tiempoPresion < 3) {
        setTiempoPresion(0);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [presionando]);

  const activarPanico = () => {
    setPresionando(false);
    setPanicoActivado(true);
    setGrabando(true);

    // Vibración intensa
    Vibration.vibrate([0, 1000, 500, 1000]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(
      '🚨 PÁNICO ACTIVADO',
      'Grabando video y audio. Notificando a mujeres cercanas.',
      [{ text: 'OK' }]
    );

    // Simular grabación de 30 segundos
    setTimeout(() => {
      setGrabando(false);
      Alert.alert('📹 Evidencias capturadas', 'Video y audio guardados');
    }, 5000);
  };

  const simularConfirmacion = () => {
    if (confirmaciones < 2) {
      const nuevasConfirmaciones = confirmaciones + 1;
      setConfirmaciones(nuevasConfirmaciones);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '✅ Confirmación recibida',
        `${nuevasConfirmaciones} mujer(es) confirmaron que van en camino`,
        [{ text: 'OK' }]
      );

      if (nuevasConfirmaciones >= 2) {
        setTimeout(() => {
          llamarPolicia();
        }, 2000);
      }
    }
  };

  const llamarPolicia = () => {
    setAlertaPolicia(true);
    
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);
    
    Alert.alert(
      '🚔 ¡LLAMANDO A LA POLICÍA!',
      'Tu ubicación y evidencias están siendo enviadas a las autoridades.\n\nTambién se notificará a tu mamá.',
      [
        {
          text: 'Ver detalles',
          onPress: () => mostrarDetallesAlerta(),
        },
      ]
    );

    // Simular llamadas con SNS
    setTimeout(() => {
      sendSNSNotification('110', 'Emergencia WarmiNet - Mujer en peligro');
      sendSNSNotification(
        USUARIOS_DEMO.mujer.personasConfianza[0].celular,
        'ALERTA: Tu hija activó el botón de pánico'
      );
    }, 1000);
  };

  const mostrarDetallesAlerta = () => {
    Alert.alert(
      '🚨 Alerta enviada a:',
      `📞 Policía: 110\n` +
        `👤 ${USUARIOS_DEMO.mujer.personasConfianza[0].nombre} (${USUARIOS_DEMO.mujer.personasConfianza[0].relacion}): ${USUARIOS_DEMO.mujer.personasConfianza[0].celular}\n\n` +
        `📍 Ubicación: ${incidente.nombre}\n` +
        `📹 Evidencias: Video + Audio`,
      [{ text: 'OK' }]
    );
  };

  const resetearDemo = () => {
    setPanicoActivado(false);
    setPresionando(false);
    setTiempoPresion(0);
    setGrabando(false);
    setConfirmaciones(0);
    setAlertaPolicia(false);
  };

  const cambiarIncidente = (index) => {
    resetearDemo();
    setIncidenteActual(index);
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
        <Text style={styles.headerTitle}>Botón Pánico 3 Segundos</Text>
      </View>

      {/* Selector de incidentes */}
      <View style={styles.incidenteSelector}>
        <Text style={styles.incidenteLabel}>Incidentes de demo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {INCIDENTES_PANICO.map((inc, index) => (
            <TouchableOpacity
              key={inc.id}
              style={[
                styles.incidenteButton,
                incidenteActual === index && styles.incidenteButtonActive,
              ]}
              onPress={() => cambiarIncidente(index)}
            >
              <Text
                style={[
                  styles.incidenteButtonText,
                  incidenteActual === index && styles.incidenteButtonTextActive,
                ]}
              >
                {index + 1}️⃣ {inc.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mapa con ruta */}
      <MapView
        style={styles.map}
        initialRegion={{
          ...incidente.coordinate,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker coordinate={incidente.coordinate} pinColor={COLORS.danger} />
        
        {panicoActivado && (
          <Polyline
            coordinates={incidente.ruta}
            strokeColor={COLORS.black}
            strokeWidth={5}
          />
        )}

        {panicoActivado &&
          incidente.ruta.map((coord, index) => (
            <Marker
              key={index}
              coordinate={coord}
              pinColor={COLORS.black}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.puntoNegro} />
            </Marker>
          ))}
      </MapView>

      {/* Panel de control */}
      <View style={styles.controlPanel}>
        {!panicoActivado ? (
          <View style={styles.panicoButtonContainer}>
            <Text style={styles.instruccion}>
              Mantén presionado 3 segundos para activar
            </Text>
            <TouchableOpacity
              style={[
                styles.panicoButton,
                presionando && styles.panicoButtonPressing,
              ]}
              onPressIn={() => setPresionando(true)}
              onPressOut={() => setPresionando(false)}
              activeOpacity={1}
            >
              <Text style={styles.panicoButtonText}>
                {presionando ? '⏱️ ' + tiempoPresion.toFixed(1) + 's' : '🚨 PÁNICO'}
              </Text>
            </TouchableOpacity>
            {presionando && (
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${(tiempoPresion / 3) * 100}%` }]}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.estadoPanico}>
            <Text style={styles.estadoTitle}>🚨 PÁNICO ACTIVADO</Text>
            
            {grabando && (
              <View style={styles.grabandoContainer}>
                <Text style={styles.grabandoText}>📹 Grabando evidencias...</Text>
                <View style={styles.recordingDot} />
              </View>
            )}

            <View style={styles.confirmacionesContainer}>
              <Text style={styles.confirmacionesText}>
                Confirmaciones: {confirmaciones}/2
              </Text>
              <TouchableOpacity
                style={styles.confirmarButton}
                onPress={simularConfirmacion}
                disabled={confirmaciones >= 2}
              >
                <Text style={styles.confirmarButtonText}>
                  {confirmaciones >= 2 ? '✅ Confirmado' : '👍 Confirmar ayuda'}
                </Text>
              </TouchableOpacity>
            </View>

            {alertaPolicia && (
              <View style={styles.alertaPolicia}>
                <Text style={styles.alertaPoliciaText}>
                  🚔 ¡LLAMANDO A LA POLICÍA!
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.evidenciasButton}
              onPress={() => setModalEvidencias(true)}
            >
              <Text style={styles.evidenciasButtonText}>📹 Ver evidencias</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetearDemo}>
              <Text style={styles.resetButtonText}>🔄 Resetear demo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal de evidencias */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEvidencias}
        onRequestClose={() => setModalEvidencias(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📹 Evidencias capturadas</Text>

            <Text style={styles.modalSubtitle}>Video del incidente:</Text>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>
                🎥 Video simulado{'\n'}30 segundos
              </Text>
            </View>

            <Text style={styles.modalSubtitle}>Audio grabado:</Text>
            <View style={styles.audioPlaceholder}>
              <Text style={styles.audioPlaceholderText}>🎵 Audio simulado</Text>
            </View>

            <Text style={styles.modalInfo}>
              📍 Ubicación: {incidente.nombre}{'\n'}
              ⏰ Hora: {new Date().toLocaleTimeString()}{'\n'}
              📱 Ruta negra: {incidente.ruta.length} puntos marcados
            </Text>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalEvidencias(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
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
    backgroundColor: COLORS.secondary2,
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
  incidenteSelector: {
    backgroundColor: '#ffebee',
    padding: 12,
  },
  incidenteLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  incidenteButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.neutral,
  },
  incidenteButtonActive: {
    backgroundColor: COLORS.secondary2,
    borderColor: COLORS.secondary2,
  },
  incidenteButtonText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: 'bold',
  },
  incidenteButtonTextActive: {
    color: COLORS.white,
  },
  map: {
    flex: 1,
  },
  puntoNegro: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.black,
  },
  controlPanel: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  panicoButtonContainer: {
    alignItems: 'center',
  },
  instruccion: {
    fontSize: 14,
    color: COLORS.neutral,
    marginBottom: 15,
    textAlign: 'center',
  },
  panicoButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  panicoButtonPressing: {
    backgroundColor: '#cc0000',
    transform: [{ scale: 0.95 }],
  },
  panicoButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.danger,
  },
  estadoPanico: {
    alignItems: 'center',
  },
  estadoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 15,
  },
  grabandoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  grabandoText: {
    fontSize: 16,
    color: COLORS.black,
    marginRight: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.danger,
  },
  confirmacionesContainer: {
    width: '100%',
    marginBottom: 15,
  },
  confirmacionesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmarButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmarButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertaPolicia: {
    backgroundColor: '#1565c0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  alertaPoliciaText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  evidenciasButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  evidenciasButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    marginTop: 10,
  },
  videoPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  videoPlaceholderText: {
    fontSize: 16,
    color: COLORS.neutral,
    textAlign: 'center',
  },
  audioPlaceholder: {
    width: '100%',
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  audioPlaceholderText: {
    fontSize: 16,
    color: COLORS.neutral,
  },
  modalInfo: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  closeModalButton: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
