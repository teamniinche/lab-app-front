import React, { useState } from 'react';
import {View,StyleSheet } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { connect } from '../store/reducers/userReducer';
// import { utilisateurs } from '../../hooks/littleBiblio';
import { Picker } from '@react-native-picker/picker';
import Connect from '../connexion/connect';

const ConnexionState = ({ /*label, options, selectedValue, onValueChange*/ }) => {
    const targetUser = useSelector((state) => state.user.targetUser);
    const {fName,lName}=targetUser?targetUser:{fName:null,lName:null};
    const full_name=fName+ '  '+lName;
    const [selectedValue,setSelectedValue]=useState("");
    const connectOptions=[{label:full_name,value:full_name},{label:'Déconnexion',value:'déconnexion'}];
    const disconnectOptions=[{label:'Se connecter',value:'connexion'},{label:'Je me connecte.',value:'aller se connecter'}];
    const options=targetUser?connectOptions:disconnectOptions;
    const dispatch = useDispatch();
    const [visible,setVisible]=useState(false);
    const onValueChange=(val)=>{
        if(val==='déconnexion'){dispatch(connect(null));
        }else{
            // if(val==='aller se connecter'){setVisible(true);};
            setVisible(true);
            setSelectedValue('Se connecter');
        }
    }
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        mode="dropdown"
        onValueChange={(itemValue) => onValueChange(itemValue)}
        style={styles.picker}
      >
        {options.map((option, index) => {
         return <Picker.Item key={index} label={option.label} value={option.value} />
        })}
      </Picker>
      <Connect visible={visible} render={()=>setVisible(false)}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position:'absolute',
    zIndex:1000,
    width:'100%',
    maxWidth:400,
    height:'100%',
    // border:0,
  },
  picker: {
    height:50,
    backgroundColor: '#f0f0f0',
    borderRadius:10,
    border:0,
    maxHeight:50,
    width:'100%',
    maxWidth:200,
    textAlign:'center',
    color:'green',
  },
});

export default ConnexionState;
