import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Easing } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header"
import Footer from "../components/Footer"

const TechnicianScanner = () => {
  const [machineId, setMachineId] = useState("")
  const [status, setStatus] = useState("Pendiente")
  const [isScanning, setIsScanning] = useState(false)
  const scanLineAnim = new Animated.Value(0)

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start()
    } else {
      scanLineAnim.setValue(0)
    }
  }, [isScanning, scanLineAnim]) // Added scanLineAnim to dependencies

  const handleScan = () => {
    setIsScanning(true)
    setStatus("Escaneando...")

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setStatus("Incidencia Detectada")
    }, 3000)
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="scan-circle-outline" size={40} color="#007AFF" />
          <Text style={styles.title}>Escáner de Máquinas</Text>
        </View>

        <View style={styles.scannerContainer}>
          <View style={styles.scanner}>
            {isScanning && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanLineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 200],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}
          </View>
          <Text style={styles.statusText}>{status}</Text>
        </View>

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

        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanningButton]}
          onPress={handleScan}
          disabled={isScanning}
        >
          <Text style={styles.scanButtonText}>{isScanning ? "Escaneando..." : "Iniciar Escaneo"}</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
            Escanee la máquina para detectar incidencias
          </Text>
        </View>
      </View>
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  scannerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  scanner: {
    width: 250,
    height: 200,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#007AFF",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  scanButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  scanningButton: {
    backgroundColor: "#999",
  },
  scanButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: "#E6F2FF",
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
})

export default TechnicianScanner