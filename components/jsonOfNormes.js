import {useState,useLayoutEffect} from 'react';
import { View ,Text,TouchableOpacity,ActivityIndicator, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector,useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
// import Pop from './popup';
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
import { Time,DateString } from '../hooks/littleBiblio';
// import liquidesNormes from '../assets/liquidesNormes';
import { setNormes,unSetNormes } from './store/reducers/normesReducer';
import { Flex,allowTo } from '../assets/functions';
import { usePopup } from './wrappers/contexts';

const Normes=()=>{
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    const storage=Platform.OS===('web' || 'window' || 'macos')?localStorage:AsyncStorage;
    const theme=storage.getItem('isLight') || false;
    var {user,normes}=useSelector(state=>{
            const user=state.user.targetUser
            const normes=state.normes.targetNormes;
            return {user:user,normes:normes}
        });
    // var user=useSelector(state=>state.user.targetUser);
    const userIsAdmin=user?user.isAdmin:false;
    const btnLabel=storage.getItem('buttonLabel') || 'Save';
    // const [fullData,setFullData]=useState({});
    const [isLight,setIslight]=useState(theme);
    const [donnees,setDonnees]=useState({});
    const [buttonLabel,setButtonLabel]=useState(btnLabel);
    const [loading,setLoading]=useState(false);
    const [fetching,setFetching]=useState(false);
    const [User,setUser]=useState({});
    // const {trace,formatTrace}=useTraces({});
    function handleSave(){
        if(!allowTo("modifier une norme",user?.privileges)){
            setPop({show:true,message:"Vous n'êtes pas habileté à modifier les normes.",code:'#880000'});
            return;
        }
        setLoading(true);
        fetch(dbBaseRoot+'normes/update-normes', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}` 
            },
            body: JSON.stringify({UtilisateurId:user?.id,data:/*liquidesNormes*/donnees})
          })
            .then(response => response.json())
            .then(dat =>{
                const {code,message}=dat;
                const toPop=code==="green"?
                {show:true,message:"Normes-liquides mis à jour avec succes.",code:code}
                :
                {show:true,message:"Erreur lors de la mise à jour des Normes-liquides :"+message,code:'#880000'}
                setButtonLabel(message);
                storage.setItem('buttonLabel',message);
                dispatch(unSetNormes());
                setPop(toPop);
            })
            .finally(
                ()=>{setLoading(false)}
            )
    }

    const handleThemeChange=() => {
        if(Platform.OS===('web' || 'window' || 'macos')){
            storage.setItem('isLight',!isLight);
            setIslight(!isLight);
        }else{
            setPop({show:true,message:'Work only on web platform',code:'#880000'});
        }
    }
    const bkgColor=isLight?'whitesmoke':'rgba(0,0,0,0.9)';
    const textColor=isLight?'rgba(0,0,0,0.9)':'whitesmoke';
    const disabledColor=userIsAdmin?textColor:'rgba(100,100,100,0.6)';

    useLayoutEffect(()=>{
        // setDonnees(liquidesNormes);
        const GetLocalNormes=(dt) =>{
// console.log("GetLocalNormes",donnees)

                // const isValid = dt.data && Object.keys(dt.data).length !== 0;
                // setDonnees(isValid ? dt.data : liquidesNormes);
                const {Utilisateur,updatedAt,data}=dt.data;
                setUser({user:Utilisateur,updatedAt:updatedAt})
                // const gp=data.noura_lave_vitre;const newData={...data,get_tol:gp}
                setDonnees(/*liquidesNormes*/data);
            }
        const FetchNormes=()=>{
            setFetching(true);
            fetch(dbBaseRoot+'normes/get-normes', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(dt =>{
                // console.log("FetchNormes",dt)
                // const isValid = dt.data && Object.keys(dt.data).length !== 0;
                // setDonnees(isValid ? dt.data : liquidesNormes);
                const {Utilisateur,updatedAt,data}=dt.data;
                setUser({user:Utilisateur,updatedAt:updatedAt})
                // const gp=data.noura_lave_vitre;const newData={...data,get_tol:gp}
                setDonnees(/*liquidesNormes*/data);
                dispatch(setNormes(dt));

            })
            .finally(()=>setFetching(false))
            }
            // console.log(normes)
        if(normes!==null){GetLocalNormes(normes);}else{FetchNormes();}
    },[])

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
const isLarge=Platform.OS===('web' || 'window' || 'macos');

    return <View style={{maxHeight:isLarge?'75vh':1300,height:isLarge?'70vh':'220%',overflowY:'scroll',
    padding:'12px',width:isLarge?'80%':"100%",
    paddingHorizontal:isLarge?'50px':20,
    backgroundColor:bkgColor,
    paddingTop:isLarge?'50px':80,
    borderRadius:8,
    marginHorizontal:"auto",
    marginTop:isLarge && 15,
    }}>

        {
            Platform.OS===('web' || 'window' || 'macos')?(
                fetching?<ActivityIndicator size="large" color={isLight?'grey':'white'} />:
                <JsonTree
                    data={donnees}
                    readOnly={user?!user.isAdmin:true}
                    onFullyUpdate={(data)=>{
                        if(!allowTo("modifier une norme",user?.privileges)){
                            setPop({show:true,message:"Vous n'êtes pas habileté à modifier les normes.",code:'#880000'});
                            return;
                        }
                        setDonnees(data);setButtonLabel('To save');}}
                    onDeltaUpdate={(data)=>null}
                    beforeRemoveAction={() => new Promise((resolve, reject) => {reject("")})}
                />)
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
            <TouchableOpacity disabled={!userIsAdmin || buttonLabel==='✅ Normes updated'} style={{backgroundColor:disabledColor,padding:8,paddingHorizontal:24,borderRadius:8,}}  onPress={() => handleSave()}>
            <Text style={{color:!userIsAdmin?'grey':bkgColor,fontWeight:'bold',}}>{loading?<Text><ActivityIndicator size="small" color={isLight?'white':'grey'} /> saving</Text>:buttonLabel}</Text>
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
            <Text style={{color:textColor,}}><Txt txt="Last Update : on "/>{DateString(User.updatedAt || "2026-06-09T11:53:49.037Z")}<Txt txt=" at "/>{Time(User.updatedAt || "2026-06-09T11:53:49.037Z")/*User.updatedAt && User.updatedAt.split('Z')[0]*/}</Text>
            <Text style={{color:textColor,}}><Txt txt="By : "/>{User.user && User.user.fName+' '+User.user.lName}</Text>
        </View>
        {/* <Pop/> */}
    </View>
}

const Txt=({txt,textColor})=><Text style={{color:'grey'}}>{txt}</Text>;

// function useTraces(){
//     const [trace,setTrace]=useState({})
//     const  FormatTrace=(traceArray)=>{
//         const tr = traceArray.reduce((acc, current) => acc + '@'+current, 0);
//         const updatedTrace=trace.push(tr);
//         const Trace=updatedTrace.reduce((acc, item) => {
//             acc[item] = item;
//             return acc;
//           }, {});
//         setTrace(Trace);
//     }
//     return {trace:trace,formatTrace:FormatTrace};
// }

export default Normes;