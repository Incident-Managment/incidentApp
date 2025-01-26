import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import ModalSelector from "../components/ModalSelector"

const EnhancedIncidentForm = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [category, setCategory] = useState("")
  const [phase, setPhase] = useState("")
  const [image, setImage] = useState(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log({ title, description, status, priority, category, phase, image })
  }

  const statusOptions = [
    { label: "Abierto", value: "abierto" },
    { label: "En progreso", value: "en_progreso" },
    { label: "Cerrado", value: "cerrado" },
  ]

  const priorityOptions = [
    { label: "Alta", value: "alta" },
    { label: "Media", value: "media" },
    { label: "Baja", value: "baja" },
  ]

  const categoryOptions = [
    { label: "Software", value: "software" },
    { label: "Hardware", value: "hardware" },
    { label: "Red", value: "red" },
  ]

  const phaseOptions = [
    { label: "Desarrollo", value: "desarrollo" },
    { label: "Pruebas", value: "pruebas" },
    { label: "Producción", value: "producción" },
  ]

  const machineOptions = [
    { label: "Máquina 1", value: "maquina_1" },
    { label: "Máquina 2", value: "maquina_2" },
    { label: "Máquina 3", value: "maquina_3" },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Crear Nueva Incidencia</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título de la incidencia</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ingrese el título"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción de la incidencia</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ingrese la descripción"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status de la incidencia</Text>
            <ModalSelector
              options={statusOptions}
              selectedValue={status}
              onValueChange={setStatus}
              placeholder="Seleccione un status"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prioridad de la incidencia</Text>
            <ModalSelector
              options={priorityOptions}
              selectedValue={priority}
              onValueChange={setPriority}
              placeholder="Seleccione una prioridad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría de la incidencia</Text>
            <ModalSelector
              options={categoryOptions}
              selectedValue={category}
              onValueChange={setCategory}
              placeholder="Seleccione una categoría"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Máquina</Text>
            <ModalSelector
                options={machineOptions}
                selectedValue={category}
                onValueChange={setCategory}
                placeholder="Seleccione una máquina"
            />
            </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fase de la producción</Text>
            <ModalSelector
              options={phaseOptions}
              selectedValue={phase}
              onValueChange={setPhase}
              placeholder="Seleccione una fase"
            />
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#f5efe7",
    },
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      color: "#3d3d3d",
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: "#3d3d3d",
      fontWeight: "600",
    },
    input: {
      height: 50,
      borderColor: "#D8C4B6",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: "#fffaec",
      color: "#3d3d3d",
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
      paddingTop: 12,
    },
    imagePicker: {
      backgroundColor: "#578e7e",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    imagePickerText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginTop: 12,
    },
    submitButton: {
      backgroundColor: "#578e7e",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default EnhancedIncidentForm

