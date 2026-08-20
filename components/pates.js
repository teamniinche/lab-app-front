import {Pressable,TouchableOpacity,View,Text,Image,StyleSheet} from 'react-native';
import { useEffect,useLayoutEffect,useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMonoProducts } from './wrappers/contexts';
import dentifricesObject from '../iterables';
import { data as reducerData } from './store/reducers/dataReducer';
import { Flex,meraResultsFormat } from '../assets/functions';

// const path='../assets/images/';
export const images = {
  "d-mera-blanc.png": require("../assets/images/d-mera-blanc.png"),
  "d-mera-noir.png": require("../assets/images/d-mera-noir.png"),
  "d-mera-bleu.png": require("../assets/images/d-mera-bleu.png"),
  "d-mera-rouge.png": require("../assets/images/d-mera-rouge.png"),
};
export const Pates = ({/*navigation,context,*/ render}) => {
  // const {obj,updateContext}=useContext(context);
  const [dentifrices,setDentifrices]=useState({});
  const navigation=useNavigation();
  const dispatch=useDispatch();
  const {buildMonoproducts}=useMonoProducts();

  useEffect(()=>{
      dispatch(reducerData(null));
},[])

  useLayoutEffect(()=>{// les asynchrones il faut qu'elles passent par le hokk useEffect || useLayoutEffect car elles sont en retard en synchrone
      async function fetchMeras() {
          const meras = await dentifricesObject();
          if (meras) {setDentifrices(meras);}
      }
      fetchMeras();

    },[])


  const handlePress=(obje)=>{
    // const {from,results,machine,reservoir,color}=obje;
    // const frm=from.replace('D','Dentifrice');
    // obj.push({from:frm,machine:machine,reservoir:reservoir,results:results,color:color});
    // updateContext(obj);

    const resultats=meraResultsFormat(obje);
    const {identification,grandeurs}=resultats;
    const {nom}=identification;                                //|
    buildMonoproducts({title:nom,machine:"mera",reservoir:1,results:resultats});  //| en remplecement de ce qui suit 👇
    // navigation.navigate('analyses/liquides/mera', {data:obje}) ;// lorsqu il fallait passer par liquidesNavigator pour etre rediriger vers la page dinput pour mera
    render(false);
  }

  return (
    <View style={{width:'100%',height:'100%',...Flex('row','center','flex-start'),flexWrap:'wrap',gap:20,}}>
      {Object.entries(dentifrices).map(([key, d], index) => {

              const { from, results, image } = d;
              const imageSrc=images[image];
              const nom=results.codor_normes.nom;
              const nomArray=nom.split(" ");
              const lenNom=nomArray.length-1;
              const color=results.codor_normes.color==='white'?'grey':results.codor_normes.color;
              return (
                <TouchableOpacity key={index} style={{...styles.splitButton,marginHorizontal:30,borderColor:color,}}
                    onPress={()=>handlePress(results /*{from:from,results:results,machine:'M',reservoir:'1',color:color}*/)}
                >
                  <Image resizeMode="contain" source={imageSrc} style={styles.image_group2} />
                  <Pressable style={{ width: "100%" }}>
                    <Text style={{
                      // ...Flex('row','center','center'),
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
                      {/* <FontAwesome name="cog" size={25} color="grey" /> */}
                      {nomArray[lenNom]}
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
})