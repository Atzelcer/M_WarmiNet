import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import MapView, { Marker, Circle } from '../components/MapViewWeb';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { PUNTOS_ROJOS } from '../data/mockData';
import MarcarPuntoModal from '../components/MarcarPuntoModal';
import RadarAnimation from '../components/RadarAnimation';
import { Audio } from 'expo-av';

export default function PuntosRojosScreen({ navigation }) {
  const [casoActual, setCasoActual] = useState(0); // 0, 1, 2
  const [modalVisible, setModalVisible] = useState(false);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalMarcar, setModalMarcar] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [simulando, setSimulando] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState(SUCRE_COORDINATES);
  const [distancia, setDistancia] = useState(0);
  const [soundObject, setSoundObject] = useState(null);

  const casos = [
    {
      id: 1,
      titulo: 'Caso 1: Marcar punto peligroso',
      descripcion: 'Usa el botón "Marcar Punto" para reportar un lugar peligroso con evidencia fotográfica',
      punto: PUNTOS_ROJOS[0],
      tipoSimulacion: 'MARCAR',
    },
    {
      id: 2,
      titulo: 'Caso 2: Acercamiento a zona peligrosa',
      descripcion: 'Simulación: Te acercas a una zona reportada y recibes alerta',
      punto: PUNTOS_ROJOS[1],
      tipoSimulacion: 'ACERCAMIENTO',
    },
    {
      id: 3,
      titulo: 'Caso 3: Llegada a punto peligroso',
      descripcion: 'Simulación: Llegas al punto y se muestra la evidencia y alerta',
      punto: PUNTOS_ROJOS[2],
      tipoSimulacion: 'LLEGADA',
    },
  ];

  const casoActivo = casos[casoActual];

  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  const reproducirAlarma = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' },
        { shouldPlay: true }
      );
      setSoundObject(sound);
    } catch (error) {
      console.log('Error reproduciendo alarma:', error);
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const simularCaso2 = () => {
    setSimulando(true);
    setShowRadar(true);
    const puntoDestino = PUNTOS_ROJOS[1].coordinate;
    
    // Iniciar a 100 metros de distancia
    let paso = 0;
    const totalPasos = 20;
    
    const intervalo = setInterval(() => {
      paso++;
      
      // Calcular posición intermedia moviéndose hacia el punto
      const progreso = paso / totalPasos;
      const latActual = miUbicacion.latitude + (puntoDestino.latitude - miUbicacion.latitude) * progreso;
      const lngActual = miUbicacion.longitude + (puntoDestino.longitude - miUbicacion.longitude) * progreso;
      
      setMiUbicacion({ latitude: latActual, longitude: lngActual });
      
      const dist = calcularDistancia(latActual, lngActual, puntoDestino.latitude, puntoDestino.longitude);
      setDistancia(Math.round(dist));
      
      // A 30-40 metros: notificación y alarma
      if (dist <= 40 && dist >= 30 && !soundObject) {
        reproducirAlarma();
        Alert.alert(
          '⚠️ ZONA PELIGROSA CERCA',
          `Estás a ${Math.round(dist)} metros de un punto peligroso reportado:\n\n"${PUNTOS_ROJOS[1].descripcion}"\n\n¡Ten precaución!`,
          [{ text: 'Entendido', style: 'destructive' }]
        );
      }
      
      // Al llegar: detener y mostrar evidencia
      if (paso >= totalPasos) {
        clearInterval(intervalo);
        setSimulando(false);
        setShowRadar(false);
        setTimeout(() => {
          setPuntoSeleccionado(PUNTOS_ROJOS[1]);
          setModalVisible(true);
        }, 500);
      }
    }, 300);
  };

  const simularCaso3 = () => {
    setSimulando(true);
    setShowRadar(true);
    const puntoDestino = PUNTOS_ROJOS[2].coordinate;
    
    let paso = 0;
    const totalPasos = 25;
    
    const intervalo = setInterval(() => {
      paso++;
      
      const progreso = paso / totalPasos;
      const latActual = miUbicacion.latitude + (puntoDestino.latitude - miUbicacion.latitude) * progreso;
      const lngActual = miUbicacion.longitude + (puntoDestino.longitude - miUbicacion.longitude) * progreso;
      
      setMiUbicacion({ latitude: latActual, longitude: lngActual });
      
      const dist = calcularDistancia(latActual, lngActual, puntoDestino.latitude, puntoDestino.longitude);
      setDistancia(Math.round(dist));
      
      // Al llegar: detener, alarma y mostrar evidencia
      if (paso >= totalPasos) {
        clearInterval(intervalo);
        setSimulando(false);
        setShowRadar(false);
        reproducirAlarma();
        setTimeout(() => {
          setPuntoSeleccionado(PUNTOS_ROJOS[2]);
          setModalVisible(true);
        }, 500);
      }
    }, 300);
  };

  const iniciarSimulacion = () => {
    const caso = casoActivo;
    
    if (caso.tipoSimulacion === 'MARCAR') {
      setModalMarcar(true);
    } else if (caso.tipoSimulacion === 'ACERCAMIENTO') {
      simularCaso2();
    } else if (caso.tipoSimulacion === 'LLEGADA') {
      simularCaso3();
    }
  };

  const handleMarkerPress = (punto) => {
    setPuntoSeleccionado(punto);
    setModalVisible(true);
  };

  const guardarNuevoPunto = (punto) => {
    Alert.alert(
      '✅ Punto guardado',
      'Tu reporte ha sido publicado exitosamente. Gracias por ayudar a la comunidad.',
      [{ text: 'OK', onPress: () => setModalMarcar(false) }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={miUbicacion}
        showsUserLocation={false}
      >
        {/* Puntos rojos reportados */}
        {PUNTOS_ROJOS.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={punto.coordinate}
            pinColor={COLORS.danger}
            title={punto.titulo}
            description={punto.descripcion}
            onPress={() => handleMarkerPress(punto)}
          />
        ))}

        {/* Mi ubicación con círculo de radar */}
        {showRadar && (
          <>
            <Circle
              center={miUbicacion}
              radius={50}
              fillColor="rgba(66, 133, 244, 0.2)"
              strokeColor="rgba(66, 133, 244, 0.8)"
              strokeWidth={2}
            />
            <Marker
              coordinate={miUbicacion}
              pinColor="#4285F4"
              title="Tu ubicación"
            />
          </>
        )}
      </MapView>

      {/* Animación de radar sobre el mapa cuando está activa */}
      {showRadar && (
        <View style={styles.radarOverlay}>
          <RadarAnimation size={60} color="#4285F4" />
          {distancia > 0 && (
            <Text style={styles.distanciaText}>
              📍 {distancia}m al punto peligroso
            </Text>
          )}
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📍 Puntos Rojos</Text>
      </View>

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
        <TouchableOpacity
          style={[styles.actionButton, simulando && styles.actionButtonDisabled]}
          onPress={iniciarSimulacion}
          disabled={simulando}
        >
          <Text style={styles.actionButtonText}>
            {casoActivo.tipoSimulacion === 'MARCAR' ? '📍 Marcar Punto' : '▶️ Iniciar Simulación'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de información de punto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            {puntoSeleccionado && (
              <>
                <Text style={styles.modalTitle}>⚠️ Zona Peligrosa</Text>
                <Text style={styles.modalSubtitle}>{puntoSeleccionado.titulo}</Text>
                
                <Image
                  source={puntoSeleccionado.foto}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <Text style={styles.modalDescripcion}>
                  {puntoSeleccionado.descripcion}
                </Text>

                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    📅 Reportado: {puntoSeleccionado.fecha}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    💜 {puntoSeleccionado.gracias} personas agradecieron
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalGraciasButton}
                  onPress={() => {
                    Alert.alert('Gracias', 'Tu confirmación ayuda a la comunidad');
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalGraciasButtonText}>
                    💜 Agradecer este reporte
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para marcar punto */}
      <MarcarPuntoModal
        visible={modalMarcar}
        onClose={() => setModalMarcar(false)}
        onSave={guardarNuevoPunto}
      />
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
  radarOverlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  distanciaText: {
    marginTop: 10,
    backgroundColor: 'rgba(66, 133, 244, 0.9)',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.danger,
  },
  casoNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.danger,
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
  actionButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5,
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    fontSize: 28,
    color: COLORS.neutral,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalDescripcion: {
    fontSize: 15,
    color: COLORS.primary,
    lineHeight: 22,
    marginBottom: 15,
  },
  modalInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalInfoText: {
    fontSize: 14,
    color: COLORS.neutral,
    marginVertical: 3,
  },
  modalGraciasButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalGraciasButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
