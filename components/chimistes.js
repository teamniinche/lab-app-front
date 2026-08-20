import { useState,useLayoutEffect} from 'react';
import { View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { dbBaseRoot } from '../assets/constantes';
import {Image} from 'expo-image';

// const path=require('../assets/images/d-mera-bleu.png');

export const Chimistes=({navigation})=>{
    // const data=route.params.data;
    const [users,setUsers]=useState([]);
    const usersImages={
        'ndour':require('../assets/images/users-images/ndour.jpg'),
        'default':require('../assets/images/users-images/default.jpg'),
    }
    useLayoutEffect(()=>{
        fetch(dbBaseRoot + "utilisateurs/", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response)=>response.json())
        .then((data)=>{setUsers(data)})//alert(JSON.stringify(data));
        .catch (function(error){
                alert("Erreur lors de la récupération des utilisateurs :", error);
            }
        )
    },[])

    return (<View style={styles.contaner}>
        {users.map((user,index)=>{
            const path=usersImages[user.pseudo]?usersImages[user.pseudo]:usersImages['default'];
            return <TouchableOpacity key={index} style={styles.operateur}
            onPress={() =>navigation.navigate('analyse/choix_des_reservoirs')}
        >
            <Image source={path} width={80} height={70} style={styles.image}/>
            <Text style={styles.imageTitle}>{user.pseudo}</Text>
        </TouchableOpacity>})}
      </View>
       )}

       const styles=StyleSheet.create({
           contaner:{
               flexDirection:'row',
               justifyContent:'flex-start',
               flexWrap:'wrap',
               minHeight:500,
                width:'100%',
                backgroundColor:'white',
                paddingHorizontal:6,
                paddingVertical:15,
           },
           operateur:{
                width:100,
                height:100,
                backgroundColor:'whitesmoke',
                borderWidth:1,
                borderColor:'rgba(0,0,255,0.1)',
                borderRadius:8,
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                padding:15,
                margin:10,
           },
           image:{
                borderRadius:8,
           },
           imageTitle:{
                color:'black',
                fontSize:14,
                fontWeight:'900',
                marginTop:4,
                letterSpacing:2,
            }
       })