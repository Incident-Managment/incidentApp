import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  const navigateTo = (routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Home')}>
        <MaterialCommunityIcons name="home" size={24} color={styles.navIcon.color} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Analytics')}>
        <MaterialCommunityIcons name="chart-bar" size={24} color={styles.navIcon.color} />
        <Text style={styles.navText}>Incidencias</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Settings')}>
        <MaterialCommunityIcons name="cog" size={24} color={styles.navIcon.color} />
        <Text style={styles.navText}>Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navButton: {
    alignItems: "center",
    flex: 1,
  },
  navIcon: {
    color: "#333",
  },
  navText: {
    color: "#333",
    fontSize: 12,
  },
});

export default Footer;