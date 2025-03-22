import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import ModalSelector from "../components/ModalSelector";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dialog } from 'react-native-alert-notification';

const EnhancedIncidentForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status] = useState(1); 
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [phase, setPhase] = useState("");
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
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
            { url: `prioritiesByCompany`, setter: setPriorityOptions },
            { url: `productionPhasesByCompany`, setter: setPhaseOptions },
            { url: `machines/getMachinesByCompany`, setter: setMachineOptions },
            { url: `categoriesByCompany`, setter: setCategoryOptions },
          ];

          for (const { url, setter } of endpoints) {
            const apiUrl = `https://back.incidentstream.cloud/api/${url}?companyId=${companyId}`;
            const response = await axios.get(apiUrl);
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

  const handleSubmit = async () => {
    if (!title || !description || !priority || !category || !phase || !machine) {
      Dialog.show({
        type: 'WARNING',
        title: 'Campos requeridos',
        textBody: 'Por favor, complete todos los campos.',
        button: 'Cerrar',
      });
      return;
    }

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
    };

    try {
      const response = await axios.post("https://back.incidentstream.cloud/api/incidents/create", data);
      if (response.status === 200) {
        Dialog.show({
          type: 'SUCCESS',
          title: 'Éxito',
          textBody: 'Incidencia creada exitosamente',
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

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Crear Nueva Incidencia</Text>

          {[{ label: "Título", value: title, setter: setTitle },
            { label: "Descripción", value: description, setter: setDescription, multiline: true }]
            .map(({ label, value, setter, multiline }, index) => (
              <View style={styles.inputGroup} key={index}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={[styles.input, multiline && styles.textArea]}
                  value={value}
                  onChangeText={setter}
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  placeholderTextColor="#6b7280"
                  multiline={multiline}
                />
              </View>
          ))}

          {[{ label: "Prioridad", value: priority, setter: setPriority, options: priorityOptions },
            { label: "Fase", value: phase, setter: setPhase, options: phaseOptions },
            { label: "Categoría", value: category, setter: setCategory, options: categoryOptions },
            { label: "Máquina", value: machine, setter: setMachines, options: machineOptions }]
            .map(({ label, value, setter, options }, index) => (
              <View style={styles.inputGroup} key={index}>
                <Text style={styles.label}>{label}</Text>
                <ModalSelector options={options} selectedValue={value} onValueChange={setter} placeholder={`Seleccione ${label.toLowerCase()}`} />
              </View>
          ))}

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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 30, fontWeight: "700", color: "#1F2937", textAlign: "center", marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", color: "#374151" },
  input: { height: 50, borderColor: "#CBD5E1", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 16, backgroundColor: "#ffffff" },
  textArea: { height: 120, textAlignVertical: "top" },
  submitButton: { backgroundColor: "#2563EB", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  submitButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "600" },
});

export default EnhancedIncidentForm;