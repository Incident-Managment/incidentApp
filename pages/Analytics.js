import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const Analytics = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');
    const [phase, setPhase] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Formulario de Creación de Incidencias</Text>
            
            <Text style={styles.label}>Título de la incidencia</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ingrese el título"
            />

            <Text style={styles.label}>Descripción de la incidencia</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Ingrese la descripción"
                multiline
            />

            <Text style={styles.label}>Status de la incidencia</Text>
            <Picker
                selectedValue={status}
                style={styles.picker}
                onValueChange={(itemValue) => setStatus(itemValue)}
            >
                <Picker.Item label="Seleccione un status" value="" />
                <Picker.Item label="Abierto" value="abierto" />
                <Picker.Item label="En progreso" value="en_progreso" />
                <Picker.Item label="Cerrado" value="cerrado" />
            </Picker>

            <Text style={styles.label}>Prioridad de la incidencia</Text>
            <Picker
                selectedValue={priority}
                style={styles.picker}
                onValueChange={(itemValue) => setPriority(itemValue)}
            >
                <Picker.Item label="Seleccione una prioridad" value="" />
                <Picker.Item label="Alta" value="alta" />
                <Picker.Item label="Media" value="media" />
                <Picker.Item label="Baja" value="baja" />
            </Picker>

            <Text style={styles.label}>Categoría de la incidencia</Text>
            <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                <Picker.Item label="Seleccione una categoría" value="" />
                <Picker.Item label="Software" value="software" />
                <Picker.Item label="Hardware" value="hardware" />
                <Picker.Item label="Red" value="red" />
            </Picker>

            <Text style={styles.label}>Fase de la producción</Text>
            <Picker
                selectedValue={phase}
                style={styles.picker}
                onValueChange={(itemValue) => setPhase(itemValue)}
            >
                <Picker.Item label="Seleccione una fase" value="" />
                <Picker.Item label="Desarrollo" value="desarrollo" />
                <Picker.Item label="Pruebas" value="pruebas" />
                <Picker.Item label="Producción" value="producción" />
            </Picker>

            <Text style={styles.label}>Imagen</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Button title="Enviar" onPress={() => { /* handle submit */ }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    imagePicker: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePickerText: {
        color: '#333',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
});

export default Analytics;