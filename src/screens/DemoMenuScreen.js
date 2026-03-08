import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function DemoMenuScreen({ navigation }) {
  const demoItems = [
    {
      title: '🗺️ Mapa Principal',
      subtitle: 'Ver mapa con todas las funcionalidades',
      screen: 'HomeMap',
      color: COLORS.primary,
    },
    {
      title: '📍 Puntos Rojos',
      subtitle: '3 escenarios de puntos peligrosos colaborativos',
      screen: 'PuntosRojos',
      color: COLORS.danger,
    },
    {
      title: '🚨 Botón Pánico 3s',
      subtitle: '3 incidentes simulados con evidencias',
      screen: 'Panico',
      color: COLORS.secondary2,
    },
    {
      title: '🛣️ Trayecto Seguro',
      subtitle: '3 rutas con temporizadores y alertas',
      screen: 'TrayectoSeguro',
      color: COLORS.secondary3,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.backButtonText}>← Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menú de Demos</Text>
        <Text style={styles.headerSubtitle}>
          Accede directamente a cada simulación
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {demoItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.demoCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.demoTitle}>{item.title}</Text>
            <Text style={styles.demoSubtitle}>{item.subtitle}</Text>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>[INFO] Información de la Demo</Text>
          <Text style={styles.infoText}>
            • Todas las funciones son simulaciones locales{'\n'}
            • No se requiere conexión a internet{'\n'}
            • Los datos son de ejemplo y hardcodeados{'\n'}
            • AWS está configurado en modo demo{'\n'}
            • La app está diseñada para Android (APK)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('CameraID')}
        >
          <Text style={styles.registerButtonText}>
            [REGISTRO] Volver al flujo de registro completo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.secondary1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  demoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    position: 'relative',
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  demoSubtitle: {
    fontSize: 14,
    color: COLORS.neutral,
    lineHeight: 20,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  arrow: {
    fontSize: 24,
    color: COLORS.neutral,
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#2e7d32',
    lineHeight: 22,
  },
  registerButton: {
    backgroundColor: COLORS.secondary1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
