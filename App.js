import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { initAWS } from './src/services/awsService';
import { UserProvider } from './src/context/UserContext';

// Pantallas
import PermissionsScreen from './src/screens/PermissionsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CameraIDScreen from './src/screens/CameraIDScreen';
import RegisterFormScreen from './src/screens/RegisterFormScreen';
import FaceVerificationScreen from './src/screens/FaceVerificationScreen';
import HomeMapScreen from './src/screens/HomeMapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PuntosRojosScreen from './src/screens/PuntosRojosScreen';
import PanicoScreen from './src/screens/PanicoScreen';
import TrayectoSeguroScreen from './src/screens/TrayectoSeguroScreen';
import DemoMenuScreen from './src/screens/DemoMenuScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Inicializar AWS al cargar la app
    initAWS();
  }, []);

  return (
    <UserProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Permissions"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#ffffff' },
          }}
        >
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CameraID" component={CameraIDScreen} />
          <Stack.Screen name="RegisterForm" component={RegisterFormScreen} />
          <Stack.Screen name="FaceVerification" component={FaceVerificationScreen} />
          <Stack.Screen name="HomeMap" component={HomeMapScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="DemoMenu" component={DemoMenuScreen} />
          <Stack.Screen name="PuntosRojos" component={PuntosRojosScreen} />
          <Stack.Screen name="Panico" component={PanicoScreen} />
          <Stack.Screen name="TrayectoSeguro" component={TrayectoSeguroScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
