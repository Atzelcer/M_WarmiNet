import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useUser } from '../context/UserContext';

export default function RegisterFormScreen({ navigation }) {
  const { saveUserData } = useUser();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    celular: '',
    ciudad: 'Sucre',
  });

  const [personasConfianza, setPersonasConfianza] = useState([
    { nombre: '', ci: '', relacion: '', celular: '' },
  ]);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updatePersonaConfianza = (index, field, value) => {
    const newPersonas = [...personasConfianza];
    newPersonas[index][field] = value;
    setPersonasConfianza(newPersonas);
  };

  const addPersonaConfianza = () => {
    if (personasConfianza.length < 5) {
      setPersonasConfianza([
        ...personasConfianza,
        { nombre: '', ci: '', relacion: '', celular: '' },
      ]);
    } else {
      Alert.alert('Límite alcanzado', 'Puedes agregar máximo 5 personas de confianza');
    }
  };

  const removePersonaConfianza = (index) => {
    if (personasConfianza.length > 1) {
      const newPersonas = personasConfianza.filter((_, i) => i !== index);
      setPersonasConfianza(newPersonas);
    }
  };

  const handleContinue = async () => {
    // Validar campos
    if (!formData.nombreCompleto || !formData.celular) {
      Alert.alert('Datos incompletos', 'Por favor completa todos tus datos personales');
      return;
    }

    // Validar al menos una persona de confianza con datos completos
    const primeraPersona = personasConfianza[0];
    if (!primeraPersona.nombre || !primeraPersona.celular || !primeraPersona.relacion) {
      Alert.alert(
        'Persona de confianza',
        'Debes agregar al menos una persona de confianza completa'
      );
      return;
    }

    // Guardar datos en AsyncStorage a través del contexto
    await saveUserData({ formData, personasConfianza });
    
    Alert.alert(
      '✅ Registro exitoso',
      'Tus datos han sido guardados correctamente',
      [{ text: 'Continuar', onPress: () => navigation.navigate('FaceVerification') }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Completa tu perfil</Text>
      </View>

      <View style={styles.content}>
        {/* Datos personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus datos</Text>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={formData.nombreCompleto}
            onChangeText={(text) => updateFormData('nombreCompleto', text)}
            placeholder="Ej: María González"
            placeholderTextColor={COLORS.neutral}
          />

          <Text style={styles.label}>Número de celular</Text>
          <TextInput
            style={styles.input}
            value={formData.celular}
            onChangeText={(text) => updateFormData('celular', text)}
            placeholder="Ej: 70123456"
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.neutral}
          />

          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            value={formData.ciudad}
            onChangeText={(text) => updateFormData('ciudad', text)}
            placeholder="Ej: Sucre"
            placeholderTextColor={COLORS.neutral}
          />
        </View>

        {/* Personas de confianza */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personas de confianza</Text>
          <Text style={styles.sectionSubtitle}>
            Estas personas serán notificadas en caso de emergencia
          </Text>

          {personasConfianza.map((persona, index) => (
            <View key={index} style={styles.personCard}>
              <View style={styles.personHeader}>
                <Text style={styles.personNumber}>Persona {index + 1}</Text>
                {index > 0 && (
                  <TouchableOpacity onPress={() => removePersonaConfianza(index)}>
                    <Text style={styles.removeButton}>❌ Eliminar</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={persona.nombre}
                onChangeText={(text) => updatePersonaConfianza(index, 'nombre', text)}
                placeholder="Ej: Rosa González"
                placeholderTextColor={COLORS.neutral}
              />

              <Text style={styles.label}>CI</Text>
              <TextInput
                style={styles.input}
                value={persona.ci}
                onChangeText={(text) => updatePersonaConfianza(index, 'ci', text)}
                placeholder="Ej: 12345678 SC"
                placeholderTextColor={COLORS.neutral}
              />

              <Text style={styles.label}>Relación</Text>
              <TextInput
                style={styles.input}
                value={persona.relacion}
                onChangeText={(text) => updatePersonaConfianza(index, 'relacion', text)}
                placeholder="Ej: Mamá, Hermana, Amiga"
                placeholderTextColor={COLORS.neutral}
              />

              <Text style={styles.label}>Celular</Text>
              <TextInput
                style={styles.input}
                value={persona.celular}
                onChangeText={(text) => updatePersonaConfianza(index, 'celular', text)}
                placeholder="Ej: 70654321"
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.neutral}
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={addPersonaConfianza}
          >
            <Text style={styles.addButtonText}>+ Agregar otra persona</Text>
          </TouchableOpacity>
        </View>

        {/* Botón continuar */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.neutral,
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  personCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondary1,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  personNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  removeButton: {
    fontSize: 12,
    color: COLORS.danger,
  },
  addButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: COLORS.secondary1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 3,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
