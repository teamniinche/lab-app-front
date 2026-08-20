import {useState,useMemo,useLayoutEffect} from 'react';
import { View ,Text,TouchableOpacity,ActivityIndicator, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector,useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import {dbBaseRoot} from '../assets/constantes';
import {
    JsonTree,
    ADD_DELTA_TYPE,
    REMOVE_DELTA_TYPE,
    UPDATE_DELTA_TYPE,
    DATA_TYPES,
    INPUT_USAGE_TYPES,
} from 'react-editable-json-tree';
import JSONTree from '@sishuguojixuefu/react-native-json-tree';
// import { Lansas } from '../iterables';
import WinDim from '../assets/operatingData';
const {isWeb}=WinDim;
// import liquidesNormes from '../assets/liquidesNormes';
import { setNormes} from './store/reducers/normesPowder';
import { Flex } from '../assets/functions';

const NormesJavel=({dnnees})=>{
    const dispatch=useDispatch();
    const storage=isWeb?localStorage:AsyncStorage;
    const theme=storage.getItem('isLight') || false;
    var {user,normes,javelNormes,formulesJavelNormes}=useSelector(state=>{
            const user=state.user.targetUser
            const normes=state.normes.targetNormes;
            const javelNormes=state.javelNormes.javelNormes;
            const formulesJavelNormes=state.javelNormes.formulesJavelNormes;

            return {user:user,normes:normes,javelNormes:javelNormes,formulesJavelNormes:formulesJavelNormes}
        });
    const userIsAdmin=user?user.isAdmin:false;
    // const format=dnnees?.format;
    const KEY=dnnees?.name.split(' ').join('_').toLowerCase();// kKEY est pris de dnnees pris du mappage
    // const itemFormule=format && formulesJavelNormes.filter(formul=>formul.name===dnnees?.name)[0];
    const normesItem=KEY===""?dnnees:javelNormes[KEY];
    // var user=useSelector(state=>state.user.targetUser);
    const btnLabel=storage.getItem('buttonJavelLabel') || 'Save';
    // const [fullData,setFullData]=useState({});
    const [isLight,setIslight]=useState(theme);
    const [donnees,setDonnees]=useState(normesItem);// on s est servi de KEY pour atteindre le json du produit en question dans les normesPowder du store: element de linitialisation
    const [buttonJavelLabel,setButtonJavelLabel]=useState(btnLabel);
    const [loading,setLoading]=useState(false);
    const [fetching,setFetching]=useState(false);
    const [fullyData,setFullyData]=useState({});
    const [ticket,setTicket]=useState(null);
    const [User,setUser]=useState({});
    // const {trace,formatTrace}=useTraces({});
    const promiseSave=()=> new Promise((resolve,reject)=>{
        const success= true;//simulation de la reponse du serveur
        if(success){
        setTimeout(()=>{
            resolve('✅ Normes updated');
        },2000)}else{
            reject('❌ Error');
        }
    })
    function handleSave(){
        setLoading(true);
        promiseSave().then((message)=>{
            dispatch(setJavelNormes({[KEY]:donnees,...javelNormes}));// puis on a patche dans le store
            setButtonJavelLabel(message);
            storage.setItem('buttonJavelLabel',message);
        })
        .catch((error)=>{
            setButtonJavelLabel(error);
            storage.setItem('buttonJavelLabel',error);
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    useMemo(()=>{
        if(ticket!==null){
            setDonnees(fullyData);
            setButtonJavelLabel('To save');
        }
    },[ticket]);
    const handleThemeChange=() => {
        if(isWeb){
            storage.setItem('isLight',!isLight);
            setIslight(!isLight);
        }else{
            alert('Work only on web platform');
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

    return <View style={{maxHeight:Platform.OS===('web' || 'window' || 'macos')?'75vh':1300,height:Platform.OS===('web' || 'window' || 'macos')?'70vh':'220%',overflowY:'scroll',
    padding:'12px',width:'100%',
    paddingHorizontal:Platform.OS===('web' || 'window' || 'macos')?'50px':20,
    backgroundColor:bkgColor,
    paddingLeft:Platform.OS===('web' || 'window' || 'macos') && "20%",
    paddingTop:Platform.OS===('web' || 'window' || 'macos')?'50px':80,
    borderRadius:8,
    }}>

        {
            Platform.OS===('web' || 'window' || 'macos')?
                fetching?<ActivityIndicator size="large" color={isLight?'grey':'white'} />:
                <JsonTree
                    data={donnees}
                    readOnly={user?!user.isAdmin:true}
                    onFullyUpdate={(data)=>setFullyData(data)}
                    onDeltaUpdate={(data)=>{
                        const {keyPath,key,newValue,oldValue}=data;
                        const t=key+oldValue+newValue;
                            if(confirm(`Vous modifiez  ${key.toUpperCase()} de ${oldValue.toUpperCase()} à ${newValue.toUpperCase()} ❗`)){
                            setTicket(t);
                        }else{setFullyData(donnees)}
                    }}//alert(data.keyPath)
                    beforeRemoveAction={() => new Promise((resolve, reject) => {reject("")})}
                />
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


        <View style={{
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

        }}>
        
            <TouchableOpacity style={{backgroundColor:'transparent',padding:8,paddingHorizontal:24,borderRadius:8,}}  onPress={handleThemeChange}>
                <Text style={{color:'transparent',}}>
                    <FontAwesome name={isLight?"moon-o":"sun-o"} size={15} color={isLight?"black":"white"}/>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={!userIsAdmin || buttonJavelLabel==='✅ Normes updated'} style={{backgroundColor:disabledColor,padding:8,paddingHorizontal:24,borderRadius:8,}}  onPress={() => handleSave()}>
            <Text style={{color:!userIsAdmin?'grey':bkgColor,fontWeight:'bold',}}>{loading?<Text><ActivityIndicator size="small" color={isLight?'white':'grey'} /> saving</Text>:buttonJavelLabel}</Text>
            </TouchableOpacity>
        </View>

        <View style={{
                        position:'absolute',bottom:5,right:15,
                        ...Flex('column','center','flex-start'), gap:2,
                        backgroundColor:'transparent',
                        paddingHorizontal:6,
                        paddingVertical:6,
                        height:Platform.OS===('web' || 'window' || 'macos')?'fit-content' : '100%',
                        width:Platform.OS===('web' || 'window' || 'macos')?'fit-content' : '100%',

        }}>
            <Text style={{color:textColor,}}>Last Update : {User.updatedAt && User.updatedAt.split('Z')[0]}</Text>
            <Text style={{color:textColor,}}>By : {User.user && User.user.fName+' '+User.user.lName}</Text>
        </View>
</View>
}

export default NormesJavel;