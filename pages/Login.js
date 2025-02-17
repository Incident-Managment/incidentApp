import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image,Dimensions} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import { login } from '../services/users.services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

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

const { width } = Dimensions.get("window")

export default function Login({ navigation }) {
  const [showPassword, setShowPassword] = React.useState(false); // Para alternar la visibilidad de la contraseña
  const [isLogin, setIsLogin] = useState(true)

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await login(values.email, values.password);
      if (response) {
        // Guardar los datos del usuario en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response));
        console.log('Datos del usuario guardados:', response);

        // Navegar a Home usando replace
        navigation.replace('Home');
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View 
          entering={FadeInUp.duration(1000).springify()}
          style={styles.illustrationContainer}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/techsolutions.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        

        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          style={styles.formContainer}
        >
          <Text style={styles.title}>{isLogin ? "Login Now" : "Sign Up"}</Text>
          <Text style={styles.subtitle}>
            {isLogin 
              ? "Please login to continue using our app."
              : "Please Register with email and sign up to continue using our app."
            }
          </Text>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <View style={[styles.inputContainer, touched.email && errors.email && styles.inputError]}>
                  <TextInput
                    placeholder="jhon.doe@gmail.com"
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <View style={[styles.inputContainer, touched.password && errors.password && styles.inputError]}>
                  <TextInput
                    placeholder="Password"
                    style={styles.input}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <FontAwesome
                      name={showPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {!isLogin && (
                  <TouchableOpacity 
                    style={styles.termsContainer}
                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                  >
                    <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                      {agreeToTerms && <FontAwesome name="check" size={12} color="#4e54c8" />}
                    </View>
                    <Text style={styles.termsText}>I agree with privacy policy</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting || (!isLogin && !agreeToTerms)}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting 
                      ? "Processing..." 
                      : isLogin ? "Login" : "Sign up"
                    }
                  </Text>
                </TouchableOpacity>

                {isLogin && (
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </Text>
                  <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={styles.toggleButton}>
                      {isLogin ? "Sign up" : "Login"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 10,
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.5,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: -8,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4e54c8",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#f8f9fa",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#4e54c8",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#e9ecef",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    color: "#4e54c8",
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  toggleText: {
    color: "#666",
    fontSize: 14,
  },
  toggleButton: {
    color: "#4e54c8",
    fontSize: 14,
    fontWeight: "600",
  },
})