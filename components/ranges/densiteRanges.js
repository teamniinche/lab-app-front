// Native components
import { useMemo, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleRange from '../../assets/styles.js/styleRange';
import { Bouton } from '../buttons/save';
import { isAcceptable } from '../../assets/functions';
import nombers,{ calculateMaLiquide } from '../../hooks/littleBiblio';
import { primaryColor } from '../../assets/constantes';
import { clooner } from '../accueil';

/**
 *
 * @param {float} V
 * @returns object
 */

const DensiteRange = ({item}) => {
  const values=[1,2,3,4,5,6,7,"DEL","CLEAR",8,9,0,"ENTER"];
  // const dentifrice={
  //   identification:{
  //     categorie:"dentifrice",
  //     forme:"Pate || Liquide",
  //     nom:"Mera blanc",
  //     couleur:{conforme:"OUI",codor:"white"},
  //     parfum:"Normal"},
  //   grandeurs:{
  //     ph:{resultat:7,normes:{min:6,max:7.5},
  //     validation:false},
  //     viscosite:{resultat:400,normes:{min:450,max:650},validation:false},
  //     densite:{resultat:1.3029,normes:{min:1.28,max:1.32},validation:false},
  //     matiere_active:{resultat:16.16,validation:false}
  //   }
  // }

  const {machine,reservoir,results,resultsFils}=item;
  // const clooned=useSelector(state=>state.actived.clooned);
  const {currentUser,clooned} = useSelector((state) => {
      const currentUser=state.user.currentUser;
      const clooned=state.actived.clooned;
      return {currentUser,clooned};
    });
  const currentUserId=currentUser?.id;
// ============= Donnes à extraire ailleurs =================
  const {marges}={marges:{down:150,up:150}}
// =========================================================

  const {identification,grandeurs}=resultsFils || results;
  const {densite}=grandeurs;
  const {nom,couleur,categorie}=identification;const {codor}=couleur;
  const {min,max,moy}=nombers(densite.normes);
  const [value, setValue] = useState(0);const valeur=(parseFloat(value)/10000).toString();
  const [buttonParams,setButtonParams]=useState({color:'blue',text:'ENTER',able:true,});
  const [ob,setOb]=useState({machine:machine,nom:nom,reservoir:reservoir,densite:valeur,categorie:categorie});
  function APPRECIATIONS(){
    const lDensite=value<min?'Densite Low':"";
    const hDensite=value>max?'Densite High':"";
    const appreciations=lDensite+hDensite;
    return appreciations===""?"RAS":appreciations;
  }

   function handleJoin(vl){
    const entire=String(valeur).split("")[0];
    if(vl==="DEL"){
      setValue(prev=>prev.toString().slice(0,-1));}
    if(vl==="CLEAR"){
      setValue("");
      setWidth(0);
    }
    if(vl==="ENTER"){
      alert(((Number(value)/8000)*txtWidth).toFixed(0));
    }
    if(typeof(vl)==="number" && entire==="0"){
      setValue(prev=>prev.toString()+vl.toString());
    }
  }

  const handleValChange=(V)=>{
    const v=Number(V);
    setValue(v);
    setButtonParams({color:'blue',text:'ENTER',able:true,btnStyle:styles.buttonStyle});
    setOb({...ob,densite:v});
  }

  useMemo(()=>{
    handleValChange(value);
  },[value])
  const stepColor='rgba(0,0,0,0.7)';
  return <View style={[ styles.container1,{marginBottom:50,backgroundColor:"transparent",}]}>

    <View style={styles.densiteStyles}>
    <View style={styles.densiteMainScreen}>
      <View style={styles.densiteScreen}>
          <Text style={{maxHeight:20,minHeight:20,fontSize:10,alignContent:"center",minWidth:'100%',backgroundColor:"transparent"}}>
            {((parseFloat(valeur)<min) && <Text style={{width:'30%',}}>❌Densite Low</Text>) ||((parseFloat(valeur)>max) && <Text style={{width:'30%',}}>❌Densite High</Text>)}
            </Text>
          <Slider
                      style={{minWidth:'100%', minHeight:10,maxHeight:10}}
                      maximumValue={(1.3*max)}
                      minimumValue={(0.7*min)}
                      step={1}
                      tapToSeek={true}
                      trackStyle={{height:8,borderRadius:4,}}
                      thumbImage={require('../../assets/images/hdThumbs-solid/thumb-visco.png')}
                      value={parseFloat(valeur)}
                      onValueChange={()=>null}
                      minimumTrackTintColor={isAcceptable({min:min,max:max},marges,parseFloat(valeur))}
                      maximumTrackTintColor="#00FFFF"
                      thumbTintColor={isAcceptable({min:min,max:max},marges,parseFloat(valeur))}
                    />
          <Text style={{ fontSize:45,minWidth:"100%",fontFamily:"Arial",paddingBottom:5,textAlign:"right",fontWeight:"bold",minHeight:64,
          flexDirection:"row",alignContent:"flex-end"

          }}>{valeur}</Text>
      </View>
    </View>
    <View style={styles.densiteNumPad}>
        {values.map((val,index)=>val==="ENTER"?<Bouton key={index} reqBody={{
            machine:machine,
            name:nom,
            reservoir:reservoir,
            densite:ob.densite,
            observations:APPRECIATIONS(),
            UtilisateurId:currentUserId
            }}
            registrable={true}
            render={(o)=>setButtonParams(o)}
            buttonParams={buttonParams}
          />:<Text
        key={index}
        onPress={()=>handleJoin(val)}
        style={{
                flex:val==="DEL"?1/2:(val==="CLEAR" || val==="ENTER")?3/8:1/4,
                width:'30%',
                padding:10,
                backgroundColor:val==="CLEAR"?"red":(val==="ENTER"?primaryColor:(val==="DEL"?"red":'rgba(165, 54, 54, 0.1)')),
                borderWidth:1,
                borderTopColor:'grey',
                borderLeftColor:'grey',
                margin:5,
                borderRadius:5,
                textAlign:'center',
                fontSize:(val==="CLEAR" || val==="ENTER")?10:18,
                fontWeight:'bold',
                color:'white'
            }}
        >{val}</Text>
        )}
    </View>
  </View>
  </View>
};

const styles = StyleSheet.create({...styleRange,densiteStyles:{
    // width:"100%",
    maxWidth:400,
    minWidth:400,
    backgroundColor:"grey",
    flexDirection:"column",
    justifyContent:"flex-start",
    alignItems:"center",
    padding:10,
    minHeight:200,
    height:"auto",
    borderRadius:10,
    marginTop:50
    
  },
  densiteMainScreen:{
    width:"100%",
    maxHeight:80,
    flex:1,
    flexDirection:"row",
    backgroundColor:"rgba(0,0,0,0.1)",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderRadius:10,
    height:80
  },
  densiteScreen:{
    width:"96%",
    flex:1,
    // // fontSize:40,
    // fontFamily:"Arial",
    // textAlign:"right",
    // fontWeight:"bold",
    flexDirection:"column",
    alignItems:"flex-end",
    backgroundColor:"whitesmoke",
    justifyContent:"center",
    paddingVertical:4,
    paddingHorizontal:4,
    borderRadius:5,
    height:80
  },
  densiteNumPad:{
    flex:1,
    width:"96%",
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"flex-start",
  },
  buttonStyle:{
                flex:3/8,
                width:'30%',
                padding:10,
                backgroundColor:primaryColor,
                borderWidth:1,
                borderTopColor:'grey',
                borderLeftColor:'grey',
                margin:5,
                borderRadius:5,
                textAlign:'center',
                fontSize:10,
                fontWeight:'bold',
                color:'white'
            }
});

export default DensiteRange;
