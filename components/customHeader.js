import React, {useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCurrentProducted} from './wrappers/contexts';


const Entete=({thisEntete,donnees,render})=>{
  // 1. États pour stocker la colonne active et le sens du tri
  const {entete,setEntete,directionTri, setDirectionTri}=useCurrentProducted();

  // 2. Fonction déclenchée au clic sur une en-tête
  const gererTri = (cleColonne) => {
    if (entete === cleColonne) {
      // Si on reclique sur la même colonne, on inverse le sens
      setDirectionTri(directionTri === 'asc' ? 'desc' : 'asc');
    } else {
      // Si on clique sur une nouvelle colonne, on trie en 'asc' par défaut
      setEntete(cleColonne);
      setDirectionTri('asc');
    }
  };

  // 3. Tri des données en temps réel (optimisé avec useMemo)
  const donneesTriees = useMemo(() => {
    const copieDonnees = [...donnees];
    return copieDonnees.sort((a, b) => {
      if (a[entete] < b[entete]) return directionTri === 'asc' ? -1 : 1;
      if (a[entete] > b[entete]) return directionTri === 'asc' ? 1 : -1;
      return 0;
    });
  }, [entete, directionTri]);

  useEffect(()=>{
    render(donneesTriees);
  },[entete])
  // 4. Composant pour afficher l'icône de la flèche de manière dynamique
  const RendreFleche = ({ cleColonne }) => {
    if (entete !== cleColonne) return null; // Pas de flèche si ce n'est pas la colonne active
    return <View style={{padding:2,alignContent:'center',borderRadius:8,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#6200ee',height:25,width:20,marginLeft:4}}>
        <MaterialCommunityIcons 
          name={directionTri === 'asc' ? 'arrow-up' : 'arrow-down'} 
          size={16} 
          color="#ffffff" 
          style={styles.icone}
        />
    </View>;
  };

  return  <TouchableOpacity style={styles.enTeteCell} onPress={() => gererTri(thisEntete)}>
          <Text style={styles.enTeteTexte}>{thisEntete}</Text>
          <RendreFleche cleColonne={thisEntete} />
        </TouchableOpacity>
}

const styles = StyleSheet.create({
    enTeteCell: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    enTeteTexte: { fontWeight: 'bold', fontSize: 12 },
    icone: { margin:'auto'},
});

export default Entete;