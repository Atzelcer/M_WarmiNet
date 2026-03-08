import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
  const { userData } = useUser();

  if (!userData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay datos de perfil</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      {/* Foto de perfil */}
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          <Text style={styles.profileImageText}>
            {userData.formData?.nombreCompleto?.charAt(0) || '👤'}
          </Text>
        </View>
        <Text style={styles.profileName}>{userData.formData?.nombreCompleto}</Text>
        <Text style={styles.profileCity}>📍 {userData.formData?.ciudad}</Text>
      </View>

      {/* Datos personales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Datos Personales</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Celular:</Text>
          <Text style={styles.dataValue}>{userData.formData?.celular}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>CI:</Text>
          <Text style={styles.dataValue}>{userData.formData?.ci || 'No registrado'}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Dirección:</Text>
          <Text style={styles.dataValue}>{userData.formData?.direccion || 'No registrada'}</Text>
        </View>
      </View>

      {/* Personas de confianza */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Personas de Confianza</Text>
        {userData.personasConfianza?.map((persona, index) => (
          <View key={index} style={styles.personCard}>
            <Text style={styles.personName}>{persona.nombre}</Text>
            <Text style={styles.personDetail}>📱 {persona.celular}</Text>
            <Text style={styles.personDetail}>💼 {persona.relacion}</Text>
            {persona.ci && <Text style={styles.personDetail}>🆔 {persona.ci}</Text>}
          </View>
        ))}
      </View>

      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Mis Estadísticas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Puntos marcados</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Alertas enviadas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Trayectos seguros</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  profileCity: {
    fontSize: 16,
    color: COLORS.neutral,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataLabel: {
    fontSize: 16,
    color: COLORS.neutral,
  },
  dataValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  personCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  personDetail: {
    fontSize: 14,
    color: COLORS.neutral,
    marginTop: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.neutral,
    textAlign: 'center',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.neutral,
  },
});
