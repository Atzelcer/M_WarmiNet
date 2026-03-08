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
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapViewWeb';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { INCIDENTES_PANICO } from '../data/mockData';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const EVIDENCIAS = {
  caso1: {
    imagen: require('../../assets/panico/panicoImage01.jpg'),
    audio: require('../../assets/panico/panicoAudio01.mp3'),
  },
  caso2: {
    imagen: require('../../assets/panico/panicoImage02.jpg'),
    audio: require('../../assets/panico/panicoAudio02.mp3'),
  },
  caso3: {
    imagen: require('../../assets/panico/panicoImage03.jpg'),
    audio: require('../../assets/panico/panicoAudio03.mp3'),
  },
};

export default function PanicoScreen({ navigation }) {
  const [casoActual, setCasoActual] = useState(0);
  const [simulando, setSimulando] = useState(false);
  const [puntosNegros, setPuntosNegros] = useState([]);
  const [evidenciasGuardadas, setEvidenciasGuardadas] = useState([]);
  const [posicionActual, setPosicionActual] = useState(null);
  const [modalAlerta, setModalAlerta] = useState(false);
  const [modalEvidencias, setModalEvidencias] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [sound, setSound] = useState(null);
  const [reproduciendo, setReproduciendo] = useState(false);
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

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const reproducirAudio = async (audioSource) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true }
      );

      setSound(newSound);
      setReproduciendo(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setReproduciendo(false);
        }
      });

      console.log('[Pánico] Audio reproduciendo...');
    } catch (error) {
      console.log('Error reproduciendo audio:', error);
      Alert.alert('Error', 'No se pudo reproducir el audio');
    }
  };

  const detenerAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setReproduciendo(false);
    }
  };

  const guardarEvidencia = (punto, casoNumero) => {
    const nuevaEvidencia = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      punto,
      timestamp: new Date().toISOString(),
      imagen: EVIDENCIAS[`caso${casoNumero}`].imagen,
      audio: EVIDENCIAS[`caso${casoNumero}`].audio,
      casoNumero,
    };

    setEvidenciasGuardadas((prev) => [...prev, nuevaEvidencia]);
    console.log('[Pánico] Evidencia guardada:', nuevaEvidencia.id);
  };

  const simularCaso1 = () => {
    setSimulando(true);
    setGrabando(true);
    setPuntosNegros([]);
    setEvidenciasGuardadas([]);
    
    const ruta = INCIDENTES_PANICO[0].ruta;
    const inicio = ruta[0];
    setPosicionActual(inicio);

    // Reproducir audio de evidencia
    reproducirAudio(EVIDENCIAS.caso1.audio);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(
      '🚨 PÁNICO ACTIVADO',
      'Tu alerta ha sido enviada a tus contactos de confianza.\n\nCámara y micrófono activados.\nDejando rastro de tu ubicación...',
      [{ text: 'Entendido', style: 'destructive' }]
    );

    // Simular movimiento dejando puntos negros y evidencias
    let paso = 0;
    const intervalo = setInterval(() => {
      if (paso < ruta.length) {
        const punto = ruta[paso];
        setPosicionActual(punto);
        setPuntosNegros((prev) => [...prev, punto]);
        
        // Guardar evidencia cada 2 puntos
        if (paso % 2 === 0) {
          guardarEvidencia(punto, 1);
        }
        
        paso++;
      } else {
        clearInterval(intervalo);
        setSimulando(false);
        setGrabando(false);
        Alert.alert(
          '✅ Simulación completada',
          `Has dejado un rastro de puntos negros.\nEvidencias capturadas: ${Math.ceil(ruta.length / 2)}\n\nToca "Ver Evidencias" para revisar.`,
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
    setEvidenciasGuardadas([]);

    // Guardar evidencias de la otra mujer
    ruta.forEach((punto, index) => {
      if (index % 2 === 0) {
        setTimeout(() => {
          guardarEvidencia(punto, 2);
        }, index * 100);
      }
    });

    setModalAlerta(true);
  };

  const simularCaso3 = () => {
    setSimulando(true);
    setGrabando(true);
    setPuntosNegros([]);
    setEvidenciasGuardadas([]);
    
    const ruta = INCIDENTES_PANICO[2].ruta;
    const inicio = ruta[0];
    setPosicionActual(inicio);

    reproducirAudio(EVIDENCIAS.caso3.audio);
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
        
        // Guardar evidencia cada 2 puntos
        if (paso % 2 === 0) {
          guardarEvidencia(punto, 3);
        }
        
        paso++;
      } else {
        clearInterval(intervalo);
        setSimulando(false);
        setGrabando(false);
        Alert.alert(
          '✅ Simulación completada',
          `Rastro completo registrado con evidencia.\nEvidencias capturadas: ${Math.ceil(ruta.length / 2)}\n\nToca "Ver Evidencias" para revisar.`,
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

        {/* Botón para ver evidencias */}
        {evidenciasGuardadas.length > 0 && (
          <TouchableOpacity
            style={styles.evidenciasButton}
            onPress={() => setModalEvidencias(true)}
          >
            <Text style={styles.evidenciasButtonText}>
              📸 Ver Evidencias ({evidenciasGuardadas.length})
            </Text>
          </TouchableOpacity>
        )}
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

      {/* Modal de Evidencias */}
      <Modal
        visible={modalEvidencias}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalEvidencias(false)}
      >
        <View style={styles.evidenciasModal}>
          <View style={styles.evidenciasHeader}>
            <Text style={styles.evidenciasTitle}>
              📸 Evidencias Capturadas ({evidenciasGuardadas.length})
            </Text>
            <TouchableOpacity onPress={() => setModalEvidencias(false)}>
              <Text style={styles.cerrarModalText}>✕ Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.evidenciasList}>
            {evidenciasGuardadas.map((evidencia, index) => (
              <View key={evidencia.id} style={styles.evidenciaItem}>
                <View style={styles.evidenciaHeader}>
                  <Text style={styles.evidenciaNumero}>
                    Evidencia #{index + 1}
                  </Text>
                  <Text style={styles.evidenciaTimestamp}>
                    {new Date(evidencia.timestamp).toLocaleTimeString('es-BO')}
                  </Text>
                </View>

                <Text style={styles.evidenciaUbicacion}>
                  📍 Lat: {evidencia.punto.latitude.toFixed(5)}, 
                  Lon: {evidencia.punto.longitude.toFixed(5)}
                </Text>

                {/* Imagen de evidencia */}
                <Image 
                  source={evidencia.imagen}
                  style={styles.evidenciaImagen}
                  resizeMode="cover"
                />

                {/* Controles de audio */}
                <View style={styles.audioControls}>
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => reproducirAudio(evidencia.audio)}
                    disabled={reproduciendo}
                  >
                    <Text style={styles.audioButtonText}>
                      {reproduciendo ? '▶️ Reproduciendo...' : '▶️ Reproducir Audio'}
                    </Text>
                  </TouchableOpacity>

                  {reproduciendo && (
                    <TouchableOpacity
                      style={styles.audioButtonStop}
                      onPress={detenerAudio}
                    >
                      <Text style={styles.audioButtonText}>⏹️ Detener</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
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
  evidenciasButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius:20,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  evidenciasButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  evidenciasModal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  evidenciasHeader: {
    backgroundColor: COLORS.secondary2,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  evidenciasTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cerrarModalText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  evidenciasList: {
    flex: 1,
    padding: 15,
  },
  evidenciaItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  evidenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  evidenciaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary2,
  },
  evidenciaTimestamp: {
    fontSize: 12,
    color: COLORS.neutral,
  },
  evidenciaUbicacion: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 10,
  },
  evidenciaImagen: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  audioButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  audioButtonStop: {
    backgroundColor: COLORS.secondary2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  audioButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
