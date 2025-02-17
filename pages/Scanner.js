import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import { CameraView, Camera } from "expo-camera";

import Header from "../components/Header";
import Footer from "../components/Footer";

const TechnicianScanner = () => {
  const [machineId, setMachineId] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [incidencia, setIncidencia] = useState(null);
  const route = useRoute();
  const incidentId = route?.params?.incidentId;
  const [allowQR, setAllowQR] = useState(true);

  // Solicitar permisos de la cámara
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // Obtener datos de la incidencia
  useEffect(() => {
    if (incidentId) {
      const fetchIncidencia = async () => {
        try {
          const response = await fetch(`https://back.incidentstream.cloud/api/incidents/getIncidentById?incidentId=${incidentId}`);
          if (!response.ok) throw new Error("Error en la respuesta del servidor");
          const data = await response.json();
          setIncidencia(data);
        } catch (error) {
          console.error("Error al obtener la incidencia:", error);
        }
      };

      fetchIncidencia();
    }
  }, [incidentId]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setMachineId(data);
      setStatus("Máquina escaneada");
  
      const updateIncident = async () => {
        try {
          const scannedMachineId = parseInt(data, 10);
          if (isNaN(scannedMachineId)) {
            console.error("El ID de la máquina escaneada no es un número válido:", data);
            Alert.alert("Error", "El ID de la máquina escaneada no es un número válido.");
            setScanned(false);
            return;
          }
  
          console.log("Scanned Machine ID (converted to integer):", scannedMachineId);
          console.log("Incident ID:", incidentId);
  
          const requestBody = { incident_id: incidentId, scanned_machine_id: scannedMachineId };
          console.log("Request body:", requestBody);
  
          const response = await fetch("https://back.incidentstream.cloud/api/incidents/updateIncidentByScan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
  
          const responseData = await response.json();
          console.log("Response status:", response.status);
          console.log("Response data:", responseData);
  
          if (response.ok) {
            Alert.alert("Éxito", "La incidencia ha sido actualizada correctamente.");
          } else {
            Alert.alert("Error", "Hubo un problema al actualizar la incidencia.");
          }
        } catch (error) {
          console.error("Error al actualizar la incidencia:", error);
          Alert.alert("Error", "Hubo un problema al actualizar la incidencia.");
        }
      };
  
      updateIncident();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="scan-circle-outline" size={40} color="#007AFF" />
          <Text style={styles.title}>Escáner de Máquinas</Text>
        </View>

        {/* Módulo de escaneo */}
        <View style={styles.scannerContainer}>
          {hasPermission === null ? (
            <Text>Solicitando permiso de cámara...</Text>
          ) : hasPermission === false ? (
            <Text>No tienes acceso a la cámara</Text>
          ) : (
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: allowQR
                  ? ["qr"]
                  : ["code128", "ean13", "ean8", "upc_a", "upc_e"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </View>

        {scanned && (
          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
            <Text style={styles.buttonText}>Escanear otra máquina</Text>
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="barcode-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={machineId}
            onChangeText={setMachineId}
            placeholder="ID de la Máquina"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
            Escanee la máquina para detectar incidencias
          </Text>
        </View>

        {incidencia && (
          <View style={styles.incidentDetails}>
            <Text style={styles.incidentTitle}>Detalles de la Incidencia</Text>
            <Text style={styles.incidentText}>Título: {incidencia?.title}</Text>
            <Text style={styles.incidentText}>Descripción: {incidencia?.description}</Text>
            <Text style={styles.incidentText}>Estado: {incidencia?.status?.name}</Text>
            <Text style={styles.incidentText}>Company: {incidencia?.company?.name}</Text>
            <Text style={styles.incidentText}>Prioridad: {incidencia?.priority?.name}</Text>
            <Text style={styles.incidentText}>Categoría: {incidencia?.category?.name}</Text>
            <Text style={styles.incidentText}>Máquina: {incidencia?.machine?.name}</Text>
            <Text style={styles.incidentText}>Fase de Producción: {incidencia?.production_phase?.name}</Text>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginLeft: 10 },
  scannerContainer: { height: 250, marginBottom: 20, borderRadius: 10, overflow: "hidden", backgroundColor: "#EEE" },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 10, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 10, paddingHorizontal: 10, marginBottom: 20 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#333" },
  infoContainer: { marginTop: 20, backgroundColor: "#E6F2FF", padding: 15, borderRadius: 10 },
  infoText: { fontSize: 14, color: "#333" },
  incidentDetails: { marginTop: 20, padding: 15, backgroundColor: "#FFF", borderRadius: 10 },
  incidentTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  incidentText: { fontSize: 16, marginBottom: 5 },
});

export default TechnicianScanner;