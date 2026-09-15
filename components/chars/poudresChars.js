import React, { useState } from "react";
import { View } from "react-native";
import {useSelector} from 'react-redux';
import { Text, Menu, Button } from "react-native-paper";
import { ScatterChart } from 'react-native-gifted-charts';

import {relations} from '../../iterables.js';


export default PoudreCorrelations=()=>{
  const {powderAnalysed}=useSelector(state=>{
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            return {powderAnalysed};
        })
  const [relation, setRelation] = useState("GGMA");

  return <View style={{flexDirection:'column'}}>
        <RelationSelector value={relation} onChange={setRelation} />
        <InterdependenceChart relation={relation} data={powderAnalysed}/>
    </View>
};

export const RelationSelector = ({ value, onChange }) => {

  const [visible, setVisible] = useState(false);
  const selected = relations.find(
    item => item?.value === value
  );

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
          >
            {selected?.label || "Choisir une relation"}
          </Button>
        }
      >
        {/* Liste des relations */}
        {relations.map(item => (
          <Menu.Item
            key={item?.value}
            title={item?.label}
            onPress={() => {
              onChange(item?.value);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
};

export const getChartData = (relation, analyses) => {
console.log(analyses);
  switch (relation) {

    // Gros grains suivant matière active

    case "GGMA":

      return {

        xLabel: "Matière active",

        yLabel: "Gros grains",

        points: analyses.map(item => ({

          x: Number(item?.matiereActive) || 0,

          y: Number(item?.grosGrains) || 0,

        }))

      };

    // Humidité suivant matière active

    case "HMA":

      return {

        xLabel: "Matière active",

        yLabel: "Humidité",

        points: analyses.map(item => ({

          x: Number(item?.matiereActive) || 0,

          y: Number(item?.humidite) || 0,

        }))

      };

    // Alcalinité suivant matière active

    case "AlcaMA":

      return {

        xLabel: "Matière active",

        yLabel: "Alcalinité",

        points: analyses.map(item => ({

          x: Number(item?.matiereActive) || 0,

          y: Number(item?.alcalinite) || 0,

        }))

      };

    // Alcalinité suivant gros grains

    case "AlcaGG":

      return {

        xLabel: "Gros grains",

        yLabel: "Alcalinité",

        points: analyses.map(item => ({

          x: Number(item?.grosGrains) || 0,

          y: Number(item?.alcalinite) || 0,

        }))

      };

    // Alcalinité suivant humidité

    case "AlcaH":

      return {

        xLabel: "Humidité",

        yLabel: "Alcalinité",

        points: analyses.map(item => ({

          x: Number(item?.humidite) || 0,

          y: Number(item?.alcalinite) || 0,

        }))

      };

    // Gros grains suivant humidité

    case "GGH":

      return {

        xLabel: "Humidité",

        yLabel: "Gros grains",

        points: analyses.map(item => ({

          x: Number(item?.humidite) || 0,

          y: Number(item?.grosGrains) || 0,

        }))

      };

    // Gros grains suivant densité

    case "GGD":

      return {

        xLabel: "Densité",

        yLabel: "Gros grains",

        points: analyses.map(item => ({

          x: Number(item?.densite) || 0,

          y: Number(item?.grosGrains) || 0,

        }))

      };

    // Densité suivant matière active

    case "DMA":

      return {

        xLabel: "Matière active",

        yLabel: "Densité",

        points: analyses.map(item => ({

          x: Number(item?.matiereActive) || 0,

          y: Number(item?.densite) || 0,

        }))

      };

    // Densité suivant humidité

    case "DH":

      return {

        xLabel: "Humidité",

        yLabel: "Densité",

        points: analyses.map(item => ({

          x: Number(item?.humidite) || 0,

          y: Number(item?.densite) || 0,

        }))

      };

    // Alcalinité suivant densité

    case "AlcaD":

      return {

        xLabel: "Densité",

        yLabel: "Alcalinité",

        points: analyses.map(item => ({

          x: Number(item?.densite) || 0,

          y: Number(item?.alcalinite) || 0,

        }))

      };

    default:

      return {

        xLabel: "",

        yLabel: "",

        points: []

      };

  }

};

export const InterdependenceChart = ({relation,data}) => {

      const chartData = getChartData(relation, data);

      return (
        <View> 
          <ScatterChart
            // data={{
            //   datasets: [{data: chartData.points}]
            // }}
            data={chartData.points}
            width={800}
            height={350}
            // chartConfig={{
            //   backgroundGradientFrom: "#fff",
            //   backgroundGradientTo: "#fff",
            //   decimalPlaces: 2,
            //   color: () => "#1976D2",
            //   labelColor: () => "#333",
            //   propsForDots: {
            //     r: "4",
            //   },
            // }}
            // accessor="y"
            // bezier={false}
          />
        </View>
      );
    };