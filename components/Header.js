import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Dashboard</Text>
      <TouchableOpacity>
        <MaterialCommunityIcons name="account-circle" size={30} color={styles.icon.color} />
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
    color: "#333",
  },
});

export default Header;