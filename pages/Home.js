import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../components/Header";
import Footer from "../components/Footer";

const screenWidth = Dimensions.get("window").width;

const Home = () => {
  const [companyId, setCompanyId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [incidents, setIncidents] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          const companyId = parsedUser.user.company.id || "Compañía no disponible";
          const roleId = parsedUser.user.role.id;
          setCompanyId(companyId);
          setRoleId(roleId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchData = async () => {
      if (companyId && roleId !== 4) {
        try {
          const incidentsResponse = await axios.get(`https://back.incidentstream.cloud/api/incidents/countIncidentsByCompany?companyId=${companyId}`);
          setIncidents(incidentsResponse.data.count);

          const resolvedResponse = await axios.get(`https://back.incidentstream.cloud/api/incidents/countIncidentsResolvedByCompany?companyId=${companyId}`);
          setResolved(resolvedResponse.data.count);

          const averageTimeResponse = await axios.get(`https://back.incidentstream.cloud/api/incidents/averageResolutionTimeByCompany?companyId=${companyId}`);
          setAverageTime(averageTimeResponse.data.averageResolutionTime);

          const efficiencyResponse = await axios.get(`https://back.incidentstream.cloud/api/incidents/incidentEfficiencyByCompany?companyId=${companyId}`);
          setEfficiency(efficiencyResponse.data.productionEfficiency);

          const monthlyIncidentsResponse = await axios.get(`https://back.incidentstream.cloud/api/incidents/incidentsByStatusMonthly?companyId=${companyId}`);
          const incidentsData2025 = monthlyIncidentsResponse.data.incidentsData["2025"];
          const formattedData = Object.keys(incidentsData2025).map(month => {
            const monthly = incidentsData2025[month].monthly;
            return {
              month,
              ...monthly
            };
          });
          setMonthlyData(formattedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchUserData();
    fetchData();
  }, [companyId]);

  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        data: monthlyData.map(item => item["En Progreso"] || 0),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: monthlyData.map(item => item["En Espera"] || 0),
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: monthlyData.map(item => item["Resuelto"] || 0),
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: monthlyData.map(item => item["Cancelado"] || 0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["En Progreso", "En Espera", "Resuelto", "Cancelado"],
  };

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  if (roleId === 4) {
      return (
        <View style={styles.container}>
          <Header />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>👨‍🔧 Bienvenido Técnico ⚒️</Text>
            <Text style={styles.welcomeText}>
              Esta aplicación te permite escanear máquinas, gestionar incidencias y actualizar su estado. 
              Usa el escáner para identificar máquinas y resolver problemas rápidamente.
            </Text>
          </View>
          <Footer />
        </View>
      );
    }
  
  return (
    <View style={styles.container}>
      <Header />

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Analytics Section */}
        <View style={styles.analyticsContainer}>
          <View style={styles.analyticsCard}>
            <FontAwesome name="building" size={24} color="#4CAF50" />
            <Text style={styles.analyticsLabel}>Incidencias</Text>
            <Text style={styles.analyticsValue}>{incidents}</Text>
          </View>
          <View style={styles.analyticsCard}>
            <FontAwesome name="cogs" size={24} color="#FF9800" />
            <Text style={styles.analyticsLabel}>Resueltas</Text>
            <Text style={styles.analyticsValue}>{resolved}</Text>
          </View>
          <View style={styles.analyticsCard}>
            <FontAwesome name="users" size={24} color="#2196F3" />
            <Text style={styles.analyticsLabel}>Tiempo Promedio</Text>
            <Text style={styles.analyticsValue}>{averageTime.toFixed(2)} h</Text>
          </View>
          <View style={styles.analyticsCard}>
            <FontAwesome name="user" size={24} color="#9C27B0" />
            <Text style={styles.analyticsLabel}>Eficiencia</Text>
            <Text style={styles.analyticsValue}>{efficiency.toFixed(2)}%</Text>
          </View>
        </View>

        {/* Bar Chart Section */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Incident Priorities</Text>
          <BarChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flex: 1,
  },
  analyticsContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  analyticsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "48%",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  analyticsLabel: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  graphContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  welcomeContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f9f9f9", // Fondo suave para mejor contraste
    },
    welcomeTitle: {
      fontSize: 28, // Tamaño más grande para destacar
      fontWeight: "bold",
      color: "#222", // Color más oscuro para mejor legibilidad
      marginBottom: 20, // Espaciado más amplio
      textAlign: "center", // Centrado para mejor alineación
    },
    welcomeText: {
      fontSize: 18, // Tamaño ligeramente más grande
      color: "#444", // Color más accesible
      textAlign: "center",
      lineHeight: 26, // Mejor separación entre líneas
      paddingHorizontal: 10, // Espaciado interno para evitar bordes
    },
    welcomeCard: {
      width: "90%", // Tarjeta que contiene el texto
      padding: 20,
      backgroundColor: "#fff", // Fondo blanco para contraste
      borderRadius: 12, // Bordes redondeados
      shadowColor: "#000", // Sombra para profundidad
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3, // Sombra para Android
    },
});

export default Home;