import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = () => {
  const navigation = useNavigation();
  const [company, setCompany] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setCompany(parsedUser.user.company.name || 'Compañía no disponible');
        }
      } catch (error) {
        console.error('Error al obtener la compañía del usuario:', error);
      }
    };

    fetchCompany();
  }, []);

  const handleProfilePress = () => {
    navigation.navigate('Profile'); // Asegúrate de que 'Profile' sea el nombre correcto de la ruta
  };


  return (
    <View style={styles.header}>
      <Text style={styles.title}>{company}</Text>
      <TouchableOpacity onPress={handleProfilePress}>
        <MaterialCommunityIcons name="account-circle" size={39} color={styles.icon.color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    top: 3,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    color: "#3d3d3d",
  },
});

export default Header;