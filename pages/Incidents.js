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
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dialog } from 'react-native-alert-notification';

const EnhancedIncidentForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [phase, setPhase] = useState("");
  const [image, setImage] = useState(null);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [company, setCompany] = useState("");
  const [machine, setMachines] = useState("");
  const [machineOptions, setMachineOptions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [machineModalVisible, setMachineModalVisible] = useState(false);

  // Establecer valores fijos para status y category
  const status = 1;
  const category = 3;

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
            { url: `prioritiesByCompany`, setter: setPriorityOptions, useCompanyId: true },
            { url: `productionPhasesByCompany`, setter: setPhaseOptions, useCompanyId: true },
          ];

          for (const { url, setter, useCompanyId } of endpoints) {
            const apiUrl = useCompanyId 
              ? `https://back.incidentstream.cloud/api/${url}?companyId=${companyId}`
              : `https://back.incidentstream.cloud/api/${url}`;
            const response = await axios.get(apiUrl);
            setter(response.data.map(option => ({
              label: option.name,
              value: option.id,
              key: option.id, // Asegúrate de que cada opción tenga una propiedad key única
            })));
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      if (phase && company) {
        try {
          const response = await axios.get(`https://back.incidentstream.cloud/api/phases_machine/getMachinesByPhase?phase_id=${phase}&company_id=${company}`);
          setMachineOptions(response.data.map(option => ({
            label: option.name,
            value: option.id,
            key: option.id, // Asegúrate de que cada opción tenga una propiedad key única
          })));
        } catch (error) {
          console.error("Error al obtener las máquinas:", error);
        }
      }
    };
    fetchMachines();
  }, [phase, company]);

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
        Dialog.show({
          type: 'SUCCESS',
          title: 'Éxito',
          textBody: 'Incidencia creada exitosamente',
          button: 'Cerrar',
        });
      } else {
        Dialog.show({
          type: 'DANGER',
          title: 'Error',
          textBody: `Error al crear la incidencia: ${response.data}`,
          button: 'Cerrar',
        });
      }
    } catch (error) {
      Dialog.show({
        type: 'DANGER',
        title: 'Error',
        textBody: `Error al crear la incidencia: ${error.response ? error.response.data : error.message}`,
        button: 'Cerrar',
      });
    }
  };

  const renderModalSelector = (options, selectedValue, onValueChange, placeholder, modalVisible, setModalVisible, disabled) => (
    <View>
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={selectedValue ? styles.selectorText : styles.placeholderText}>
          {options.find(option => option.value === selectedValue)?.label || placeholder}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.key.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === selectedValue && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === selectedValue && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prioridad de la incidencia</Text>
            {renderModalSelector(priorityOptions, priority, setPriority, "Seleccione prioridad", priorityModalVisible, setPriorityModalVisible, false)}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fase de la producción</Text>
            {renderModalSelector(phaseOptions, phase, setPhase, "Seleccione fase", phaseModalVisible, setPhaseModalVisible, false)}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Máquina</Text>
            {renderModalSelector(machineOptions, machine, setMachines, "Seleccione máquina", machineModalVisible, setMachineModalVisible, !phase)}
          </View>

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
  selector: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  disabledSelector: {
    backgroundColor: '#f0f0f0', // Cambiar el color de fondo si está deshabilitado
    borderColor: '#ccc', // Cambiar el color del borde si está deshabilitado
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default EnhancedIncidentForm;