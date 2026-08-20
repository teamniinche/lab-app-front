import { useState } from "react";
import {Text,View,ActivityIndicator,StyleSheet} from 'react-native';
import { useSelector,useDispatch } from "react-redux";
// import Slider from "@react-native-community/slider";
import { Slider } from "@react-native-assets/slider";
import {postUsers} from "./store/reducers/crntReducer";
import { usePopup } from "./wrappers/contexts";
import { dbBaseRoot, niv_privileges,niveaux_privileges,couleurs, primaryColor } from "../assets/constantes";
import {fullNameAndPseudo,allowTo} from "../assets/functions";
// import { Chip } from "react-native-paper";

/**
 * Niveau     ||  Rôle           ||  Couleur conseillée ||  Code Hexadécimal   ||   Signification Visuelle                                              || Pages & Actions permises
 * _______________________________________________________________________________________________________________________________________________________________________________________________
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Niveau 1   ||  Comptable      |  Gris Ardoise Bleuté |  #78909C           |   Neutre, calme, axé sur les tâches de gestion standard.               | Accueil - lecture,impression
 * _______________________________________________________________________________________________________________________________________________________________________________________________
 * Niveau 2   ||  Opérateur      |  Bleu Corporation    |  #2196F3           |   Confiance, clarté, niveau opérationnel de base.                      | Niv 1 + Liquides-Poudre- consulter normes,enregistrer analyse,modifier analyse,commenter
 * _______________________________________________________________________________________________________________________________________________________________________________________________
 * Niveau 3   ||  Chef d'équipe  |  Vert Émeraude       |  #4CAF50           |   Croissance, supervision de terrain, validation locale.               | Niv 2 + definir l'equipe,selectionner|deseclectionner les produits ne cours,valider une valeur incorrecte,supprimer analyse
 * _______________________________________________________________________________________________________________________________________________________________________________________________
 * Niveau 4   ||  Responsable    |  Violet Royal        |  #9C27B0           |   Statut managérial, gestion globale d'un secteur.                     | Niv 2 (sauf modifier nanalyse)+ modifier une norme|user ,suprimer une norme|user,ajouter une norme|user,definir les privilèges d'un utilisateur,valider une valeur incorrecte,
 * _______________________________________________________________________________________________________________________________________________________________________________________________
 * Niveau 5   ||  Admin          |  Orange Ambré        |  #FF9800           |   Alerte, haut niveau de contrôle, modifications critiques.            | tous les niveaux inferieurs 
 * _______________________________________________________________________________________________________________________________________________________________________________________________
 * Niveau 6   ||  Super-Admin    |  Rouge Intense       |  #E53935           |   Pouvoir absolu, accès destructif potentiel (accès base de données).  | acces illimité au front et back
 */


// const couleurs=['#5274ffe9','#2a309dc5','#1dd40cea','#0b6703ee','#b70514eb','#cead36']
export const ToggleUser=({user,render})=>{
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    const {targetUser} = useSelector((state) => state.user);
    const connectedNiv=parseInt(targetUser?.niv.split("_")[1])-1;
    // const allowToUpgrade=connectedNiv && connectedNiv>=4;
    const allowToUpgrade=allowTo("definir les privilèges d'un utilisateur",targetUser?.privileges);
    const isNdour=fullNameAndPseudo(user).toLowerCase().includes("mamadou ndour(ndour)");
    var niv=0;
    if(user.niv){niv=((parseInt(user.niv.split("_")[1])*5)-5);}
    const [nivs,setNivs]=useState(niv);
    const [loading,setLoading]=useState(false);
    const KEY=(allowToUpgrade && !isNdour && (nivs/5)<connectedNiv)?"allowed":"notAllowed";
    
    const updatePrivilege=(valeur)=>{
      var val=valeur;
      const nivTo=val/5;
      const upgradeIsAllowed=nivTo<=connectedNiv;
      if(upgradeIsAllowed){
      setLoading(true);
      setNivs(val);
      const nivToString="can_"+(((val/5)+1));
      const {niv:undefined,...rest}=user;
      const upgradedUser={...rest,niv:nivToString,userId:targetUser.id};
      fetch( dbBaseRoot+"utilisateurs/update/"+user.id,
        {
          method:"PUT",
          headers:{
            'content-type':"application/json",
            'Authorization': `Bearer ${targetUser.token}`

          },
          body:JSON.stringify(upgradedUser)
      })
      .then(response=>response.json())
      .then(data=>{render(data.utilisateurs);dispatch(postUsers(data.utilisateurs));setPop({show:true,message:"Niveau d'acces modifié avec succes.",code:'green'})})
      .catch(function(error){setPop({show:true,message:"Erreur lors du changement de privileges :\n"+error.message,code:'#880000'})})
      .finally(()=>setLoading(false))
    }else{setNivs(connectedNiv*5)}
    }
    return <View style={{width:310,height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      {/* <Chip niv={(nivs/5)} couleur={couleurs[KEY][((nivs/5)-1)]}/> */}
      <Slider
                          style={{minWidth:300,maxWidth:300,minHeight:10,maxHeight:10,paddingHorizontal:20}}
                          maximumValue={25}
                          minimumValue={0}
                          enabled={!loading && !isNdour && connectedNiv!==null && connectedNiv!==undefined && allowToUpgrade && (nivs/5)<connectedNiv}
                          step={5}
                          StepMarker={()=><Text style={{fontSize:6}}>⏺️</Text>}
                          tapToSeek={true}
                          trackStyle={{height:8,borderRadius:4}}
                          value={parseFloat(nivs)}
                          onValueChange={updatePrivilege}
                          thumbTintColor={couleurs[KEY][((nivs/5))]}
                          minimumTrackTintColor={couleurs[KEY][6]}

                          // thumbStyle={{borderColor:"red"}}            // Override the thumb's style
                          // trackStyle={undefined}            // Override the tracks' style
                          // minTrackStyle={undefined}         // Override the tracks' style for the minimum range
                          // maxTrackStyle={undefined}         // Override the tracks' style for the maximum range
                          vertical={false}                  // If true, the slider will be drawn vertically
                          inverted={false}                  // If true, min value will be on the right, and max on the left
                          trackHeight={8}                   // The track's height in pixel
                          thumbSize={25}                    // The thumb's size in pixel
                          // thumbImage={undefined}            // An image that would represent the thumb
                          slideOnTap={true}                 // If true, touching the slider will update it's value. No need to slide the thumb.
                          // onValueChange={undefined}         // Called each time the value changed. Return false to prevent the value from being updated. The type is (value: number) => boolean | void
                          // onSlidingStart={undefined}        // Called when the slider is pressed. The type is (value: number) => void
                          // onSlidingComplete={undefined}     // Called when the press is released. The type is (value: number) => void
                          CustomThumb={()=><Chip niv={(nivs/5)} loading={loading} couleur={couleurs[KEY][((nivs/5))]}/>}           // Provide your own component to render the thumb. The type is a component: ({ value: number }) => JSX.Element
                          // StepMarker={undefined}            // We now use the component from @callstack/slider to preserve the same API. See the documentation [here](https://github.com/callstack/react-native-slider?tab=readme-ov-file#stepmarker). We add "markValue" that holds the value of the current mark instead of the index only.
                          CustomTrack={undefined}  
                        />
        </View>
}

const Chip=({loading,niv,couleur})=>{
  // <View style={{width:300,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
  //   {niv_privileges.map((item,index)=>
  return niv!=5 && <Text 
    // key={index} 
      style={
        {
        color:'white',
        fontSize:12,
        textAlign:'center',
        flexDreiction:'column',
        justifyContent:'center',
        fontWeight:'bold',
        borderRadius:5,
        paddingVertical:2,
        paddingHorizontal:5,
        maxWidth:50,minWidth:50,
        backgroundColor:couleur,//niv===(index+1)?couleur:'transparent',
        height:22
        }
      }>{loading?<ActivityIndicator size={18} color="#ffffff" />:niv_privileges[niv]}</Text>
  // )}{niv===(index+1)?item:""}
  // </View>
}
