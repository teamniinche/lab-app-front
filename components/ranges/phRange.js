// ================= SOCKET.IO.CLIENT =========================
// const SOCKET_SERVER_URL = 'https://api-tn-46ff13fab352.herokuapp.com';
// const socket = io(SOCKET_SERVER_URL,{
  //   transports: ["websocket"],
  //   reconnection: true,
  //   reconnectionAttempts: 5, // Nombre de tentatives avant échec
  //   reconnectionDelay: 3000,
  // });
  //=============================================================
  // Native components
import React, { useState,useEffect,useContext,useMemo, forwardRef, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from '@futurejj/react-native-checkbox';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bouton } from '../buttons/save';
import { useSelector } from 'react-redux';
import { isAcceptable,Flex } from '../../assets/functions';
import styleRange from '../../assets/styles.js/styleRange';
import useConformite from '../../hooks/useConformite';
import nombers from '../../hooks/littleBiblio';
// import socket from '../../assets/socket.IO-client';
import  socket from '../../assets/socketService.js'
import { CheckBoxes, useCheckBoxes, useMesure } from '../wrappers/contexts';
import { clooner } from '../accueil';

const InputRange = ({machine,reservoir,results,render}) => {
  const {currentUser,clooned} = useSelector((state) => {
    const currentUser=state.user.currentUser;
    const clooned=state.actived.clooned;
    return {currentUser,clooned};
  });
  const currentUserId=currentUser?currentUser.id:null;
  // =============  donnees à extraire ailleurs =========================
   const {marges}={marges:{down:0.20,up:0.05}}
  // ====================================================================
  const {identification,grandeurs}=results;
  const {ph}=grandeurs;
  const {nom,couleur,parfum,categorie}=identification;const {codor}=couleur;
  
  const {min,max,moy}=nombers(ph.normes);
  function valeurs_recurentes(){
    var vRecurentes=[];var itm=moy-0.05;
    while (itm<=max) {
      vRecurentes.push(itm);
      itm+=0.05;
    }
    return vRecurentes;
  }
  const [value, setValue] = useState(moy);
  const [buttonParams,setButtonParams]=useState({color:'blue',text:'Save',able:true,});

  const {isCodorConforme,isColor,isOdor}=useConformite();

  const [dor,setDor]=useState(true);
  const [lor,setLor]=useState(true);
  const [ob,setOb]=useState({machine:machine,nom:nom,rerservoir:reservoir,ph:moy,parfum:'C',color:lor?'C':'NC',categorie:categorie});

  function APPRECIATIONS(){
    const lPh=value<min?'Ph Low':"";
    const hPh=value>max?'Ph High':"";
    const c=!lor?' & Couleur non conforme':"";
    const o=!dor?' & Parfum non conforme':"";
    const appreciations=lPh+hPh+c+o;
    return appreciations===""?"RAS":appreciations;
  }
  const handleOdChange=(boool)=>{
    setOb({...ob,parfum:boool?'C':'NC'});
    setButtonParams({color:'blue',text:'Save',able:true,})
    // setButtonAble(true);
    // setObjet({...objet,[clef]:{...ob,parfum:boool?'C':'NC'}});
  }
  const handleCoChange=(boool)=>{
    setButtonParams({color:'blue',text:'Save',able:true,})
    // setButtonAble(true);
    setOb({...ob,color:boool?'C':'NC'});
    //setObjet({...objet,[clef]:{...ob,color:boool?'C':'NC'}});
  }

  function handleValChange(vl){
    setValue(vl);
    setButtonParams({color:'blue',text:'Save',able:true,});
    setOb({...ob,ph:vl});
  }
  const onHandlePressUp=() => {
    let nouvelle_valeur=value+0.05;
    handleValChange(nouvelle_valeur);

  }
  const onHandlePressDown=() => {
    let nouvelle_valeur=value-0.05;
    handleValChange(nouvelle_valeur);
  }

  useEffect(() => {
    // const socket = io(SOCKET_SERVER_URL,{
    //   transports: ["websocket"],
    //   reconnection: true,
    //   reconnectionAttempts: 5, // Nombre de tentatives avant échec
    //   reconnectionDelay: 3000,
    // });
    // Écoute les événements du serveur
    socket.on('analyseAdded', (data) => {
      console.log('Nouvelle analyse ajoutée:', data);
    });

    socket.on('analyseDeleted', (data) => {
      console.log('Analyse supprimée:', data);
    });

    socket.on('analyseUpdated', (data) => {
      console.log('Analyse mise à jour:', data);
    });

    // Nettoyage à la fermeture du composant
    return () => {
      socket.disconnect();
    };
  }, []);
const stepColor='rgba(0,0,0,0.7)';

  return <View style={styles.container1}>
    <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'transparent',position:'absolute',margin:0,padding:10,top:-15,left:-15,}} onPress={()=>render()}>
      <Text style={{fontSize:8,textAlign:'center'}}>❌</Text>
    </TouchableOpacity>

    <View style={styles.machine_reservoir}>
      <Text
        style={{height:40,width:'fit-content',fontSize:12,fontWeight:'bold',textAlign:'left',marginHorizontal:7,}}
      >
        {machine+'   '+(clooned?clooner(nom):nom)+'  '+reservoir+'   '+ob.ph.toFixed(2)+'     '+ob.parfum+'     '+ob.color+'     '+ob.categorie}

      </Text>
    </View>

    <View style={{width:'100%',maxHeight:75,padding:4,backgroundColor:'#FFFFFF',borderWidth:1,borderStyle:'solid',borderColor:'green',borderRadius:10,flex:1,flexDirection:'column',alignItems:'center',}}>
      <View style={{width:'80%',flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:-8,marginTop:-8,}}>
        <Text style={{color:'grey',}}>pH : <Text style={{fontWeight:'bold',fontSize:18,color:isAcceptable({min:min,max:max},marges,value),}}>{value.toFixed(2)}</Text></Text>
        <Txt text={parfum.codor}><Checkbox status={dor?'checked':'unchecked'} onPress={(e)=>{setDor(!dor);isOdor(e.target.value);handleOdChange(!dor)}}/></Txt>
        <Txt text="Color"><Checkbox status={lor?'checked':'unchecked'}  onPress={(e)=>{setLor(!lor);isColor(e.target.value);handleCoChange(!lor)}}/></Txt>
      </View>
      <View style={{...styles.container2,backgroundColor:codor,}}>
        <View style={styles.container3}>
          <Text style={{color:stepColor,}}>5</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>6</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,fontWeigth:'bold',}}>7</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>8</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>9</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>10</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>11</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>12</Text>
          <Text style={{color:stepColor,}}>.</Text>
          <Text style={{color:stepColor,}}>13</Text>
        </View>
        <View style={styles.iconsSlider}>
          <TouchableOpacity onPress={onHandlePressDown}>
            <Icon name="chevron-left" size={30} color="#900"/>
          </TouchableOpacity>
          <Slider
            style={{width:'84%', height:40,}}
            maximumValue={13}
            minimumValue={5}
            step={0.05}
            // thumbTouchSize={{width:40,height:40,}}
            tapToSeek={true}
            trackStyle={{height:8,borderRadius:4,}}
            thumbImage={require('../../assets/images/hdThumbs-solid/thumb-ph.png')}
            // minimumTrackStyle={{backgroundColor:'green',}}
            // maximumTrackStyle={{backgroundColor:'red',}}
            value={value}
            onValueChange={handleValChange}
            minimumTrackTintColor={isAcceptable({min:min,max:max},marges,value)}
            maximumTrackTintColor="#00FFFF"
            thumbTintColor={isAcceptable({min:min,max:max},marges,value)}
          />
          <TouchableOpacity onPress={onHandlePressUp}>
            <Icon name="chevron-right" size={30} color="#900"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={styles.commentContainer}>
      {((value<min) && <Text style={{width:'30%',}}>Ph Low</Text>) ||((value>max) && <Text style={{width:'30%',}}>Ph High</Text>)}
      {!lor && <Text style={{width:'30%',}}>Couleur non conforme</Text>}
      {!dor && <Text style={{width:'30%',}}>Parfum non conforme</Text>}
      <CheckBoxes defaultValeur={moy}>
        <Valeurs_frequentes valeurs={valeurs_recurentes()} /*defaultValeur={moy}*/ render={(n)=>handleValChange(n)}/>
      </CheckBoxes>
    </View>
    {currentUserId && <Bouton reqBody={{
          machine:machine,
          categorie:categorie,
          name:nom,
          reservoir:reservoir,
          ph:ob.ph.toFixed(2),
          parfum:ob.parfum,
          color:ob.color,
          observations:APPRECIATIONS(),
          UtilisateurId:currentUserId //1
        }}
        registrable={true}
        render={(o)=>setButtonParams(o)}
        buttonParams={buttonParams}
    />}
  </View>
};

const Txt=({text,children})=>{
  return <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:0,pading:0,}}>
    <Text style={{color:'grey',}}>{text}</Text>
    {children}
  </View>
}

function Valeurs_frequentes({valeurs,render}){
    const {checkedParam,setCheckedParam}=useCheckBoxes();
    useMemo(()=>{render(/*val*/checkedParam.val);},[/*val*/checkedParam])

    return <View style={{height:'1rem',paddingVertical:0,marginVertical:0,paddingHorizontal:'0.2rem',minWidth:'60%',...Flex('row','center','flex-start'),gap:'0.1rem',}}>
        {valeurs.map((valeur,index)=><V_component key={index} checked={valeur===/*val*/checkedParam.val} valeur={valeur} render={(obj)=>/*setValeur*/setCheckedParam(obj)}/>)}
    </View>
}
const V_component=({checked,valeur,render})=>{
  const {setCheckedParam}=useCheckBoxes();
  const [v,setV]=useState(checked);
  useMemo(()=>{if(checked){setV(!v);render({bool:checked,val:valeur});}else{setV(false);}},[checked])

  return <View style={{...Flex('column','flex-start','center'),marginVertical:-3,/*'-5px',*/}}>
    <Text style={{letterSpacing:-1.9,/*'1px',*/fontWeight:'bold',/*marginVertical:-6,/*'-6px',*/marginBottom:-10,color:'white',}}>{valeur.toFixed(2)}</Text>
    <Checkbox status={v?'checked':'unchecked'} /*style={{height:30,}}*/ onPress={()=>{setCheckedParam({bool:!v,val:valeur})/*;handleVChange()*/}}/>
  </View>
}

const styles = StyleSheet.create(styleRange);

export default InputRange;
