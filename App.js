import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Analytics from './pages/Incidents';
import Settings from './pages/Scanner';
import ConversationsList from './pages/ConversationsList';
import ChatScreen from './pages/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          name="Settings" 
          component={Settings} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ConversationsList" 
          component={ConversationsList} 
          options={{ 
            headerShown: true,
            title: 'Chat',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
          }} 
        />
        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen} 
          options={({ route }) => ({ 
            headerShown: true,
            title: route.params.name,
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}