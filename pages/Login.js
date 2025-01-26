import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import { login } from '../services/users.services';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Esquema de validación
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido')
    .label('Email'),
  password: Yup.string()
    .min(3, 'La contraseña debe contener al menos 3 caracteres')
    .required('La contraseña es requerida')
    .label('Password'),
});

export default function Login({ navigation }) {
  const [showPassword, setShowPassword] = React.useState(false); // Para alternar la visibilidad de la contraseña

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await login(values.email, values.password);
      if (response) {
        // Guardar los datos del usuario en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response));
        console.log('Datos del usuario guardados:', response);

        navigation.navigate('Home');
      }
    } catch (err) {
      setErrors({ general: 'Verifica tus credenciales.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>BIENVENIDO</Text>
        <Text style={styles.title}>INICIA SESIÓN</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <TextInput
                placeholder="Correo electrónico. Ej: alguien@gmail.com"
                placeholderTextColor="#D8C4B6"
                style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <View style={[styles.passwordContainer, touched.password && errors.password ? styles.inputError : null]}>
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#D8C4B6"
                  style={styles.inputPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={20}
                    color="#3d3d3d"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              {errors.general && (
                <Text style={styles.error}>{errors.general}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>{isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5efe7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3d3d3d',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#D8C4B6',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fffaec',
    color: '#3d3d3d',
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D8C4B6',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fffaec',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#3d3d3d',
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    height: 50,
    backgroundColor: '#578e7e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#D8C4B6',
  },
  buttonText: {
    color: '#f5ecd5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});