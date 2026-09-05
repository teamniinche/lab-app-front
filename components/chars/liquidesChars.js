import React,{useState} from 'react';
import {useSelector} from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart,BarChart } from 'react-native-gifted-charts';
import Interval from '../../kernel/classes/graphes/datesInterval.js';
import {colorFromName} from '../../assets/functions.js';
import Colors from '../../assets/colors.js';
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

export function Chats(){
  const {startedAt,endedAt,postedAnalyses}=useSelector(state=>{
    const {startedAt,endedAt}=state.period.targetPeriod;
    const postedAnalyses=state.data.postedAnalyses;
    return {startedAt:startedAt,endedAt:endedAt,postedAnalyses:postedAnalyses};
  });
  const [coordonnees,setCoordonnees]=useState({x:0,y:0,item:null});
  const {differentProducts,prodsWeeks}=interval.prodsByWeeks(postedAnalyses,startedAt,endedAt);
  const LinesData=differentProducts.map(dp=>{
    return {name:dp,LineData:Object.entries(prodsWeeks).map(([key,val])=>{
      const vl=val.analyses.filter(p=>p.name===dp).length;
      return {
        value:vl,
        labelComponent:()=>{return <Text style={styles.labelComponent}>{key}</Text>},
        dataPointText:vl.toString(),
        key:dp,
        // textColor:clor,
        textFontSize:12,
        // spacing:4,

      }})}
  });
  const FocusedShape=()=>{
    return <Text style={{backgroundColor:'white',color:'black',borderRadius:5,width:200,height:200,padding:4,position:'absolute',bottom:coordonnees.y,left:coordonnees.x}}>test</Text>;
  }
  const chartsDataSets=LinesData.map(item=>{
    const {name,LineData}=item;
    const clr=Colors[colorFromName(name)];
    return {
      data: LineData,
      curved:true,
      curvature:0.3,
      color: clr,
      dataPointsShape: 'circular', 
      dataPointsRadius: 4,
      dataPointsColor: clr,
      textColor: '#ffffff',
     // ==========================================
  // 📉 DONNÉES & PLAGES
    // ==========================================
    // data: [
    //   { value: 20, label: 'Jan' }, 
    //   { value: 45, label: 'Fév' }, 
    //   { value: 28, label: 'Mar' }, 
    //   { value: 80, label: 'Avr' }
    // ],
    // startIndex: 0,                  // Débute le tracé au tout premier élément
    // endIndex: 3,                    // Arrête le tracé au quatrième élément

    // ==========================================
    // 🎨 STYLE DE LA LIGNE
    // ==========================================
    // color: '#2196F3',               // Ligne de couleur bleue
    // thickness: 4,                   // Épaisseur de la courbe à 4px
    // zIndex: 10,                     // Force cette ligne à passer au-dessus des autres
    // strokeDashArray:,       // Ligne pointillée : 10px visibles, 5px vides
    // lineSegments: [...]          // Optionnel : s'utilise à la place de color/thickness pour découper la ligne en morceaux colorés

    // ==========================================
    // 🗺️ TYPE DE COURBE (RENDU)
    // ==========================================
    // curved: true,                   // Active les courbes de Bézier pour lisser la ligne
    // curvature: 0.5,                 // Arrondi subtil (0 = angles droits, 1 = très arrondi)
    // curveType: 1,                   // Type mathématique de la courbe (0 ou 1)
    // stepChart: false,               // false pour rester en courbe classique (si true, écrase 'curved')

    // ==========================================
    // ⛰️ GRAPHIQUE D'AIRE (REMPLISSAGE)
    // ==========================================
    // areaChart: true,                // Active le remplissage sous la courbe
    // startFillColor: '#2196F3',      // Dégradé : Couleur de départ (haut)
    // endFillColor: '#FFFFFF',        // Dégradé : Couleur d'arrivée (bas)
    // startOpacity: 0.4,              // Opacité forte en haut
    // endOpacity: 0.0,                // Opacité totalement transparente en bas

    // ==========================================
    // 🔴 STYLE DES POINTS DE DONNÉES
    // ==========================================
    // hideDataPoints: false,          // Affiche bien les points sur la ligne
    // dataPointsColor: '#FF5722',     // Points de couleur orange
    // dataPointsRadius: 6,            // Taille des points si circulaires
    // dataPointsShape: 'circular',    // Forme ronde (peut être 'rectangular')
    // dataPointsWidth: 12,            // Largeur (utilisé si shape = 'rectangular')
    // dataPointsHeight: 12,           // Hauteur (utilisé si shape = 'rectangular')

    // ==========================================
    // 🏷️ TEXTES & FLÈCHES
    // ==========================================
    // textColor: '#333333',           // Couleur du texte affiché au-dessus des points
    // textFontSize: 12,               // Taille du texte des données
    showArrow: true,                // Ajoute une flèche directionnelle au bout du tracé
    arrowConfig: {                  // Personnalisation de la flèche terminale
      length: 12,
      width: 8,
      color: '#ffffff',
      showArrowBase: true,
    }
  }})

  return (<View style={styles.container}>
         <Text style={styles.title}>Statistiques Hebdomadaires</Text>
      
      <View style={styles.chartContainer}>
        <focusedShape/>
        <LineChart
          dataSet={chartsDataSets}
          height={300}
          width={1100}
          // focusEnabled={true}
          // onFocus={() =>alert('ok')}
          adjustToWidth={true}
          backgroundColor='grey'
          noOfSections={4}
          // focusTogether={true}
          // pointerConfig={{
          // showPointerStrip: true,
          // onPointerChange: (item, index, event) => {
          //   console.log(item);
          //   const { locationX, locationY, pageX, pageY } = event.nativeEvent;
          //   setCoordonnees({x:locationX, y:locationY,item:item});// dans le graphique
            
          //   // console.log(`Index survolé : ${index}`);
          //   // console.log(`X dans le graphique : ${locationX}px, Y dans le graphique : ${locationY}px`);
          //   // console.log(`X absolue écran : ${pageX}px, Y absolue écran : ${pageY}px`);
          // }

          pointerConfig={{
            showPointerStrip: true,
            pointerStripColor: '#fff',
            pointerStripWidth: 2,
            pointerColor: 'red',
            radius: 6,
            
            // ✅ 1. Callback pour sauvegarder l'item ou l'index dans votre state local
            // onPointerChange: (item, index) => {
            // },
            pointerComponent: (items) => {
              return (
                <View style={{
                  backgroundColor: '#000000e0',
                  padding: 8,
                  borderRadius: 6,
                  bottom: 40,
                  alignSelf: 'center',
                  minWidth: 60,
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    {items?.key}
                  </Text>
                </View>
              );
            }
        }} 
        />
    </View>
    </View>
  );
};


export default function Charts(){
  // 📊 Définition des données multi-étages
  // const stackData = [
  //   {
  //     stacks: [
  //       { value: 10, color: '#4CAF50' }, // Étage 1 (Bas) - Vert
  //       { value: 20, color: '#FF9800' }, // Étage 2 (Milieu) - Orange
  //       { value: 15, color: '#F44336' }, // Étage 3 (Haut) - Rouge
  //     ],
  //     label: 'Trim 1',
  //   },
  //   {
  //     stacks: [
  //       { value: 15, color: '#4CAF50' },
  //       { value: 12, color: '#FF9800' },
  //       { value: 30, color: '#F44336' },
  //     ],
  //     label: 'Trim 2',
  //   },
  //   {
  //     stacks: [
  //       { value: 22, color: '#4CAF50' },
  //       { value: 18, color: '#FF9800' },
  //       { value: 8, color: '#F44336' },
  //     ],
  //     label: 'Trim 3',
  //   },
  // ];

  const {startedAt,endedAt,postedAnalyses}=useSelector(state=>{
    const {startedAt,endedAt}=state.period.targetPeriod;
    const postedAnalyses=state.data.postedAnalyses;
    return {startedAt:startedAt,endedAt:endedAt,postedAnalyses:postedAnalyses};
  });
  const [coordonnees,setCoordonnees]=useState({x:0,y:0,item:null});
  const {differentProducts,prodsWeeks}=interval.prodsByWeeks(postedAnalyses,startedAt,endedAt);
  const stackData=Object.entries(prodsWeeks).map(([key,val])=>{
      return {
        label:key,
        stacks:differentProducts.map(dp=>{
          const vl=val.analyses?.filter(p=>p.name===dp)?.length;
          const prctge=val.count!==0?((vl/val.count)*100).toFixed(1).toString()+'%':'0%';
          const clor=Colors[colorFromName(dp)];
          return {
            value:vl,
            // innerBarComponent:() => (
            //   <Text style={{color: 'white', fontSize: 10, alignSelf: 'center',textWrap:'nowrap',overflow:'visible',width:'auto'}}>{dp}</Text>
            // ),
            innerBarComponent:() => (
              <View style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                height:'auto',
                padding:1,
                backgroundColor:'rgba(0,0,0,0.15)',
                width: 250,             // 💡 Donne un espace large virtuel pour éviter l'enroulement
                left: -100 + (40 / 2),  // 💡 Centre le bloc virtuel (remplacez 40 par votre barWidth)
              }}>
                <Text 
                  numberOfLines={1}     // ❌ Empêche le retour à la ligne
                  style={{
                    color: 'white', 
                    fontSize: 10, 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    letterSpacing:0.9,
                  }}
                >
                  {vl!==0?vl+' '+dp.replace('Madar','Mdr').replace('Renzo','R').replace('Noura','Nra').replace('Premium','prem').replace('Platinium','plat')+' '+prctge:''}
                </Text>
              </View>
            ),
            color:clor
          }
        })
      }
  });

// const stackData = [
//   {
//     stacks: [
//       { 
//         value: 10, 
//         color: '#4CAF50',
//         // 🎯 Affiche le texte directement dans ce bloc
//         innerBarComponent: () => (
//           <Text style={{color: 'white', fontSize: 10, alignSelf: 'center'}}>Vert</Text>
//         )
//       },
//       { 
//         value: 20, 
//         color: '#FF9800',
//         innerBarComponent: () => (
//           <Text style={{color: 'white', fontSize: 10, alignSelf: 'center'}}>Orange</Text>
//         )
//       },
//       { 
//         value: 15, 
//         color: '#F44336',
//         innerBarComponent: () => (
//           <Text style={{color: 'white', fontSize: 10, alignSelf: 'center'}}>Rouge</Text>
//         )
//       },
//     ],
//     label: 'Trim 1',
//   },
// ];



  return (
    <View style={{ padding: 20, backgroundColor: '#1A1A1A', borderRadius: 10 }}>
      <BarChart
        stackData={stackData}         // ✅ Charge la structure multi-étages
        barWidth={40}                 // Largeur de chaque colonne empilée
        spacing={50}                  // Espace entre les colonnes
        height={300}                  // Hauteur globale du graphique
        noOfSections={4}              // Nombre de lignes de grille horizontales
        
        // 🎨 Personnalisation des axes et labels
        xAxisLabelTextStyle={{ color: 'lightgray', fontSize: 12 }}
        yAxisTextStyle={{ color: 'lightgray' }}
        yAxisColor={'gray'}
        xAxisColor={'gray'}
        
        // ✨ Options esthétiques optionnelles
        barBorderRadius={4}           // Arrondit légèrement les angles des blocs
      />
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
  labelComponent:{
    width:20,
    padding:2,
    textAlign:'center',
    backgroundColor:'blue',
    height:30,
    color:'white',
    fontWeight:'bold',
    fontSize:10,
    borderRadius:'50%'

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
