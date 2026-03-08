import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// APP SIMPLIFICADA PARA PROBAR
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ WARMINET</Text>
        <Text style={styles.subtitle}>App de Seguridad para Mujeres</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.status}>✅ App funcionando correctamente</Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🏠 Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🔴 Puntos Rojos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🆘 Botón Pánico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🛣️ Rutas Seguras</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Si ves esto, la app está corriendo bien ✅
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4b135f',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fd71b2',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4b135f',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4b135f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontSize: 14,
  },
});
