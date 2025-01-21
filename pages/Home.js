import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";

const screenWidth = Dimensions.get("window").width;

const Home = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Rainy Days"],
  };

  const pieData = [
    {
      name: "Alta",
      population: 10,
      color: "rgba(255, 0, 0, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Media",
      population: 20,
      color: "rgba(255, 165, 0, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Baja",
      population: 30,
      color: "rgba(0, 255, 0, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

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

  return (
    <View style={styles.container}>
      <Header />

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Analytics Section */}
        <View style={styles.analyticsContainer}>
          <View style={styles.analyticsCard}>
            <FontAwesome name="building" size={24} color="#4CAF50" />
            <Text style={styles.analyticsLabel}>Companies</Text>
            <Text style={styles.analyticsValue}>5</Text>
          </View>
          <View style={styles.analyticsCard}>
            <FontAwesome name="cogs" size={24} color="#FF9800" />
            <Text style={styles.analyticsLabel}>Machine Types</Text>
            <Text style={styles.analyticsValue}>3</Text>
          </View>
          <View style={styles.analyticsCard}>
            <FontAwesome name="users" size={24} color="#2196F3" />
            <Text style={styles.analyticsLabel}>User Roles</Text>
            <Text style={styles.analyticsValue}>5</Text>
          </View>
          <View style={styles.analyticsCard}>
            <FontAwesome name="user" size={24} color="#9C27B0" />
            <Text style={styles.analyticsLabel}>Users</Text>
            <Text style={styles.analyticsValue}>5</Text>
          </View>
        </View>


        {/* Line Chart Section */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Monthly Incidents</Text>
          <LineChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        
        {/* Graph Section */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Incident Statuses</Text>
          <Text style={styles.graphSubtitle}>Status Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            style={styles.chart}
          />
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

        {/* Progress Bar Section */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Project Progress</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressText}>75% Complete</Text>
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
  graphSubtitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '75%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Home;