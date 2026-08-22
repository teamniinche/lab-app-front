import { useMemo,useEffect,useLayoutEffect,useState,useRef } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet,TouchableWithoutFeedback,Pressable,ActivityIndicator,FlatList, TouchableOpacity } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons';
import { Searchbar,TextInput,Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch,useSelector } from 'react-redux';

import socket from '../assets/socketService';
import { dbBaseRoot,primaryColor,couleurs} from '../assets/constantes'; 
import { Periodes } from '../components/periode';
import { HeaderRight } from './DrawerNavigator';
import { PowderHeaders } from '../components/tables/componentTable';
import Pop,{NewAnalysed} from '../components/popup';
import CustomPoudreDrawerContent from '../components/customPoudreDrawerContent';
import {FormulesProvider,CurrentProductedProvider,useCurrentProducted,useFormules,ItemToSaveProvider, useItemToSave, usePopup } from '../components/wrappers/contexts';
import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
import {InputIsValid,LansaObservations/*,LansaValue,Actions*/,Chariot,/*PowderRow,UpdateLansa,*/Errors,colors} from './DrawerPoudre';
import { setPowderAnalysed } from '../components/store/reducers/powderAnalysesReducer';
import { storeFocusedListe } from '../components/store/reducers/currentProducted';
import { commentsFromObjectToArray,ReduceDateTime,Time } from '../hooks/littleBiblio';
import PoudreAnalysedTab from './poudreTabNavigator';
import WinDim from '../assets/operatingData';
import { Lansas,routesAndHeadersPowder } from '../iterables';
import { styles } from '../components/tables/componentTable';
import { AddPoudreComment } from '../components/buttons/save';
import { ViewOrImgBgPowderWrapper } from '../components/wrappers/viewOrImgWrapper';
import { Comment } from '../components/tables/chat-for-table';
import { AdjentDayInMs} from '../components/periode';
import { isFormule,powdersAndCountsFormat,allowTo} from '../assets/functions';
import Colors from '../assets/colors';
const {aujourdhui,demain}=Periodes();
const {full}=routesAndHeadersPowder;
const {api_url,headers}=full;
const {isLarge,isWeb}=WinDim;
function Flex(dir,jC,aI){
  return {
    display:'flex',
    flexDirection:dir,
    justifyContent:jC,
    alignItems:aI,
  }
}
const Drawer = createDrawerNavigator();
// const colors={ // import de DrawerPoudre
//     "white":{
//         "nom":"Blanc",
//         "color":"rgb(255,255,255)"
//     },
//     "red":{
//         "nom":"Rouge",
//         "color":"rgba(255,0,0,0.4)"
//     },
//     "blue":{
//         "nom":"Bleu",
//         "color":"rgba(0,0,255,0.4)"
//     },
//     "green":{
//         "nom":"Vert",
//         "color":"rgba(0,255,0,0.4)"
//     }

// }

// const Errors = ({visible,render,isMissing,missing}) => { // import de DrwerPoudre
//     const {errors,noErrors}=useItemToSave();
//     const Errors=(isMissing && noErrors)?missing:errors;
//     const errorsLen=Errors.length;
//     return  <Portal>
//           <Dialog style={{maxWidth:700,minWidth:400,marginHorizontal:"auto"}} visible={visible} onDismiss={()=>render()}>
//             <Dialog.Title style={{fontSize:15,color:"red",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>{errorsLen+" invalid input"+(errorsLen>1?"s":"")}</Dialog.Title>
//             <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto"}}>
//               {Errors.map((er,i)=><Text variant="bodyMedium" key={i} style={{marginBottom:20}}>{"🚨 "+er}</Text>)}
//             </Dialog.Content>
//             <Dialog.Actions>
//               <Button onPress={()=>render()}>OK</Button>
//             </Dialog.Actions>
//           </Dialog>
//         </Portal>
// }

const UpdateLansa = ({visible,item}) => {// import de DrawerPoudre
  return<View >
        <Portal>
          <Dialog style={{maxWidth:700,minWidth:400,width:"40%",marginHorizontal:"auto"}} visible={visible} onDismiss={()=>render()}>
                <Dialog.Title style={{fontSize:15,color:"grey",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>{"Mise a jour "+ item.name}</Dialog.Title>
            <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto"}}>
                <PoudreWorkSpace mission="update"/>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>render()}>Enregistrer</Button>
              <Button onPress={()=>render()}>Annuler</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
}

export default function DrawerTour(){
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    // useEffect(() => {
    //     socket.emit('joinRoom','Tour');
    //     socket.on('roomJoiningStatus', (data) => {
    //         const {success,message}=data;
    //         if(!success){
    //             setPop({show:true,message:message,status:'middle',code:'#880000'});
    //             return;
    //         }
    //         setPop({show:true,message:message,status:'low',code:'green'});
    //     })
    // }, []);
    useLayoutEffect(()=>{
            fetch(dbBaseRoot+"poudre/analyses/lansasAndformules")
            .then(response=>response.json())
            .then(data=>{
                const {lansas,formules}=data.analyses;
                const analyses=[...lansas,...formules];
                dispatch(setPowderAnalysed(analyses));
            })
            .catch(function(error){
                setPop({show:true,message:error.message,code:"#880000"})
            })
        },[]);
  return (<CurrentProductedProvider>
        <ItemToSaveProvider>
            <Drawer.Navigator initialRouteName="Formules"
            screenOptions={{
                    headerShown:false,
                    drawerType:isLarge?'permanent':'slide',
                    drawerStyle:isLarge?{width:'21%'/*'23%'*/,backgroundColor: '#ddd'}:{backgroundColor: '#ddd'},
                    overlayColor:isLarge && "transparent",
                    headerLeft:isLarge?()=>null:undefined,
                    switeEnabled:!isLarge,
                    headerStyle: { backgroundColor: '#6200ee',height:40 },
                    drawerPosition: 'left',
                    gestureEnabled:true,
                    gestureDirection:'horizontal',
                    headerTintColor: '#fff',
                    headerTitleAlign: 'left',
                    drawerLabelStyle: { fontSize: 18,letterSpacing:2, },
                    // headerRight:() => (<HeaderRight isLarge={isLarge}/>)
                    // headerRight:() => (<HeaderRight isLarge={isLarge}/>)
                }}
                drawerContent={()=> <FormulesProvider><CustomPoudreDrawerContent/> </FormulesProvider>}
                >
                <Drawer.Screen name="Basics" children={({navigation,route}) =>  <></>}/>
                <Drawer.Screen name="Lansas" children={({navigation,route}) => <PoudreAnalysedTab nested={true}/>} />
                <Drawer.Screen name="Formules" children={({navigation,route}) => <PoudreAnalysedTab nested={true}/>} />
                
            </Drawer.Navigator>
        </ItemToSaveProvider>
    </CurrentProductedProvider>
    
  );

}

export const Tabs=() => {
    return  <View 
    style={{
        flex:1,
        minWith:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor:'rgba(0,0,0,0.9)',
        width:"100%",
        // padding:3,
        paddingVertical:0,
    }}
> 
{/* // https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDM5MW5yYnZlcGE0Mm80YjlncTR5cG41cG5rNWhua2N2enBudXk2YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SnwifA7bOFDhe/giphy.gif"> ancien */}
    <ViewOrImgBgPowderWrapper uri="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmd4bWZ3aHZ4ejlqY3dzOXhlMmZ3YmpkdGRjbXY3ZmU0c3hhZG9jYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h3XeInHxWLN84/giphy.gif">
        <FormulesProvider>
                
            <PaperProvider>
                    <PoudreWorkSpace mission="create"/>
            </PaperProvider>
        </FormulesProvider>
    </ViewOrImgBgPowderWrapper>
        <View style={{width:'50%'}}>
            <AnalysedCards/>
        </View>
    </View>
}
            // <AnalysedList /*entete de la liste de gauche et la liste  de gauche */ />A adapter a tour
const AnalysedCards /**remplacé par productedTour */=() => {
        const [K,setK]=useState(null);
        const {powderAnalysed,focusedListe}=useSelector(state=>{
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            const focusedListe=state.currentProducted.focusedListe;
            return {powderAnalysed,focusedListe};
        })
        const {registred,Everages}=useCurrentProducted();
        const [analysed,setAnalysed]=useState([]);
        const [PRODUCTS,setProducts]=useState([]);
        function handleResearchChange(txt){
            const matchedAnalysed=powderAnalysed.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
            setAnalysed(matchedAnalysed);
        }
        useMemo(()=>{setAnalysed(focusedListe);setProducts(powdersAndCountsFormat(powderAnalysed))},[focusedListe]);// focusedListe du store etait import pour cette partie
        const {name,nom}=focusedListe[0]||{};
        const {nameToDisplay}=isFormule(focusedListe[0]||{})
        const AnalysedLen=analysed.length;
    return <View style={{flex:1,width:"100%",minHeight:740,backgroundColor:'#2c2c2c',marginLeft:2}}>
            <View style={{width:"100%",height:"auto",height:'100%',/*minHeight:500,maxHeight:740,*/flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',backgroundColor:'transparent',paddingHorizontal:20,paddingVertical:10}}>
                {PRODUCTS.map((ITEM,index)=><CarteProduct key={index} PRODUCT={ITEM}/>)}
            </View>
        </View>
}
const ProductedTour=()=>{ 
        const [K,setK]=useState(null);
        const {setPop,setNewAna}=usePopup();
        const scrollViewRef = useRef(null);
        const {powderAnalysed,focusedListe}=useSelector(state=>{
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            const focusedListe=state.currentProducted.focusedListe;
            return {powderAnalysed,focusedListe};
        })
        const [analysed,setAnalysed]=useState([]);
        const {registred,Everages}=useCurrentProducted();
        function handleResearchChange(txt){
            // alert(JSON.stringify(registred))
            const matchedAnalysed=powderAnalysed.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
            setAnalysed(matchedAnalysed.slice(20));
            // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
        }

        useEffect(() => {
            function onCommentPoudreAdded(data){
                setPop({show:true,status:'high',message:data,code:'green'});
            }
            socket.on('commentPoudreAdded', (data)=>onCommentPoudreAdded(data));

             function onAnalysedPoudreAdded(data){
                setNewAna({show:true,message:data?.id,code:'green'});
            }
            socket.on('analysedPoudreAdded', (data)=>onAnalysedPoudreAdded(data));
            
            return () => {
                socket.off('commentPoudreAdded');
                socket.off('analysedPoudreAdded');
                };
            }, []);

        useMemo(()=>{setAnalysed(focusedListe?.slice(-20))},[focusedListe]);// focusedListe du store etait import pour cette partie
        const {name,nom}=focusedListe[0]||{};
        const {nameToDisplay}=isFormule(focusedListe[0]||{})
        const AnalysedLen=analysed.length;
        // const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
    return  <>
                <View style={{flex:1,width:"100%",minHeight:50,backgroundColor:'#e7e0ec',flexDirection:"row",justifyContent:"space-between",alignItems:"center",borderTopLeftRadius:8,borderTopRightRadius:8}}>
                    <Text style={{flex: 1,textAlign: "left",maxWidth:130,minWidth:100,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:14,letterSpacing:2}}
                    >CHARIOT</Text>
                    <Text style={{ flex:1,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"left",minWidth:100,fontSize:16,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>PRODUCT</Text>
                    <Text style={{ flex:1,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:16,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{"DENSITE     "}</Text>
                    
                </View>
    <ScrollView 
        ref={scrollViewRef}
        horizontal={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        style={{width:"100%",maxHeight:400,padding:10/*,overflowY:"scroll",*/}}
    >
                          <FlatList
                                        data={analysed}
                                        keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
                                        renderItem={({ item },index) =>{
                                        return <PowderRow
                                                    key={index}
                                                    ky={index}
                                                    K={K}
                                                    setK={setK}
                                                    item={item}
                                                    items={analysed}
                                                />
                                            }
                                        }
                          />
                    </ScrollView>
    </>
}

const PoudreWorkSpace=() => {
    const dispatch=useDispatch();
    const {setPop,setNewAna}=usePopup();
    const inputRefs = useRef([]);
    const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
    const {targetUser,focusedProduct,powderAnalysed,currentProducted}=useSelector(state=>{
        const targetUser = state.user.targetUser;
        const powderAnalysed=state.powderAnalysed.powderAnalysed;
        const focusedProduct=state.focusedProduct.focusedProduct;
        const currentProducted=state.currentProducted.currentProducted;
        return {targetUser,focusedProduct,powderAnalysed,currentProducted};
    });

    const enregistrerAllowed=allowTo("enregistrer analyse",targetUser?.privileges);
    const CLE=enregistrerAllowed?"allowed":"notAllowed";
    // alert(JSON.stringify(currentProducted))
    const {toCreate,setAction,ListOfFocusedAndLastNumberTour,currentProductedPro,currentProductedLen,setFocusedList,setFocusedPro,focusedPro,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
    const {freeChariot}=ListOfFocusedAndLastNumberTour(focusedProduct,powderAnalysed);
    const {noErrors,errors,itemToSave}=useItemToSave();
    // const numChariot=itemToSave?.nChar;
    const numIdentifier=itemToSave?.identifier;
    const {name,densite,nom,couleur,taches,format,parfum,percarbonate,mousses,max_gg,max_humidite,alcanite,matiere_active,compression,...Rest}=focusedPro;
    
    const {estFormule,nameToDisplay}=isFormule(focusedPro);
    const {silicate,sel,...REST}=Rest;
    const rest=toCreate?REST:Rest;
    // alert(JSON.stringify(rest))
    const [visible,setVisible]=useState(false);
    const [isMissing,setIsMissing]=useState(false);
    const [missing,setMissing]=useState({});

    function missingRequiredKeys(){
        // const keysAndRequireds=[['nChar',true],['densite',true]];
        const keysAndRequireds=[['densite',true]];
        var missings=[];
        keysAndRequireds.map(item=>{
        if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
            const msg=item[0].toUpperCase()+" is required !";
            missings.push(msg);
            return null;
        }})
        return missings;
    };
 
    //  useEffect(() => {

    //         if(!socket.connected){
    //             setPop({show:true,message:'Even-Driver disconnected',code:'#880000'})
    //         }
    //         function onAnalysePoudreAdded(data){
    //             const {newAnalyse,lansas}=data;alert(JSON.stringify(data))
    //             setRegistred(lansas);
    //             dispatch(setPowderAnalysed(lansas));
    //             setNewAna({show:true,id:newAnalyse?.id||101,code:data?.code || 'green'});
    //         }
    //         socket.on('analysePoudreAdded', (data)=>onAnalysePoudreAdded(data));
    //         return () => {
    //             socket.off('analysePoudreAdded');
    //             };
    //         }, []);

const missings=missingRequiredKeys();
const missingLength=missings.length;
const keyOk=noErrors && missingLength===0 && toCreate;


    const handleEnregistrerPress=()=>{
        if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
            return;
        }
        if(!noErrors){
            setVisible(true);
        }else{
            // const observations=errors.reduce((acc,er)=>acc+'JOIN'+er)||"";
            const observations="";
            if(missingLength!==0){
                setMissing(missings);
                setIsMissing(true);
                setVisible(true);
            }else{
                var saveObject={};
                if(toCreate){
                    // ====================== build des non requis ==================================
                    // const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>ky!=='densite');
                    // notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];})// reconstruire notRequired sous forme d'objet js dans saveObject
                    
                    // ====================== build du item a enregistre ============================
                    const {list,freeChariot}=ListOfFocusedAndLastNumberTour(focusedProduct,powderAnalysed);
                    // const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedPro,registred);// registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const identifier=freeChariot.toString()+"_"+AdjentDayInMs(new Date(),0).toString();
                    // const {densite,silicate,sel,...rest}=saveObject;// pour retirer la densite ,le silicate et le sel
                    const buildItem={...itemToSave,name:focusedProduct.name,identifier:identifier,nChar:parseFloat(freeChariot),observations:observations,categorie:"local",UtilisateurId:1};
                    // alert(JSON.stringify(buildItem))
                    const enregistre=[...registred,buildItem];// 2
                    // ===================== Envoi aux memoires bdd & Context & store =====================
                    setFocusedList([...list,buildItem]);
                    dispatch(storeFocusedListe([...list,buildItem]));

                    fetch(dbBaseRoot+"poudre/analyses/add",
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${targetUser.token}`
                        },
                        body:JSON.stringify(buildItem)
                    })
                    .then(response=>response.json())
                    .then(data=>{
                        // console.log(data)
                        const {code,message,analyses}=data;

                        try{
                            const {lansas,formules}=analyses;
                            const ANALYSES=[...lansas,...formules];
                            // alert(JSON.stringify(ANALYSES));
                            setRegistred(ANALYSES);
                            dispatch(setPowderAnalysed(ANALYSES));
                        }catch(error){throw new Error("L'analyse n'a pas pu etre ajoutée: "+error.message);}

                        return lansas;
                        // const toPop=code==='green'?
                        //         {show:true,message:"Analyse enregistrée avec succes.",code:code}
                        //         :
                        //         {show:true,message:"L'analyse n'a pas pu etre enregistrée :"+error.message,code:'#880000'}
                        // setPop(toPop);
                    })
                    .then(lansas=>{
                        const ID=lansas.slice(-1)[0].id
                        socket.emit('analysePoudreAdded',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
                    })
                    .catch((error)=>alert(error.message))
                    
                    // dispatch(storeFocusedListe([...list,buildItem]));
                    // setRegistred(enregistre);
                    // dispatch(setPowderAnalysed(enregistre));
                   
                }else{
                    const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
                    const {list}=ListOfFocusedAndLastNumberTour(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const builtItem={...itemToSave,name:focusedProduct.name,observations:observations,categorie:"local",UtilisateurId:1};
                    const enregistre=[...registredWithoutTheFocused,builtItem];// 2
                    // ===================== Envoi aux memoires Context & store =====================
                    setFocusedList([...list,{...itemToSave,name:focusedProduct.name,observations:observations,UtilisateurId:1}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
                    dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
                    fetch(dbBaseRoot+"poudre/analyses/updateTour/"+itemToSave.id,
                       {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${targetUser.token}`
                            },
                            body:JSON.stringify(builtItem)
                        })
                    .then(response=>response.json())
                    .then(data=>{
                        
                        try{
                            const {lansas,formules}=analyses;
                            const ANALYSES=[...lansas,...formules];
                            setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
                            dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
                        }catch(error){throw new Error("L'analyse n'a pas pu etre modifiée: "+error.message);}

                        // const toPop=code==='green'?
                        //         {show:true,message:"Analyse modifiée avec succes.",code:code}
                        //         :
                        //         {show:true,message:"L'analyse n'a pas pu etre modifiée: "+error.message,code:'#880000'}
                        // setPop(toPop);
                    });
                    setAction("create");
                }
            }
        }
    }
    return <View style={{width:"96%",margin:'2%',padding:0}}>
       
        {/* {currentProductedLen!==0 &&  */}
        <View style={{width:"100%",height:"auto",/*minHeight:750,*/ borderRadius:10,backgroundColor:'rgba(255,255,255,0.6)',justifyContent:'flex-start',borderWidth:4,borderColor:'#dddddd',alignItems:'center'/*,paddingHorizontal:10,paddingVertical:8*/,gap:15}}>
            {/* {taches!==undefined && <HeaderOfEdit name={nameToDisplay} couleur={couleur} taches={taches} />} */}
            <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
            <ProductedTour/>
            <View style={{flexDirection:'row',justifyContent:'flex-start',padding:'3%',borderTopWidth:2,borderTopColor:'#dddddd',borderRadius:8,gap:5,width:'100%'}}>
                <Text style={[style.lansaValue,{fontSize:15,paddingHorizontal:10,fontWeight:'bold',textAlign:'center',alignContent:'center'}]}>{name}</Text>
                {Object.entries({chariot:{defaut:freeChariot,normes:{min:1,max:2000}},densite:densite}).map(([key,value],i)=><EditRow keyOk={keyOk} renderSave={()=>handleEnregistrerPress()} inputRefs={inputRefs} index={i} key={i} obj={{key:key,value:value}}/>)}
                 <TouchableOpacity 
                    disabled={!enregistrerAllowed}
                                    style={{
                                        width:80,// ct min
                                        minHeight:50,// ct min
                                        // marginTop:20,
                                        backgroundColor:couleurs[CLE][7],
                                        borderRadius:10,
                                        paddingHorizontal:5,
                                        paddingVertical:15,
                                    }}
                        onPress={handleEnregistrerPress}
                    >
                        <Text style={{color:"white",fontWeight:"bold",textAlign:"center"}}>Save</Text>
                    </TouchableOpacity>
            </View>
            
        </View>
        {/* } */}

        {/* <Portal> */}
            {/* <Pop/> */}
            {/* <NewAnalysed/> */}
        {/* </Portal> */}
    </View>
}


// ============================ WorkSpace =====================================
const HeaderOfEdit=({inputRefs,name,couleur,taches})=>{
const {toCreate}=useCurrentProducted();
const tachesSplit=taches?.split("-")|| [];
return <View 
                        style={{
                        minWidth:"100%",
                        minHeight:40,
                        marginTop:0,
                        backgroundColor:"rgba(250,250,250,0.06)",
                        borderRadius:8,
                        paddingHorizontal:40,
                        paddingVertical:0,
                        flexDirection:"row",
                        justifyContent:"flex-start",
                        alignItems:"center",
                        gap:30
                        }}
                    >
        <Text style={{height:"100%",fontWeight:"bold",textAlign:"center"}}> 
            {!toCreate?"MAJ "+name?.toUpperCase():name?.toUpperCase()} 
        </Text>
        <View 
            style={{
                    borderWidth:1,
                    borderColor:"rgba(0,0,0,0.1)",
                    minWidth:"40%",
                    minHeight:"90%",
                    paddingHorizontal:40,
                    backgroundColor:couleur,
                    borderRadius:5,
                    flexDirection:"row",
                    justifyContent:"flex-start",
                    alignItems:"center",
                    gap:5
                }}>
            <Text style={{minWidth:"55%",height:"100%",textAlign:"left",color:"grey"}}>{colors[couleur].nom}</Text>
            {tachesSplit.map((clr,i)=><Text key={i} style={{width:"auto",height:"100%",color:"grey",textAlign:"center",backgroundColor:colors[clr].color,paddingHorizontal:5}}>{colors[clr].nom}</Text>)}
        </View>
</View>}
// ============   =============== AnalysedList ==========================
const PowderRow=({K,ky,ac,setK,item})=>{
    const targetUser=useSelector(state=>state.user.targetUser);
    const focusedProduct=useSelector(state=>state.focusedProduct.focusedProduct);
    const clooned= useSelector(state => state.actived.clooned);
    const scrollViewCommentsRef=useRef([]);
    const {setPop}=usePopup();
    const {toCreate,setId2Update,id2Update,setAction,setFocusedList,focusedPro,ListOfFocusedAndLastNumberTour,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
    const {noErrors,pickItemToSave,itemToSave}=useItemToSave();
    const obj={key:'densite',value:focusedPro.densite}
    const headersKeys=["densite"];
    const [focusedIndex,setFocusedIndex]=useState(null);
    const [isCollapsed,setIsCollapsed]=useState(false);
    const {nChar,name,identifier,Utilisateur,commentaires,couleur,taches,...rest}=item;
    const chemist=Utilisateur?.pseudo;
    const [comment,setComment]=useState("");
    const allowToComment=allowTo("commenter",targetUser?.privileges);
    const KEY=allowToComment?"allowed":"notAllowed";
    const [commenteres,setCommenteres]=useState(commentaires);
    const [comments,setComments]=useState(commentsFromObjectToArray(commentaires));

    const [toggle,setToggle]=useState(false);
    const {nameToDisplay}=isFormule(item);
    const isHovered=K===identifier;
    const isMeToUpdate=id2Update===item.id;
    const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};

    // const handleAddComment=()=>{
    //     const pseudo=toggle?"ndour":"Moneem";
    //     const commnts=[[comment,"Mamadou","Ndour",null,true,pseudo],...comments];
    //     setToggle(!toggle);
    //     setComments(commnts);
    // }

     const handleAddComment=()=>{
          if(!allowToComment){ setPop({show:true,message:"Vous n'êtes pas autorisé à commenter une analyse.",code:''});return;}
          if(comment){
            if(targetUser){
              const targetUserId=targetUser.id;
              const commentToAdd={text:comment,AnalyseId:item?.id,Utilisateur:{id:1,fName:chemist,lName:chemist,isAdmin:false,pseudo:'ndour',url:'',createdAt:new Date()}}
              AddPoudreComment({text:comment,AnalyseId:item?.id,UtilisateurId:targetUserId})
    
              // hot reload messenges =============================
              setCommenteres({...commenteres,commentToAdd})
              setComments(commentsFromObjectToArray({...commenteres,commentToAdd}))
              // ======================================================
              setComment('');
              // inputRef.current[key].value="";
              scrollViewCommentsRef.current[ky]?.scrollToEnd({animated:true});
            }
            // else{
            //   modalShow(true);
            // }
        }}
    const handleKeyPress=(e)=>{
        if(e.nativeEvent.key==='Enter'){
        handleAddComment();
    }
    }

    // ========================= POUR UPDATETOUR ===============================================
    // itemToSave & focusedPro &focusedProduct & observations & setFocusedList & Dispatch & storeFocusedListe & setPowerAnalysed & setPop & set Action & setRegistred

    const dispatch=useDispatch();
    const inputRefs = useRef([]);
    const enregistrerAllowed=allowTo("enregistrer analyse",targetUser?.privileges);
    const CLE=enregistrerAllowed?"allowed":"notAllowed";
    const numIdentifier=itemToSave?.identifier;
    
    const [visible,setVisible]=useState(false);
    const [isMissing,setIsMissing]=useState(false);
    const [missing,setMissing]=useState({});

    function missingRequiredKeys(){
        // const keysAndRequireds=[['nChar',true],['densite',true]];
        const keysAndRequireds=[['densite',true]];
        var missings=[];
        keysAndRequireds.map(item=>{
        if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
            const msg=item[0].toUpperCase()+" is required !";
            missings.push(msg);
            return null;
        }})
        return missings;
    };
    // ============================================================================================
   

      function handleUpdateTour(vl){
        if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
            return;
        }
        if(!noErrors){
            setVisible(true);
        }else{
            const observations="";
            const missings=missingRequiredKeys();
            if(missings.length!==0){
                setMissing(missings);
                setIsMissing(true);
                setVisible(true);
            }else{
                // var saveObject={};
                    const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
                    const {list}=ListOfFocusedAndLastNumberTour(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const builtItem={...itemToSave,densite:vl,name:focusedProduct.name,observations:observations,categorie:"local",UtilisateurId:1};
                    // const enregistre=[...registredWithoutTheFocused,builtItem];// 2
                    // ===================== Envoi aux memoires Context & store =====================
                    setFocusedList([...list,{...itemToSave,densite:vl,name:focusedProduct.name,observations:observations,UtilisateurId:1}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
                    dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
                    fetch(dbBaseRoot+"poudre/analyses/updateTour/"+itemToSave.id,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${targetUser.token}`
                        },
                        body:JSON.stringify(builtItem)
                    })
                    .then(response=>response.json())
                    .then(data=>{
                        const {code,message,analyses}=data;
                        const {lansas,formules}=analyses;
                        const ANALYSES=[...lansas,...formules];
                        setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
                        dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
                        const toPop=code==='green'?
                                {show:true,message:"Analyse modifiée avec succes.",code:code}
                                :
                                {show:true,message:"L'analyse n'a pas pu etre modifiée: "+error.message,code:'#880000'}
                        setPop(toPop);
                        setId2Update(null);
                        setAction("create");
                    })
                   
            }
        }
    }
    return <>
    <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
    <TouchableOpacity 
                style={
                    [
                        {
                            flex:1,
                            flexDirection:"column",
                            justifyContent:"flex-start",
                            alignItems:"center",
                            minHeight:40,
                            paddingVertical:2,
                            paddingHorizontal:4
                        },
                        isHovered && hoveredStyle
                    ]
                }

                onPress={() => {setFocusedIndex(item?.id);setIsCollapsed(!isCollapsed)}}
                onPressIn={()=>setFocusedIndex(item?.id)}
                onMouseEnter={()=>setK(identifier)}
                onMouseLeave={()=>setK(null)}
            >
                <View 
                    style={{
                        flex:1,
                        width:"100%",
                        flexDirection:"row",
                        justifyContent:"flex-start",
                        alignItems:"center"
                    }}
                >
                    <Chariot oldCh={Number(nChar)} id={item.id}/>
                    <Text style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",minWidth:100,fontSize:isHovered?16:14,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{nameToDisplay}</Text>

                    {/* {
                        headersKeys.map((ky,i)=>{
                                const isInHeadersKeys=rest[ky]!==undefined;
                                return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?rest[ky]:"..."}</Text>//isInHeadersKeys?vl[cle]:"..."
                            })
                    } */}
                    {(id2Update!==null && isMeToUpdate)?
                    <EditRow render={(vl)=>handleUpdateTour(vl)} inputRefs={[]} index={0} obj={obj} />
                    :
                    <Text key={0} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:14,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{rest['densite']}</Text>}
                    <View style={{...styles.row,marginBottom:2,marginRight:4,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 38,}}>
                        {isHovered && <Actions item={item} />}
                    </View>
                </View>
                {//comments,handleAddComment,handleKeyPress,comment
                    focusedIndex===item?.id && <Collapsible collapsed={isCollapsed}>
                        <View style={{minWidth:ac?880:550,width:"100%",height:"auto",padding:20,paddingVertical:0,marginHorizontal:'auto',backgroundColor:'rgba(0,0,0,0.1)',
                            flexDirection:"column",
                            justifyContent:"flex-start",
                            alignItems:"center",

                        }}>
                                <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+"3.4.2026"+"   updated : "+"4.3.2026"+"  By:"+"ndour"+"  "}</Text></View>
                                {/* <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+ReduceDateTime(createdAt)+"   updated : "+ReduceDateTime(updatedAt)+"  By:"+chemist+"  "+(validation?(" validated by: "+validateur+" on: "+ReduceDateTime(validatedAt)):"")}</Text></View> */}
                                <View style={{width:'100%',minHeight:100,padding:24,borderRadius:5,paddingTop:5,backgroundColor:'rgb(180,180,180)',}}>
                                    {/* <Text style={{color:'black',fontWeight:'bold',}}>{"Analyse "+id+" - "+categorie+"."+item.name+" Observations : "}<Observations obs={observations}/> </Text> */}
                                    <ScrollView ref={scrollViewCommentsRef}>
                                        <View style={{width:'100%',paddingBottom:50,flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
                                            {comments.map((cmnt,index)=><Comment key={index} targetPseudo={null} color={Colors.Bleu} comnt={cmnt}/>)}
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={{...Flex('row','center','center'),zIndex:10,width:'90%',height:80,marginTop:-12,bottom:0,}}>
                                    <TouchableWithoutFeedback style={{width:'80%',height:'60%',}}>
                                        <TextInput
                                            style={{display:'block',backgroundColor:'white',width:'100%',padding:5,margin:5,borderRadius:5,paddingHorizontal:12,overflowX:'wrap',minHeight:40,maxHeight:100,height:'60%'}}
                                            placeholder="Your new comment here ..."
                                            // ref={inputRef}
                                            onSubmitEditing={handleAddComment}
                                            onChangeText={(value)=>setComment(value)}
                                            onKeyPress={handleKeyPress}
                                            value={comment}
                                        />
                    
                                    </TouchableWithoutFeedback>
                                    <TouchableOpacity
                                    onPress={handleAddComment}
                                    style={{maxWidth:48,width:'20%',height:'50%',paddingHorizontal:6,paddingVertical:4,margin:6,backgroundColor:'blue',borderRadius:5,...Flex('column','center','center'),}}
                                    >
                                    <Text style={{color:'white',textAlign:'center',fontWeight:'bold',}}>
                                    <Icon name="paper-plane" size={17} color="#fff"/>
                                    </Text>
                    
                                    </TouchableOpacity>
                                </View>
                        </View>
                    </Collapsible>
                }
            </TouchableOpacity>
            </>
}

const EditRow=({render,renderSave,keyOk,inputRefs,index,obj})=>{ // import de DrawerPoudre
    const {key,value}=obj;
    const labelJoined=key.split("_").join(" ").replace("max ","").replace("gg","Gros grains");
    const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
    const {pickItemToSave,itemToSave}=useItemToSave();
    const [input,setInput]=useState("");
    const uniquePropriete=["max_gg","max_humidite"];
    const min=uniquePropriete.includes(key)?0:(value?.normes?.min || 0);
    const max=uniquePropriete.includes(key)?value?.normes:(value?.normes?.max || 1000);
    const invalidOrSave = (val) => {
    return new Promise((resolve, reject) => {
            const valFormat = Number.isNaN(Number(val)) ? val : Number(val); 
            const { icon, obs } = InputIsValid({ input: valFormat, label: labelJoined, normes: { min, max } });
            setIconAndObs({ icon, obs });
            pickItemToSave({"key":key,"value":val,"message":obs})
            if (obs === "") {resolve("ok");} else {reject("ko");}
        });
    };
    function handleCheckValidity(val){
        invalidOrSave(val)
        .then(rep=>{
            if(rep==="ok"){
                render!==undefined && render(val);
            }
        })
        .catch(function(error){
            throw new error("❌ there's error");
        })
        
        
    }
    return <View style={{width:"100",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
        <LansaValue render={()=>render()} renderSave={renderSave} inputRefs={inputRefs} keyOk={keyOk} index={index} value={input} labelJoined={labelJoined} icon={iconAndObs.icon} renderValidity={()=>handleCheckValidity(input)} renderVal={(val)=>setInput(val)}/>
        {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
    </View>
}

const LansaValue=({inputRefs,renderSave,keyOk,index,labelJoined,icon,value,renderValidity,renderVal})=>{ // import de DrawerPoudre
    const inputDensityRef=useRef(null);
    const {setNewAna}=usePopup();
    const {currentProductedLen,focusedPro,toCreate}=useCurrentProducted();
    const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
    const [textValue,setTextValue]=useState("");
    const IamFocused=index===INDEX;
    // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
    // const currentProductedLen=currentProducted.length;
    const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);

    // useEffect(() => {
    //          // 1. Connexion au serveur
    //         socket.connect();
    //         socket.on('analysePoudreAdded', (data) => {
    //             setNewAna({show:true,id:data?.nChar,code:'green'});
    //             return ;
    //         });
    //         return () => {
    //             socket.off('analysePoudreAdded');
    //             socket.disconnect();
    //             };
    //         }, []);

    useEffect(()=>{
        if(!toCreate){
            const valeur=itemToSave?.name && itemToSave[label.replace("Gros grains","gg").replace("Matiere active","matiere_active").toLowerCase()];
            setTextValue(valeur); 
            // alert(JSON.stringify(itemToSave))
        }else{
            setTextValue("");
            setItemToSave({});
        }
    },[toCreate])

    function handleLenOverFive(val){if (val.length === 5) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
    const handleNext = () => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
    const handleKeyPress = (e) => {const { key } = e.nativeEvent;
        if (key === 'ArrowRight') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
        if (key === 'ArrowLeft') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
        if (key === 'Enter') {renderValidity();if(keyOk){renderSave();if (inputDensityRef) inputDensityRef?.current?.focus();}}
    };
    
    return <TextInput
        disabled={currentProductedLen===0 || labelJoined==='chariot'}
        returnKeyType="next"
        onKeyPress={handleKeyPress} 
        onSubmitEditing={handleNext}
        onFocus={()=>toCreate && setIndex(index)}
        blurOnSubmit={false}
        selectTextOnFocus="true"
        maxLength={5}
        label={label}
        value={textValue} 
        style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
        // ref={(el) => (inputRefs.current && (inputRefs.current[index] = el))}
        ref={inputDensityRef}
        onBlur={()=>renderValidity()}
        onChangeText={(val)=>{setTextValue(val);renderVal(val);handleLenOverFive(val)}}
        right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
    />
}
// =============================================================================

// const Chariot=({oldCh,id})=>{ // import drawerPoudre
//     const [ch,setCh]=useState(oldCh);
//     const {setPop}=usePopup();
//     const dispatch=useDispatch();
//     const {ListOfFocusedAndLastNumberTour,setFocusedList,setRegistred}=useCurrentProducted();
//     const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed)

//     function handleBlur(newCh){
//         const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.id)!==Number(id));
//         const item=powderAnalysed.filter(it=>Number(it.id)===Number(id))[0];
//         const newItem={...item,nChar:Number(newCh),UtilisateurId:1};

//         const updteOwderAnalysed=[...updatedPowderAnalysed,newItem].sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar);
//         const {list}=ListOfFocusedAndLastNumberTour(item,updteOwderAnalysed);
//         setFocusedList(list);
//         dispatch(storeFocusedListe(list));
//         if(!item.id){setPop({show:true,message:"Erreur sur l'ID cible ! Peut-etre UNDEFINED | NULL .",code:'#880000'});return}
//         fetch(dbBaseRoot+"poudre/analyses/updateChariot/"+item.id,
//                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(newItem)
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         const {message,code,analyses}=data;
//                         const {lansas}=analyses;
//                         setRegistred(lansas.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
//                         dispatch(setPowderAnalysed(lansas.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
//                         const toPop=code==='green'?
//                                 {show:true,message:"Chariot changé avec succes.",code:code}
//                                 :
//                                 {show:true,message:"Le numero de chariot n'a pas pu etre modifié :"+message,code:'#880000'}
//                         setPop(toPop);
//                     })
//     }

//     return <TextInput
//         value={ch}
//         onBlur={()=>handleBlur(Number(ch))}
//         onChangeText={(CH)=>setCh(CH)}
//         style={{flex: 1,textAlign: "left",maxWidth:30,width:20,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:14,letterSpacing:2}}
//     />
// }

const Actions=({item})=>{// import de DrawerPoudre
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    const {setFocusedPro,setId2Update,UpdateFocusedProdByName,setRegistred,setFocusedList,ListOfFocusedAndLastNumber,setAction,focusedPro}=useCurrentProducted();
    const {targetUser,powderNormes,powderAnalysed,focusedListe}=useSelector(state=>{
        const powderNormes=state.powderNormes.powderNormes;
        const targetUser = state.user.targetUser;
        const {powderAnalysed,focusedListe}=state.powderAnalysed;
        return {targetUser,powderNormes,powderAnalysed,focusedListe};
    });
    const deleteAllowed=allowTo("supprimer analyse",targetUser?.privileges);
    const updateAllowed=allowTo("modifier analyse",targetUser?.privileges);
    const delKey=deleteAllowed?"allowed":"notAllowed";
    const updKey=updateAllowed?"allowed":"notAllowed";
    const {setItemToSave}=useItemToSave();
    const {name,id}=item;
    const handleDelete=async ()=>{
        // if(!deleteAllowed){setPop({show:true,message:"Vous n'avez pas la permission de supprimer une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#88000'});return;}
        try{
            const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.id)!==Number(id));
            const {list}=ListOfFocusedAndLastNumber(item,updatedPowderAnalysed);
           if(!id){setPop({show:true,message:"Erreur sur l'ID cible. ID undefined || null .",code:'#880000'});return}
            fetch(dbBaseRoot+"poudre/analyses/delete/"+targetUser.id+"/"+id,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${targetUser.token}`
                        }
                    })
                    .then(response=>response.json())
                    .then(data=>{
                        // console.log(data)
                        const {code,message/*,analyses*/}=data;
                        // const {lansas,formules}=analyses;
                        // const ANALYSES=[...lansas,...formules];
                        // const {list}=ListOfFocusedAndLastNumber(item,ANALYSES);
                        // dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)));
                        // dispatch(storeFocusedListe(list));
                         // mise a jour des data statement ==========================
                            // Provider
                        if(code==="green"){
                            setFocusedList(list);
                            setRegistred(updatedPowderAnalysed);
                                // store de redux
                            dispatch(setPowderAnalysed(updatedPowderAnalysed));
                            dispatch(storeFocusedListe(list));
                        }
                        const toPop=code==='green'?
                                {show:true,message:"Analyse "+id+" avec succes.",code:code}
                                :
                                {show:true,message:"L'analyse "+id+" n'a pas pu etre supprimée :"+error.message,code:'#880000'}
                        setPop(toPop);
                    })
            // ==========================================================
            
            // render(updatedPowderAnalysed);
          // Mise a jour coté bdd
        // /*const response=*/ await fetch(`${dbBaseRoot}analyses/delete/${id}`,{
        //   method:'DELETE',
        //   headers: {
        //       'Content-Type':'application/json'
        //   },});
          // Mise à jour coté UI
            // const itms=items.filter(item=>item.id!==id);
            // dispatch(postAnalyses(null));
            // render(itms);
        }catch(error){
            setPop({show:true,mesage:"Analyse "+item.id+" n'a pu etre supprimee !"+error,code:'#880000'});
        }
    }
    const confirmDelete=()=>{
        if(!deleteAllowed){setPop({show:true,message:"Vous n'avez pas la permission de supprimer une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#88000'});return;}
        isWeb?(confirm("Etes-vous sur de  vouloir supprimer cet enregistrement ?")?handleDelete():null)
      :
      Alert.alert("Confirmation",
          "Etes-vous sur de  vouloir supprimer cet enregistrement ?",
          [
            {
              text:"Annuler",
              style:"cancel",
              onPress:()=>null
            },
            {
              text:"Continuer la suppression",
              onPress:()=>handleDelete()
            }
          ],
          {cancelable:true}
        )}

  const handleUpdate=async ()=>{
    if(!updateAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission de modifier une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#880000'});return;}

    //   const itemKey=name.split(" ").join("_").toLowerCase();
    //   const itemNormes=powderNormes[itemKey];
    //   setFocusedPro(itemNormes);
    // UpdateFocusedProdByName(item);
    setId2Update(item.id)
    setItemToSave(item);
    setAction("update");

  }

  return <TouchableWithoutFeedback>
    <View
      style={{
        height:"auto",
        width:150,
        paddingVertical: 3,
        borderRadius: 8,
        backgroundColor:'white',
        // ...Flex('row','center','center')
        }}
    >
    {/* {
      user && user.isAdmin? */}
      <>
        <Pressable style={{...style.actions,marginRight:45,}} disabled={!deleteAllowed} onPress={confirmDelete}>
            <Icon size={14} name="trash" color={couleurs[delKey][8]}/>
        </Pressable>
        <Pressable style={{...style.actions,marginLeft:50,}} disabled={!updateAllowed} onPress={handleUpdate}>
            <Icon size={14} name="pencil" color={couleurs[updKey][7]}/>
        </Pressable>
        {true?<Pressable style={{...style.actions,marginLeft:100,}} disabled={!updateAllowed} onPress={handleUpdate}>
            {/* <Icon size={14} name="pencil" color={couleurs[updKey][7]}/> */}
            <Text style={[style.addedbuttons,{backgroundColor:'rgba(150,0,0,0.08)'}]}>Isol</Text>
        </Pressable>:
        <Pressable style={{...style.actions,marginLeft:100,}} disabled={!updateAllowed} onPress={handleUpdate}>
            {/* <Icon size={14} name="pencil" color={couleurs[updKey][7]}/> */}
            <Text style={[style.addedbuttons,{backgroundColor:'rgba(0,150,0,0.08)'}]}>Inject</Text>
        </Pressable>}

      </>
      {/* :<Text>...</Text>
    } */}
    </View>
  </TouchableWithoutFeedback>
}

const CarteProduct=({PRODUCT})=>{
    const {name,totalCount,isolatedCount}=PRODUCT;
    return <View style={style.carteMain}>
        <View style={style.carteRow}>
            <Text style={style.carteCol1}><Text style={{position:'absolute',top:-20,fontSize:25}}>📌</Text></Text>
            <Text style={[style.carteCol2,{backgroundColor:'#e7e0ec'}]}>{name}</Text>
        </View>
        <View style={style.carteRow}>
            <Text style={style.carteCol1}>TOTAL</Text>
            <Text style={style.carteCol2}>{totalCount}</Text>
        </View>
         <View style={[style.carteRow,{backgroundColor:'rgba(100,0,0,0.1)',borderBottomLeftRadius:6}]}>
            <Text style={style.carteCol1}>T ISOLES</Text>
            <Text style={[style.carteCol2,{color:'red'}]}>{isolatedCount}</Text>
        </View>


    </View>
}

// =========================================================================



// const LansaObservations=({obs})=>(obs!=="" && <Text style={style.lansaObservations}>{obs}</Text>);// import de DrawerPoudre

// function InputIsValid({input,label,normes}){ // import de DrawerPoudre
//     const {min,max}=normes;
//     const labl=label.toUpperCase();
//     if(Number.isNaN(Number(input))) return {icon:"alert",obs:"Input must be numeric"};
//     switch(true){
//         case input<min:
//            return {icon:"close",obs:labl+" is low"};
//            break;
//         case input>max:
//             return {icon:"close",obs:labl+" is high"};
//            break;
//         case (input>=min && input<=max):
//             return {icon:"check",obs:""};
//            break;
//         default:       
//             return {icon:"alert",obs:"Invalid input"};
//     }
// }


const style=StyleSheet.create({
    carteMain:{maxWidth:210,height:160,borderWidth:2,borderRadius:8,borderColor:'#e7e0ec',backgroundColor:'#e7e0ec',padding:5,margin:10,flexDirection:'column',justifyContent:'center'},
    carteRow:{width:'100%',height:50,borderBottomWidth:0.5,borderCollor:'black',flexDirection:'row',justifyContent:'flex-start'},
    carteCol1:{width:70,height:'100%',alignContent:'left'},
    carteCol2:{width:130,height:'100%',borderLeftWidth:0.5,backgroundColor:'white',borderCollor:'grey',alignContent:'center',fontWeight:'bold',textAlign:'center'},
    lansaValue:{
        minWidth:120,//"90%",
        maxWidth:150,
        borderWidth:1,
        borderRadius:5,
        textAlign:"center",
        fontSize:15,
    },
    lansaObservations:{
        maxWidth:65,
        width:"auto",
        backgroundColor:"rgba(0,0,0,0.15)",
        borderWidth:1,
        borderColor:"red",
        borderRadius:8,
        borderBottomLeftRadius:1,
        fontSize:9,
        fontWeight:"bold",
        padding:10,
        paddingVertical:5,
        marginTop:-10
    },
    actions:{
        position:'absolute',
        zIndex:1000,
        height:'80%',
        width:35,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    addedbuttons:{
        fontWeight:'bold',
        fontSize:10,
        textAlign:'center',
        alignContent:'center',
        padding:6,
        margin:3,
        borderWidth:0.5,
        borderColor:'rgba(0,0,0,0.2)',
        borderRadius:5
    }

})




// import { useMemo,useEffect,useLayoutEffect,useState,useRef } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { View, Text, StyleSheet,TouchableWithoutFeedback,Pressable,ActivityIndicator,FlatList, TouchableOpacity } from 'react-native';
// // import { FontAwesome5 } from '@expo/vector-icons';
// import { Searchbar,TextInput,Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
// import { ScrollView } from 'react-native-gesture-handler';
// import Collapsible from 'react-native-collapsible';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useDispatch,useSelector } from 'react-redux';
// import socket from '../assets/socketService';
// import { dbBaseRoot,primaryColor,couleurs} from '../assets/constantes';
// import { Periodes } from '../components/periode';
// import { HeaderRight } from './DrawerNavigator';
// import { PowderHeaders } from '../components/tables/componentTable';
// import Pop,{NewAnalysed} from '../components/popup';
// import CustomPoudreDrawerContent from '../components/customPoudreDrawerContent';
// import {FormulesProvider,CurrentProductedProvider,useCurrentProducted,useFormules,ItemToSaveProvider, useItemToSave, usePopup } from '../components/wrappers/contexts';
// import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
// import {InputIsValid,LansaObservations/*,LansaValue,Actions*/,Chariot,/*PowderRow,UpdateLansa,*/Errors,colors} from './DrawerPoudre';
// import { setPowderAnalysed } from '../components/store/reducers/powderAnalysesReducer';
// import { storeFocusedListe } from '../components/store/reducers/currentProducted';
// import { commentsFromObjectToArray,ReduceDateTime,Time } from '../hooks/littleBiblio';
// import PoudreAnalysedTab from './poudreTabNavigator';
// import WinDim from '../assets/operatingData';
// import { Lansas,routesAndHeadersPowder } from '../iterables';
// import { styles } from '../components/tables/componentTable';
// import { AddPoudreComment } from '../components/buttons/save';
// import { ViewOrImgBgPowderWrapper } from '../components/wrappers/viewOrImgWrapper';
// import { Comment } from '../components/tables/chat-for-table';
// import { AdjentDayInMs} from '../components/periode';
// import { isFormule,powdersAndCountsFormat,allowTo} from '../assets/functions';
// import Colors from '../assets/colors';
// const {aujourdhui,demain}=Periodes();
// const {full}=routesAndHeadersPowder;
// const {api_url,headers}=full;
// const {isLarge,isWeb}=WinDim;
// function Flex(dir,jC,aI){
//   return {
//     display:'flex',
//     flexDirection:dir,
//     justifyContent:jC,
//     alignItems:aI,
//   }
// }
// const Drawer = createDrawerNavigator();
// // const colors={ // import de DrawerPoudre
// //     "white":{
// //         "nom":"Blanc",
// //         "color":"rgb(255,255,255)"
// //     },
// //     "red":{
// //         "nom":"Rouge",
// //         "color":"rgba(255,0,0,0.4)"
// //     },
// //     "blue":{
// //         "nom":"Bleu",
// //         "color":"rgba(0,0,255,0.4)"
// //     },
// //     "green":{
// //         "nom":"Vert",
// //         "color":"rgba(0,255,0,0.4)"
// //     }

// // }

// // const Errors = ({visible,render,isMissing,missing}) => { // import de DrwerPoudre
// //     const {errors,noErrors}=useItemToSave();
// //     const Errors=(isMissing && noErrors)?missing:errors;
// //     const errorsLen=Errors.length;
// //     return  <Portal>
// //           <Dialog style={{maxWidth:700,minWidth:400,marginHorizontal:"auto"}} visible={visible} onDismiss={()=>render()}>
// //             <Dialog.Title style={{fontSize:15,color:"red",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>{errorsLen+" invalid input"+(errorsLen>1?"s":"")}</Dialog.Title>
// //             <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto"}}>
// //               {Errors.map((er,i)=><Text variant="bodyMedium" key={i} style={{marginBottom:20}}>{"🚨 "+er}</Text>)}
// //             </Dialog.Content>
// //             <Dialog.Actions>
// //               <Button onPress={()=>render()}>OK</Button>
// //             </Dialog.Actions>
// //           </Dialog>
// //         </Portal>
// // }

// const UpdateLansa = ({visible,item}) => {// import de DrawerPoudre
//   return<View >
//         <Portal>
//           <Dialog style={{maxWidth:700,minWidth:400,width:"40%",marginHorizontal:"auto"}} visible={visible} onDismiss={()=>render()}>
//                 <Dialog.Title style={{fontSize:15,color:"grey",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>{"Mise a jour "+ item.name}</Dialog.Title>
//             <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto"}}>
//                 <PoudreWorkSpace mission="update"/>
//             </Dialog.Content>
//             <Dialog.Actions>
//               <Button onPress={()=>render()}>Enregistrer</Button>
//               <Button onPress={()=>render()}>Annuler</Button>
//             </Dialog.Actions>
//           </Dialog>
//         </Portal>
//       </View>
// }

// export default function DrawerTour(){
//     const dispatch=useDispatch();
//     const {setPop}=usePopup();
//     // useEffect(() => {
//     //     socket.emit('joinRoom','Tour');
//     //     socket.on('roomJoiningStatus', (data) => {
//     //         const {success,message}=data;
//     //         if(!success){
//     //             setPop({show:true,message:message,status:'middle',code:'#880000'});
//     //             return;
//     //         }
//     //         setPop({show:true,message:message,status:'low',code:'green'});
//     //     })
//     // }, []);
//     useLayoutEffect(()=>{
//             fetch(dbBaseRoot+"poudre/analyses/lansasAndformules")
//             .then(response=>response.json())
//             .then(data=>{
//                 const {lansas,formules}=data.analyses;
//                 const analyses=[...lansas,...formules];
//                 dispatch(setPowderAnalysed(analyses));
//             })
//             .catch(function(error){
//                 alert(error.message)
//             })
//         },[]);
//   return (<CurrentProductedProvider>
//         <ItemToSaveProvider>
//             <Drawer.Navigator initialRouteName="Formules"
//             screenOptions={{
//                     headerShown:false,
//                     drawerType:isLarge?'permanent':'slide',
//                     drawerStyle:isLarge?{width:'21%'/*'23%'*/,backgroundColor: '#ddd'}:{backgroundColor: '#ddd'},
//                     overlayColor:isLarge && "transparent",
//                     headerLeft:isLarge?()=>null:undefined,
//                     switeEnabled:!isLarge,
//                     headerStyle: { backgroundColor: '#6200ee',height:40 },
//                     drawerPosition: 'left',
//                     gestureEnabled:true,
//                     gestureDirection:'horizontal',
//                     headerTintColor: '#fff',
//                     headerTitleAlign: 'left',
//                     drawerLabelStyle: { fontSize: 18,letterSpacing:2, },
//                     // headerRight:() => (<HeaderRight isLarge={isLarge}/>)
//                     // headerRight:() => (<HeaderRight isLarge={isLarge}/>)
//                 }}
//                 drawerContent={()=> <FormulesProvider><CustomPoudreDrawerContent/> </FormulesProvider>}
//                 >
//                 <Drawer.Screen name="Basics" children={({navigation,route}) =>  <></>}/>
//                 <Drawer.Screen name="Lansas" children={({navigation,route}) => <PoudreAnalysedTab nested={true}/>} />
//                 <Drawer.Screen name="Formules" children={({navigation,route}) => <PoudreAnalysedTab nested={true}/>} />
                
//             </Drawer.Navigator>
//         </ItemToSaveProvider>
//     </CurrentProductedProvider>
    
//   );

// }

// export const Tabs=() => {
//     return  <View 
//     style={{
//         flex:1,
//         minWith:'100%',
//         flexDirection:'row',
//         justifyContent:'center',
//         alignItems:'flex-start',
//         backgroundColor:'rgba(0,0,0,0.9)',
//         width:"100%",
//         // padding:3,
//         paddingVertical:0,
//     }}
// > 
// {/* // https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDM5MW5yYnZlcGE0Mm80YjlncTR5cG41cG5rNWhua2N2enBudXk2YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SnwifA7bOFDhe/giphy.gif"> ancien */}
//     <ViewOrImgBgPowderWrapper uri="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmd4bWZ3aHZ4ejlqY3dzOXhlMmZ3YmpkdGRjbXY3ZmU0c3hhZG9jYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h3XeInHxWLN84/giphy.gif">
//         <FormulesProvider>
                
//             <PaperProvider>
//                     <PoudreWorkSpace mission="create"/>
//             </PaperProvider>
//         </FormulesProvider>
//     </ViewOrImgBgPowderWrapper>
//         <View style={{width:'50%'}}>
//             <AnalysedCards/>
//         </View>
//     </View>
// }
//             // <AnalysedList /*entete de la liste de gauche et la liste  de gauche */ />A adapter a tour
// const AnalysedCards /**remplacé par productedTour */=() => {
//         const [K,setK]=useState(null);
//         const {powderAnalysed,focusedListe}=useSelector(state=>{
//             const powderAnalysed=state.powderAnalysed.powderAnalysed;
//             const focusedListe=state.currentProducted.focusedListe;
//             return {powderAnalysed,focusedListe};
//         })
//         const {registred,Everages}=useCurrentProducted();
//         const [analysed,setAnalysed]=useState([]);
//         const [PRODUCTS,setProducts]=useState([]);
//         function handleResearchChange(txt){
//             const matchedAnalysed=powderAnalysed.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
//             setAnalysed(matchedAnalysed);
//         }
//         useMemo(()=>{setAnalysed(focusedListe);setProducts(powdersAndCountsFormat(powderAnalysed))},[focusedListe]);// focusedListe du store etait import pour cette partie
//         const {name,nom}=focusedListe[0]||{};
//         const {nameToDisplay}=isFormule(focusedListe[0]||{})
//         const AnalysedLen=analysed.length;
//     return <View style={{flex:1,width:"100%",minHeight:740,backgroundColor:'#2c2c2c',marginLeft:2}}>
//             <View style={{width:"100%",height:"auto",height:'100%',/*minHeight:500,maxHeight:740,*/flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap',backgroundColor:'transparent',paddingHorizontal:20,paddingVertical:10}}>
//                 {PRODUCTS.map((ITEM,index)=><CarteProduct key={index} PRODUCT={ITEM}/>)}
//             </View>
//         </View>
// }
// const ProductedTour=()=>{ 
//         const [K,setK]=useState(null);
//         const {setPop,setNewAna}=usePopup();
//         const scrollViewRef = useRef(null);
//         const {powderAnalysed,focusedListe}=useSelector(state=>{
//             const powderAnalysed=state.powderAnalysed.powderAnalysed;
//             const focusedListe=state.currentProducted.focusedListe;
//             return {powderAnalysed,focusedListe};
//         })
//         const [analysed,setAnalysed]=useState([]);
//         const {registred,Everages}=useCurrentProducted();
//         function handleResearchChange(txt){
//             // alert(JSON.stringify(registred))
//             const matchedAnalysed=powderAnalysed.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
//             setAnalysed(matchedAnalysed.slice(20));
//             // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
//         }

//         useEffect(() => {
//             function onCommentPoudreAdded(data){
//                 setPop({show:true,status:'high',message:data,code:'green'});
//             }
//             socket.on('commentPoudreAdded', (data)=>onCommentPoudreAdded(data));

//              function onAnalysedPoudreAdded(data){
//                 setNewAna({show:true,message:data?.id,code:'green'});
//             }
//             socket.on('analysedPoudreAdded', (data)=>onAnalysedPoudreAdded(data));
            
//             return () => {
//                 socket.off('commentPoudreAdded');
//                 socket.off('analysedPoudreAdded');
//                 };
//             }, []);

//         useMemo(()=>{setAnalysed(focusedListe?.slice(-20))},[focusedListe]);// focusedListe du store etait import pour cette partie
//         const {name,nom}=focusedListe[0]||{};
//         const {nameToDisplay}=isFormule(focusedListe[0]||{})
//         const AnalysedLen=analysed.length;
//         // const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
//     return  <>
//                 <View style={{flex:1,width:"100%",minHeight:50,backgroundColor:'#e7e0ec',flexDirection:"row",justifyContent:"space-between",alignItems:"center",borderTopLeftRadius:8,borderTopRightRadius:8}}>
//                     <Text style={{flex: 1,textAlign: "left",maxWidth:130,minWidth:100,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:14,letterSpacing:2}}
//                     >CHARIOT</Text>
//                     <Text style={{ flex:1,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"left",minWidth:100,fontSize:16,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>PRODUCT</Text>
//                     <Text style={{ flex:1,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:16,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{"DENSITE     "}</Text>
                    
//                 </View>
//     <ScrollView 
//         ref={scrollViewRef}
//         horizontal={false}
//         onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//         style={{width:"100%",maxHeight:400,padding:10/*,overflowY:"scroll",*/}}
//     >
//                           <FlatList
//                                         data={analysed}
//                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
//                                         renderItem={({ item },index) =>{
//                                         return <PowderRow
//                                                     key={index}
//                                                     ky={index}
//                                                     K={K}
//                                                     setK={setK}
//                                                     item={item}
//                                                     items={analysed}
//                                                 />
//                                             }
//                                         }
//                           />
//                     </ScrollView>
//     </>
// }

// const PoudreWorkSpace=() => {
//     const dispatch=useDispatch();
//     const {setPop,setNewAna}=usePopup();
//     const inputRefs = useRef([]);
//     const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
//     const {targetUser,focusedProduct,powderAnalysed,currentProducted}=useSelector(state=>{
//         const targetUser = state.user.targetUser;
//         const powderAnalysed=state.powderAnalysed.powderAnalysed;
//         const focusedProduct=state.focusedProduct.focusedProduct;
//         const currentProducted=state.currentProducted.currentProducted;
//         return {targetUser,focusedProduct,powderAnalysed,currentProducted};
//     });

//     const enregistrerAllowed=allowTo("enregistrer analyse",targetUser?.privileges);
//     const CLE=enregistrerAllowed?"allowed":"notAllowed";
//     // alert(JSON.stringify(currentProducted))
//     const {toCreate,setAction,ListOfFocusedAndLastNumberTour,currentProductedPro,currentProductedLen,setFocusedList,setFocusedPro,focusedPro,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
//     const {freeChariot}=ListOfFocusedAndLastNumberTour(focusedProduct,powderAnalysed);
//     const {noErrors,errors,itemToSave}=useItemToSave();
//     // const numChariot=itemToSave?.nChar;
//     const numIdentifier=itemToSave?.identifier;
//     const {name,densite,nom,couleur,taches,format,parfum,percarbonate,mousses,max_gg,max_humidite,alcanite,matiere_active,compression,...Rest}=focusedPro;
    
//     const {estFormule,nameToDisplay}=isFormule(focusedPro);
//     const {silicate,sel,...REST}=Rest;
//     const rest=toCreate?REST:Rest;
//     // alert(JSON.stringify(rest))
//     const [visible,setVisible]=useState(false);
//     const [isMissing,setIsMissing]=useState(false);
//     const [missing,setMissing]=useState({});

//     function missingRequiredKeys(){
//         // const keysAndRequireds=[['nChar',true],['densite',true]];
//         const keysAndRequireds=[['densite',true]];
//         var missings=[];
//         keysAndRequireds.map(item=>{
//         if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
//             const msg=item[0].toUpperCase()+" is required !";
//             missings.push(msg);
//             return null;
//         }})
//         return missings;
//     };
 
//     //  useEffect(() => {

//     //         if(!socket.connected){
//     //             setPop({show:true,message:'Even-Driver disconnected',code:'#880000'})
//     //         }
//     //         function onAnalysePoudreAdded(data){
//     //             const {newAnalyse,lansas}=data;alert(JSON.stringify(data))
//     //             setRegistred(lansas);
//     //             dispatch(setPowderAnalysed(lansas));
//     //             setNewAna({show:true,id:newAnalyse?.id||101,code:data?.code || 'green'});
//     //         }
//     //         socket.on('analysePoudreAdded', (data)=>onAnalysePoudreAdded(data));
//     //         return () => {
//     //             socket.off('analysePoudreAdded');
//     //             };
//     //         }, []);

// const missings=missingRequiredKeys();
// const missingLength=missings.length;
// const keyOk=noErrors && missingLength===0 && toCreate;


//     const handleEnregistrerPress=()=>{
//         if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
//             return;
//         }
//         if(!noErrors){
//             setVisible(true);
//         }else{
//             // const observations=errors.reduce((acc,er)=>acc+'JOIN'+er)||"";
//             const observations="";
//             if(missingLength!==0){
//                 setMissing(missings);
//                 setIsMissing(true);
//                 setVisible(true);
//             }else{
//                 var saveObject={};
//                 if(toCreate){
//                     // ====================== build des non requis ==================================
//                     // const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>ky!=='densite');
//                     // notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];})// reconstruire notRequired sous forme d'objet js dans saveObject
                    
//                     // ====================== build du item a enregistre ============================
//                     const {list,freeChariot}=ListOfFocusedAndLastNumberTour(focusedProduct,powderAnalysed);
//                     // const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedPro,registred);// registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
//                     const identifier=freeChariot.toString()+"_"+AdjentDayInMs(new Date(),0).toString();
//                     // const {densite,silicate,sel,...rest}=saveObject;// pour retirer la densite ,le silicate et le sel
//                     const buildItem={...itemToSave,name:focusedProduct.name,identifier:identifier,nChar:parseFloat(freeChariot),observations:observations,categorie:"local",UtilisateurId:1};
//                     // alert(JSON.stringify(buildItem))
//                     const enregistre=[...registred,buildItem];// 2
//                     // ===================== Envoi aux memoires bdd & Context & store =====================
//                     setFocusedList([...list,buildItem]);
//                     dispatch(storeFocusedListe([...list,buildItem]));

//                     fetch(dbBaseRoot+"poudre/analyses/add",
//                        {method: 'POST',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(buildItem)
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         // console.log(data)
//                         const {code,message,analyses}=data;
//                         const {lansas,formules}=analyses;
//                         const ANALYSES=[...lansas,...formules];
//                         // alert(JSON.stringify(ANALYSES));
//                         setRegistred(ANALYSES);
//                         dispatch(setPowderAnalysed(ANALYSES));
//                         return lansas;
//                         // const toPop=code==='green'?
//                         //         {show:true,message:"Analyse enregistrée avec succes.",code:code}
//                         //         :
//                         //         {show:true,message:"L'analyse n'a pas pu etre enregistrée :"+error.message,code:'#880000'}
//                         // setPop(toPop);
//                     })
//                     .then(lansas=>{
//                         const ID=lansas.slice(-1)[0].id
//                         socket.emit('analysePoudreAdded',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
//                     })
//                     .catch((error)=>alert(error.message))
                    
//                     // dispatch(storeFocusedListe([...list,buildItem]));
//                     // setRegistred(enregistre);
//                     // dispatch(setPowderAnalysed(enregistre));
                   
//                 }else{
//                     const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
//                     const {list}=ListOfFocusedAndLastNumberTour(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
//                     const builtItem={...itemToSave,name:focusedProduct.name,observations:observations,categorie:"local",UtilisateurId:1};
//                     const enregistre=[...registredWithoutTheFocused,builtItem];// 2
//                     // ===================== Envoi aux memoires Context & store =====================
//                     setFocusedList([...list,{...itemToSave,name:focusedProduct.name,observations:observations,UtilisateurId:1}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
//                     dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
//                     fetch(dbBaseRoot+"poudre/analyses/updateTour/"+itemToSave.id,
//                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(builtItem)
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         const {code,message,analyses}=data;
//                         const {lansas,formules}=analyses;
//                         const ANALYSES=[...lansas,...formules];
//                         setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
//                         dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
//                         // const toPop=code==='green'?
//                         //         {show:true,message:"Analyse modifiée avec succes.",code:code}
//                         //         :
//                         //         {show:true,message:"L'analyse n'a pas pu etre modifiée: "+error.message,code:'#880000'}
//                         // setPop(toPop);
//                     });
//                     setAction("create");
//                 }
//             }
//         }
//     }
//     return <View style={{width:"96%",margin:'2%',padding:0}}>
       
//         {currentProductedLen!==0 && <View style={{width:"100%",height:"auto",/*minHeight:750,*/ borderRadius:10,backgroundColor:'rgba(255,255,255,0.6)',justifyContent:'flex-start',borderWidth:4,borderColor:'#dddddd',alignItems:'center'/*,paddingHorizontal:10,paddingVertical:8*/,gap:15}}>
//             {/* {taches!==undefined && <HeaderOfEdit name={nameToDisplay} couleur={couleur} taches={taches} />} */}
//             <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
//             <ProductedTour/>
//             <View style={{flexDirection:'row',justifyContent:'flex-start',padding:'3%',borderTopWidth:2,borderTopColor:'#dddddd',borderRadius:8,gap:5,width:'100%'}}>
//                 <Text style={[style.lansaValue,{fontSize:15,paddingHorizontal:10,fontWeight:'bold',textAlign:'center',alignContent:'center'}]}>{name}</Text>
//                 {Object.entries({chariot:{defaut:freeChariot,normes:{min:1,max:2000}},densite:densite}).map(([key,value],i)=><EditRow keyOk={keyOk} renderSave={()=>handleEnregistrerPress()} inputRefs={inputRefs} index={i} key={i} obj={{key:key,value:value}}/>)}
//                  <TouchableOpacity 
//                     disabled={!enregistrerAllowed}
//                                     style={{
//                                         width:80,// ct min
//                                         minHeight:50,// ct min
//                                         // marginTop:20,
//                                         backgroundColor:couleurs[CLE][7],
//                                         borderRadius:10,
//                                         paddingHorizontal:5,
//                                         paddingVertical:15,
//                                     }}
//                         onPress={handleEnregistrerPress}
//                     >
//                         <Text style={{color:"white",fontWeight:"bold",textAlign:"center"}}>Save</Text>
//                     </TouchableOpacity>
//             </View>
            
//         </View>}
//         {/* <Portal> */}
//             {/* <Pop/> */}
//             {/* <NewAnalysed/> */}
//         {/* </Portal> */}
//     </View>
// }


// // ============================ WorkSpace =====================================
// const HeaderOfEdit=({inputRefs,name,couleur,taches})=>{
// const {toCreate}=useCurrentProducted();
// const tachesSplit=taches?.split("-")|| [];
// return <View 
//                         style={{
//                         minWidth:"100%",
//                         minHeight:40,
//                         marginTop:0,
//                         backgroundColor:"rgba(250,250,250,0.06)",
//                         borderRadius:8,
//                         paddingHorizontal:40,
//                         paddingVertical:0,
//                         flexDirection:"row",
//                         justifyContent:"flex-start",
//                         alignItems:"center",
//                         gap:30
//                         }}
//                     >
//         <Text style={{height:"100%",fontWeight:"bold",textAlign:"center"}}> 
//             {!toCreate?"MAJ "+name?.toUpperCase():name?.toUpperCase()} 
//         </Text>
//         <View 
//             style={{
//                     borderWidth:1,
//                     borderColor:"rgba(0,0,0,0.1)",
//                     minWidth:"40%",
//                     minHeight:"90%",
//                     paddingHorizontal:40,
//                     backgroundColor:couleur,
//                     borderRadius:5,
//                     flexDirection:"row",
//                     justifyContent:"flex-start",
//                     alignItems:"center",
//                     gap:5
//                 }}>
//             <Text style={{minWidth:"55%",height:"100%",textAlign:"left",color:"grey"}}>{colors[couleur].nom}</Text>
//             {tachesSplit.map((clr,i)=><Text key={i} style={{width:"auto",height:"100%",color:"grey",textAlign:"center",backgroundColor:colors[clr].color,paddingHorizontal:5}}>{colors[clr].nom}</Text>)}
//         </View>
// </View>}
// // ============   =============== AnalysedList ==========================
// const PowderRow=({K,ky,ac,setK,item})=>{
//     const targetUser=useSelector(state=>state.user.targetUser);
//     const focusedProduct=useSelector(state=>state.focusedProduct.focusedProduct);
//     const clooned= useSelector(state => state.actived.clooned);
//     const scrollViewCommentsRef=useRef([]);
//     const {setPop}=usePopup();
//     const {toCreate,setId2Update,id2Update,setAction,setFocusedList,focusedPro,ListOfFocusedAndLastNumberTour,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
//     const {noErrors,pickItemToSave,itemToSave}=useItemToSave();
//     const obj={key:'densite',value:focusedPro.densite}
//     const headersKeys=["densite"];
//     const [focusedIndex,setFocusedIndex]=useState(null);
//     const [isCollapsed,setIsCollapsed]=useState(false);
//     const {nChar,name,identifier,Utilisateur,commentaires,couleur,taches,...rest}=item;
//     const chemist=Utilisateur?.pseudo;
//     const [comment,setComment]=useState("");
//     const allowToComment=allowTo("commenter",targetUser?.privileges);
//     const KEY=allowToComment?"allowed":"notAllowed";
//     const [commenteres,setCommenteres]=useState(commentaires);
//     const [comments,setComments]=useState(commentsFromObjectToArray(commentaires));

//     const [toggle,setToggle]=useState(false);
//     const {nameToDisplay}=isFormule(item);
//     const isHovered=K===identifier;
//     const isMeToUpdate=id2Update===item.id;
//     const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};

//     // const handleAddComment=()=>{
//     //     const pseudo=toggle?"ndour":"Moneem";
//     //     const commnts=[[comment,"Mamadou","Ndour",null,true,pseudo],...comments];
//     //     setToggle(!toggle);
//     //     setComments(commnts);
//     // }

//      const handleAddComment=()=>{
//           if(!allowToComment){ setPop({show:true,message:"Vous n'êtes pas autorisé à commenter une analyse.",code:''});return;}
//           if(comment){
//             if(targetUser){
//               const targetUserId=targetUser.id;
//               const commentToAdd={text:comment,AnalyseId:item?.id,Utilisateur:{id:1,fName:chemist,lName:chemist,isAdmin:false,pseudo:'ndour',url:'',createdAt:new Date()}}
//               AddPoudreComment({text:comment,AnalyseId:item?.id,UtilisateurId:targetUserId})
    
//               // hot reload messenges =============================
//               setCommenteres({...commenteres,commentToAdd})
//               setComments(commentsFromObjectToArray({...commenteres,commentToAdd}))
//               // ======================================================
//               setComment('');
//               // inputRef.current[key].value="";
//               scrollViewCommentsRef.current[ky]?.scrollToEnd({animated:true});
//             }
//             // else{
//             //   modalShow(true);
//             // }
//         }}
//     const handleKeyPress=(e)=>{
//         if(e.nativeEvent.key==='Enter'){
//         handleAddComment();
//     }
//     }

//     // ========================= POUR UPDATETOUR ===============================================
//     // itemToSave & focusedPro &focusedProduct & observations & setFocusedList & Dispatch & storeFocusedListe & setPowerAnalysed & setPop & set Action & setRegistred

//     const dispatch=useDispatch();
//     const inputRefs = useRef([]);
//     const enregistrerAllowed=allowTo("enregistrer analyse",targetUser?.privileges);
//     const CLE=enregistrerAllowed?"allowed":"notAllowed";
//     const numIdentifier=itemToSave?.identifier;
    
//     const [visible,setVisible]=useState(false);
//     const [isMissing,setIsMissing]=useState(false);
//     const [missing,setMissing]=useState({});

//     function missingRequiredKeys(){
//         // const keysAndRequireds=[['nChar',true],['densite',true]];
//         const keysAndRequireds=[['densite',true]];
//         var missings=[];
//         keysAndRequireds.map(item=>{
//         if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
//             const msg=item[0].toUpperCase()+" is required !";
//             missings.push(msg);
//             return null;
//         }})
//         return missings;
//     };
//     // ============================================================================================
   

//       function handleUpdateTour(vl){
//         if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
//             return;
//         }
//         if(!noErrors){
//             setVisible(true);
//         }else{
//             const observations="";
//             const missings=missingRequiredKeys();
//             if(missings.length!==0){
//                 setMissing(missings);
//                 setIsMissing(true);
//                 setVisible(true);
//             }else{
//                 // var saveObject={};
//                     const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
//                     const {list}=ListOfFocusedAndLastNumberTour(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
//                     const builtItem={...itemToSave,densite:vl,name:focusedProduct.name,observations:observations,categorie:"local",UtilisateurId:1};
//                     // const enregistre=[...registredWithoutTheFocused,builtItem];// 2
//                     // ===================== Envoi aux memoires Context & store =====================
//                     setFocusedList([...list,{...itemToSave,densite:vl,name:focusedProduct.name,observations:observations,UtilisateurId:1}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
//                     dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
//                     fetch(dbBaseRoot+"poudre/analyses/updateTour/"+itemToSave.id,
//                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(builtItem)
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         const {code,message,analyses}=data;
//                         const {lansas,formules}=analyses;
//                         const ANALYSES=[...lansas,...formules];
//                         setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
//                         dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
//                         const toPop=code==='green'?
//                                 {show:true,message:"Analyse modifiée avec succes.",code:code}
//                                 :
//                                 {show:true,message:"L'analyse n'a pas pu etre modifiée: "+error.message,code:'#880000'}
//                         setPop(toPop);
//                         setId2Update(null);
//                         setAction("create");
//                     })
                   
//             }
//         }
//     }
//     return <>
//     <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
//     <TouchableOpacity 
//                 style={
//                     [
//                         {
//                             flex:1,
//                             flexDirection:"column",
//                             justifyContent:"flex-start",
//                             alignItems:"center",
//                             minHeight:40,
//                             paddingVertical:2,
//                             paddingHorizontal:4
//                         },
//                         isHovered && hoveredStyle
//                     ]
//                 }

//                 onPress={() => {setFocusedIndex(item?.id);setIsCollapsed(!isCollapsed)}}
//                 onPressIn={()=>setFocusedIndex(item?.id)}
//                 onMouseEnter={()=>setK(identifier)}
//                 onMouseLeave={()=>setK(null)}
//             >
//                 <View 
//                     style={{
//                         flex:1,
//                         width:"100%",
//                         flexDirection:"row",
//                         justifyContent:"flex-start",
//                         alignItems:"center"
//                     }}
//                 >
//                     <Chariot oldCh={Number(nChar)} id={item.id}/>
//                     <Text style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",minWidth:100,fontSize:isHovered?16:14,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{nameToDisplay}</Text>

//                     {/* {
//                         headersKeys.map((ky,i)=>{
//                                 const isInHeadersKeys=rest[ky]!==undefined;
//                                 return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?rest[ky]:"..."}</Text>//isInHeadersKeys?vl[cle]:"..."
//                             })
//                     } */}
//                     {(id2Update!==null && isMeToUpdate)?
//                     <EditRow render={(vl)=>handleUpdateTour(vl)} inputRefs={[]} index={0} obj={obj} />
//                     :
//                     <Text key={0} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:14,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{rest['densite']}</Text>}
//                     <View style={{...styles.row,marginBottom:2,marginRight:4,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 38,}}>
//                         {isHovered && <Actions item={item} />}
//                     </View>
//                 </View>
//                 {//comments,handleAddComment,handleKeyPress,comment
//                     focusedIndex===item?.id && <Collapsible collapsed={isCollapsed}>
//                         <View style={{minWidth:ac?880:550,width:"100%",height:"auto",padding:20,paddingVertical:0,marginHorizontal:'auto',backgroundColor:'rgba(0,0,0,0.1)',
//                             flexDirection:"column",
//                             justifyContent:"flex-start",
//                             alignItems:"center",

//                         }}>
//                                 <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+"3.4.2026"+"   updated : "+"4.3.2026"+"  By:"+"ndour"+"  "}</Text></View>
//                                 {/* <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+ReduceDateTime(createdAt)+"   updated : "+ReduceDateTime(updatedAt)+"  By:"+chemist+"  "+(validation?(" validated by: "+validateur+" on: "+ReduceDateTime(validatedAt)):"")}</Text></View> */}
//                                 <View style={{width:'100%',minHeight:100,padding:24,borderRadius:5,paddingTop:5,backgroundColor:'rgb(180,180,180)',}}>
//                                     {/* <Text style={{color:'black',fontWeight:'bold',}}>{"Analyse "+id+" - "+categorie+"."+item.name+" Observations : "}<Observations obs={observations}/> </Text> */}
//                                     <ScrollView ref={scrollViewCommentsRef}>
//                                         <View style={{width:'100%',paddingBottom:50,flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
//                                             {comments.map((cmnt,index)=><Comment key={index} targetPseudo={null} color={Colors.Bleu} comnt={cmnt}/>)}
//                                         </View>
//                                     </ScrollView>
//                                 </View>
//                                 <View style={{...Flex('row','center','center'),zIndex:10,width:'90%',height:80,marginTop:-12,bottom:0,}}>
//                                     <TouchableWithoutFeedback style={{width:'80%',height:'60%',}}>
//                                         <TextInput
//                                             style={{display:'block',backgroundColor:'white',width:'100%',padding:5,margin:5,borderRadius:5,paddingHorizontal:12,overflowX:'wrap',minHeight:40,maxHeight:100,height:'60%'}}
//                                             placeholder="Your new comment here ..."
//                                             // ref={inputRef}
//                                             onSubmitEditing={handleAddComment}
//                                             onChangeText={(value)=>setComment(value)}
//                                             onKeyPress={handleKeyPress}
//                                             value={comment}
//                                         />
                    
//                                     </TouchableWithoutFeedback>
//                                     <TouchableOpacity
//                                     onPress={handleAddComment}
//                                     style={{maxWidth:48,width:'20%',height:'50%',paddingHorizontal:6,paddingVertical:4,margin:6,backgroundColor:'blue',borderRadius:5,...Flex('column','center','center'),}}
//                                     >
//                                     <Text style={{color:'white',textAlign:'center',fontWeight:'bold',}}>
//                                     <Icon name="paper-plane" size={17} color="#fff"/>
//                                     </Text>
                    
//                                     </TouchableOpacity>
//                                 </View>
//                         </View>
//                     </Collapsible>
//                 }
//             </TouchableOpacity>
//             </>
// }

// const EditRow=({render,renderSave,keyOk,inputRefs,index,obj})=>{ // import de DrawerPoudre
//     const {key,value}=obj;
//     const labelJoined=key.split("_").join(" ").replace("max ","").replace("gg","Gros grains");
//     const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
//     const {pickItemToSave,itemToSave}=useItemToSave();
//     const [input,setInput]=useState("");
//     const uniquePropriete=["max_gg","max_humidite"];
//     const min=uniquePropriete.includes(key)?0:(value?.normes?.min || 0);
//     const max=uniquePropriete.includes(key)?value?.normes:(value?.normes?.max || 1000);
//     const invalidOrSave = (val) => {
//     return new Promise((resolve, reject) => {
//             const valFormat = Number.isNaN(Number(val)) ? val : Number(val); 
//             const { icon, obs } = InputIsValid({ input: valFormat, label: labelJoined, normes: { min, max } });
//             setIconAndObs({ icon, obs });
//             pickItemToSave({"key":key,"value":val,"message":obs})
//             if (obs === "") {resolve("ok");} else {reject("ko");}
//         });
//     };
//     function handleCheckValidity(val){
//         invalidOrSave(val)
//         .then(rep=>{
//             if(rep==="ok"){
//                 render!==undefined && render(val);
//             }
//         })
//         .catch(function(error){
//             throw new error("❌ there's error");
//         })
        
        
//     }
//     return <View style={{width:"100",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
//         <LansaValue render={()=>render()} renderSave={renderSave} inputRefs={inputRefs} keyOk={keyOk} index={index} value={input} labelJoined={labelJoined} icon={iconAndObs.icon} renderValidity={()=>handleCheckValidity(input)} renderVal={(val)=>setInput(val)}/>
//         {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
//     </View>
// }

// const LansaValue=({inputRefs,renderSave,keyOk,index,labelJoined,icon,value,renderValidity,renderVal})=>{ // import de DrawerPoudre
//     const inputDensityRef=useRef(null);
//     const {setNewAna}=usePopup();
//     const {currentProductedLen,focusedPro,toCreate}=useCurrentProducted();
//     const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
//     const [textValue,setTextValue]=useState("");
//     const IamFocused=index===INDEX;
//     // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
//     // const currentProductedLen=currentProducted.length;
//     const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);

//     // useEffect(() => {
//     //          // 1. Connexion au serveur
//     //         socket.connect();
//     //         socket.on('analysePoudreAdded', (data) => {
//     //             setNewAna({show:true,id:data?.nChar,code:'green'});
//     //             return ;
//     //         });
//     //         return () => {
//     //             socket.off('analysePoudreAdded');
//     //             socket.disconnect();
//     //             };
//     //         }, []);

//     useEffect(()=>{
//         if(!toCreate){
//             const valeur=itemToSave?.name && itemToSave[label.replace("Gros grains","gg").replace("Matiere active","matiere_active").toLowerCase()];
//             setTextValue(valeur); 
//             // alert(JSON.stringify(itemToSave))
//         }else{
//             setTextValue("");
//             setItemToSave({});
//         }
//     },[toCreate])

//     function handleLenOverFive(val){if (val.length === 5) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
//     const handleNext = () => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
//     const handleKeyPress = (e) => {const { key } = e.nativeEvent;
//         if (key === 'ArrowRight') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
//         if (key === 'ArrowLeft') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
//         if (key === 'Enter') {renderValidity();if(keyOk){renderSave();if (inputDensityRef) inputDensityRef?.current?.focus();}}
//     };
    
//     return <TextInput
//         disabled={currentProductedLen===0 || labelJoined==='chariot'}
//         returnKeyType="next"
//         onKeyPress={handleKeyPress} 
//         onSubmitEditing={handleNext}
//         onFocus={()=>toCreate && setIndex(index)}
//         blurOnSubmit={false}
//         selectTextOnFocus="true"
//         maxLength={5}
//         label={label}
//         value={textValue} 
//         style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
//         // ref={(el) => (inputRefs.current && (inputRefs.current[index] = el))}
//         ref={inputDensityRef}
//         onBlur={()=>renderValidity()}
//         onChangeText={(val)=>{setTextValue(val);renderVal(val);handleLenOverFive(val)}}
//         right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
//     />
// }
// // =============================================================================

// // const Chariot=({oldCh,id})=>{ // import drawerPoudre
// //     const [ch,setCh]=useState(oldCh);
// //     const {setPop}=usePopup();
// //     const dispatch=useDispatch();
// //     const {ListOfFocusedAndLastNumberTour,setFocusedList,setRegistred}=useCurrentProducted();
// //     const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed)

// //     function handleBlur(newCh){
// //         const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.id)!==Number(id));
// //         const item=powderAnalysed.filter(it=>Number(it.id)===Number(id))[0];
// //         const newItem={...item,nChar:Number(newCh),UtilisateurId:1};

// //         const updteOwderAnalysed=[...updatedPowderAnalysed,newItem].sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar);
// //         const {list}=ListOfFocusedAndLastNumberTour(item,updteOwderAnalysed);
// //         setFocusedList(list);
// //         dispatch(storeFocusedListe(list));
// //         if(!item.id){setPop({show:true,message:"Erreur sur l'ID cible ! Peut-etre UNDEFINED | NULL .",code:'#880000'});return}
// //         fetch(dbBaseRoot+"poudre/analyses/updateChariot/"+item.id,
// //                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
// //                         body:JSON.stringify(newItem)
// //                     })
// //                     .then(response=>response.json())
// //                     .then(data=>{
// //                         const {message,code,analyses}=data;
// //                         const {lansas}=analyses;
// //                         setRegistred(lansas.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
// //                         dispatch(setPowderAnalysed(lansas.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
// //                         const toPop=code==='green'?
// //                                 {show:true,message:"Chariot changé avec succes.",code:code}
// //                                 :
// //                                 {show:true,message:"Le numero de chariot n'a pas pu etre modifié :"+message,code:'#880000'}
// //                         setPop(toPop);
// //                     })
// //     }

// //     return <TextInput
// //         value={ch}
// //         onBlur={()=>handleBlur(Number(ch))}
// //         onChangeText={(CH)=>setCh(CH)}
// //         style={{flex: 1,textAlign: "left",maxWidth:30,width:20,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:14,letterSpacing:2}}
// //     />
// // }

// const Actions=({item})=>{// import de DrawerPoudre
//     const dispatch=useDispatch();
//     const {setPop}=usePopup();
//     const {setFocusedPro,setId2Update,UpdateFocusedProdByName,setRegistred,setFocusedList,ListOfFocusedAndLastNumber,setAction,focusedPro}=useCurrentProducted();
//     const {targetUser,powderNormes,powderAnalysed,focusedListe}=useSelector(state=>{
//         const powderNormes=state.powderNormes.powderNormes;
//         const targetUser = state.user.targetUser;
//         const {powderAnalysed,focusedListe}=state.powderAnalysed;
//         return {targetUser,powderNormes,powderAnalysed,focusedListe};
//     });
//     const deleteAllowed=allowTo("supprimer analyse",targetUser?.privileges);
//     const updateAllowed=allowTo("modifier analyse",targetUser?.privileges);
//     const delKey=deleteAllowed?"allowed":"notAllowed";
//     const updKey=updateAllowed?"allowed":"notAllowed";
//     const {setItemToSave}=useItemToSave();
//     const {name,id}=item;
//     const handleDelete=async ()=>{
//         // if(!deleteAllowed){setPop({show:true,message:"Vous n'avez pas la permission de supprimer une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#88000'});return;}
//         try{
//             const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.id)!==Number(id));
//             const {list}=ListOfFocusedAndLastNumber(item,updatedPowderAnalysed);
//            if(!id){setPop({show:true,message:"Erreur sur l'ID cible. ID undefined || null .",code:'#880000'});return}
//             fetch(dbBaseRoot+"poudre/analyses/delete/"+targetUser.id+"/"+id,
//                        {method: 'DELETE',headers: {'Content-Type': 'application/json'}
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         // console.log(data)
//                         const {code,message/*,analyses*/}=data;
//                         // const {lansas,formules}=analyses;
//                         // const ANALYSES=[...lansas,...formules];
//                         // const {list}=ListOfFocusedAndLastNumber(item,ANALYSES);
//                         // dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)));
//                         // dispatch(storeFocusedListe(list));
//                          // mise a jour des data statement ==========================
//                             // Provider
//                         if(code==="green"){
//                             setFocusedList(list);
//                             setRegistred(updatedPowderAnalysed);
//                                 // store de redux
//                             dispatch(setPowderAnalysed(updatedPowderAnalysed));
//                             dispatch(storeFocusedListe(list));
//                         }
//                         const toPop=code==='green'?
//                                 {show:true,message:"Analyse "+id+" avec succes.",code:code}
//                                 :
//                                 {show:true,message:"L'analyse "+id+" n'a pas pu etre supprimée :"+error.message,code:'#880000'}
//                         setPop(toPop);
//                     })
//             // ==========================================================
            
//             // render(updatedPowderAnalysed);
//           // Mise a jour coté bdd
//         // /*const response=*/ await fetch(`${dbBaseRoot}analyses/delete/${id}`,{
//         //   method:'DELETE',
//         //   headers: {
//         //       'Content-Type':'application/json'
//         //   },});
//           // Mise à jour coté UI
//             // const itms=items.filter(item=>item.id!==id);
//             // dispatch(postAnalyses(null));
//             // render(itms);
//         }catch(error){
//             setPop({show:true,mesage:"Analyse "+item.id+" n'a pu etre supprimee !"+error,code:'#880000'});
//         }
//     }
//     const confirmDelete=()=>{
//         if(!deleteAllowed){setPop({show:true,message:"Vous n'avez pas la permission de supprimer une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#88000'});return;}
//         isWeb?(confirm("Etes-vous sur de  vouloir supprimer cet enregistrement ?")?handleDelete():null)
//       :
//       Alert.alert("Confirmation",
//           "Etes-vous sur de  vouloir supprimer cet enregistrement ?",
//           [
//             {
//               text:"Annuler",
//               style:"cancel",
//               onPress:()=>null
//             },
//             {
//               text:"Continuer la suppression",
//               onPress:()=>handleDelete()
//             }
//           ],
//           {cancelable:true}
//         )}

//   const handleUpdate=async ()=>{
//     if(!updateAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission de modifier une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#880000'});return;}

//     //   const itemKey=name.split(" ").join("_").toLowerCase();
//     //   const itemNormes=powderNormes[itemKey];
//     //   setFocusedPro(itemNormes);
//     // UpdateFocusedProdByName(item);
//     setId2Update(item.id)
//     setItemToSave(item);
//     setAction("update");

//   }

//   return <TouchableWithoutFeedback>
//     <View
//       style={{
//         height:"auto",
//         width:150,
//         paddingVertical: 3,
//         borderRadius: 8,
//         backgroundColor:'white',
//         // ...Flex('row','center','center')
//         }}
//     >
//     {/* {
//       user && user.isAdmin? */}
//       <>
//         <Pressable style={{...style.actions,marginRight:45,}} disabled={!deleteAllowed} onPress={confirmDelete}>
//             <Icon size={14} name="trash" color={couleurs[delKey][8]}/>
//         </Pressable>
//         <Pressable style={{...style.actions,marginLeft:50,}} disabled={!updateAllowed} onPress={handleUpdate}>
//             <Icon size={14} name="pencil" color={couleurs[updKey][7]}/>
//         </Pressable>
//         {true?<Pressable style={{...style.actions,marginLeft:100,}} disabled={!updateAllowed} onPress={handleUpdate}>
//             {/* <Icon size={14} name="pencil" color={couleurs[updKey][7]}/> */}
//             <Text style={[style.addedbuttons,{backgroundColor:'rgba(150,0,0,0.08)'}]}>Isol</Text>
//         </Pressable>:
//         <Pressable style={{...style.actions,marginLeft:100,}} disabled={!updateAllowed} onPress={handleUpdate}>
//             {/* <Icon size={14} name="pencil" color={couleurs[updKey][7]}/> */}
//             <Text style={[style.addedbuttons,{backgroundColor:'rgba(0,150,0,0.08)'}]}>Inject</Text>
//         </Pressable>}

//       </>
//       {/* :<Text>...</Text>
//     } */}
//     </View>
//   </TouchableWithoutFeedback>
// }

// const CarteProduct=({PRODUCT})=>{
//     const {name,totalCount,isolatedCount}=PRODUCT;
//     return <View style={style.carteMain}>
//         <View style={style.carteRow}>
//             <Text style={style.carteCol1}><Text style={{position:'absolute',top:-20,fontSize:25}}>📌</Text></Text>
//             <Text style={[style.carteCol2,{backgroundColor:'#e7e0ec'}]}>{name}</Text>
//         </View>
//         <View style={style.carteRow}>
//             <Text style={style.carteCol1}>TOTAL</Text>
//             <Text style={style.carteCol2}>{totalCount}</Text>
//         </View>
//          <View style={[style.carteRow,{backgroundColor:'rgba(100,0,0,0.1)',borderBottomLeftRadius:6}]}>
//             <Text style={style.carteCol1}>T ISOLES</Text>
//             <Text style={[style.carteCol2,{color:'red'}]}>{isolatedCount}</Text>
//         </View>


//     </View>
// }

// // =========================================================================



// // const LansaObservations=({obs})=>(obs!=="" && <Text style={style.lansaObservations}>{obs}</Text>);// import de DrawerPoudre

// // function InputIsValid({input,label,normes}){ // import de DrawerPoudre
// //     const {min,max}=normes;
// //     const labl=label.toUpperCase();
// //     if(Number.isNaN(Number(input))) return {icon:"alert",obs:"Input must be numeric"};
// //     switch(true){
// //         case input<min:
// //            return {icon:"close",obs:labl+" is low"};
// //            break;
// //         case input>max:
// //             return {icon:"close",obs:labl+" is high"};
// //            break;
// //         case (input>=min && input<=max):
// //             return {icon:"check",obs:""};
// //            break;
// //         default:       
// //             return {icon:"alert",obs:"Invalid input"};
// //     }
// // }


// const style=StyleSheet.create({
//     carteMain:{maxWidth:210,height:160,borderWidth:2,borderRadius:8,borderColor:'#e7e0ec',backgroundColor:'#e7e0ec',padding:5,margin:10,flexDirection:'column',justifyContent:'center'},
//     carteRow:{width:'100%',height:50,borderBottomWidth:0.5,borderCollor:'black',flexDirection:'row',justifyContent:'flex-start'},
//     carteCol1:{width:70,height:'100%',alignContent:'left'},
//     carteCol2:{width:130,height:'100%',borderLeftWidth:0.5,backgroundColor:'white',borderCollor:'grey',alignContent:'center',fontWeight:'bold',textAlign:'center'},
//     lansaValue:{
//         minWidth:120,//"90%",
//         maxWidth:150,
//         borderWidth:1,
//         borderRadius:5,
//         textAlign:"center",
//         fontSize:15,
//     },
//     lansaObservations:{
//         maxWidth:65,
//         width:"auto",
//         backgroundColor:"rgba(0,0,0,0.15)",
//         borderWidth:1,
//         borderColor:"red",
//         borderRadius:8,
//         borderBottomLeftRadius:1,
//         fontSize:9,
//         fontWeight:"bold",
//         padding:10,
//         paddingVertical:5,
//         marginTop:-10
//     },
//     actions:{
//         position:'absolute',
//         zIndex:1000,
//         height:'80%',
//         width:35,
//         flexDirection:'row',
//         alignItems:'center',
//         justifyContent:'center',
//     },
//     addedbuttons:{
//         fontWeight:'bold',
//         fontSize:10,
//         textAlign:'center',
//         alignContent:'center',
//         padding:6,
//         margin:3,
//         borderWidth:0.5,
//         borderColor:'rgba(0,0,0,0.2)',
//         borderRadius:5
//     }

// })
