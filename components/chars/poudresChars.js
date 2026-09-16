import { useState,useLayoutEffect} from "react";
import { View,ScrollView, } from "react-native";
import {useSelector} from 'react-redux';
import { Text, Menu, Button } from "react-native-paper";
import { BubbleChart } from 'react-native-gifted-charts';
import { FontAwesome5 } from '@expo/vector-icons';
import {Texts,Titre} from './liquidesChars.js';
import {relations} from '../../iterables.js';
const LateralNav=(props)=>{
  const {relation, setRelation} = props;
return <View style={{width:200,minHeigth:500,paddingHorizontal:10,paddingVertical:20,paddingTop:5,marginRight:15,borderRadius:5,borderWidth:1,borderBottomWidth:0,borderColor:'grey',backgroundColor:'whitesmoke'}}>
        <View style={{backgroundColor:'rgba(0,0,0,0.07)',borderRadius:4,paddingVertical:20,marginBottom:20,borderWidth:1,brderColor:'rgba(0,0,0,0.05)'}}>
          <Texts focusedDep={null} text="Corrélations-Selectionnes une corrélation"/>
        </View>
        <RelationSelector value={relation} onChange={(r)=>setRelation(r)} />
        
      </View>
  }

  export default PoudresCharts=({navigation})=>{
    const [relation, setRelation] = useState("GGMA");
    const {startedAt,endedAt,powderAnalysed}=useSelector(state=>{
      const {startedAt,endedAt}=state.period.targetPeriod;
      const powderAnalysed=state.powderAnalysed.powderAnalysed;
      return {startedAt:startedAt,endedAt:endedAt,powderAnalysed:powderAnalysed};
    });
    const {xLabel,yLabel}=getChartData(relation,powderAnalysed);
    useLayoutEffect(()=>{
                navigation.setOptions({
                    headerLeft:()=>(
                        <TouchableOpacity style={{width:40,margin:0,marginLeft:30,backgroundColor:'transparent',}} onPress={() => navigation.navigate('Accueil')}>
                            <FontAwesome5 name='arrow-left' size={20} color='white'/>
                        </TouchableOpacity>
                    )
                });
        },[]);
  return  (<ScrollView 
                horizontal={true}  
                style={{ 
                        minWidth:1050,
                        width:'100%',
                        height:'auto',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'flex-start',
                        padding: 5
                }}
          >
            <LateralNav relation={relation} setRelation={(r)=>setRelation(r)}/>
            <View 
              style={{ 
                  backgroundColor: '#1A1A1A', 
                  borderRadius: 10,
                  width:900,
                  padding:15 
                }}
            >
        <Titre params={{dateStart:startedAt,dateEnd:endedAt,total:powderAnalysed?.length,literal:xLabel+'( '+yLabel+' )'}}/>
        <InterdependenceChart relation={relation} data={powderAnalysed}/>
       
            </View>
    </ScrollView>
  )
};

// export default PoudreCorrelations=()=>{
//   const {powderAnalysed}=useSelector(state=>{
//             const powderAnalysed=state.powderAnalysed.powderAnalysed;
//             return {powderAnalysed};
//         })
//   const [relation, setRelation] = useState("GGMA");
//   // alert(JSON.stringify(powderAnalysed));

//   return <View style={{flexDirection:'column'}}>
//         <RelationSelector value={relation} onChange={setRelation} />
//         <InterdependenceChart relation={relation} data={powderAnalysed}/>
//     </View>
// };

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

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
          r: 8 ,
          label:"0"

        }))

      };

    default:

      return {

        xLabel: "",

        yLabel: "",

        points: [],
        r: 8 ,
      label:"0"

      };

  }

};

export const InterdependenceChart = ({relation,data}) => {

      const chartData = getChartData(relation, data);

      return (
        <View> 
          <BubbleChart
            data={chartData.points}
        
            // --- MODE SCATTER XY ---
            scatterChart={true}        // Active le traitement mathématique des axes X et Y
            showGradient={true}       // Garde une couleur unie sur vos points
            centerColorForGradient="#007AFF"
            bubblesColor="#ffffff" //"#007AFF"     // Couleur de vos coordonnées
            
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