import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker } from '../components/MapViewWeb';
import * as Location from 'expo-location';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { PUNTOS_ROJOS } from '../data/mockData';

export default function HomeMapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No podemos acceder a tu ubicación');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = (punto) => {
    Alert.alert(
      '[PELIGRO] Zona peligrosa',
      punto.descripcion + '\n\n' + punto.gracias + ' personas agradecieron esta alerta',
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Ver detalles', onPress: () => navigation.navigate('PuntosRojos') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        style={styles.map}

        initialRegion={SUCRE_COORDINATES}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Mostrar puntos rojos */}
        {PUNTOS_ROJOS.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={punto.coordinate}
            pinColor={COLORS.danger}
            title="[!] Zona peligrosa"
            description={punto.descripcion}
            onPress={() => handleMarkerPress(punto)}
          />
        ))}
      </MapView>

      {/* Header con logo y menú */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>WarmiNet</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('DemoMenu')}
        >
          <Text style={styles.menuButtonText}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Botones flotantes */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.danger }]}
          onPress={() => navigation.navigate('PuntosRojos')}
        >
          <Text style={styles.actionButtonEmoji}>[!]</Text>
          <Text style={styles.actionButtonText}>Puntos{'\n'}Rojos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.secondary2 }]}
          onPress={() => navigation.navigate('Panico')}
        >
          <Text style={styles.actionButtonEmoji}>[SOS]</Text>
          <Text style={styles.actionButtonText}>Botón{'\n'}Pánico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.secondary3 }]}
          onPress={() => navigation.navigate('TrayectoSeguro')}
        >
          <Text style={styles.actionButtonEmoji}>[►]</Text>
          <Text style={styles.actionButtonText}>Trayecto{'\n'}Seguro</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de información */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() =>
          Alert.alert(
            'WarmiNet - Mapa Principal',
            '[!] Puntos rojos: zonas peligrosas reportadas\n\n' +
              '[SOS] Botón pánico: emergencias 3 segundos\n\n' +
              '[►] Trayecto seguro: monitoreo de rutas\n\n' +
              'Toca los marcadores rojos para ver detalles.'
          )
        }
      >
        <Text style={styles.infoButtonText}>[i]</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(75, 19, 95, 0.95)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  floatingButtons: {
    position: 'absolute',
    right: 20,
    top: 150,
    gap: 15,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 13,
  },
  infoButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  infoButtonText: {
    fontSize: 24,
  },
});
