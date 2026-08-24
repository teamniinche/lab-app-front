import React, {useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCurrentProducted} from './wrappers/contexts';


const Entete=({thisEntete,donnees,headers,render})=>{
  const {observations,actions,...rest}=headers;
  // 1. États pour stocker la colonne active et le sens du tri
  const {entete,setEntete,directionTri, setDirectionTri}=useCurrentProducted();

  // 2. Fonction déclenchée au clic sur une en-tête
  const gererTri = (cleColonne) => {
    const entte=cleColonne==='heure'?'createdAt':(cleColonne==='chimiste'?'utilisateur':cleColonne);
    if (entete === entte) {
      // Si on reclique sur la même colonne, on inverse le sens
      setDirectionTri(directionTri === 'asc' ? 'desc' : 'asc');
    } else {
      // Si on clique sur une nouvelle colonne, on trie en 'asc' par défaut
      setEntete(entte);
      setDirectionTri('asc');
    }
  };

  // 3. Tri des données en temps réel (optimisé avec useMemo)
  const donneesTriees = useMemo(() => {
    const copieDonnees = [...donnees];
    const entte=entete==='heure'?'createdAt':(entete==='chimiste'?'utilisateur':entete);
    return copieDonnees.sort((a, b) => {
      if(entte==='utilisateur'){
        if (a[entte]['pseudo'] < b[entte]['pseudo']) return directionTri === 'asc' ? -1 : 1;
        if (a[entte]['pseudo'] > b[entte]['pseudo']) return directionTri === 'asc' ? 1 : -1;
      }else{
        if (a[entte] < b[entte]) return directionTri === 'asc' ? -1 : 1;
        if (a[entte] > b[entte]) return directionTri === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [entete, directionTri]);

  useEffect(()=>{
    render(donneesTriees);
  },[entete])
  // 4. Composant pour afficher l'icône de la flèche de manière dynamique
  const RendreFleche = ({ cleColonne }) => {
    if (entete !== cleColonne) return null; // Pas de flèche si ce n'est pas la colonne active
    return <View style={{alignContent:'center',borderRadius:8,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#6200ee',height:20,width:15,marginLeft:4}}>
        <MaterialCommunityIcons 
          name={directionTri === 'asc' ? 'arrow-up' : 'arrow-down'} 
          size={16} 
          color="#ffffff" 
          style={styles.icone}
        />
    </View>;
  };

  return !Object.keys(rest).inludes(thisEntete)?<TouchableOpacity style={styles.enTeteCell} onPress={() => gererTri(thisEntete)}>
          <Text style={styles.enTeteTexte}>{thisEntete.toUpperCase()}</Text>
          <RendreFleche cleColonne={thisEntete} />
        </TouchableOpacity>:null
}

const styles = StyleSheet.create({
    enTeteCell: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    enTeteTexte: { fontWeight: 'bold', fontSize: 12 },
    icone: { margin:'auto'},
});

export default Entete;