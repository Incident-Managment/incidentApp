import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Footer = () => {
  const [roleId, setRoleId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRoleId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setRoleId(parsedUser.user.role.id);
        }
      } catch (error) {
        console.error('Error fetching role ID from AsyncStorage', error);
      }
    };

    fetchRoleId();
  }, []);

  const navigateTo = (routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  };

  if (roleId === 2 || roleId === 3) {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Home')}>
          <MaterialCommunityIcons name="home" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Analytics')}>
          <MaterialCommunityIcons name="file-upload" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Incidencias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('ViewIncident')}>
          <MaterialCommunityIcons name="list-status" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Ver Incidencias</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (roleId === 4) {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Home')}>
          <MaterialCommunityIcons name="home" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Scanner')}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('ConversationsList')}>
          <MaterialCommunityIcons name="chat-alert" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
      </View>
    );
  } else{
    return(
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('Home')}>
          <MaterialCommunityIcons name="home" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateTo('ConversationsList')}>
          <MaterialCommunityIcons name="chat-alert" size={24} color={styles.navIcon.color} />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
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