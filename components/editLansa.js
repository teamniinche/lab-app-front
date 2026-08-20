import {useState } from 'react';
import { useSelector } from 'react-redux';
import { View} from 'react-native';
import {useJavelFormules } from './wrappers/contexts';
import NormesPowder from './jsonOfNormesPowder';
import NormesJavel from './jsonOfNormesJavel';

export default LansaEdit=()=>{// il prend l'item du localStorage || AsyncStorage
  return <View style={{flex:1,width:"100%",flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-start",padding:30,gap:20}}>
        <NormesPowder />
    </View>}

export const JavelEdit=()=>{
    const {itemStored}=useJavelFormules();
  return <View style={{flex:1,width:"100%",flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-start",padding:30,gap:20}}>
        <NormesJavel dnnees={itemStored}/> 
    </View>}