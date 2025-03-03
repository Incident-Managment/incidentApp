import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import { CameraView, Camera } from "expo-camera";
import Footer from "../components/Footer";
import { Dialog } from 'react-native-alert-notification';

const TechnicianScanner = () => {
  const [machineId, setMachineId] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [incidencia, setIncidencia] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const route = useRoute();
  const incidentId = route?.params?.incidentId;
  const [allowQR, setAllowQR] = useState(true);
  const allowQRRef = useRef(allowQR);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

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

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;  // Evita escanear más de una vez.

    setScanned(true);
    setCameraActive(false); // Desactivar la cámara después de escanear
    setMachineId(data);
    setStatus("Máquina escaneada");

    try {
      const scannedMachineId = parseInt(data, 10);
      if (isNaN(scannedMachineId)) {
        console.error("El ID de la máquina escaneada no es válido:", data);
        Dialog.show({
          type: 'DANGER',
          title: 'Error',
          textBody: 'El ID de la máquina escaneada no es válido.',
          button: 'Cerrar'
        });
        return;
      }

      const requestBody = { incident_id: incidentId, scanned_machine_id: scannedMachineId };

      const response = await fetch("https://back.incidentstream.cloud/api/incidents/updateIncidentByScan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Incidencia actualizada correctamente:", requestBody);
        Dialog.show({
          type: 'SUCCESS',
          title: 'Éxito',
          textBody: 'La incidencia ha sido actualizada correctamente.',
          button: 'Cerrar'
        });
      } else {
        Dialog.show({
          type: 'DANGER',
          title: 'Error',
          textBody: 'Hubo un problema al actualizar la incidencia.',
          button: 'Cerrar'
        });
      }
    } catch (error) {
      console.error("Error al actualizar la incidencia:", error);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setCameraActive(true); // Reactivar la cámara
    setMachineId("");
    setStatus("Pendiente");
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Solicitando permiso para usar la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha concedido permiso para usar la cámara.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="scan-circle-outline" size={40} color="#007AFF" />
          <Text style={styles.title}>Escáner de Máquinas</Text>
        </View>

        <View style={styles.scannerContainer}>
          {cameraActive && (
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Solo escanear si no ha sido escaneado antes
              barcodeScannerSettings={{
                barcodeTypes: allowQRRef.current ? ["qr"] : ["code128", "ean13", "ean8", "upc_a", "upc_e"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </View>

        {scanned && (
          <TouchableOpacity style={styles.button} onPress={resetScanner}>
            <Text style={styles.buttonText}>Escanear otra vez</Text>
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
