import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapViewWeb';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { INCIDENTES_PANICO } from '../data/mockData';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function PanicoScreen({ navigation }) {
  const [casoActual, setCasoActual] = useState(0);
  const [simulando, setSimulando] = useState(false);
  const [puntosNegros, setPuntosNegros] = useState([]);
  const [posicionActual, setPosicionActual] = useState(null);
  const [modalAlerta, setModalAlerta] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const pulseAnim = useState(new Animated.Value(1))[0];

  const casos = [
    {
      id: 1,
      titulo: 'Caso 1: Yo presiono pánico',
      descripcion: 'Presionas el botón de pánico y dejas rastro de puntos negros',
      incidente: INCIDENTES_PANICO[0],
    },
    {
      id: 2,
      titulo: 'Caso 2: Veo pánico de otra mujer',
      descripcion: 'Aparece alerta de otra mujer que presionó pánico',
      incidente: INCIDENTES_PANICO[1],
    },
    {
      id: 3,
      titulo: 'Caso 3: Yo presiono pánico (ruta 2)',
      descripcion: 'Segunda simulación de pánico con rastro',
      incidente: INCIDENTES_PANICO[2],
    },
  ];

  const casoActivo = casos[casoActual];

  useEffect(() => {
    // Animación de pulso para el botón de pánico
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const reproducirAlarma = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/emergency-alarm-01.mp3' },
        { shouldPlay: true, isLooping: true }
      );
      
      // Detener después de 5 segundos
      setTimeout(() => {
        sound.stopAsync();
        sound.unloadAsync();
      }, 5000);
    } catch (error) {
      console.log('Error reproduciendo alarma:', error);
    }
  };

  const simularCaso1 = () => {
    setSimulando(true);
    setGrabando(true);
    setPuntosNegros([]);
    
    const ruta = INCIDENTES_PANICO[0].ruta;
    const inicio = ruta[0];
    setPosicionActual(inicio);

    reproducirAlarma();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(
      '🚨 PÁNICO ACTIVADO',
      'Tu alerta ha sido enviada a tus contactos de confianza.\n\nCámara y micrófono activados.\nDejando rastro de tu ubicación...',
      [{ text: 'Entendido', style: 'destructive' }]
    );

    // Simular movimiento dejando puntos negros
    let paso = 0;
    const intervalo = setInterval(() => {
      if (paso < ruta.length) {
        const punto = ruta[paso];
        setPosicionActual(punto);
        setPuntosNegros((prev) => [...prev, punto]);
        paso++;
      } else {
        clearInterval(intervalo);
        setSimulando(false);
        setGrabando(false);
        Alert.alert(
          '✅ Simulación completada',
          'Has dejado un rastro de puntos negros. Tus contactos pueden seguir tu ubicación.',
          [{ text: 'OK' }]
        );
      }
    }, 800);
  };

  const simularCaso2 = () => {
    // Mostrar alerta de otra mujer
    const ruta = INCIDENTES_PANICO[1].ruta;
    setPuntosNegros(ruta);
    setPosicionActual(ruta[0]);

    setModalAlerta(true);
  };

  const simularCaso3 = () => {
    setSimulando(true);
    setGrabando(true);
    setPuntosNegros([]);
    
    const ruta = INCIDENTES_PANICO[2].ruta;
    const inicio = ruta[0];
    setPosicionActual(inicio);

    reproducirAlarma();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(
      '🚨 PÁNICO ACTIVADO',
      'Tu alerta ha sido enviada.\n\nCámara y micrófono activados.\nGrabando evidencia...',
      [{ text: 'Entendido', style: 'destructive' }]
    );

    let paso = 0;
    const intervalo = setInterval(() => {
      if (paso < ruta.length) {
        const punto = ruta[paso];
        setPosicionActual(punto);
        setPuntosNegros((prev) => [...prev, punto]);
        paso++;
      } else {
        clearInterval(intervalo);
        setSimulando(false);
        setGrabando(false);
        Alert.alert(
          '✅ Simulación completada',
          'Rastro completo registrado con evidencia',
          [{ text: 'OK' }]
        );
      }
    }, 700);
  };

  const iniciarSimulacion = () => {
    setPuntosNegros([]);
    setPosicionActual(null);

    if (casoActual === 0) {
      simularCaso1();
    } else if (casoActual === 1) {
      simularCaso2();
    } else if (casoActual === 2) {
      simularCaso3();
    }
  };

  const verMasInfo = () => {
    setModalAlerta(false);
    Alert.alert(
      '💜 Mujer en peligro',
      'Una mujer cerca de ti presionó el botón de pánico.\n\nUbicación: Calle menos iluminada\nDistancia: ~500 metros\n\n¿Deseas ayudar?',
      [
        { text: 'Llamar a la policía', onPress: () => Alert.alert('Llamando...', '☎️ 110 - Policía') },
        { text: 'Ver rastro en mapa', onPress: () => Alert.alert('Rastro activado', 'Puedes seguir su ubicación') },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={SUCRE_COORDINATES}
        showsUserLocation={false}
      >
        {/* Línea de rastro conectando puntos negros */}
        {puntosNegros.length > 1 && (
          <Polyline
            coordinates={puntosNegros}
            strokeColor="#000000"
            strokeWidth={4}
          />
        )}

        {/* Puntos negros del rastro */}
        {puntosNegros.map((punto, index) => (
          <Marker
            key={`punto-${index}`}
            coordinate={punto}
            pinColor="#000000"
            title={`Punto ${index + 1}`}
            description={`Registrado hace ${index * 5} segundos`}
          />
        ))}

        {/* Posición actual (último punto) */}
        {posicionActual && (
          <Marker
            coordinate={posicionActual}
            pinColor={grabando ? "#FF0000" : "#000000"}
            title={grabando ? "🚨 EN PÁNICO - Grabando" : "Última posición"}
          />
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🚨 Botón de Pánico</Text>
      </View>

      {/* Indicador de grabación */}
      {grabando && (
        <View style={styles.grabandoIndicador}>
          <View style={styles.grabandoDot} />
          <Text style={styles.grabandoText}>🔴 Grabando evidencia...</Text>
        </View>
      )}

      {/* Selector de casos */}
      <View style={styles.casosContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {casos.map((caso, index) => (
            <TouchableOpacity
              key={caso.id}
              style={[
                styles.casoCard,
                casoActual === index && styles.casoCardActive,
              ]}
              onPress={() => setCasoActual(index)}
            >
              <Text style={[
                styles.casoNumero,
                casoActual === index && styles.casoNumeroActive,
              ]}>
                {caso.id}
              </Text>
              <Text style={[
                styles.casoTitulo,
                casoActual === index && styles.casoTituloActive,
              ]}>
                {caso.titulo.split(':')[1]?.trim() || caso.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Botón de acción */}
      <View style={styles.buttonContainer}>
        <Text style={styles.casoDescripcion}>{casoActivo.descripcion}</Text>
        
        {casoActual === 0 || casoActual === 2 ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.panicoButton, simulando && styles.panicoButtonDisabled]}
              onPress={iniciarSimulacion}
              disabled={simulando}
            >
              <Text style={styles.panicoButtonText}>
                {simulando ? '🚨 EN PÁNICO...' : '🚨 PRESIONAR PÁNICO'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={iniciarSimulacion}
          >
            <Text style={styles.actionButtonText}>
              👀 Ver alerta de otra mujer
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.warningText}>
          * En caso real: se activan cámara, micrófono y se envía a contactos
        </Text>
      </View>

      {/* Modal de alerta de otra mujer */}
      <Modal
        visible={modalAlerta}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalAlerta(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertaCard}>
            <Text style={styles.alertaIcon}>🚨</Text>
            <Text style={styles.alertaTitulo}>¡ALERTA DE PÁNICO!</Text>
            <Text style={styles.alertaDescripcion}>
              Una mujer cerca de ti presionó el botón de pánico
            </Text>
            
            <View style={styles.alertaInfo}>
              <Text style={styles.alertaInfoText}>📍 ~500 metros de distancia</Text>
              <Text style={styles.alertaInfoText}>⏰ Hace 2 minutos</Text>
              <Text style={styles.alertaInfoText}>🗺️ {INCIDENTES_PANICO[1].nombre}</Text>
            </View>

            <TouchableOpacity
              style={styles.alertaButton}
              onPress={verMasInfo}
            >
              <Text style={styles.alertaButtonText}>💜 VER Y AYUDAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertaCerrarButton}
              onPress={() => setModalAlerta(false)}
            >
              <Text style={styles.alertaCerrarText}>Cerrar</Text>
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
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.secondary2,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  grabandoIndicador: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  grabandoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginRight: 10,
  },
  grabandoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  casosContainer: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  casoCard: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    minWidth: 150,
    alignItems: 'center',
    elevation: 3,
  },
  casoCardActive: {
    backgroundColor: COLORS.secondary2,
  },
  casoNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary2,
  },
  casoNumeroActive: {
    color: 'white',
  },
  casoTitulo: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  casoTituloActive: {
    color: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  casoDescripcion: {
    fontSize: 14,
    color: COLORS.neutral,
    textAlign: 'center',
    marginBottom: 15,
  },
  panicoButton: {
    backgroundColor: COLORS.secondary2,
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 8,
    marginBottom: 10,
  },
  panicoButtonDisabled: {
    backgroundColor: '#888',
  },
  panicoButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 11,
    color: COLORS.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertaCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  alertaIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  alertaTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary2,
    marginBottom: 10,
    textAlign: 'center',
  },
  alertaDescripcion: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  alertaInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
  },
  alertaInfoText: {
    fontSize: 14,
    color: COLORS.neutral,
    marginVertical: 3,
  },
  alertaButton: {
    backgroundColor: COLORS.secondary2,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  alertaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertaCerrarButton: {
    paddingVertical: 10,
  },
  alertaCerrarText: {
    color: COLORS.neutral,
    fontSize: 16,
  },
});
