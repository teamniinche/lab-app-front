import { useState,useLayoutEffect} from "react";
import { StyleSheet,Pressable,TouchableOpacity,View,ScrollView } from 'react-native';
import Btn from '../buttons/btnWithinfo.js';
import {useSelector} from 'react-redux';
import { Text, Menu, Button } from "react-native-paper";
import { BubbleChart,PieChart } from 'react-native-gifted-charts';
import { FontAwesome5 } from '@expo/vector-icons';
import FiltersP from '../../kernel/classes/formatTablesAnalysesPoudre.js';
import {Texts,Titre} from './liquidesChars.js';
import {relations} from '../../iterables.js';
const filter=new FiltersP();

export const Replace=(sj,ar)=>{var SJ=sj;
  for (const el of ar) {SJ=SJ.replace(el[0],el[1]);}
  return SJ;
}

export const isElisible=(a/*analyse*/,coordonnees)=>{
const {abs,oord}=coordonnees;
  return a[abs] && a[abs]!==0 && a[oord] && a[oord]!==0;
}

const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};
const graphes={
  Correlations:{component:'Correlations',info:'Corrélations entre les parametres physico-chimiques'},
  Productions:{component:'Productions',info:"Statistiques sur la production"},
  // NonConformité:{component:'NonConformite',info:'Proportion de la non-conformité/produit'}
}

const GraphesNav=({render})=>{
    const initialTargeted=Object.keys(graphes)[0] || null;
    const [grap,setGrap]=useState(initialTargeted);
    const [focusedGrap,setFocusedGrap]=useState(initialTargeted);
    function handleGrapPress(component,k){
      render(component);
      setFocusedGrap(k);
    }
    const hoverStyle={backgroundColor:'rgba(0,0,250,0.0.08)',borderRadius:4}
    const focusStyle={backgroundColor:'rgba(0,0,250,0.5)',borderRadius:4}
    return <View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',gap:3,minWidth:1050,width:'100%',heigth:'auto',padding:8,marginBottom:10,paddingBottom:20,borderRadius:5,borderWidth:1,borderColor:'grey',backgroundColor:'rgba(240,240,240,0.2)'}}>
        <Text style={{color:'rgba(0,0,0,0.3)',borderRadius:4,paddingVertical:4,textAlign:'center',letterSpacing:2,fontSize:14}}>Graphiques</Text>
        <View style={{flexDirection:'row',paddingLeft:50,justifyContent:'flex-start',gap:15,alignItems:'center',width:'auto',height:20}}>
            {Object.entries(graphes).map(([k,value])=>{
              const {component,info}=value;
              return <Btn
                  style={[{width:'100%',height:25,padding:2,marginHorizontal:15},grap===k?hoverStyle:{},focusedGrap===k?focusStyle:{}]} 
                  onPress={()=>handleGrapPress(component,k)}
                  onHoverIn={()=>setGrap(k)}
                  onHoverOut={()=>setGrap(null)}
                  bcgrndClr={'rgba(0,0,0,0.8)'}
                  textStyle={styles.tooltipText}
                  info={info}
              >
                <Text style={{color:focusedGrap===k?'white':'black',width:'100%',textAlign:'center',letterSpacing:2,fontSize:13,fontWeight:'bold'}}>{k.replace('ProductionsPar','Prods/').replace('EvolutionPar','Prods/')}</Text>
              </Btn>
            })}
        </View>
      </View>
  }

const LateralNav=(props)=>{
  const {relation, setRelation} = props;
return <View style={{width:200,minHeigth:500,paddingHorizontal:10,paddingVertical:20,paddingTop:5,marginRight:15,borderRadius:5,borderWidth:1,borderBottomWidth:0,borderColor:'grey',backgroundColor:'whitesmoke'}}>
        <View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'center',backgroundColor:'rgba(0,0,0,0.07)',borderRadius:4,paddingVertical:20,marginBottom:20,borderWidth:1,brderColor:'rgba(0,0,0,0.05)'}}>
          <Texts focusedDep={null} text="Corrélations-Selectionnes une corrélation"/>
          <RelationSelector value={relation} onChange={(r)=>setRelation(r)} />
        </View>
        
      </View>
  }

export const Correlations=()=>{
    const [relation, setRelation] = useState("GGMA");
    const {startedAt,endedAt,powderAnalysed}=useSelector(state=>{
      const {startedAt,endedAt}=state.period.targetPeriod;
      const powderAnalysed=state.powderAnalysed.powderAnalysed;
      return {startedAt:startedAt,endedAt:endedAt,powderAnalysed:powderAnalysed};
    });
    const {xLabel,yLabel}=getChartData(relation,powderAnalysed);
    const RELATION=relations.filter(rel=>rel.value===relation)[0]?.label || 'Abcisse(Oordonnée)';
    const coordonnees=Replace(RELATION,[['Gros grains','gg'],['é','e'],['Matière active','matiere_active'],['(','|'],[')','|']]).split('|');
    const splitRelation=Replace(RELATION,[['(','|'],[')','|']]).split('|');
    const ANALYSES=powderAnalysed.filter(an=>isElisible(an,{abs:coordonnees[1].toLowerCase(),oord:coordonnees[0].toLowerCase()}));

  return  (
      <ScrollView 
                horizontal={true}  
                style={{ 
                        minWidth:1050,
                        width:'100%',
                        height:'auto',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'flex-start',
                        padding: 5,
                        marginTop:5
                }}
      >
            <LateralNav relation={relation} setRelation={(r)=>setRelation(r)}/>
            <View 
              style={{ 
                  backgroundColor: 'whitesmoke', 
                  borderRadius: 10,
                  width:900,
                  padding:15 
                }}
            >
            <Titre params={{dateStart:startedAt,dateEnd:endedAt,total:'( élisibles )'+ANALYSES?.length,literal:yLabel+'( '+xLabel+' )'}}/>
            <InterdependenceChart splitRelation={splitRelation} relation={relation} data={ANALYSES}/>
            </View>
      </ScrollView>
  )
};

const RelationSelector = ({ value, onChange }) => {

  const [visible, setVisible] = useState(false);
  const selected = relations.find(
    item => item?.value === value
  );

  return (
    <View style={{width:'98%',margin:'auto',marginTop:20}}>
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

const getChartData = (relation, analyses) => {

  switch (relation) {
    case "GGMA":

      return {

        xLabel: "Matière active",

        yLabel: "Gros grains",

        points: analyses.map(item => ({

          x: Number(item?.matiereActive) || 0,

          y: Number(item?.gg) || 0,
          r: 8 ,
          label:(Number(item?.gg) || 0).toString()

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
          label:(Number(item?.humidite) || 0).toString()

        }))

      };

    // Alcanité suivant matière active

    case "AlcaMA":

      return {

        xLabel: "Matière active",

        yLabel: "Alcanité",

        points: analyses.map(item => ({

          x: Number(item?.matiereActive) || 0,

          y: Number(item?.alcanite) || 0,
          r: 8 ,
          label:(Number(item?.alcanite) || 0).toString()

        }))

      };

    // Alcanité suivant gros grains

    case "AlcaGG":

      return {

        xLabel: "Gros grains",

        yLabel: "Alcanité",

        points: analyses.map(item => ({

          x: Number(item?.gg) || 0,

          y: Number(item?.alcanite) || 0,
          r: 8 ,
          label:(Number(item?.alcanite) || 0).toString()

        }))

      };

    // Alcanité suivant humidité

    case "AlcaH":

      return {

        xLabel: "Humidité",

        yLabel: "Alcanité",

        points: analyses.map(item => ({

          x: Number(item?.humidite) || 0,

          y: Number(item?.alcanite) || 0,
          r: 8 ,
          label:(Number(item?.alcanite) || 0).toString()

        }))

      };

    // Gros grains suivant humidité

    case "GGH":

      return {

        xLabel: "Humidité",

        yLabel: "Gros grains",

        points: analyses.map(item => ({

          x: Number(item?.humidite) || 0,

          y: Number(item?.gg) || 0,
          r: 8 ,
          label:(Number(item?.gg) || 0).toString()

        }))

      };

    // Gros grains suivant densité

    case "GGD":

      return {

        xLabel: "Densité",

        yLabel: "Gros grains",

        points: analyses.map(item => ({

          x: Number(item?.densite) || 0,

          y: Number(item?.gg) || 0,
          r: 8 ,
          label:(Number(item?.gg) || 0).toString()

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
          label:(Number(item?.densite) || 0).toString()

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
          label:(Number(item?.densite) || 0).toString()

        }))

      };

    // Alcanité suivant densité

    case "AlcaD":

      return {

        xLabel: "Densité",

        yLabel: "Alcanité",

        points: analyses.map(item => ({

          x: Number(item?.densite) || 0,

          y: Number(item?.alcanite) || 0,
          r: 8 ,
          label:(Number(item?.alcanite) || 0).toString()

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

const InterdependenceChart = ({relation,data,splitRelation}) => {

      const chartData = getChartData(relation, data);
      const maxX=Math.max(...chartData.points.map(pt=> pt.x), 0)+5;
      const maxY=Math.max(...chartData.points.map(pt=> pt.y), 0)+5;

      return (
        <View> 
          <Text style={{width:'auto',textAlign:'center',position:'absolute',letterSpacing:2,bottom:20,right:-2,color:'black'}}>{splitRelation[1]}</Text>
          <BubbleChart
            data={chartData.points}
            xNoOfSections={5}
            // --- MODE SCATTER XY ---
            scatterChart={true}        // Active le traitement mathématique des axes X et Y
            showGradient={true}       // Garde une couleur unie sur vos points
            centerColorForGradient="#007AFF"
            bubblesColor="#ffffff" //"#007AFF"     // Couleur de vos coordonnées
            
            // --- CONFIGURATION DE L'AJUSTEMENT (AUTO-FIT) ---
            width={800}   // Largeur utile de la grille du graphique
            parentWidth={850}  // Largeur totale de prise en compte du conteneur
            maxY={maxY}
            maxX={maxX}
            // --- DESIGN DES AXES & GRILLE ---
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisColor="#333"
            xAxisColor="#333"
            showGrid={false}
            gridColor="#EAEAEA"
            
            // Hauteur fixe du repère ordonné
            height={360}
          />
        <Text style={{width:'auto',textAlign:'center',position:'absolute',letterSpacing:2,top:0,left:5,transform: [{ rotate: '-90deg' }],whiteSpace:'nowrap',color:'black'}}>{splitRelation[0]}</Text>
        </View>
      );
    };
  
const Productions=()=>{
  const {startedAt,endedAt,powderAnalysed}=useSelector(state=>{
      const {startedAt,endedAt}=state.period.targetPeriod;
      const powderAnalysed=state.powderAnalysed.powderAnalysed;
      return {startedAt:startedAt,endedAt:endedAt,powderAnalysed:powderAnalysed};
    });
  return <View 
              style={{ 
                  backgroundColor: 'whitesmoke', 
                  borderRadius: 10,
                  width:900,
                  padding:15 
                }}
            >
            <Titre params={{dateStart:startedAt,dateEnd:endedAt,total:powderAnalysed?.length,literal:'Proportions de production'}}/>
            <PieCharts powderAnalysed={powderAnalysed}/>
      </View>
}

function PieCharts({powderAnalysed}) {
    const LEN=powderAnalysed?.length;
    const powderByName=filter.filterByName(powderAnalysed);
    const fullPalette = [
  // --- Les Bleus & Cyans (5) ---
  '#177AD5', // 1. Bleu Tech
  '#ED6665', // 12. Corail doux
  '#A8E6CF', // 8. Vert Pastel doux
  '#F1C40F', // 9. Jaune Soleil
  '#9B5DE5', // 14. Violet Électrique
  '#2ECC71', // 6. Vert Menthe
  '#E74C3C', // 13. Rouge Alerte
  '#3498DB', // 2. Bleu Ciel vif
  '#00CEC9', // 3. Turquoise soutenu
  '#1ABC9C', // 5. Émeraude clair
  
  // --- Les Verts (3) ---
  '#79D2DE', // 4. Cyan Lumineux
  '#27AE60', // 7. Vert Labo

  // --- Les Jaunes, Oranges & Rouges (5) ---
  '#FFB84C', // 10. Orange Chaud
  '#FD79A8',  // 15. Rose Baie
  '#E67E22', // 11. Mandarine

  // --- Les Violets & Roses (2) ---
];

    const pieData=Object.entries(powderByName).map(([key,analises],index)=>{
          const len=analises?.length;
          // const name=analises[0]?.name;
          const prctge=LEN!==0?((len/LEN)*100):0;
           // 2. On retourne TOUJOURS un objet valide avec une valeur numérique
    return { 
      value: Number(prctge.toFixed(1)), // 🟢 S'assure que c'est un nombre pur
      // text: `${key} (${prctge.toFixed(1)}%)`, // 🟢 Le .toFixed sert uniquement pour le texte d'affichage
      color: fullPalette[index], // 🟢 Sécurité avec le modulo %
      pieCentricLabelComponent: () => (
        <View style={{width:'auto',minWidth:100,flexDirection:'column',alignItems: 'center', justifyContent: 'center',backgroundColor:'white',borderRadius:10,paddingHorizontal:4}}>
          {/* Vous pouvez styliser le texte comme vous le souhaitez ici */}
          <Text style={{ color: '#333', fontSize: 10, fontWeight: 'bold',width:'auto' }}>
            {key}
          </Text>
          <Text style={{ color: '#666', fontSize: 9,width:'auto' }}>
            {prctge.toFixed(1)}%
          </Text>
        </View>
      ),
      
    };
  })
  // 3. 🟢 ON FILTRE APRÈS LE MAP pour éliminer proprement les lignes à 0%
  .filter(item => item.value > 0);

  return (
    <View style={{ alignItems: 'center',margin:'auto', marginVertical: 40 }}>
      <PieChart
        data={pieData}
        radius={210}
        
        // --- ACTIVATION DES LABELS EXTÉRIEURS 🟢 ---
        showValuesAsLabels={true}     // Sort les labels à l'extérieur
        labelsPosition="onBorder"    // Aligne les points de départ des lignes
        
        // --- PERSONNALISATION DU TEXTE ---
        showText={true}         // Force l'affichage des chaînes présentes dans "text"
        textColor="black"       // Couleur d'écriture à l'intérieur des parts
        textSize={12}           // Taille de la police
        fontWeight="bold"
        textPosition={30}
        
        // --- LIGNES DE REPERE (POINTERS) ---
        extraRadiusForLabels={30}     // Éloignement du texte par rapport au cercle
        strokeWidth={2}               // Épaisseur de la ligne indicatrice
        strokeColor="#666"            // Couleur de la ligne indicatrice
      />
    </View>
  );
}
const COMPONENTSPOUDRE={
  Correlations:<Correlations/>,
  Productions:<Productions/>,
  // NonConformite:<NonConformite/>
}
export default function PoudreCharts({navigation}){
    const [Component,setComponent]=useState('Correlations');
    useLayoutEffect(()=>{
                  navigation.setOptions({
                      headerLeft:()=>(
                          <TouchableOpacity style={{width:40,margin:0,marginLeft:30,backgroundColor:'transparent',}} onPress={() => navigation.navigate('Accueil')}>
                              <FontAwesome5 name='arrow-left' size={20} color='white'/>
                          </TouchableOpacity>
                      )
                  });
          },[]);
    return <View
                  style={{ 
                          minWidth:1050,
                          width:'100%',
                          height:'auto',
                          flexDirection:'column',
                          justifyContent:'flex-start',
                          alignItems:'flex-start',
                          padding: 5
                  }}
            >
              <GraphesNav render={(C)=>setComponent(C)}/>
              {COMPONENTSPOUDRE[Component]}
            </View>
   }

const styles = StyleSheet.create({
    tooltipText: {
    width:'auto',
    // backgroundColor:'rgba(0,0,0,0.8)',
    color:'white',
    height:20,
    padding:2,
    borderRadius:2,
    textAlign:'center',
    letterSpacing:1.5,
    fontSize:12
  },
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
