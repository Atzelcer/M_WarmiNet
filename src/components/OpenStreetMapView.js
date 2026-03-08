import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants/colors';

export default function OpenStreetMapView({ 
  markers = [], 
  initialRegion = { latitude: -19.046, longitude: -65.259, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  style 
}) {
  // Convertir marcadores a formato para el mapa
  const markersJSON = JSON.stringify(markers.map(m => ({
    lat: m.coordinate.latitude,
    lng: m.coordinate.longitude,
    title: m.title || '',
    description: m.description || '',
    color: m.pinColor || 'red'
  })));

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Inicializar mapa
        const map = L.map('map').setView([${initialRegion.latitude}, ${initialRegion.longitude}], 14);
        
        // Agregar capa de OpenStreetMap (GRATIS, sin API key)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Agregar marcadores
        const markers = ${markersJSON};
        markers.forEach(marker => {
          const color = marker.color === '#DC143C' || marker.color === 'red' ? 'red' : 'blue';
          
          // Icono personalizado para puntos rojos
          let icon;
          if (color === 'red') {
            icon = L.divIcon({
              className: 'custom-marker',
              html: '<div style="background-color: #DC143C; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
              iconSize: [26, 26],
              iconAnchor: [13, 13]
            });
          } else {
            icon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            });
          }
          
          const leafletMarker = L.marker([marker.lat, marker.lng], { icon: icon }).addTo(map);
          
          if (marker.title || marker.description) {
            leafletMarker.bindPopup(\`
              <div style="font-family: Arial, sans-serif;">
                <strong style="color: #4b135f;">\${marker.title}</strong>
                <br/>
                <span style="font-size: 12px;">\${marker.description}</span>
              </div>
            \`);
          }
          
          // Enviar evento cuando se toca un marcador
          leafletMarker.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'markerPress',
              data: marker
            }));
          });
        });
        
        // Marcador de ubicación del usuario
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: '<div style="background-color: #4285F4; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 10px rgba(66, 133, 244, 0.8);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        L.marker([${initialRegion.latitude}, ${initialRegion.longitude}], { icon: userIcon })
          .addTo(map)
          .bindPopup('<strong style="color: #4b135f;">📍 Tu ubicación</strong>');
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === 'markerPress') {
              // Aquí puedes manejar el evento de click en marcador
              console.log('Marcador presionado:', message.data);
            }
          } catch (e) {
            console.log('Error parsing message:', e);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
