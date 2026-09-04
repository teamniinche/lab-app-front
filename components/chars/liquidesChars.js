import React from 'react';
import {useSelector} from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart,BarChart } from 'react-native-gifted-charts';
import Interval from '../../kernel/classes/graphes/datesInterval.js';
import {colorFromName} from '../../assets/functions.js';
import Colors from '../../assets/color.js';
const interval=new Interval();

// export default function Charts() {
//   const data = [
//     { value: 40, label: 'Jan', frontColor: '#3498db' },
//     { value: 75, label: 'Fév', frontColor: '#3498db' },
//     { value: 60, label: 'Mar', frontColor: '#2ecc71' },
//     { value: 95, label: 'Avr', frontColor: '#2ecc71' },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Rapport de Performance</Text>
//       {/* <View style={styles.card}>
//         <BarChart
//           data={data}
//           barWidth={35}
//           capRadius={4}
//           noOfSections={4}
//           maxValue={100}
//           yAxisTextStyle={{ color: '#7f8c8d' }}
//           xAxisLabelTextStyle={{ color: '#7f8c8d' }}
//         />
//       </View> */}
//       <View style={styles.card}>
//         <LChart/>
//       </View>
//     </View>
//   );
// }
function Y(val,index){const y=6+index;return y}

export function Char() {
  const {startedAt,endedAt,postedAnalyses}=useSelector(state=>{
    const {startedAt,endedAt}=state.period.targetPeriod;
    const postedAnalyses=state.data.postedAnalyses;
    return {startedAt:startedAt,endedAt:endedAt,postedAnalyses:postedAnalyses};
  });
  const {differentProducts,prodsWeeks}=interval.prodsByWeeks(postedAnalyses,startedAt,endedAt);

  const data = Object.entries(prodsByWeeks).map(([key,val],index)=>{return { value: Y(val.count,index), label: key }});
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques Hebdomadaires</Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          height={300}
          width={1000}
          thickness={1}
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

export default function Charts(){
  const {startedAt,endedAt,postedAnalyses}=useSelector(state=>{
    const {startedAt,endedAt}=state.period.targetPeriod;
    const postedAnalyses=state.data.postedAnalyses;
    return {startedAt:startedAt,endedAt:endedAt,postedAnalyses:postedAnalyses};
  });
  const {differentProducts,prodsWeeks}=interval.prodsByWeeks(postedAnalyses,startedAt,endedAt);
  const LinesData=differentProducts.map((dp,index)=>{
    return {name:dp,LineData:Object.entries(prodsWeeks).map(([key,val])=>{return {value:Y(val.analyses.filter(p=>p.name===dp).length,index)}})}
  });

  const chartsDataSets=LinesData.map(item=>{
    const {name,LineData}=item;
    const clr=Colors[colorFromName(name)];
    return {
      data: LineData,
      color: clr,
      dataPointsColor: clr,
      textColor: 'blue',
    }
  })

  return (<View style={styles.container}>
         <Text style={styles.title}>Statistiques Hebdomadaires</Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          dataSet={chartsDataSets}
          height={250}
          noOfSections={4}
          focusTogether={true} 
        />
    </View>
    </View>
  );
};


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
    width:'auto',
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
