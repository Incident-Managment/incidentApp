import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
        <MaterialCommunityIcons name="home" size={24} color={styles.navIcon.color} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Analytics')}>
        <MaterialCommunityIcons name="chart-bar" size={24} color={styles.navIcon.color} />
        <Text style={styles.navText}>Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
        <MaterialCommunityIcons name="cog" size={24} color={styles.navIcon.color} />
        <Text style={styles.navText}>Settings</Text>
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
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
});

export default Footer;