// CALLED PACKAGES
import { View ,Text,TouchableOpacity,ActivityIndicator, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useMemo,useLayoutEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import {
    JsonTree,
    ADD_DELTA_TYPE,
    REMOVE_DELTA_TYPE,
    UPDATE_DELTA_TYPE,
    DATA_TYPES,
    INPUT_USAGE_TYPES,
} from 'react-editable-json-tree';
import JSONTree from '@sishuguojixuefu/react-native-json-tree';
// DATA STATEMENTS
import { setNormes,setFormulesNormes} from './store/reducers/normesPowder';
import { useFormules, usePopup } from './wrappers/contexts';
import { Time,DateString } from '../hooks/littleBiblio';
import {dbBaseRoot} from '../assets/constantes';
import WinDim from '../assets/operatingData';
// import Pop from './popup';
// UTILLS
import { Flex,allowTo,isFormule } from '../assets/functions';
import { paramsAreValid } from '../iterables';

const {isWeb}=WinDim;
export const UpdateItems = async ({body,url,token}) => {
    const returnedData=await fetch(dbBaseRoot + url, {
                        method: "PUT",
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body:body
                    })
            .then((response)=>response.json())
            .then(data=>{return {"ok":true,data:data}})
            .catch(function(error){return {ok:false,data:error.message}})
        return new Promise((resolve, reject) => {
            if (returnedData.ok) {
                resolve(returnedData.data);
            } else {
                reject("Erreur : "+returnedData.data);
            }
        });
    };

const NormesPowder=()=>{
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    const storage=isWeb?localStorage:AsyncStorage;
    const theme=storage.getItem('isLight') || false;
    const dnnees=JSON.parse(storage.getItem('initialData'));// Le fait de passer directement par le Context (useFormules) bloque le Json Tree. Alors on a passe par le localStorage ou AsyncTorage
    const KEY=dnnees?.name.split(' ').join('_').toLowerCase();// KEY est pris de dnnees pris du mappage
    var {user,normes,powderNormes,formulesNormes,formuleUser,lansaUser}=useSelector(state=>{
            const user=state.user.targetUser
            const normes=state.normes.targetNormes;
            const normesPowder=state.powderNormes.powderNormes;
            const formulesNormesPowder=state.powderNormes.formulesNormes;
            const formuleUser={user:formulesNormesPowder.Utilisateur,updatedAt:formulesNormesPowder.updatedAt};
            const lansaUser={user:normesPowder.Utilisateur,updatedAt:normesPowder.updatedAt};
            return {user:user,normes:normes,powderNormes:normesPowder,formulesNormes:formulesNormesPowder,formuleUser:formuleUser,lansaUser:lansaUser}
        });
    const usr=isFormule(dnnees).estFormule?formuleUser:lansaUser;
    const userIsAdmin=user?user.isAdmin:false;
    const btnLabel=storage.getItem('buttonPowderLabel') || 'Save';
    const [isLight,setIslight]=useState(theme);
    const [donnees,setDonnees]=useState(dnnees);//normesItem on s est servi de KEY pour atteindre le json du produit en question dans les normesPowder du store: element de linitialisation
    const [buttonPowderLabel,setButtonPowderLabel]=useState(btnLabel);
    const [loading,setLoading]=useState(false);
    const [fetching,setFetching]=useState(false);
    const [User,setUser]=useState(usr);

    const handleThemeChange=() => {
        if(isWeb){
            storage.setItem('isLight',!isLight);
            setIslight(!isLight);
        }else{
            setPop({show:true,message:'Work only on web platform',code:'#880000'});
        }
    }
    const bkgColor=isLight?'whitesmoke':'rgba(0,0,0,0.9)';
    const textColor=isLight?'rgba(0,0,0,0.9)':'whitesmoke';
    const disabledColor=userIsAdmin?textColor:'rgba(100,100,100,0.6)';

    const thme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};
function saveNormes(){
    if(!allowTo("modifier une norme",targetUser?.privileges)){
        setPop({show:true,message:"Vous n'êtes pas habileté à modifier les normes.",code:"#880000"});
        return;
    }
    const {name,nom,parfum}=donnees;
    const isRegistrable=paramsAreValid(donnees)
    if(!isRegistrable){alert("** Name ** is required and must be valid.\nAnd if ** Nom ** , that must be defined.\n And others inputs must be numerics.");
    return};
    setLoading(true);
    const NEW_KEY=donnees?.name.split(' ').join('_').toLowerCase();
    if(nom && parfum){
        const rest=formulesNormes.data.arr.filter(it=>it.nom!==nom);
        // fetch(dbBaseRoot + "formules/normes/update-normes", {
        //                 method: "PUT",
        //                 headers: { 'Content-Type': 'application/json' },
        //                 body:JSON.stringify({data:{arr:[...rest,donnees]},UtilisateurId:1})
        //             })
        //     .then((response)=>response.json())
            UpdateItems({
                body:JSON.stringify({data:{arr:[...rest,donnees]},UtilisateurId:user?.id}),
                url:"formules/normes/update-normes",
                token:user.token
            })
            .then((updatedFormules)=>{
            const {code,data,message}=updatedFormules;
            dispatch(setFormulesNormes(data));
            setButtonPowderLabel(message);
            storage.setItem('buttonPowderLabel',message);
            setLoading(false);
            const toPop=code==='green'?
                                {show:true,message:"Normes-Poudre mises à jour avec succes.",code:code}
                                :
                                {show:true,message:"Erreur lors de la mise à jour de normes-Poudre."+error.message,code:'#880000'}
            setPop(toPop);
            })
            .catch((error)=>{
                console.log(error.error);
                setButtonPowderLabel(error.message);
                storage.setItem('buttonPowderLabel',error.message);
                setPop({show:true,message:"Erreur lors de la mise à jour de normes-Poudre."+error.message,code:'#880000'});
            })
            .finally(()=>{
                setLoading(false);
            })
    }else{
        const NEW_KEY=donnees.name.split(' ').join('_').toLowerCase();
        const {data}=powderNormes;
        // fetch(dbBaseRoot + "poudre/normes/update-normes", {
        //                 method: "PUT",
        //                 headers: { 'Content-Type': 'application/json' },
        //                 body:JSON.stringify({data:{...data,[NEW_KEY]:donnees},UtilisareurId:1})
        //             })
        //     .then((response)=>response.json())
            UpdateItems({
                body:JSON.stringify({data:{...data,[NEW_KEY]:donnees},UtilisateurId:user?.id}),
                url:"poudre/normes/update-normes",
                token:user.token
            })
            .then((dat)=>{
            const {code,message,data}=dat;
            dispatch(setNormes(data));
            setButtonPowderLabel(message);
            storage.setItem('buttonPowderLabel',message);
            setLoading(false);
            const toPop=code==='green'?
                                {show:true,message:"Normes-Poudre mises à jour avec succes.",code:code}
                                :
                                {show:true,message:"Erreur lors de la mise à jour de normes-Poudre."+error.message,code:'#880000'}
            setPop(toPop);
            })
            .catch((error)=>{
                setButtonPowderLabel(error.message);
                storage.setItem('buttonPowderLabel',error.message);
                setPop({show:true,message:"Erreur lors de la mise à jour de normes-Poudre."+error.message,code:'#880000'});

            })
            .finally(()=>{
                setLoading(false);
            })
    }
}

 
const handleFullyUpdate = (newData) => {
    if(!allowTo("modifier une norme",user?.privileges)){
        setPop({show:true,message:"Vous n'êtes pas habileté à modifier les normes.",code:'#880000'});
        return;
    }
    setDonnees(newData);setButtonPowderLabel('To save');};
const handleDeltaUpdate = (delta) => {};

    return <View style={{maxHeight:Platform.OS===('web' || 'window' || 'macos')?'75vh':1300,height:Platform.OS===('web' || 'window' || 'macos')?'70vh':'220%',overflowY:'scroll',
    padding:'12px',width:'100%',
    paddingHorizontal:Platform.OS===('web' || 'window' || 'macos')?'50px':20,
    backgroundColor:bkgColor,
    paddingLeft:Platform.OS===('web' || 'window' || 'macos') && "20%",
    paddingTop:Platform.OS===('web' || 'window' || 'macos')?'50px':80,
    borderRadius:8,
    }}>

        {
            Platform.OS===('web' || 'window' || 'macos')?(
                fetching?<ActivityIndicator size="large" color={isLight?'grey':'white'} />:
                <JsonTree
                    data={donnees}
                    readOnly={false}//user?!user.isAdmin:true
                    onFullyUpdate={handleFullyUpdate}
                    onDeltaUpdate={handleDeltaUpdate}
                    beforeRemoveAction={() => new Promise((resolve, reject) => {reject("")})}
                />
                
                       
            )
            :
            <JSONTree
                data={donnees}
                theme={{
                            extend: thme,
                            valueLabel: {
                                textDecoration: 'underline'
                            },
                            nestedNodeLabel: ({ style }, nodeType, expanded) => ({
                                style: {
                                ...style,
                                textTransform: expanded ? 'lowercase' : style.textTransform
                                }
                            })
                            }
                        }
                getItemString={(type, data, itemType, itemString) => <Text>{itemType} {itemString}</Text>}
            />
        }


        <View
            style={{
                        position:'absolute',top:15,right:15,
                        ...Flex('row','center','center'), gap:6,
                        backgroundColor:'transparent',
                        borderRadius:15,
                        paddingHorizontal:6,
                        paddingVertical:6,
                        height:'fit-content',
                        width:'fit-content',
                        borderWidth:1,
                        borderStyle:'solid',
                        borderColor:textColor,
            }
        }>
        
            <TouchableOpacity style={{backgroundColor:'transparent',padding:8,paddingHorizontal:24,borderRadius:8,}}  onPress={handleThemeChange}>
                <Text style={{color:'transparent',}}>
                    <FontAwesome name={isLight?"moon-o":"sun-o"} size={15} color={isLight?"black":"white"}/>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={!userIsAdmin || buttonPowderLabel==='✅ Normes updated'} style={{backgroundColor:disabledColor,padding:8,paddingHorizontal:24,borderRadius:8,}}  onPress={() => saveNormes()}>
            <Text style={{color:!userIsAdmin?'grey':bkgColor,fontWeight:'bold',}}>{loading?<Text><ActivityIndicator size="small" color={isLight?'white':'grey'} /> saving</Text>:buttonPowderLabel}</Text>
            </TouchableOpacity>
        </View>

        <View 
        style={{
                        position:'absolute',bottom:5,right:15,
                        ...Flex('column','center','flex-start'), gap:2,
                        backgroundColor:'transparent',
                        paddingHorizontal:6,
                        paddingVertical:6,
                        height:Platform.OS===('web' || 'window' || 'macos')?'fit-content' : '100%',
                        width:Platform.OS===('web' || 'window' || 'macos')?'fit-content' : '100%',

        }
        }>
            <Text style={{color:textColor,}}><Txt txt="Last Update : on "/>{DateString(User.updatedAt || "2026-06-09T11:53:49.037Z")}<Txt txt=" at "/>{Time(User.updatedAt || "2026-06-09T11:53:49.037Z")/*User.updatedAt && User.updatedAt.split('Z')[0]*/}</Text>
            <Text style={{color:textColor,}}><Txt txt="By : "/>{User.user && User.user.fName+' '+User.user.lName}</Text>
        </View>
        {/* <Pop/> */}
</View>
}

const Txt=({txt,textColor})=><Text style={{color:'grey'}}>{txt}</Text>;

export default NormesPowder;