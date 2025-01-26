import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('Profile'); // Asegúrate de que 'Profile' sea el nombre correcto de la ruta
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Dashboard</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    color: "#578e7e",
  },
});

export default Header;