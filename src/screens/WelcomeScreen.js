import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Logo de WarmiNet */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>WarmiNet</Text>
          <Text style={styles.logoSubtext}>Tu seguridad es nuestra prioridad</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bienvenida</Text>
        <Text style={styles.subtitle}>
          Red de seguridad exclusiva para mujeres
        </Text>

        <View style={styles.featuresContainer}>
          <FeatureItem icon="[MAPA]" text="Mapas de seguridad colaborativos" />
          <FeatureItem icon="[SOS]" text="Botón de pánico inteligente" />
          <FeatureItem icon="[SEGURO]" text="Trayectos seguros monitoreados" />
          <FeatureItem icon="[RED]" text="Red de apoyo entre mujeres" />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CameraID')}
        >
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={() => navigation.navigate('DemoMenu')}
        >
          <Text style={styles.demoButtonText}>[DEMO] Ir directo a DEMOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  logoContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.secondary1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  logoSubtext: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 0.6,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.neutral,
    textAlign: 'center',
    marginBottom: 25,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.black,
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: COLORS.secondary1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
  },
  demoButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
