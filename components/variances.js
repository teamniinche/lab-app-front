import {Pressable,TouchableOpacity,View,Text,Image,Platform,StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMonoProducts } from './wrappers/contexts';
import { meraResultsFormat } from '../assets/functions';
import { Flex } from '../assets/functions';
import WinDim from '../assets/operatingData';
import { CheckRBParent } from './modaux.js/modalReserv';
import { clooner } from './accueil';
const Stack=createNativeStackNavigator();
const {isLarge,screenHeight}=WinDim;
/* =============== Variances & CheckRBParent dans les VariancesNavigator englobé dans ModalVariants ===================
qui est utilisé dans OpNavigator qui regroupe Grid(Accueil) ,ModalMesures et ModalVariants
==============================================================================================================*/
export function ModalVariants({route}) {
const {machinesReservoirs,variancesObject,imagesVariances}=route?.params.data || {};

const navigation=useNavigation();
  return (<View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={{position:'absolute',margin:0,padding:0,top:-5,right:-5,}} onPress={()=>navigation.goBack()}>
                        <Text style={{fontSize:16,}}>❌</Text>
                    </TouchableOpacity>
                    <VariancesNavigator 
                            machinesReservoirs={machinesReservoirs}
                            variancesObject={variancesObject}
                            imagesVariances={imagesVariances}
                    />
                  
                </View>
          </View>
    );
}
export const VariancesNavigator=({machinesReservoirs,variancesObject,imagesVariances,render})=>{
  
    return (<Stack.Navigator
        screenOptions={{mode:'modal',headerShown: false,}}>
        <Stack.Screen name="Variants" children={() => <Variances
                            machinesReservoirs={machinesReservoirs}
                            variancesObject={variancesObject}
                            imagesVariances={imagesVariances}
                        />}/>
        <Stack.Screen name="analyses/liquides/variants/reservoirs" children={({route}) => <CheckRBParent data={null} route={route}/>}/>
    </Stack.Navigator>
    )}
export const Variances = ({/*navigation ici pour  seulement VriantsNavigator en test  pour web*/machinesReservoirs,variancesObject,imagesVariances}) => {
  const clooned=useSelector(state=>state.actived.clooned);
  const navigation=useNavigation();
  const {buildMonoproducts}=useMonoProducts();
  const {machines,reservoirs}=machinesReservoirs || {machines:[],reservoirs:[]};
  // const handlePress=(obje)=>{
  //   if(Platform.OS==='web' ){navigation.navigate('analyses/liquides/ph', {data:obje});render(false);
  //   }else{navigation.navigate("analyse/choix_des_varianceReservoirs", {data:obje})}//analyses/liquides/variants/reservoirs
  // }
  const handlePress=(obje)=>{
    if(Platform.OS==='web'){buildMonoproducts(obje[0]);navigation.goBack()/*navigation.navigate("analyses/liquides/variants/reservoirs", {data:obje[0]});*///render(false);
    }else{navigation.navigate("analyses/choix_des_varianceReservoirs", {data:obje})}//analyses/liquides/variants/reservoirs
  }
  return (
    <View style={{width:'100%',height:'100%'/*'80%'*/,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',/*...Flex('row','center','flex-start'),*/flexWrap:'wrap',gap:30,paddingLeft:'1%',paddingHorizontal:'5%',paddingVertical:'2%',/*'10%',*/}}>
      {Object.entries(variancesObject).map(([key, variant], index) => {
              const imageSrc=imagesVariances[key];
              var nom=variant.codor_normes.nom;
              const lenNom=nom.split(" ").length-1;
              const color=variant.codor_normes.color==='white'?'grey':variant.codor_normes.color;
              return (
                <TouchableOpacity key={index} style={{...styles.splitButton,borderColor:color,marginVertical:15,}}
                    // onPress={()=>handlePress([{from:nom,results:meraResultsFormat(variant),machine:'F',reservoir:'1',color:color}])}
                    onPress={()=>{Platform.OS!=='web'?
                    handlePress({from:nom,title:nom,results:meraResultsFormat(variant),machines:machines,reservoirs:reservoirs,color:color})
                    :handlePress([{from:nom,title:nom,results:meraResultsFormat(variant),machines:machines,reservoirs:reservoirs,/*machine:'F',reservoir:'1',*/color:color}])
                    }}

                >
                  <Image resizeMode="contain" source={clooned?require("../assets/images/any.png"):imageSrc} style={styles.image_group2} />
                  <Pressable style={{width: "100%",}}>
                    <Text style={{
                      flexDirection:'row',
                      justifyContent:'center',
                      alignItems:'center',
                      // paddingVertical:4,
                       borderWidth:1,
                       borderColor:'grey',
                       borderRadius:10,
                       width: "125%",
                       textAlign: "center",
                       marginLeft:-15,
                       fontWeight:'bold',
                       height:20,
                       backgroundColor:'rgb(250,250,250)',
                       }}>
                      {clooned?clooner(nom.split(" ")[lenNom]):nom.split(" ")[lenNom]}
                    </Text>
                  </Pressable>
                </TouchableOpacity>
              );
      })}
    </View>
  );
};

const styles=StyleSheet.create({
    container:{
        // ...Flex('column','center','center'),
        flexDirection:'column',
        // justifyContent:'flex-start',
        // alignItems:'center',
        // flexWrap:'wrap',
        // gap:10,
        paddingHorizontal:0,
        paddingVertical:5,
        minHeight:'100%',
        maxHeight:'100%',
        height:'100%',
        // overflow:'scroll',
        width:'100%',
    },
    scrollView:{
      maxHeight:'90%',
    },
    button:{
      // ...Flex('column','center','center'),
      // gap:0,
        // minWidth:100,//120,
        // maxWidth:100,//120,
        // minHeight:120,
        // maxHeight:120,
        // width:'25vw',
        // height:'25vw',
        // marginHorizontal:5,
        width:95,
        height:120,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(0,0,0,0.2)',
        borderRadius:10,
        backgroundColor:'white',//rgba(49, 141, 247, 0.7)',
        // ...Flex('row','flex-start','center'),

    },
    splitButton:{
        minWidth:70,
        maxWidth:70,
        minHeight:70,
        maxHeight:200,
        // width:'25vw',
        // height:'25vw',
        marginHorizontal:10,
        borderWidth: 4,
        borderRadius: 10,
        // backgroundColor:'rgba(49, 141, 247, 0.7)',
        ...Flex('row','flex-start','center'),
    },
    infos:{
        textAlign:'center',
        fontWeight:'bold',
        width:'80%',
        height:145,
        color:'white',
        letterSpacing:2,
        ...Flex('column','flex-start','flex-end'),
        paddingVertical:4,
        padding:12,
    },
    title:{
      letterSpacing:-1.2,
      textAlign:'center',
      width:'90%',
      height:'15%',
      fontSize:14,
      color:'grey',
      fontWeight:'bold',
      // marginTop:-10,
      // transform:[{rotate:'-90deg'}],
    },
    mach_component:{
      ...Flex('column','center','center'),
      fontWeight:'bold',
      fontSize:13,
      color:'black',
    },
    machines:{
      ...Flex('row','center','center'),
      maxHeight:'70%',
      height:'70%',
      width:'100%',
      padding:'0px',
      margin:'0px',
    },
    reservoirs:{
      height:'80%',
      maxWidth:'50%',
      width:'100%',
      ...Flex('column','center','flex-end'),
      flexWrap:'wrap',
      padding:12,

    },
    image:{
        // width:'30%',
        height:'75%',//150,
        // marginLeft:-14,
    },
    image_group:{
        width:'70%',
        height:130, //400
        // marginLeft:-14,
    },
    image_group1:{
        width:'80%',
        height:130,//400
        // marginLeft:-14,//'-1.3rem',
    },
    image_group2:{
        width:'70%',
        height:130,//250
        // marginLeft:-14,
    },


///

  card: {
    height: "60%", // moitié de l’écran
    width:"99%",
    backgroundColor: "#fff",
    borderWidth:1,
    marginHorizontal:"auto",
    marginBottom:-15,
    borderColor:'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  modalContainer: {
    //regle les padding du fond gris ainsi  les height et width en quelque sorte du modal content
    flex: 1,
    flexDirection:'column',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical:'20%',//'2%'
    paddingHorizontal:'auto',//'20%',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // minWidth:'90%',
    //height:450,
  },
  modalContent: {
    minWidth:400,
    minHeight:540,
    width:480,//'95%',
    // height:500,
    // height:(screenHeight*0.8),//'70vh'
    padding:50,
    // paddingHorizontal:20,
    // paddingVertical:50,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    // ...Flex('column','center','center'),
    // gap:'1rem',
  },
    modalCotainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical:'30%',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width:'100%',
  },
  modalCotent: {
    flexDirection:'row',
    width: 350,
    minHeight:300,
    paddingVertical:50,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    gap:50,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "blue",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
})
