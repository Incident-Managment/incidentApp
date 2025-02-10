import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ModalSelector from "../components/ModalSelector";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EnhancedIncidentForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [phase, setPhase] = useState("");
  const [image, setImage] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [company, setCompany] = useState("");
  const [machine, setMachines] = useState("");
  const [machineOptions, setMachineOptions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          const companyId = parsedUser.user.company.id || "Compañía no disponible";
          setCompany(companyId);
          setUserId(parsedUser.user.id);

          const endpoints = [
            { url: `statuses`, setter: setStatusOptions }, // Cambiado a `statuses`
            { url: `prioritiesByCompany`, setter: setPriorityOptions },
            { url: `categoriesByCompany`, setter: setCategoryOptions },
            { url: `productionPhasesByCompany`, setter: setPhaseOptions },
            { url: `machines/getMachinesByCompany`, setter: setMachineOptions },
          ];

          for (const { url, setter } of endpoints) {
            const response = await axios.get(
              `https://back.incidentstream.cloud/api/${url}?companyId=${companyId}`
            );
            setter(response.data.map(option => ({
              label: option.name,
              value: option.id,
              key: option.id,
            })));
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };
    fetchOptions();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      status_id: status,
      priority_id: priority,
      category_id: category,
      production_phase_id: phase,
      machine_id: machine,
      company_id: company,
      user_id: userId,
      creation_date: new Date().toISOString(),
      update_date: new Date().toISOString(),
      image_cloudinary: image ? { url: image } : null,
    };

    try {
      const response = await axios.post("https://back.incidentstream.cloud/api/incidents/create", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("Incidencia creada exitosamente");
      } else {
        console.error("Error al crear la incidencia:", response.data);
      }
    } catch (error) {
      console.error("Error al crear la incidencia:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Crear Nueva Incidencia</Text>

          {[{ label: "Título de la incidencia", value: title, setter: setTitle },
            { label: "Descripción de la incidencia", value: description, setter: setDescription, multiline: true }]
            .map(({ label, value, setter, multiline }, index) => (
              <View style={styles.inputGroup} key={index}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={[styles.input, multiline && styles.textArea]}
                  value={value}
                  onChangeText={setter}
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  placeholderTextColor="#999"
                  multiline={multiline}
                />
              </View>
          ))}

          {[{ label: "Status de la incidencia", value: status, setter: setStatus, options: statusOptions },
            { label: "Prioridad de la incidencia", value: priority, setter: setPriority, options: priorityOptions },
            { label: "Categoría de la incidencia", value: category, setter: setCategory, options: categoryOptions },
            { label: "Fase de la producción", value: phase, setter: setPhase, options: phaseOptions },
            { label: "Máquina", value: machine, setter: setMachines, options: machineOptions }]
            .map(({ label, value, setter, options }, index) => (
              <View style={styles.inputGroup} key={index}>
                <Text style={styles.label}>{label}</Text>
                <ModalSelector options={options} selectedValue={value} onValueChange={setter} placeholder={`Seleccione ${label.toLowerCase()}`} />
              </View>
          ))}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Imagen</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>{image ? "Cambiar Imagen" : "Seleccionar Imagen"}</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5efe7" },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, color: "#3d3d3d", textAlign: "center" },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: "#3d3d3d", fontWeight: "600" },
  input: { height: 50, borderColor: "#D8C4B6", borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16, backgroundColor: "#fffaec", color: "#3d3d3d" },
  textArea: { height: 100, textAlignVertical: "top", paddingTop: 12 },
  imagePicker: { backgroundColor: "#578e7e", padding: 12, borderRadius: 8, alignItems: "center" },
  imagePickerText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  image: { width: "100%", height: 200, borderRadius: 8, marginTop: 12 },
  submitButton: { backgroundColor: "#578e7e", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 20 },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default EnhancedIncidentForm;