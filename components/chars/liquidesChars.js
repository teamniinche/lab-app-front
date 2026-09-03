import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart,BarChart } from 'react-native-gifted-charts';

export default function Charts() {
  const data = [
    { value: 40, label: 'Jan', frontColor: '#3498db' },
    { value: 75, label: 'Fév', frontColor: '#3498db' },
    { value: 60, label: 'Mar', frontColor: '#2ecc71' },
    { value: 95, label: 'Avr', frontColor: '#2ecc71' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rapport de Performance</Text>
      <View style={styles.card}>
        <BarChart
          data={data}
          barWidth={35}
          capRadius={4}
          noOfSections={4}
          maxValue={100}
          yAxisTextStyle={{ color: '#7f8c8d' }}
          xAxisLabelTextStyle={{ color: '#7f8c8d' }}
        />
      </View>
      <View style={styles.card}>
        <LChart/>
      </View>
    </View>
  );
}


export  function LChart() {
  // Données du graphique
  const data = [
    { value: 15, label: 'Lun' },
    { value: 30, label: 'Mar' },
    { value: 26, label: 'Mer' },
    { value: 40, label: 'Jeu' },
    { value: 55, label: 'Ven' },
    { value: 45, label: 'Sam' },
    { value: 70, label: 'Dim' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques Hebdomadaires</Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          height={220}
          width={300}
          thickness={3}
          color="#3498db"
          noOfSections={4}
          areaChart // Remplit la zone sous la ligne
          startFillColor="rgba(52, 152, 219, 0.4)"
          endFillColor="rgba(52, 152, 219, 0.0)"
          dataPointsColor="#2c3e50"
          dataPointsRadius={4}
          textColor="#7f8c8d"
          xAxisColor="#bdc3c7"
          yAxisColor="#bdc3c7"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Ombre sur Android
  },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 }

});
