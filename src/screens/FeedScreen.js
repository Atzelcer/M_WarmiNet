import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function FeedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📢 Feed Comunitario</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardEmoji}>📢</Text>
          <Text style={styles.cardTitle}>Feed Comunitario</Text>
          <Text style={styles.cardText}>
            Aquí podrás ver y compartir situaciones peligrosas reportadas por la comunidad.
          </Text>
          <Text style={styles.cardInfo}>
            💜 Esta función estará disponible próximamente
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEmoji}>📍</Text>
          <Text style={styles.cardSubtitle}>Características que incluirá:</Text>
          <Text style={styles.cardList}>
            • Reportar ubicación actual{'\n'}
            • Subir fotos de evidencia{'\n'}
            • Describir la situación{'\n'}
            • Ver reportes de otras usuarias{'\n'}
            • Sistema de apoyo comunitario
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible en la próxima versión')}
      >
        <Text style={styles.buttonText}>✏️ Crear Reporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  cardEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.neutral,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  cardInfo: {
    fontSize: 16,
    color: COLORS.secondary1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cardList: {
    fontSize: 16,
    color: COLORS.neutral,
    lineHeight: 28,
  },
  button: {
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 18,
    borderRadius: 15,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
