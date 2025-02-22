import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Analytics from './pages/Incidents';
import TechnicianScanner from './pages/Scanner';
import IncidenciasList from './pages/IncidenView';
import IncidenciasListTechnician from './pages/IncidentViewT';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AlertNotificationRoot>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ 
            headerShown: true,
            title: 'Perfil',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerBackTitle: '', // Cambia el texto de retroceso en iOS
          }}
        />
        <Stack.Screen 
          name="Analytics" 
          component={Analytics} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Scanner" 
          component={TechnicianScanner} 
          options={{ 
            headerShown: true,
            title: 'Escáner',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
            headerBackTitle: '', // Cambia el texto de retroceso en iOS
          }} 
        />
        <Stack.Screen
          name="ViewIncident"
          component={IncidenciasList}
          options={{ 
            headerShown: true,
            title: 'Incidencias',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
          }}
        />
        <Stack.Screen
          name="ViewIncidentTechnician"
          component={IncidenciasListTechnician}
          options={{ 
            headerShown: true,
            title: 'Incidencias',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
          }}
        />
      </Stack.Navigator>
      </AlertNotificationRoot>
    </NavigationContainer>
  );
}