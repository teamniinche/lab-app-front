import React, { useState,useEffect } from 'react';
import { View, Text,TouchableOpacity,TouchableWithoutFeedback,Keyboard,StyleSheet } from 'react-native';
import { Checkbox,Divider,Button, Dialog,Chip, Portal, Switch, PaperProvider, TextInput } from 'react-native-paper';
import {useDispatch,useSelector} from 'react-redux';
import { setFormulesNormes,setOne } from './store/reducers/normesPowder';
import { Picker} from '@react-native-picker/picker';
import { Lansas,Parfums,Formats } from '../iterables';
import { primaryColor,dbBaseRoot } from '../assets/constantes';
import { useNFormules,useFormules } from './wrappers/contexts';

const FormuleEdit=()=>{
    const dispatch=useDispatch();
    const {theOne,formulesNormes,token}=useSelector(state=>{
        const {theOne,formulesNormes}=state.powderNormes;
        const token=state.user.targetUser.token;
        return {theOne:theOne,formulesNormes:formulesNormes,token:token}
    });
    const {defaultBuild,allRequiredDefined,build,setBuild,values,nAddItem}=useNFormules();
    const {setFWrapperShow}=useFormules();
    const [nomNFormule,setNomNFormule]=useState("");
    function Builder({key,obj}){const built={...build,[key]:obj};setBuild(built);}
    const handleNomChange=(nom)=>{
        setNomNFormule(nom);
        Builder({key:"nom",obj:nom});
    }
    const handleEnregistrerPress=()=>{
                            if(!allRequiredDefined){
                                const {lansa:undefined,...rest}=build;
                                const newItem={...theOne,...rest,format:values};
                                const {arr}=formulesNormes.data;
                                fetch(dbBaseRoot + "formules/normes/update-normes", {
                                                              method: "PUT",
                                                              headers: { 
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${token}`
                                                                },
                                                              body:JSON.stringify({data:{arr:[...arr,newItem]},UtilisateurId:1})
                                                            })
                                                    .then(response => {
            // Sécurité : On vérifie que le serveur répond un statut valide (200-299)
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde serveur");
            return response.json();
        })
        .then((updatedFormulesNormes) => {
            // Mises à jour d'états et dispatch synchrones
            dispatch(setFormulesNormes(updatedFormulesNormes.data));
            nAddItem(newItem);
            setBuild(defaultBuild);
            setFWrapperShow(false);
        })
        .catch((error) => {
            // 3. CORRECTION: Gestion des erreurs réseau ou serveur
            console.error("Erreur enregistrement:", error);
        });
                                
                            }else{setPop({show:true,message:"Veuillez entrer tous les champs requis !",code:"#880000"});}
                        }
    
            return <View style={{minHeight:650,paddingVertical:30,paddingTop:10,paddingBottom:0,width:"100%",flexDirection:"column",alignItems:"flex-start"}}>
                <View style={{width:"100%",minHeight:570,height:"90%",flexDirection:"row",maxWidth:"100%",flexWrap:"wrap",paddingHorizontal:10,paddingTop:5,paddingBottom:0,gap:"5%"}}>
                <TextInput maxLength={20} placeholder='Specifier le nom systematique de la formule' placeholderTextColor="grey"
                    value={nomNFormule} 
                    onChangeText={(nom)=>handleNomChange(nom)}
                    textAlignVertical='center'
                    selectTextOnFocus={true}
                    style={[styles.picker,{width:"90%",backgroundColor:"#e9e9ed",borderRadius:10,borderWidth:1,borderColor:primaryColor}]}
                />
                <Picker
                    selectedValue={null}
                    mode="dialog"
                    onValueChange={(lnsa) =>{Builder({key:"lansa",obj:lnsa});dispatch(setOne(lnsa))}}
                    style={styles.picker}
                >
                    <Picker.Item key={0} label="Selectionner le LANSA de base" value={null} />
                    {Object.values(Lansas).map((item, index) => {
                    return <Picker.Item key={index} label={item.name} value={item.name} />
                    })}
                </Picker>
                <Picker
                    selectedValue={null}
                    mode="dialog"
                    onValueChange={(prfum) =>Builder({key:"parfum",obj:prfum})}
                    style={styles.picker}
                >
                    <Picker.Item key={0} label="Selectionner le PARFUM" value={null} />
                    {Parfums.map((item,  index) => {
                    return <Picker.Item key={index} label={item} value={item} />
                    })}
                </Picker>
                <PickerMultiple/>
                <CustomSwitch lansa="" label="compression"/>
                <View style={{flexDirection:"row",alignItems:"center",width:"100%",marginVertical:30,marginBottom:0}}>
                    <Divider style={{flex:1}}/>
                    <Text style={{marginHorizontal:20,fontWeight:"bold",fontSize:16}}>Automatique</Text>
                    <Divider style={{flex:1}}/>
                </View>
                <View style={{width:"100%",flexDirection:"column",height:"auto",alignItems:"flex-start",justifyContent:"center",paddingHorizontal:30,paddingTop:0,marginTop:0}}>
                    <Dialogue/>
                    <CustomSwitch lansa={build.lansa} label="percarbonate"/>
                    <CustomSwitch lansa={build.lansa} label="mousses"/>
                </View>

                 </View>

                <TouchableOpacity
                        style={styles.enregistrer}
                        onPress={handleEnregistrerPress}
                >
                    <Text style={styles.enregistrerText}>Enregistrer</Text>
                </TouchableOpacity>

                </View>
}

const PickerMultiple=()=>{
    const {values,noValues,toggleItem,setDialogShow}=useNFormules();

    // "rgb(233, 233, 237)" ="#e9e9ed"
    return <><View style={[styles.picker,{backgroundColor:"rgb(233, 233, 237)",maxHeight:40,borderWidth:1,borderColor:"grey",maxWidth:"65%",width:"auto",flexDirection:"row",overFlowY:"scroll",borderRadius:10,justifyContent:"flex-start",alignItems:"center",gap:5}]} >
            {values.map((value,  index) => <Chip key={index}
                style={styles.chip}
                onClose={()=>toggleItem(value)}
            >{value}</Chip>)}
           {noValues && <Button style={{maxWidth:300,maxHeight:40}} onPress={()=>setDialogShow(true)}>Selectionner les formats</Button>}
            {/* <Dialogue/> */}
        </View>
        </>
}

const CustomSwitch = ({lansa,label}) => {
    const isMoussesOrPerca=["percarbonate","mousses"].includes(label);
    const {build,setBuild}=useNFormules();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => {
        const val=label==="mousses"?isSwitchOn:{min:0,max:300};
        const built={...build,[label]:val};
        setBuild(built);
        setIsSwitchOn(!isSwitchOn);
    };

return <View style={{width:"auto",minHeight:40,flexDirection:"row",gap:10,zIndex:-1,justifyContent:"center",alignItems:"center",}}>
    <Text>{label}</Text>
        <Switch disabled={lansa?.toLowerCase().includes("auto")?false:(isMoussesOrPerca?true:false)} value={isSwitchOn} color={primaryColor} onValueChange={onToggleSwitch} />
    </View>
};

const Dialogue = () => {
    const {toggleItem,selected,dialogShow,setDialogShow}=useNFormules();
    
  return <PaperProvider><View>
        <Portal>
          <Dialog style={{maxWidth:430,minWidth:400,marginHorizontal:"auto",position:"absolute",left:0,zIndex:500}} visible={dialogShow} onDismiss={()=>setDialogShow(false)}>
            <Dialog.Title style={{fontSize:15,color:primaryColor,textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>Cocher les formats</Dialog.Title>
            <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"flex-start",paddingHorizontal:40,height:"auto"}}>
               {
                Formats.map((item,  index) => (
                    <Checkbox.Item
                        key={index}
                        label={item} 
                        style={{maxWidth:70,minWidth:70,fontSize:10,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}
                        onPress={()=>toggleItem(item)}
                        status={selected.includes(item)?"checked":"unchecked"}
                    />
                ))}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>setDialogShow(false)}>Fermer</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View></PaperProvider>
}

const styles=StyleSheet.create({
    picker:{
        width:"40%",
        minHeight:50,
        paddingVertical:20,
        paddingHorizontal:20,
        textAlign:"center",
    },
    chip:{
        width:"auto",
        height:"auto",
        backgroundColor:"white"
    },
    enregistrer:{
        backgroundColor:primaryColor,
        width:"80%",
        minHeight:50,
        alignSelf:"center",
        borderRadius:10,
        alignItems:"center"
    },
    enregistrerText:{
        color:"white",
        fontWeight:"bold",
        margin:"auto",
        alignSelf:"center",
    }
});
export default FormuleEdit;