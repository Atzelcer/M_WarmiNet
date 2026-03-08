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
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/colors';
import { RUTAS_SEGURAS, USUARIOS_DEMO } from '../data/mockData';
import { sendSNSNotification } from '../services/awsService';

export default function TrayectoSeguroScreen({ navigation }) {
  const [rutaActual, setRutaActual] = useState(0);
  const [trayectoIniciado, setTrayectoIniciado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [modalExtender, setModalExtender] = useState(false);
  const [extendido, setExtendido] = useState(false);
  const [alertaEnviada, setAlertaEnviada] = useState(false);

  const timerRef = useRef(null);
  const ruta = RUTAS_SEGURAS[rutaActual];

  useEffect(() => {
    if (trayectoIniciado && tiempoRestante > 0) {
      timerRef.current = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            preguntarExtension();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [trayectoIniciado, tiempoRestante]);

  const iniciarTrayecto = () => {
    setTrayectoIniciado(true);
    setTiempoRestante(ruta.tiempoDemo);
    setExtendido(false);
    setAlertaEnviada(false);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      '✅ Trayecto iniciado',
      `Ruta: ${ruta.nombre}\nTiempo: ${ruta.tiempoMinutos} minutos\n\n(Demo: ${ruta.tiempoDemo} segundos)\n\nTus personas de confianza serán notificadas si no llegas a tiempo.`
    );
  };

  const preguntarExtension = () => {
    Vibration.vibrate([0, 500, 200, 500]);
    
    if (rutaActual === 1) {
      // RUTA 2: Usuario extiende
      setModalExtender(true);
    } else {
      // RUTA 1 y 3: No responde, se envía alerta
      setTimeout(() => {
        enviarAlertaFamilia();
      }, 3000);
    }
  };

  const extenderTiempo = () => {
    setModalExtender(false);
    setExtendido(true);
    setTiempoRestante(ruta.tiempoDemo);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      '✅ Tiempo extendido',
      `Se agregaron ${ruta.tiempoMinutos} minutos más a tu trayecto.`
    );
  };

  const enviarAlertaFamilia = () => {
    setAlertaEnviada(true);
    
    Vibration.vibrate([0, 1000, 500, 1000]);
    
    // Simular envío SNS
    USUARIOS_DEMO.mujer.personasConfianza.forEach((persona) => {
      sendSNSNotification(
        persona.celular,
        `ALERTA: ${USUARIOS_DEMO.mujer.nombre} no llegó a su destino. Ruta: ${ruta.nombre}`
      );
    });

    Alert.alert(
      '⚠️ Alerta enviada a familia',
      `Se notificó a tus personas de confianza:\n\n` +
        USUARIOS_DEMO.mujer.personasConfianza.map(
          (p) => `• ${p.nombre} (${p.relacion}): ${p.celular}`
        ).join('\n') +
        `\n\nRuta: ${ruta.nombre}\nÚltima ubicación compartida`,
      [{ text: 'OK' }]
    );
  };

  const confirmarLlegada = () => {
    Alert.alert(
      '✅ Llegada confirmada',
      '¡Llegaste a salvo! Tus personas de confianza serán notificadas.',
      [
        {
          text: 'OK',
          onPress: () => resetearDemo(),
        },
      ]
    );
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simular envío SNS de confirmación
    sendSNSNotification(
      USUARIOS_DEMO.mujer.personasConfianza[0].celular,
      `${USUARIOS_DEMO.mujer.nombre} llegó a salvo a su destino.`
    );
  };

  const resetearDemo = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTrayectoIniciado(false);
    setTiempoRestante(0);
    setModalExtender(false);
    setExtendido(false);
    setAlertaEnviada(false);
  };

  const cambiarRuta = (index) => {
    resetearDemo();
    setRutaActual(index);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <Text style={styles.headerTitle}>Trayecto Seguro</Text>
      </View>

      {/* Selector de rutas */}
      <View style={styles.rutaSelector}>
        <Text style={styles.rutaLabel}>Rutas de demo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {RUTAS_SEGURAS.map((r, index) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.rutaButton,
                rutaActual === index && styles.rutaButtonActive,
              ]}
              onPress={() => cambiarRuta(index)}
            >
              <Text
                style={[
                  styles.rutaButtonText,
                  rutaActual === index && styles.rutaButtonTextActive,
                ]}
              >
                {index + 1}️⃣ {r.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (ruta.inicio.latitude + ruta.fin.latitude) / 2,
          longitude: (ruta.inicio.longitude + ruta.fin.longitude) / 2,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={ruta.inicio}
          pinColor={COLORS.success}
          title="Inicio"
          description={ruta.nombre.split(' → ')[0]}
        />
        <Marker
          coordinate={ruta.fin}
          pinColor={COLORS.primary}
          title="Destino"
          description={ruta.nombre.split(' → ')[1]}
        />
        {trayectoIniciado && (
          <Polyline
            coordinates={[ruta.inicio, ruta.fin]}
            strokeColor={alertaEnviada ? COLORS.danger : COLORS.secondary3}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Panel de control */}
      <View style={styles.controlPanel}>
        {!trayectoIniciado ? (
          <View>
            <Text style={styles.rutaTitle}>{ruta.nombre}</Text>
            <View style={styles.rutaInfo}>
              <Text style={styles.rutaInfoItem}>
                ⏱️ Tiempo estimado: {ruta.tiempoMinutos} min
              </Text>
              <Text style={styles.rutaInfoItem}>
                📱 Demo: {ruta.tiempoDemo} segundos
              </Text>
            </View>

            <TouchableOpacity
              style={styles.iniciarButton}
              onPress={iniciarTrayecto}
            >
              <Text style={styles.iniciarButtonText}>🛣️ Iniciar trayecto</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ Comportamiento según ruta:{'\n\n'}
                • Ruta 1: No responde → Alerta enviada{'\n'}
                • Ruta 2: Extiende tiempo correctamente{'\n'}
                • Ruta 3: No responde → Alerta enviada
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.trayectoTitle}>🛣️ Trayecto en curso</Text>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Tiempo restante:</Text>
              <Text
                style={[
                  styles.timerText,
                  tiempoRestante <= 10 && styles.timerTextWarning,
                ]}
              >
                {formatTime(tiempoRestante)}
              </Text>
            </View>

            {extendido && (
              <View style={styles.extendidoBadge}>
                <Text style={styles.extendidoText}>✅ Tiempo extendido</Text>
              </View>
            )}

            {alertaEnviada && (
              <View style={styles.alertaBadge}>
                <Text style={styles.alertaText}>
                  ⚠️ Alerta enviada a familia
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmarButton}
              onPress={confirmarLlegada}
            >
              <Text style={styles.confirmarButtonText}>✅ Confirmar llegada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelarButton}
              onPress={resetearDemo}
            >
              <Text style={styles.cancelarButtonText}>❌ Cancelar trayecto</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal extender tiempo */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalExtender}
        onRequestClose={() => setModalExtender(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⏰ Tiempo agotado</Text>
            <Text style={styles.modalText}>
              ¿Deseas extender tu tiempo?{'\n\n'}
              Si no respondes, se notificará a tu familia.
            </Text>

            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={extenderTiempo}
            >
              <Text style={styles.modalButtonPrimaryText}>
                ✅ Extender tiempo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => {
                setModalExtender(false);
                setTimeout(() => enviarAlertaFamilia(), 2000);
              }}
            >
              <Text style={styles.modalButtonSecondaryText}>
                ❌ No responder (simular)
              </Text>
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
    backgroundColor: COLORS.secondary3,
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
  rutaSelector: {
    backgroundColor: '#f3e5f5',
    padding: 12,
  },
  rutaLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  rutaButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.neutral,
  },
  rutaButtonActive: {
    backgroundColor: COLORS.secondary3,
    borderColor: COLORS.secondary3,
  },
  rutaButtonText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: 'bold',
  },
  rutaButtonTextActive: {
    color: COLORS.white,
  },
  map: {
    flex: 1,
  },
  controlPanel: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rutaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  rutaInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  rutaInfoItem: {
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 5,
  },
  iniciarButton: {
    backgroundColor: COLORS.secondary3,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  iniciarButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#2e7d32',
    lineHeight: 20,
  },
  trayectoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary3,
    marginBottom: 15,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
  },
  timerLabel: {
    fontSize: 16,
    color: COLORS.neutral,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.secondary3,
  },
  timerTextWarning: {
    color: COLORS.danger,
  },
  extendidoBadge: {
    backgroundColor: COLORS.success,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  extendidoText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertaBadge: {
    backgroundColor: COLORS.danger,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  alertaText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmarButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmarButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelarButton: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelarButtonText: {
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
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalButtonPrimaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  modalButtonSecondaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
