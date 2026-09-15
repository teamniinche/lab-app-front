import React, { useState } from "react";
import { View } from "react-native";
import {useSelector} from 'react-redux';
import { Text, Menu, Button } from "react-native-paper";
import { BubbleChart } from 'react-native-gifted-charts';

import {relations} from '../../iterables.js';


export default PoudreCorrelations=()=>{
  const {powderAnalysed}=useSelector(state=>{
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            return {powderAnalysed};
        })
  const [relation, setRelation] = useState("GGMA");
  console.log(powderAnalysed);

  return <View style={{flexDirection:'column'}}>
        <RelationSelector value={relation} onChange={setRelation} />
        {/* <InterdependenceChart relation={relation} data={[]}/> */}
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
// console.log(analyses);
  switch (relation) {
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
       const dat = [
    { x: 10, y: 45, r: 6 },
    { x: 25, y: 85, r: 6 },
    { x: 40, y: 30, r: 6 },
    { x: 55, y: 110, r: 6 },
    { x: 70, y: 65, r: 6 },
    { x: 90, y: 140, r: 6 },
  ];

      return (
        <View> 
          <BubbleChart
            data={dat}
        
            // --- MODE SCATTER XY ---
            scatterChart={true}        // Active le traitement mathématique des axes X et Y
            showGradient={false}       // Garde une couleur unie sur vos points
            bubblesColor="#007AFF"     // Couleur de vos coordonnées
            
            // --- CONFIGURATION DE L'AJUSTEMENT (AUTO-FIT) ---
            width={800}   // Largeur utile de la grille du graphique
            parentWidth={850}  // Largeur totale de prise en compte du conteneur
            
            // --- DESIGN DES AXES & GRILLE ---
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisColor="#333"
            xAxisColor="#333"
            showGrid={true}
            gridColor="#EAEAEA"
            
            // Hauteur fixe du repère ordonné
            height={360}
          />
        </View>
      );
    };