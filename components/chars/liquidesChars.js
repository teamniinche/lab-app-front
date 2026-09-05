import React,{useState} from 'react';
import {useSelector} from 'react-redux';
import { StyleSheet,Pressable, View, Text,ScrollView } from 'react-native';
import { LineChart,BarChart } from 'react-native-gifted-charts';
import Filters from '../../kernel/classes/formatTablesAnalyses.js';
import Interval from '../../kernel/classes/graphes/datesInterval.js';
import {colorFromName} from '../../assets/functions.js';
import Colors from '../../assets/colors.js';
import {primaryColor} from '../../assets/constantes.js';
const interval=new Interval();
const filter=new Filters();
function Y(val,index){const y=6+index;return y}
const BarComponent=({params})=>{
  const {len,head,dp,vl,prctge}=params;
  return <View style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                height:'auto',
                padding:1,
                backgroundColor:'rgba(0,0,0,0.16)',
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
                  {(vl!==0 && len!==0)?(!head?vl+' ':'')+dp.replace('Madar','Mdr').replace('Renzo','').replace('Citron','cit').replace('Noura','Nra').replace('Premium','prem').replace('Platinium','plat')+' '+prctge:''}
                </Text>
              </View>
}

export function SingleLineChar() {
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

export function MultiLineCharts(){
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

export default function MultiStagesBarCharts(){

  const {startedAt,endedAt,postedAnalyses}=useSelector(state=>{
    const {startedAt,endedAt}=state.period.targetPeriod;
    const postedAnalyses=state.data.postedAnalyses;
    return {startedAt:startedAt,endedAt:endedAt,postedAnalyses:postedAnalyses};
  });
  const [analyses,setAnalyses]=useState(postedAnalyses);
  const [coordonnees,setCoordonnees]=useState({x:0,y:0,item:null});
  const {differentProducts,prodsWeeks}=interval.prodsByWeeks(analyses,startedAt,endedAt);
  const prodsByDep=filter.filterByDep(postedAnalyses);
// =====================================================================================================================================
  // const maxValue=Object.values(prodsWeeks).reduce((acc,item)=>{return item.count > acc ? item.count : acc;}, 0);
  // Alternative moderne et très lisible
  const maxValue = Math.max(...Object.values(prodsWeeks).map(item => item.count), 0);
  const noOfSections = 10; // Le nombre de lignes horizontales de votre grille
  // 2. Calcul du pas de base théorique
  const theoreticalStep = maxValue / noOfSections;
  // 3. Arrondi intelligent pour obtenir des graduations "propres" (ex: 23 -> 25, 104 -> 110)
  var dynamicStep = Math.ceil(theoreticalStep);
  if (dynamicStep > 10) {dynamicStep = Math.ceil(dynamicStep / 2) * 2;/*Arrondit au multiple de 5 supérieur si le pas est grand*/}
  // 4. Le nouveau maximum du graphique sera un multiple parfait du step
  const dynamicMax = dynamicStep * noOfSections;
  // C'est cet objet que vous passez à votre état (state) yAxisConfig
  const yAxisConfig = {max: dynamicMax,step: dynamicStep};

// ===================================================================================================================================
  const dataLength = Object.keys(prodsWeeks).length; // Nombre total de points sur l'axe X
  // 📐 Configuration dynamique des espaces de l'axe X
  const itemWidth = 50;         // Espace horizontal attribué à chaque point/barre (en px)
  const initialSpacing = 30;    // Espace avant le tout premier point
  const endSpacing = 30;        // 🌟 Espace de sécurité APRÈS le dernier point pour éviter qu'il soit collé au bord
  // Calcul de la largeur totale requise pour étaler tout l'axe X
  const calculatedWidth = (dataLength * itemWidth) + initialSpacing
// ====================================================================================================================================

  const stackData=Object.entries(prodsWeeks).map(([key,val])=>{
      return {
        label:key,
        labelComponent:()=>(<Text style={styles.labelComponent}>{key}</Text>),
        stacks:[...differentProducts.map(dp=>{
          const vl=val.analyses?.filter(p=>p.name===dp)?.length;
          const prctge=val.count!==0?((vl/val.count)*100).toFixed(1).toString()+'%':'0%';
          const clor=Colors[colorFromName(dp)];
          return {
            value:vl,
            innerBarComponent:()=>(<BarComponent params={{len:val.count,head:false,dp:dp,vl:vl,prctge:prctge}}/>),
            color:clor
          }
        }),
        {
          value:2,
          innerBarComponent:()=>(<BarComponent params={{len:val.count,head:true,dp:val.count.toString()+' prods',vl:2,prctge:''}}/>),
          color:'transparent'
        }
      ]
      }
  });

  const LateralNav=()=>{
    function handleDepPress(items){
      setAnalyses(items);
    }
    return <View style={{width:200,minHeigth:500,paddingHorizontal:10,paddingVertical:20,paddingTop:5,marginRight:15,borderRadius:5,borderWidth:1,borderBottomWidth:0,borderColor:'grey',backgroundColor:'whitesmoke'}}>
        <Text style={{color:primaryColor,backgroundColor:'rgba(0,0,0,0.15)',borderRadius:4,paddingVertical:20,textAlign:'center',marginBottom:20,letterSpacing:2,fontSize:14,fontWeight:'bold'}}>Départements</Text>
        {Object.entries(prodsByDep).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,items])=>{
          return <Pressable style={{width:'100%',height:50,padding:5}} onPress={()=>handleDepPress(items)}>
            <Text style={{color:'black',letterSpacing:2,fontSize:13,fontWeight:'bold'}}>{k}</Text>
            </Pressable>
        })}
      </View>
  }

  return (<ScrollView 
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
            <LateralNav/>
            <View 
              style={{ 
                  backgroundColor: '#1A1A1A', 
                  borderRadius: 10,
                  width:900,
                  padding:15 
                }}
            >
              <BarChart
                stackData={stackData}         // ✅ Charge la structure multi-étages
                barWidth={40}                 // Largeur de chaque colonne empilée
                height={300}                  // Hauteur globale du graphique
                noOfSections={noOfSections}              // Nombre de lignes de grille horizontales
                stepValue={yAxisConfig.step}   // 2. Définit la valeur de chaque palier
                maxValue={yAxisConfig.max}

                scrollable={true}
                width={800}            // ✅ Donne toute la place nécessaire à l'axe X
                initialSpacing={initialSpacing}    // Espace de départ à gauche
                endSpacing={endSpacing}            // ✅ Force une zone vide à la fin de la dernière valeur
                spacing={itemWidth}                // Distance entre chaque point de donnée

                bounces={true}                     // Ajoute un effet de rebond élastique en fin de course
                showScrollIndicator={true}
                // 🎨 Personnalisation des axes et labels
                xAxisLabelTextStyle={{ color: 'lightgray', fontSize: 12 }}
                yAxisTextStyle={{ color: 'lightgray' }}
                yAxisColor={'gray'}
                xAxisColor={'gray'}
                
                // ✨ Options esthétiques optionnelles
                barBorderRadius={4}           // Arrondit légèrement les angles des blocs
              />
            </View>
    </ScrollView>
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
    height:20,
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
