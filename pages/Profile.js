import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";


const Profile = () => {
    const [userData, setUserData] = useState({
      name: '',
      email: '',
      phone: '',
      company: '',
      accountCreated: '',
      role: '',
    });
  
    const navigation = useNavigation();
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user);
            const creationDate = new Date(parsedUser.user.creation_date);
            const formattedDate = `${creationDate.getDate()}/${creationDate.getMonth() + 1}/${creationDate.getFullYear()}`;
            setUserData({
              name: parsedUser.user.name || 'Nombre no disponible',
              email: parsedUser.user.email || 'Email no disponible',
              phone: parsedUser.user.phone_number || 'Teléfono no disponible',
              company: parsedUser.user.company.name || 'Compañía no disponible',
              accountCreated: formattedDate, // Este dato puede venir de tu backend
              role: parsedUser.user.role.name || 'Rol no disponible',
            });
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('user');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{userData.company}</Text>
        <View style={styles.card}>
         <MaterialCommunityIcons name="account-circle" size={60} color={styles.icon.color} />
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.role}>{userData.role}</Text>
  
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Correo Electrónico: </Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
  
            <Text style={styles.infoTitle}>Teléfono:</Text>
            <Text style={styles.infoValue}>{userData.phone}</Text>
  
            <Text style={styles.infoTitle}>Compañia:</Text>
            <Text style={styles.infoValue}>{userData.company}</Text>
  
            <Text style={styles.infoTitle}>Cuenta creada:</Text>
            <Text style={styles.infoValue}>{userData.accountCreated}</Text>
          </View>
        </View>
  
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 30,
      backgroundColor: '#F9FAFB',
      alignItems: 'center',
      paddingTop: 90,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
      color: '#1F2937',
    },
    card: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    profileImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#D8C4B6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#1F2937',
    },
    role: {
      fontSize: 16,
      color: '#6b7280',
      marginBottom: 20,
    },
    infoContainer: {
      width: '100%',
      marginBottom: 20,
    },
    infoTitle: {
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 5,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 10,
      color: '#1F2937',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    logoutButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#2563EB',
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
    },
    logoutButtonText: {
      color: '#ffffff',
      fontSize: 19,
      fontWeight: 'bold',
    },
    icon: {
      color: "#3d3d3d",
    },
  });

export default Profile;
