// Native components
import { useState,useContext } from 'react';
import { View, Text, StyleSheet,TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleRange from '../../assets/styles.js/styleRange';
import { Bouton } from '../buttons/save';
import { isAcceptable} from '../../assets/functions';
import nombers,{ calculateMaLiquide } from '../../hooks/littleBiblio';
import { clooner } from '../accueil';

/**
 * 
 * @param {float} V 
 * @returns object
 */

const MARange = ({item}) => {
  const clooned=useSelector(state=>state.actived.clooned);
  const [vlue,setVlue]=useState(2.50);
  const {machine,reservoir,resultsFils}=item;
  // =============  donnees à extraire ailleurs =========================
  const {marges}={marges:{down:1.50,up:1.50}}
  //=====================================================================


  const {identification,grandeurs}=resultsFils;
  const {matiere_active}=grandeurs;
  const coef=matiere_active?.normes?.coef || 14.41;
  const {nom,couleur}=identification;const {codor}=couleur;
  const {m,produit,ma0}={m:2.50,produit:nom,ma0:2.75};
  const useMA=(V)=>{
    const [ma,setMat]=useState(calculateMaLiquide(produit,coef,vlue /*,m*/,V))

    const matAct=(v)=>{
        setMat(calculateMaLiquide(produit,coef,vlue /*,m*/,v));
    }
    return {MA:ma,setMA:matAct};
}
  const {min,max,moy}=nombers(matiere_active.normes);
  const [value, setValue] = useState(ma0);
  const [buttonParams,setButtonParams]=useState({color:'blue',text:'Save',able:true,});
  const { MA ,setMA}=useMA(ma0);
  const [ob,setOb]=useState({machine:machine,nom:nom,reservoir:reservoir,ma:MA});

  function APPRECIATIONS(){
    const lMa=value<min?'Ma Low':"";
    const hMa=value>max?'Ma High':"";
    const appreciations=lMa+hMa;
    return appreciations===""?"RAS":appreciations;
  }
  const handleValChange=(v)=>{
    setValue(v);
    setMA(v);
    setButtonParams({color:'blue',text:'Save',able:true,})
    setOb({...ob,ma:calculateMaLiquide(produit,coef,vlue /*,m*/,v)});
  }
  const onHandlePressUp=() => {
    let nouvelle_valeur=value+0.05;
    const inRange=(nouvelle_valeur>=0) && (nouvelle_valeur<=8);
    inRange && handleValChange(nouvelle_valeur);

  }
  const onHandlePressDown=() => {
    let nouvelle_valeur=value-0.05;
    const inRange=(nouvelle_valeur>=0) && (nouvelle_valeur<=8);
    inRange && handleValChange(nouvelle_valeur);
  }
  const onHandleValueMasseChange=(text)=>{setVlue(text);}

  const stepColor='rgba(0,0,0,0.7)';
  return <View style={styles.container1}>
    <View style={styles.machine_reservoir}>
      <Text
        style={{ height: 40, width:'fit-content' ,fontSize:12,fontWeight:'bold',textAlign:'left',marginHorizontal:'7px',}}
      >
        {clooned?clooner(nom):nom+'   '+machine+'  '+ob.ma}

      </Text>
    </View>
    <View style={{width:'100%',maxHeight:75,padding:4,backgroundColor:'#FFFFFF',border:'1px solid green',borderRadius:10,flex:1,flexDirection:'column',alignItems:'center',}}>
      <View style={{width:'80%',flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:-10,}}>
        <Text style={{color:'grey',fontSize:10,}}>{'Volume = '+value.toFixed(2)+' mL    MA : '+min+'<'} <Text style={{fontWeight:'bold',fontSize:11,color:isAcceptable({min:min,max:max},marges,MA),}}>{ MA}</Text> {'<'+max}</Text>
        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginTop:-5,overflow:'hidden',}}><Text style={{maxWidth:50,color:'grey',}}>masse </Text><TextInput maxLength={4} value={vlue} keyboardType="numeric" onChangeText={onHandleValueMasseChange} style={{maxWidth:50,borderRadius:5,borderWidth:1,borderColor:'rgba(0,0,0,0.2)',fontWeight:'bold',textAlign:'center',borderStyle:'solid',}}/></View>
      </View>
      <View style={{...styles.container2,backgroundColor:codor,}}>
        <View style={styles.container3}>
        <Text style={{color:stepColor,}}>0</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>1</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>2</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,fontWeigth:'bold',}}>3</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>4</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>5</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>6</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>7</Text>
        <Text style={{color:stepColor,}}>.</Text>
        <Text style={{color:stepColor,}}>8</Text>
        </View>
        <View style={styles.iconsSlider}>
        <TouchableOpacity onPress={onHandlePressDown}>
          <Icon name="chevron-left" size={30} color="#900"/>
        </TouchableOpacity>
          
          <Slider
            style={{width:'84%', height:40,}}
            minimumValue={0}
            maximumValue={8}
            step={0.05}
            value={value}
            tapToSeek={true}
            trackStyle={{height:8,borderRadius:4,}}
            thumbImage={require('../../assets/images/hdThumbs-solid/thumb-vol.png')}
            onValueChange={handleValChange}
            minimumTrackTintColor={isAcceptable({min:min,max:max},marges,MA)}
            maximumTrackTintColor="#00FFFF"
            thumbTintColor={isAcceptable({min:min,max:max},marges,MA)}
          />
          <TouchableOpacity onPress={onHandlePressUp}>
            <Icon name="chevron-right" size={30} color="#900"/>
        </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={styles.commentContainer}>
        {((MA<min) && <Text style={{width:'30%',}}>MA Low</Text>) ||((MA>max) && <Text style={{width:'30%',}}>MA High</Text>)}
    </View>
    <Bouton reqBody={{
            machine:machine,
            name:nom,
            reservoir:reservoir,
            matiere_active:ob.ma,
            observations:APPRECIATIONS(),
            UtilisateurId:1
            }}
            registrable={true}
            render={(o)=>setButtonParams(o)}
            buttonParams={buttonParams}
            // able={buttonAble}
          />
  </View>
};

const styles = StyleSheet.create(styleRange);

export default MARange;
