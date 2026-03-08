import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapViewWeb';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { RUTAS_SEGURAS } from '../data/mockData';

export default function TrayectoSeguroScreen({ navigation }) {
  const [rutaActual, setRutaActual] = useState(0);
  const [simulando, setSimulando] = useState(false);
  const [trayecto, setTrayecto] = useState([]);
  const [trayectoDesvio, setTrayectoDesvio] = useState([]);
  const [posicionActual, setPosicionActual] = useState(null);
  const [modalFormulario, setModalFormulario] = useState(false);
  const [formData, setFormData] = useState({
    inicio: '',
    destino: '',
  });

  const ruta = RUTAS_SEGURAS[rutaActual];

  // Generar trayecto entre dos puntos
  const generarTrayecto = (inicio, fin, numPuntos = 15) => {
    const puntos = [];
    for (let i = 0; i <= numPuntos; i++) {
      const ratio = i / numPuntos;
      const lat = inicio.latitude + (fin.latitude - inicio.latitude) * ratio;
      const lng = inicio.longitude + (fin.longitude - inicio.longitude) * ratio;
      puntos.push({ latitude: lat, longitude: lng });
    }
    return puntos;
  };

  // Generar desvío RUTA 2: Se desvía pero llega
  const generarDesvioRuta2 = (ruta) => {
    const mitad = Math.floor(ruta.length / 2);
    const desvio = [];
    
    // Primera mitad normal
    for (let i = 0; i < mitad; i++) {
      desvio.push(ruta[i]);
    }
    
    // Desvío
    const puntoDesvio = ruta[mitad];
    desvio.push({
      latitude: puntoDesvio.latitude + 0.001,
      longitude: puntoDesvio.longitude + 0.0015,
    });
    desvio.push({
      latitude: puntoDesvio.latitude + 0.0015,
      longitude: puntoDesvio.longitude + 0.001,
    });
    
    // Regresa y continúa hasta el final
    for (let i = mitad + 1; i < ruta.length; i++) {
      desvio.push(ruta[i]);
    }
    
    return desvio;
  };

  // Generar desvío RUTA 3: Se desvía y se queda
  const generarDesvioRuta3 = (ruta) => {
    const mitad = Math.floor(ruta.length / 2);
    const desvio = [];
    
    // Primera mitad normal
    for (let i = 0; i < mitad; i++) {
      desvio.push(ruta[i]);
    }
    
    // Se desvía y se queda ahí
    const puntoDesvio = ruta[mitad];
    desvio.push({
      latitude: puntoDesvio.latitude + 0.002,
      longitude: puntoDesvio.longitude - 0.001,
    });
    desvio.push({
      latitude: puntoDesvio.latitude + 0.0025,
      longitude: puntoDesvio.longitude - 0.0015,
    });
    // Se queda aquí, no continúa al destino
    
    return desvio;
  };

  const iniciarSimulacion = () => {
    setTrayecto([]);
    setTrayectoDesvio([]);
    setPosicionActual(ruta.inicio);
    setSimulando(true);

    // Generar trayecto base
    const trayectoBase = generarTrayecto(ruta.inicio, ruta.fin);
    
    let trayectoFinal = trayectoBase;
    let tienDesvio = false;

    // Aplicar desvíos según el caso
    if (rutaActual === 1) {
      // Ruta 2: Se desvía pero llega
      trayectoFinal = generarDesvioRuta2(trayectoBase);
      tienDesvio = true;
    } else if (rutaActual === 2) {
      // Ruta 3: Se desvía y se queda
      trayectoFinal = generarDesvioRuta3(trayectoBase);
      tienDesvio = true;
    }

    Alert.alert(
      '🛤️ Trayecto Seguro Iniciado',
      `Ruta: ${ruta.nombre}\n\nTus contactos de confianza recibirán notificaciones de tu ubicación.\n\n${tienDesvio ? '⚠️ En esta simulación ocurrirá un desvío' : '✅ Seguirás la ruta correctamente'}`,
      [{ text: 'Iniciar', onPress: () => simularRecorrido(trayectoFinal, tienDesvio) }]
    );
  };

  const simularRecorrido = (trayectoFinal, tienDesvio) => {
    let paso = 0;

    const intervalo = setInterval(() => {
      if (paso < trayectoFinal.length) {
        const punto = trayectoFinal[paso];
        setPosicionActual(punto);
        
        // Agregar punto al trayecto (azul)
        setTrayecto((prev) => [...prev, punto]);
        
        paso++;
      } else {
        clearInterval(intervalo);
        setSimulando(false);
        
        // Verificar si llegó al destino
        const ultimoPunto = trayectoFinal[trayectoFinal.length - 1];
        const distanciaFinal = calcularDistancia(
          ultimoPunto.latitude,
          ultimoPunto.longitude,
          ruta.fin.latitude,
          ruta.fin.longitude
        );

        if (distanciaFinal < 50) {
          // Llegó al destino
          Alert.alert(
            '✅ Destino alcanzado',
            `¡Llegaste a salvo!\n\n${ruta.nombre}\n\nTus contactos han sido notificados.`,
            [{ text: 'OK' }]
          );
        } else {
          // No llegó (se desvió y se quedó)
          Alert.alert(
            '⚠️ Desvío detectado',
            `Tu ubicación se detuvo fuera de la ruta.\n\nDistancia al destino: ${Math.round(distanciaFinal)}m\n\nTus contactos de confianza han sido alertados.`,
            [
              { text: 'Estoy bien', onPress: () => console.log('Usuario está bien') },
              { text: 'Necesito ayuda', style: 'destructive', onPress: () => Alert.alert('Alerta enviada', 'Tus contactos han sido notificados') },
            ]
          );
        }
      }
    }, 500);
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
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

  const abrirFormulario = () => {
    setModalFormulario(true);
  };

  const guardarRutaPersonalizada = () => {
    if (!formData.inicio.trim() || !formData.destino.trim()) {
      Alert.alert('Datos incompletos', 'Por favor completa ambos campos');
      return;
    }

    Alert.alert(
      '✅ Ruta guardada',
      `Tu ruta personalizada ha sido guardada:\n\n📍 Inicio: ${formData.inicio}\n🎯 Destino: ${formData.destino}\n\nPodrás iniciarla cuando quieras.`,
      [{ text: 'OK', onPress: () => setModalFormulario(false) }]
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
        {/* Marcador de inicio */}
        <Marker
          coordinate={ruta.inicio}
          pinColor="#4285F4"
          title="📍 Inicio"
          description={ruta.nombre.split('→')[0]}
        />

        {/* Marcador de fin */}
        <Marker
          coordinate={ruta.fin}
          pinColor="#34A853"
          title="🎯 Destino"
          description={ruta.nombre.split('→')[1]}
        />

        {/* Línea del trayecto recorrido (azul) */}
        {trayecto.length > 0 && (
          <Polyline
            coordinates={trayecto}
            strokeColor="#4285F4"
            strokeWidth={5}
          />
        )}

        {/* Posición actual */}
        {posicionActual && (
          <Marker
            coordinate={posicionActual}
            pinColor={simulando ? "#FFD700" : "#4285F4"}
            title={simulando ? "🚶‍♀️ En movimiento" : "Posición final"}
          />
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛤️ Trayecto Seguro</Text>
      </View>

      {/* Selector de rutas */}
      <View style={styles.rutasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {RUTAS_SEGURAS.map((r, index) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.rutaCard,
                rutaActual === index && styles.rutaCardActive,
              ]}
              onPress={() => {
                if (!simulando) {
                  setRutaActual(index);
                  setTrayecto([]);
                  setPosicionActual(null);
                }
              }}
            >
              <Text style={[
                styles.rutaNumero,
                rutaActual === index && styles.rutaNumeroActive,
              ]}>
                {r.id}
              </Text>
              <Text style={[
                styles.rutaNombre,
                rutaActual === index && styles.rutaNombreActive,
              ]}>
                {r.nombre}
              </Text>
              <Text style={[
                styles.rutaEstado,
                rutaActual === index && styles.rutaEstadoActive,
              ]}>
                {r.estado === 'COMPLETO' && '✅ Llegó bien'}
                {r.estado === 'DESVIO_LLEGO' && '⚠️ Desvío → Llegó'}
                {r.estado === 'DESVIO_QUEDO' && '❌ Desvió y quedó'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Info de ruta */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitulo}>{ruta.nombre}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📍 Inicio:</Text>
          <Text style={styles.infoValue}>{ruta.nombre.split('→')[0]}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>🎯 Destino:</Text>
          <Text style={styles.infoValue}>{ruta.nombre.split('→')[1]}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>⏱️ Tiempo:</Text>
          <Text style={styles.infoValue}>~{ruta.tiempoMinutos} min</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.iniciarButton, simulando && styles.iniciarButtonDisabled]}
          onPress={iniciarSimulacion}
          disabled={simulando}
        >
          <Text style={styles.iniciarButtonText}>
            {simulando ? '🚶‍♀️ En camino...' : '▶️ Iniciar Trayecto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.personalizarButton}
          onPress={abrirFormulario}
        >
          <Text style={styles.personalizarButtonText}>
            ⚙️ Crear ruta personalizada
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de formulario */}
      <Modal
        visible={modalFormulario}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalFormulario(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>🗺️ Nueva Ruta</Text>

            <Text style={styles.label}>📍 Punto de inicio</Text>
            <TextInput
              style={styles.input}
              value={formData.inicio}
              onChangeText={(text) => setFormData({ ...formData, inicio: text })}
              placeholder="Ej: Mi casa, Calle Bolívar 123"
              placeholderTextColor={COLORS.neutral}
            />

            <Text style={styles.label}>🎯 Punto de llegada</Text>
            <TextInput
              style={styles.input}
              value={formData.destino}
              onChangeText={(text) => setFormData({ ...formData, destino: text })}
              placeholder="Ej: Universidad USFX"
              placeholderTextColor={COLORS.neutral}
            />

            <TouchableOpacity
              style={styles.guardarButton}
              onPress={guardarRutaPersonalizada}
            >
              <Text style={styles.guardarButtonText}>✓ Guardar ruta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelarButton}
              onPress={() => setModalFormulario(false)}
            >
              <Text style={styles.cancelarButtonText}>Cancelar</Text>
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
    backgroundColor: COLORS.secondary3,
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
  rutasContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  rutaCard: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    minWidth: 140,
    alignItems: 'center',
    elevation: 3,
  },
  rutaCardActive: {
    backgroundColor: COLORS.secondary3,
  },
  rutaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary3,
  },
  rutaNumeroActive: {
    color: 'white',
  },
  rutaNombre: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  rutaNombreActive: {
    color: 'white',
  },
  rutaEstado: {
    fontSize: 10,
    color: COLORS.neutral,
    marginTop: 3,
  },
  rutaEstadoActive: {
    color: 'white',
  },
  infoContainer: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.neutral,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
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
  iniciarButton: {
    backgroundColor: COLORS.secondary3,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
  },
  iniciarButtonDisabled: {
    backgroundColor: COLORS.neutral,
  },
  iniciarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  personalizarButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  personalizarButtonText: {
    color: 'white',
    fontSize: 16,
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
    padding: 25,
    width: '100%',
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  guardarButton: {
    backgroundColor: COLORS.secondary3,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  guardarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelarButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelarButtonText: {
    color: COLORS.neutral,
    fontSize: 16,
  },
});
