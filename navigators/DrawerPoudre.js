import { useMemo,useEffect,useLayoutEffect,useState,useRef } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation ,useNavigationState} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet,TouchableWithoutFeedback,Pressable,ActivityIndicator,Platform,FlatList, TouchableOpacity } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons';
import { Searchbar,TextInput,Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch,useSelector } from 'react-redux';
import socket from '../assets/socketService';
import { dbBaseRoot,primaryColor,couleurs  } from '../assets/constantes';
import { Periodes } from '../components/periode';
import { HeaderRight } from './DrawerNavigator';
import { PowderHeaders } from '../components/tables/componentTable';
import Pop from '../components/popup';
import CustomPoudreDrawerContent from '../components/customPoudreDrawerContent';
import {FormulesProvider,CurrentProductedProvider,useCurrentProducted,useFormules,ItemToSaveProvider, useItemToSave, usePopup } from '../components/wrappers/contexts';
import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
import { setPowderAnalysed } from '../components/store/reducers/powderAnalysesReducer';
import { storeFocusedListe } from '../components/store/reducers/currentProducted';
import PoudreAnalysedTab from './poudreTabNavigator';
import WinDim from '../assets/operatingData';
import { Lansas,routesAndHeadersPowder,headersTour } from '../iterables';
import { styles } from '../components/tables/componentTable';
import { ViewOrImgBgPowderWrapper } from '../components/wrappers/viewOrImgWrapper';
import EnteteRow from '../components/entete-row.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Comment } from '../components/tables/chat-for-table';
import { AdjentDayInMs} from '../components/periode';
import { isFormule,allowTo,isAlreadyAnalysed,Chariots,IsEmptyObject,moy,keyReduce,realKeyFromEntete} from '../assets/functions';
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
export const colors={
    "white":{
        "nom":"Blanc",
        "color":"rgb(255,255,255)"
    },
    "red":{
        "nom":"Rouge",
        "color":"rgba(255,0,0,0.4)"
    },
    "blue":{
        "nom":"Bleu",
        "color":"rgba(0,0,255,0.4)"
    },
    "green":{
        "nom":"Vert",
        "color":"rgba(0,255,0,0.4)"
    }

}

export const Errors = ({visible,render,isMissing,missing}) => {
    const {errors,noErrors}=useItemToSave();
    const Errors=(isMissing && noErrors)?missing:errors;
    const errorsLen=Errors.length;
    return  <Portal>
          <Dialog style={{maxWidth:700,minWidth:400,marginHorizontal:"auto"}} visible={visible} onDismiss={()=>render()}>
            <Dialog.Title style={{fontSize:15,color:"red",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>{errorsLen+" invalid input"+(errorsLen>1?"s":"")}</Dialog.Title>
            <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto"}}>
              {Errors.map((er,i)=><Text variant="bodyMedium" key={i} style={{marginBottom:20}}>{"🚨 "+er}</Text>)}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>render()}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
}

export const UpdateLansa = ({visible,item}) => {
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

export default function DrawerPoudre(){
    const {setPop}=usePopup();
    const dispatch=useDispatch();
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
                <Drawer.Screen name="Lansas" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
                <Drawer.Screen name="Formules" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
                
            </Drawer.Navigator>
        </ItemToSaveProvider>
    </CurrentProductedProvider>
    
  );

}

const Tabs=({navigation,route}) => {
    return <View 
    style={{flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor:'rgba(0,0,0,0.9)',
        width:"100%",
        padding:3,
        paddingVertical:0,
    }}
>
            <FormulesProvider>
                <ViewOrImgBgPowderWrapper uri="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDM5MW5yYnZlcGE0Mm80YjlncTR5cG41cG5rNWhua2N2enBudXk2YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SnwifA7bOFDhe/giphy.gif">
                    <AnalysedTab/>
                </ViewOrImgBgPowderWrapper>
                <AnalysedList/>
            </FormulesProvider>
        </View>
}

const AnalysedTab=() => {
    return  <View style={{width:"100%",backgroundColor:'rgba(250,250,250,0.1)',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginRight:2}}>
        <PoudreAnalysedTab/>
        <PaperProvider><PoudreWorkSpace mission="create"/></PaperProvider>
    </View>
}

const AnalysedList=() => {
        // const [loading,setLoading]=useState(false);
        const [K,setK]=useState(null);
        const {powderAnalysed,focusedListe}=useSelector(state=>{
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            const focusedListe=state.currentProducted.focusedListe;
            return {powderAnalysed,focusedListe};
        })
        const [analysed,setAnalysed]=useState([]);
        const {registred}=useCurrentProducted();
        function handleResearchChange(txt){
            // alert(JSON.stringify(registred))
            const matchedAnalysed=powderAnalysed.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
            setAnalysed(matchedAnalysed);
            // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
        }
        useMemo(()=>{setAnalysed(focusedListe.filter(item=>isAlreadyAnalysed(item)))},[focusedListe]);// focusedListe du store etait import pour cette partie
        const {name,nom}=focusedListe[0]||{};
        const {nameToDisplay}=isFormule(focusedListe[0]||{})
        // const AnalysedLen=analysed.length;
        // const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
    return <View style={{flex:1,width:"55%",minHeight:700,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
            <View style={{width:"100%",height:75,backgroundColor:"#ddd",flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderBottomWidth:2,borderColor:"black",paddingHorizontal:20,paddingRight:10,marginBottom:10}}>
                <View style={{width:"65%",flexDirection:"row-reverse",justifyContent:"flex-start",alignItems:"center",gap:0}}>
                <HeaderRight isLarge={isLarge} liq={false}/>
                <Searchbar
                    placeholder="Numero nChar..."
                    onChangeText={(txt)=>handleResearchChange(txt)}
                    value={null}
                    style={{margin:0,backgroundColor:'rgba(255,255,255,0.9)',width:"70%",height:"auto"}}
                />
                </View>
                <Text style={{fontSize:12,textAlign:"center",fontWeight:'bold',width:"35%"}}>{/*nom ||name*/nameToDisplay}</Text>
            </View>
            <View style={{width:"100%",height:"auto",minHeight:740,maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
                <PowderHeaders headers={headers}/>
                {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
                        ) : ( */}
                    <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}>
                          <FlatList
                                        data={analysed}
                                        keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
                                        renderItem={({ item },index) =>{
                                        return <PowderRow
                                                    key={index}
                                                    K={K}
                                                    setK={setK}
                                                    item={item}
                                                    items={analysed}
                                                />
                                            }
                                        }
                          />
                    </View>
                {/* <View 
                style={{
                        flex:1,
                        maxHeight:60,
                        width:"96%",
                        paddingHorizontal:"2%",
                        marginVertical:10,
                        paddingVertical:8,
                        flexDirection:"row",
                        gap:40,
                        position:"absolute",
                        bottom:10,
                        backgroundColor:"rgb(0,90,0)",
                        borderBottomLeftRadius:8,
                        borderBottomRightRadius:8,
                        }}
                >
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>Les moyennes </Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"GG "+(GG/AnalysedLen).toFixed(2)}</Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"HUM. "+(HUMIDITE/AnalysedLen).toFixed(2)}</Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"MA "+(MATIERE_ACTIVE/AnalysedLen).toFixed(2)}</Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"ALCA. "+(ALCANITE/AnalysedLen).toFixed(2)}</Text>
                </View> */}
            </View>
                        {/* )
                  } */}
        </View>
}

export const AnalysedListTour=() => {
        const [K,setK]=useState(null);
        const scrollViewRef = useRef(null);

        /* Experimentation: relation entre redux et le contexte(on set le redux->le context prend 
        [auto: non pas auto finalement !il fautun useEffect dans le context
         ou passer directement la valeur du redux dans l'objet du context pour que le context se met à jour automatiquement ]
          du redux et hot-reload sur UI ???? )*/
        const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed); // const {powderAnalysed/*,focusedListe*/}=useSelector(state=>{
        //     const powderAnalysed=state.powderAnalysed.powderAnalysed;
        //     // const focusedListe=state.currentProducted.focusedListe;
        //     return {powderAnalysed/*,focusedListe*/};
        // })
        const [analysed,setAnalysed]=useState([]);
        const {registred,focusedList}=useCurrentProducted();
        
        useEffect/*useMemo*/(()=>{setAnalysed(focusedList.slice(-20))},[focusedList]);// focusedListe du store etait import pour cette partie

        const {name,nom}=focusedList[0]||{};
        const AnalysedLen=analysed.length;
    return <View style={{flex:1,width:"100%",minHeight:400,borderWidth:1,borderColor:'grey',borderRadius:15,backgroundColor:'white',paddingVertical:20,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2,marginTop:40}}>
            
            <View style={{width:"100%",height:"auto",minHeight:400,maxHeight:400,paddingHorizontal:10,paddingVertical:0}}>
                <PowderHeaders headers={headersTour}/>
                    {/* <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}> */}
                        <ScrollView 
                                ref={scrollViewRef}
                                horizontal={false}
                                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                                style={{width:"100%",maxHeight:300,padding:10/*,overflowY:"scroll",*/}}
                            >
                          <FlatList
                                        data={analysed}
                                        keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
                                        renderItem={({ item },index) =>{
                                        return <PowderRowTour
                                                    key={index}
                                                    K={K}
                                                    setK={setK}
                                                    item={item}
                                                    items={analysed}
                                                />
                                            }
                                        }
                          />
                          </ScrollView>
                    {/* </View> */}
            </View>
        </View>
}

export const AnalysedListe=({product,rend}) => {// Pour Poudre-full
        // const [loading,setLoading]=useState(false);
        // const route=useRoute();
        const tabNavigation=useNavigation();
        // 2. Remonte d'un niveau pour cibler le Drawer Navigator parent
        const drawerNavigation = tabNavigation.getParent(); 

        const dispatch=useDispatch();
        const {startedAt,endedAt}=useSelector(state=>state.period.targetPeriod);
        const [K,setK]=useState(null);
        const {setPop}=usePopup();
        const {powderFiltred,powderAnalysed,powderType,type,focusedListe}=useSelector(state=>{
            const powderFiltred=state.powderAnalysed.powderFiltred;
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            const {powderType,type}=state.powderAnalysed;
            const focusedListe=state.currentProducted.focusedListe;
            return {powderFiltred,powderAnalysed,powderType,type,focusedListe};
        })
        const [analysed,setAnalysed]=useState([]);
        const {entete}=useCurrentProducted();


        useLayoutEffect(()=>{
            fetch(`${dbBaseRoot}poudre/analyses?startedAt=${startedAt}&endedAt=${endedAt}`) 
            .then(response=>response.json())
            .then(data=>{dispatch(setPowderAnalysed(data.analyses));rend(powderAnalysed);})//;/*setAnalysed(data.analyses)*/})// losque powderAnalysed changera setAnalyses se fera du useEffect plus en dessous
            .catch(function(error){ 
                setPop({show:true,message:error.message,code:"#880000"})
            })
        },[]);

        // ========================================= AFFICHAGE DE LA ROUTE =======================================
        const suffixe = product ? `/ ${product}` : '';
        const TYPE=type?`/ ${type}` : '/*';
        const NTT=(entete && entete!=='heure')?` #${entete}`:'';
        // 1. Récupérer PRÉCISEMENT le nom de la route active du Drawer enfant
        const drawerRouteName = useNavigationState((state) => {
                // On cherche l'état de la route actuellement affichée
                const route = state.routes[state.index];
                // Si cette route contient elle-même un état imbriqué (le Drawer)
                if (route.state) {return route.state.routes[route.state.index].name;}
                // Valeur de secours si l'état n'est pas encore initialisé

                return route.name;
            });
        useEffect(()=>{if (drawerNavigation) {drawerNavigation.setOptions({title: `${drawerRouteName} / poudres ${TYPE}`})}},[type])
        useMemo(()=>{
            if (drawerNavigation) {drawerNavigation.setOptions({title: `${drawerRouteName} / poudres ${TYPE}${suffixe}${NTT}`, /*Affiche visuellement : "Boutique/favoris"*/});};
        // ==========================================================================================================
            setAnalysed(powderFiltred);
        },[product, drawerRouteName, drawerNavigation,entete]);// product pour gerer le cas du clic sur un decompte-item



        useEffect/*useMemo*/(()=>{
            setAnalysed(powderType); // filtrer suivant le type (extra,local,finies,get,diam,...)
            ///** Essayons -le */ rend(powderAnalysed); // construit les chipps: doit rester constatn que owderAnalysed n'a pas changé: Pouvait se faire dans le useLayoutEffect si aucune mise a jour des powderAnalysed n'est envisagée
        },[powderAnalysed,powderType]);// focusedListe du store etait import pour cette partie

        // const AnalysedLen=analysed.length;
        // const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);

        // =========================================== POUR  EnteteRow seulement ==============================================
        const entetesAlreadyIn=[];
        function enteteIsIn(ent){if(!entetesAlreadyIn.includes(ent)){entetesAlreadyIn.push(ent);return false;}else{return true;}};
        

    return <View style={{flex:1,width:"100%",height:"auto",padding:50,paddingTop:20,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
            <View style={{width:"100%",height:"auto",height:"auto",maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
                <PowderHeaders donnees={analysed} headers={headers} render={(anlyss)=>setAnalysed(anlyss)}/>
                {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
                        ) : ( */}
                    <View style={{width:"100%",height:"auto",maxHeight:740,marginBottom:70,overflowY:"scroll",}}>
                          <FlatList
                                        data={analysed}
                                        keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
                                        renderItem={({ item },index) =>{
                                            const realKey=realKeyFromEntete(entete,item);
                                            return <>
                                                {realKey!==undefined && !enteteIsIn(realKey) && <EnteteRow analysed={analysed} ntte={realKey} prodName={item.name}/>}
                                                <PowderRow
                                                    key={index}
                                                    K={K}
                                                    setK={setK}
                                                    item={item}
                                                    items={analysed}
                                                    ac={true}
                                                />
                                            </>
                                            }
                                        }
                          />
                    </View>
                {/* {product!==null && <View 
                style={{
                        flex:1,
                        maxHeight:60,
                        width:"96%",
                        paddingHorizontal:"2%",
                        marginVertical:10,
                        paddingVertical:8,
                        flexDirection:"row",
                        gap:40,
                        position:"absolute",
                        bottom:10,
                        backgroundColor:"rgb(0,90,0)",
                        borderBottomLeftRadius:8,
                        borderBottomRightRadius:8,
                        }}
                >
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>Les moyennes </Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"GG "+(GG/AnalysedLen).toFixed(2)}</Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"HUM. "+(HUMIDITE/AnalysedLen).toFixed(2)}</Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"MA "+(MATIERE_ACTIVE/AnalysedLen).toFixed(2)}</Text>
                    <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"ALCA. "+(ALCANITE/AnalysedLen).toFixed(2)}</Text>
                </View>} */}
            </View>
                        {/* )
                  } */}
        </View>
}

export const PowderRow=({K,ac,setK,item})=>{
    const headersKeys=["gg","humidite","matiere_active","alcanite","silicate","sel"];
    const clooned= useSelector(state => state.actived.clooned);
    const [focusedIndex,setFocusedIndex]=useState(null);
    const [isCollapsed,setIsCollapsed]=useState(false);
    const [comment,setComment]=useState("");
    const [toggle,setToggle]=useState(false);
    const [comments,setComments]=useState([]);
    const {nChar,name,identifier,couleur,taches,...rest}=item;
    const {nameToDisplay}=isFormule(item);
    const isHovered=K===identifier;
    const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};
    const handleAddComment=()=>{
        const pseudo=toggle?"ndour":"Moneem";
        const commnts=[[comment,"Mamadou","Ndour",null,true,pseudo],...comments];
        setToggle(!toggle);
        setComments(commnts);
    }
    const handleKeyPress=(e)=>{
        if(e.nativeEvent.key==='Enter'){
        handleAddComment();
    }
    }
    return <TouchableOpacity 
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

                onPress={() => {setFocusedIndex(nChar);setIsCollapsed(!isCollapsed)}}
                onPressIn={()=>setFocusedIndex(nChar)}
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
                    <Chariot oldCh={Number(nChar)}/>
                    <Text style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",minWidth:100,fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{nameToDisplay}</Text>

                    {
                        headersKeys.map((ky,i)=>{
                                const isInHeadersKeys=rest[ky]!==undefined;
                                return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?rest[ky]:"..."}</Text>//isInHeadersKeys?vl[cle]:"..."
                            })
                    }
                    <View style={{...styles.row,marginBottom:2,marginRight:4,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 38,}}>
                        {isHovered && <Actions item={item} />}
                    </View>
                </View>
                {
                    focusedIndex===nChar && <Collapsible collapsed={isCollapsed}>
                        <View style={{minWidth:ac?880:600,width:"100%",height:"auto",padding:20,paddingVertical:0,marginHorizontal:'auto',backgroundColor:'rgba(0,0,0,0.1)',
                            flexDirection:"column",
                            justifyContent:"flex-start",
                            alignItems:"center",

                        }}>
                                <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+"3.4.2026"+"   updated : "+"4.3.2026"+"  By:"+"ndour"+"  "}</Text></View>
                                {/* <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+ReduceDateTime(createdAt)+"   updated : "+ReduceDateTime(updatedAt)+"  By:"+chemist+"  "+(validation?(" validated by: "+validateur+" on: "+ReduceDateTime(validatedAt)):"")}</Text></View> */}
                                <View style={{width:'100%',minHeight:100,padding:24,borderRadius:5,paddingTop:5,backgroundColor:'rgb(180,180,180)',}}>
                                    {/* <Text style={{color:'black',fontWeight:'bold',}}>{"Analyse "+id+" - "+categorie+"."+item.name+" Observations : "}<Observations obs={observations}/> </Text> */}
                                    <ScrollView>
                                    {/* <ScrollView ref={scrollViewRef}> */}
                                        {/* <CommentsProvider commentaires={commentaires}> */}
                                        <View style={{width:'100%',paddingBottom:50,flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
                                            {comments.map((cmnt,index)=><Comment key={index} targetPseudo={null} color={Colors.Bleu} comnt={cmnt}/>)}
                                        </View>
                                        {/* <Comments targetPseudo={targetPseudo} itemColor={itemColor} />
                                        </CommentsProvider> */}
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
}

const PowderRowTour=({K,ac,setK,item})=>{
    const {UpdateFocusedProdByName,setAction}=useCurrentProducted();
    const {setItemToSave}=useItemToSave();
    const headersKeys=["nChar","name","densite","density"];
    const clooned= useSelector(state => state.actived.clooned);
    const [focusedIndex,setFocusedIndex]=useState(null);
    const {name,nChar,densite,identifier}=item;
    const ITEM={nChar:nChar,name:name,densite:densite,dap:densite};
    const isHovered=K===identifier;
    const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};
    function handleUpdate(){
        UpdateFocusedProdByName(item);
        setItemToSave(item);
        setFocusedIndex(nChar);
        setAction(item?.id);
    }
    return <TouchableOpacity 
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

                onPress={()=>handleUpdate()}
                onPressIn={()=>setFocusedIndex(nChar)}
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
                    {
                        headersKeys.map((ky,i)=>{
                                const isInHeadersKeys=ITEM[ky]!==undefined;
                                return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?ITEM[ky]:"..."}</Text> 
                            })
                    }
                </View> 
                
       
            </TouchableOpacity>
}

export const Chariot=({oldCh})=>{
    const [ch,setCh]=useState(oldCh);
    const {setPop}=usePopup();
    const dispatch=useDispatch();
    const {ListOfFocusedAndLastNumber}=useCurrentProducted();
    const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed)
    const {targetUser}=useSelector(state=>state.user);
    function handleBlur(newCh){
        const tourAllowed=allowTo("TOUR",targetUser?.privileges) || targetUser?.affecte_depart==='Tour';
        if(!tourAllowed){setPop({show:true,message:"Vous n'ëtes pas habileté à modifier un  numero de chariot.",code:'#880000'});setCh(oldCh);return;};
        const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.nChar)!==Number(oldCh));
        const item=powderAnalysed.filter(it=>Number(it.nChar)===Number(oldCh))[0];
        const {nChar,...rest}=item;const newItem={...rest,nChar:Number(newCh)};

        const updteOwderAnalysed=[...updatedPowderAnalysed,newItem].sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar);
        const {list}=ListOfFocusedAndLastNumber(item,updteOwderAnalysed);
        dispatch(setPowderAnalysed(updteOwderAnalysed));
        dispatch(storeFocusedListe(list));
        if(!item.id){setPop({show:true,message:"Erreur sur l'ID cible ! Peut-etre UNDEFINED | NULL .",code:"#880000"});return}
        fetch(dbBaseRoot+"poudre/analyses/update/"+item.id,
                       {method: 'PUT',headers: {'Content-Type': 'application/json'},
                        body:JSON.stringify(newItem)
                    }) 
                    .then(response=>response.json())
                    .then(data=>{
                        // console.log(data)
                        const {message/*,analyses*/}=data;
                        // const {lansas,formules}=analyses;
                        // const ANALYSES=[...lansas,...formules];
                        // const {list}=ListOfFocusedAndLastNumber(item,ANALYSES);
                        // dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)));
                        // dispatch(storeFocusedListe(list));
                    })

        // setCh(newCh);
    }
    return <TextInput
        value={ch}
        onBlur={()=>handleBlur(Number(ch))}
        onChangeText={(CH)=>setCh(CH)}
        style={{flex: 1,textAlign: "left",maxWidth:30,width:20,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:12,letterSpacing:2}}
    />
}

export const Actions=({item})=>{
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    const {setFocusedPro,UpdateFocusedProdByName,setRegistred,setFocusedList,ListOfFocusedAndLastNumber,setAction,focusedPro}=useCurrentProducted();
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
    UpdateFocusedProdByName(item);
    setItemToSave(item);
    setAction("update");

  }

  return <TouchableWithoutFeedback>
    <View
      style={{
        height:"auto",
        width:100,
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
      </>
      {/* :<Text>...</Text>
    } */}
    </View>
  </TouchableWithoutFeedback>
}

const PoudreWorkSpace=() => {
    const dispatch=useDispatch();
    const {setPop}=usePopup();
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
    const {toCreate,setAction,ListOfFocusedAndLastNumber,focusedList,currentProductedPro,currentProductedLen,setFocusedList,setFocusedPro,focusedPro,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
    const chariots=Chariots(focusedList);
    const {noErrors,errors,itemToSave}=useItemToSave();
    // const numChariot=itemToSave?.nChar;
    const numIdentifier=itemToSave?.identifier;
    const {nom,name,couleur,taches,format,parfum,percarbonate,mousses,densite,compression,...Rest}=focusedPro;
    const {estFormule,nameToDisplay}=isFormule(focusedPro);
    const {silicate,sel,...REST}=Rest;
    const rest=toCreate?REST:Rest;
    const [visible,setVisible]=useState(false);
    const [isMissing,setIsMissing]=useState(false);
    const [missing,setMissing]=useState({});

    function missingRequiredKeys(){
        const keysAndRequireds=keysAndRequirements();
        var missings=[];
        keysAndRequireds.map(item=>{
        if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
            const msg=item[0].toUpperCase()+" is required !";
            missings.push(msg);
            return null;
        }})
        return missings;
    };

    // useMemo(()=>{setFocusedPro(focusedProduct);},[focusedProduct]);// pour mettre a jour focused chaque fois que le focused du store est mis a jour a partir de ce component
    // useLayoutEffect(()=>{ // pour charger le focused initial apres initialisation

    //     const currentProductedValues=Object.values(currentProductedPro);
    //     const currentProductedLen=currentProductedValues.length;
    //     const currentProducted_0=currentProductedLen!==0?currentProductedValues[0]:{};
    //     // setCurrentProductedPro()
    //     setFocusedPro(currentProducted_0);
    // },[]);
// console.log(focusedPro)
    const handleEnregistrerPress=()=>{
        if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
            return;
        }
        if(!noErrors){
            setVisible(true);
        }else{
            // const observations=errors.reduce((acc,er)=>acc+'JOIN'+er)||"";
            const observations="";
            const missings=missingRequiredKeys();
            if(missings.length!==0){
                setMissing(missings);
                setIsMissing(true);
                setVisible(true); 
            }else{
                var saveObject={};
                if(toCreate && !toCreate.toString().includes('falsy')){
                    // ====================== build des non requis ==================================
                    const {format}=focusedPro;
                    const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
                    notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];})// reconstruire notRequired sous forme d'objet js dans saveObject
                    if(format!==undefined){
                        const formats=format?.reduce((a,acc)=>acc+" "+a);
                        saveObject['format']=formats;
                    }
                    // ====================== build du item a enregistre ============================
                    const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedProduct,powderAnalysed);
                    // const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedPro,registred);// registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const identifier=freeChariot.toString()+"_"+AdjentDayInMs(new Date(),0).toString();
                    const {densite,silicate,sel,...rest}=saveObject;// pour retirer la densite ,le silicate et le sel
                    const buildItem={...rest,...itemToSave,identifier:identifier/*,nChar:parseFloat(freeChariot)*/,observations:observations,categorie:"local",UtilisateurId:parseFloat(targetUser?.id)};
                    // alert(JSON.stringify(buildItem))
                    const enregistre=[...registred,buildItem];// 2
                    // ===================== Envoi aux memoires bdd & Context & store =====================
                    setFocusedList([...list,buildItem]);
                    dispatch(storeFocusedListe([...list,buildItem]));

                    fetch(`${dbBaseRoot}poudre/analyses/add?startedAt=${aujourdhui}&endedAt=${demain}`,
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
                        const {code,message,analyse,analyses}=data;

                        if(code!=='red'){
                            try{
                                const {lansas,formules}=!IsEmptyObject(analyses || {})?analyses:{lansas:[],formules:[]};
                                const ANALYSES=[...lansas,...formules];
                                setRegistred(ANALYSES);
                                dispatch(setPowderAnalysed(ANALYSES));
                                setPop({show:true,message:"Analyse ajoutée avec succes.",code:code});
                            }catch(error){throw new Error("L'analyse n'a pas pu etre ajoutée: "+error.message);}
                        }else{
                            throw new Error("L'analyse n'a pas pu etre ajoutée: "+message);
                        }

                        return analyse;
                    })
                    .then((analyse)=>{
                        const ID=analyse?.id;
                        socket.emit('analysePoudreAdded',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
                    })
                    .catch((error)=>{
                        setPop({show:true,message:error.message,code:'#880000'});
                    })
                    
                    // dispatch(storeFocusedListe([...list,buildItem]));
                    // setRegistred(enregistre);
                    // dispatch(setPowderAnalysed(enregistre));
                   
                }else{
                    // alert(JSON.stringify(id))
                    // ====================== build des non requis ==================================
                    const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
                    notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];});
                    // ====================== build du item a enregistre ============================
                    // const registredWithoutTheFocused=registred.filter(tem=>Number(tem.nChar)!==Number(numChariot));
                    const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
                    const {list}=ListOfFocusedAndLastNumber(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const {densite,...rest}=saveObject;// pour retirer la densite
                    const builtItem={...rest,...itemToSave,observations:observations,categorie:"local",UtilisateurId:targetUser?.id};
                    const enregistre=[...registredWithoutTheFocused,builtItem];// 2
                    // ===================== Envoi aux memoires Context & store =====================
                    setFocusedList([...list,{...rest,...itemToSave,observations:observations,UtilisateurId:targetUser?.id}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
                    dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
                    // alert(JSON.stringify(builtItem))
                    fetch(dbBaseRoot+"poudre/analyses/update/"+itemToSave.id,
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

                        if(code!=='red'){
                            try{
                                const {lansas,formules}=!IsEmptyObject(analyses || {})?analyses:{lansas:[],formules:[]};
                                const ANALYSES=[...lansas,...formules];
                                setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
                                dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
                                setPop({show:true,message:"Analyse modifiée avec succes.",code:code});
                                // const toPop=code==='green'?
                                //         {show:true,message:"Analyse modifiée avec succes.",code:code}
                                //         :{show:true,message:"L'analyse n'a pas pu etre modifiée: "+message,code:'#880000'}
                            }catch(error){throw new Error("L'analyse n'a pas pu etre modifiée: "+error.message);}

                        }else{
                            throw new Error("L'analyse n'a pas pu etre modifiée: "+message);
                        }

                    })
                    .then(()=>{
                        const ID=builtItem?.id;
                        socket.emit('analysePoudreUpdated',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
                    })
                    .catch((error)=>{
                        setPop({show:true,message:error.message,code:'#880000'});
                    })
                    // setRegistred(enregistre.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
                    // dispatch(setPowderAnalysed(enregistre.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
                    // dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
                    setAction("create");
                }
            }
        }
    }
    
    return <View style={{minWidth:"80%",paddingVertical:40}}>
        {currentProductedLen!==0 && <View style={{width:"100%",height:"auto",maxHeight:540,/*minHeight:750,*/ borderRadius:10,backgroundColor:'rgba(255,255,255,0.4)',justifyContent:'flex-start',alignItems:'center',paddingHorizontal:30,paddingVertical:15,paddingBottom:40,gap:15}}>
            {taches!==undefined && <HeaderOfEdit name={nameToDisplay} couleur={couleur} taches={taches} />}
            <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
            <ScrollView horizontal={false} style={{width:"100%"}}>
                {Object.entries({'nChar':{normes:{min:1,max:999}},...rest}).map(([key,value],i)=><EditRow 
                    inputRefs={inputRefs} 
                    index={i} key={i} 
                    obj={{key:key,value:value}}
                />)}
            </ScrollView>
            {Object.keys(rest).length>0 && <TouchableOpacity 
            disabled={!enregistrerAllowed}
                            style={{
                                minWidth:"100%",
                                minHeight:40,
                                marginTop:20,
                                backgroundColor:couleurs[CLE][7],
                                borderRadius:10,
                                paddingHorizontal:40,
                                paddingVertical:10,
                            }}
                onPress={handleEnregistrerPress}
            >
                <Text style={{color:"white",fontWeight:"bold",textAlign:"center",width:"center"}}>{"Enregistrer"+(!toCreate?" les modifications":"")}</Text>
            </TouchableOpacity>}
        </View>}
        {/* <Pop/> */} 
        {/* // etit bien pour workSpace  */}
    </View>
}

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
// const ChariotRow=({inputRefs,obj})=>{
//     const {key,value}=obj;
//     const {focusedList}=useCurrentProducted();
//     const chariots=Chariots(focusedList);
//     const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
//     const {pickItemToSave}=useItemToSave();
//     const [input,setInput]=useState("");
//     function handleCheckValidity(val){
//         const valFormat=Number.isNaN(Number(val))?val:Number(val); 
//         const {icon,obs}=InputIsValid({input:valFormat,label:'nChar',normes:{min:1,max:999}});// utilise un formatage de val pour adapter les types
//         setInput(val);
//         setIconAndObs({icon,obs});
//         pickItemToSave({"key":key,"value":val,"message":obs});
//     }
//     return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
//         <Picker 
//                     selectedValue={input}
//                     mode="dropdown"
//                     // onKeyPress={(e)=>handleKeyPress(e,0)} 
//                     ref={(el) => (inputRefs.current[0] = el)}
//                     onValueChange={(itemValue) => handleCheckValidity(itemValue)} 
//                     style={style.input}
//                 >
//                     <Picker.Item key={0} label="Chariot" value={null} />
//                     {chariots.map((option, index) => {
//                     return <Picker.Item style={{textAlign:'center',}} key={index} label={option} value={option} />
//                     })}
//         </Picker>
//         {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
//     </View>
// }
const EditRow=({inputRefs,index,obj})=>{
    const {key,value}=obj;
    const lablJoined=key.split("_").join(" ").replace("max ","").replace("gg","Gros grains");
    const labelJoined=index===0?'N° chariot':lablJoined;
    const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
    const {pickItemToSave}=useItemToSave();
    const [input,setInput]=useState("");
    const uniquePropriete=["max_gg","max_humidite"];
    const min=uniquePropriete.includes(key)?0:(value.normes?.min || 0);
    const max=uniquePropriete.includes(key)?value.normes:(value.normes?.max || 1000);
    function handleCheckValidity(val){
        const valFormat=Number.isNaN(Number(val))?val:Number(val); 
        const {icon,obs}=InputIsValid({input:valFormat,label:labelJoined,normes:{min,max}});// utilise un formatage de val pour adapter les types
        setIconAndObs({icon,obs});
        pickItemToSave({"key":key,"value":val,"message":obs});
    }
    return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginBottom:10,marginHorizontal:"auto",gap:10}}>
        {index===0?<UniversalCombobox 
            inputRefs={inputRefs} 
            index={index} 
            labelJoined='N° Chariot'
            value={input}
            icon={iconAndObs.icon}
            renderValidity={()=>handleCheckValidity(input)}
            renderVal={(val)=>setInput(val)}
             />
            :
            <LansaValue 
            inputRefs={inputRefs} 
            index={index} 
            value={input} 
            labelJoined={labelJoined} 
            icon={iconAndObs.icon}

            renderValidity={()=>handleCheckValidity(input)}
            renderVal={(val)=>setInput(val)}
        />}
        {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
    </View>
}

export const LansaValue=({inputRefs,index,labelJoined,icon,value,renderValidity,renderVal})=>{
    const {currentProductedLen,focusedPro,toCreate}=useCurrentProducted();
    const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
    const [textValue,setTextValue]=useState("");
    const IamFocused=index===INDEX;
    // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
    // const currentProductedLen=currentProducted.length;
    const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
    useEffect(()=>{
        if(!toCreate || toCreate.toString().includes('falsy')){
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
        if (key === 'ArrowDown') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
        if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
    };

    
    return <TextInput
        disabled={currentProductedLen===0}
        returnKeyType="next"
        onKeyPress={handleKeyPress} 
        onSubmitEditing={handleNext}
        onFocus={()=>setIndex(index)}
        blurOnSubmit={false}
        selectTextOnFocus="true"
        maxLength={5}
        label={label}
        value={textValue} 
        style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
        ref={(el) => (inputRefs.current[index] = el)}
        onBlur={()=>renderValidity()}
        onChangeText={(val)=>{setTextValue(val);renderVal(val);handleLenOverFive(val)}}
        right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
    />
}

export const LansaObservations=({obs})=>(obs!=="" && <Text style={style.lansaObservations}>{obs}</Text>);

export function InputIsValid({input,label,normes}){
    const {min,max}=normes;
    const labl=label.toUpperCase();
    if(Number.isNaN(Number(input))) return {icon:"alert",obs:"Input must be numeric"};
    switch(true){
        case input<min:
           return {icon:"close",obs:labl+" is low"};
           break;
        case input>max:
            return {icon:"close",obs:labl+" is high"};
           break;
        case (input>=min && input<=max):
            return {icon:"check",obs:""};
           break;
        default:       
            return {icon:"alert",obs:"Invalid input"};
    }
}
function UniversalCombobox({inputRefs,labelJoined,icon,value,renderValidity,renderVal,index,obj}) {
    const {currentProductedLen,focusedList,focusedPro,setAction,toCreate}=useCurrentProducted();
    const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
    // const [textValue,setTextValue]=useState("");
    const IamFocused=index===INDEX;
    // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
    // const currentProductedLen=currentProducted.length;
    const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
    // const {focusedList}=useCurrentProducted();
    const chariots=Chariots(focusedList);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(chariots.slice(-35));
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(()=>{
        if(!toCreate || toCreate.toString().includes('falsy')){
            const valeur=itemToSave?.name && itemToSave?.nChar;
            setInputValue(valeur);
        }else{
            setInputValue("");
            setItemToSave({});
        }
    },[toCreate])

    function isManual(val){
        const isNumAndAlreadyIn=!Number.isNaN(Number(val)) && chariots.includes(Number(val));
        return isNumAndAlreadyIn;
    }
    function handleLenOverFive(val){if (val.length === 5) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
    const handleNext = () => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
    const handleKeyPress = (e) => {const { key } = e.nativeEvent;
        if (key === 'ArrowDown') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
        if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
    };

  const filteredOptions = options.filter(item =>
   item.toString().toLowerCase().includes((inputValue || "").toString().toLowerCase())
  );

  const isNewOption =inputValue!==undefined && inputValue.toString().trim()!== '' && !options.some(opt => opt.toString().toLowerCase() === inputValue.toString().toLowerCase());

  const handleSelect = (value) => {
    setInputValue(value);
    setAction(itemToSave?.id);
    setShowDropdown(false);
  };

  const handleAddNew = () => {
    const newValue = inputValue.toString()/*.trim()*/;
    setOptions([...options, newValue].slice(-35));
    setShowDropdown(false);
  };

  const rendValidity=(cb)=>{
    return new Promise((resolve,reject)=>{
        try{
            cb()
            setTimeout(()=>resolve(true),500)
        }catch(error){
            reject(false)
        }
        })
    }
const handleBlur=()=>{
    rendValidity(renderValidity)
    .then(bool=>bool && setShowDropdown(false));
}

  return (
    // 1. LE CONTENEUR PRINCIPAL DOIT ÊTRE EN EN RELATIF
    <View style={style.lansaValue}>
      
      <TextInput
        style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
        placeholder="Chariot..."
        value={inputValue}
        onFocus={() => {setIndex(index);setShowDropdown(true)}}
        onChangeText={(val)=>{setInputValue(val);setShowDropdown(true);renderVal(val);handleLenOverFive(val);isManual(val) && setAction('create')}}
        disabled={currentProductedLen===0}
        returnKeyType="next"
        onKeyPress={handleKeyPress} 
        onSubmitEditing={handleNext}
        blurOnSubmit={false}
        selectTextOnFocus="true"
        maxLength={5} 
        label={label}
        ref={(el) => (inputRefs.current[index] = el)}
        onBlur={handleBlur}
        right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
    
      />

      {/* 2. LE MENU DÉROULANT EST EN ABSOLUTE */}
      {showDropdown && (
        <View style={style.dropdown}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            style={{ maxHeight: 100 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={style.item} onPress={() => handleSelect(item)}>
                <Text style={style.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {isNewOption && (
            <TouchableOpacity style={style.addItem} onPress={handleAddNew}>
              <Text style={style.addItemText}>➕ Ajouter "{inputValue}"</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
    
  );
}

const style=StyleSheet.create({
    lansaValue:{
        minWidth:"100%",
        // minWidth:"90%",
        borderWidth:1,
        borderRadius:5,
        textAlign:"center",
        fontSize:15,
    },
    lansaObservations:{
        
        position:'absolute',
        zIndex:1000,
        left:155,
        top:7,
        backgroundColor:"rgba(250,0,0,0.5)",
        color:"white",
        fontStyle:"italic",
        letterSpacing:1.5,
        fontSize:10,
        fontWeight:"bold",
        width:"auto",
        maxWidth:170,

        // maxWidth:65,
        // backgroundColor:"rgba(0,0,0,0.15)",
        borderWidth:1,
        borderColor:"red",
        borderRadius:8,
        borderBottomLeftRadius:1,
        // fontSize:9,
        // fontWeight:"bold",
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
    input:{
        backgroundColor:'rgb(80,80,80)',
        width:'90%',
        // maxHeight:'5rem',
        height:50,
        // padding:'1.5rem',
        fontWeight:'bold',
        textAlign:'center',
        letterSpacing:4,
        borderRadius:8,
        color:'white',
    },
      container: {
    width: '100%',
    // maxWidth: 400,
    alignSelf: 'center',
    // position: 'relative', // 👈 Indispensable pour servir de repère au menu absolute
    // zIndex: 1000,         // 👈 Force le menu à passer devant tout le reste sur Web/iOS
  },
  dropdown: {
    // position: 'absolute', // 👈 Sort le menu du flux de mise en page (ne pousse plus rien)
    // top: '100%',          // 👈 Se place pile au pixel près sous le TextInput
    // marginTop: 5,         // 👈 Crée le petit espace de décalage propre (équivalent à votre -10)
    // left: 0,
    // right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    // zIndex: 2000,         // 👈 Sécurité additionnelle pour le rendu
    
    // Ombres multiplateformes pour détacher le menu du fond
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 5 },
      web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.15)' }
    }),
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  addItem: {
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderTopWidth: 1,
    borderTopColor: '#bae6fd',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  addItemText: {
    color: '#0284c7',
    fontWeight: 'bold',
    fontSize: 16,
  },

})






// import { useMemo,useEffect,useLayoutEffect,useState,useRef } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Picker } from '@react-native-picker/picker';
// import { View, Text, StyleSheet,TouchableWithoutFeedback,Pressable,ActivityIndicator,Platform,FlatList, TouchableOpacity } from 'react-native';
// // import { FontAwesome5 } from '@expo/vector-icons';
// import { Searchbar,TextInput,Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
// import Collapsible from 'react-native-collapsible';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useDispatch,useSelector } from 'react-redux';
// import socket from '../assets/socketService';
// import { dbBaseRoot,primaryColor,couleurs  } from '../assets/constantes';
// import { Periodes } from '../components/periode';
// import { HeaderRight } from './DrawerNavigator';
// import { PowderHeaders } from '../components/tables/componentTable';
// import Pop from '../components/popup';
// import CustomPoudreDrawerContent from '../components/customPoudreDrawerContent';
// import {FormulesProvider,CurrentProductedProvider,useCurrentProducted,useFormules,ItemToSaveProvider, useItemToSave, usePopup } from '../components/wrappers/contexts';
// import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
// import { setPowderAnalysed } from '../components/store/reducers/powderAnalysesReducer';
// import { storeFocusedListe } from '../components/store/reducers/currentProducted';
// import PoudreAnalysedTab from './poudreTabNavigator';
// import WinDim from '../assets/operatingData';
// import { Lansas,routesAndHeadersPowder,headersTour } from '../iterables';
// import { styles } from '../components/tables/componentTable';
// import { ViewOrImgBgPowderWrapper } from '../components/wrappers/viewOrImgWrapper';
// import { ScrollView } from 'react-native-gesture-handler';
// import { Comment } from '../components/tables/chat-for-table';
// import { AdjentDayInMs} from '../components/periode';
// import { isFormule,allowTo,isAlreadyAnalysed,Chariots} from '../assets/functions';
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
// export const colors={
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

// export const Errors = ({visible,render,isMissing,missing}) => {
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

// export const UpdateLansa = ({visible,item}) => {
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

// export default function DrawerPoudre(){
//     const dispatch=useDispatch();
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
//                 <Drawer.Screen name="Lansas" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
//                 <Drawer.Screen name="Formules" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
                
//             </Drawer.Navigator>
//         </ItemToSaveProvider>
//     </CurrentProductedProvider>
    
//   );

// }

// const Tabs=({navigation,route}) => {
//     return <View 
//     style={{flex:1,
//         flexDirection:'row',
//         justifyContent:'center',
//         alignItems:'flex-start',
//         backgroundColor:'rgba(0,0,0,0.9)',
//         width:"100%",
//         padding:3,
//         paddingVertical:0,
//     }}
// >
//             <FormulesProvider>
//                 <ViewOrImgBgPowderWrapper uri="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDM5MW5yYnZlcGE0Mm80YjlncTR5cG41cG5rNWhua2N2enBudXk2YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SnwifA7bOFDhe/giphy.gif">
//                     <AnalysedTab/>
//                 </ViewOrImgBgPowderWrapper>
//                 <AnalysedList/>
//             </FormulesProvider>
//         </View>
// }

// const AnalysedTab=() => {
//     return  <View style={{width:"100%",backgroundColor:'rgba(250,250,250,0.1)',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginRight:2}}>
//         <PoudreAnalysedTab/>
//         <PaperProvider><PoudreWorkSpace mission="create"/></PaperProvider>
//     </View>
// }

// const AnalysedList=() => {
//         // const [loading,setLoading]=useState(false);
//         const [K,setK]=useState(null);
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
//             setAnalysed(matchedAnalysed);
//             // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
//         }
//         useMemo(()=>{setAnalysed(focusedListe.filter(item=>isAlreadyAnalysed(item)))},[focusedListe]);// focusedListe du store etait import pour cette partie
//         const {name,nom}=focusedListe[0]||{};
//         const {nameToDisplay}=isFormule(focusedListe[0]||{})
//         const AnalysedLen=analysed.length;
//         const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
//     return <View style={{flex:1,width:"55%",minHeight:700,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
//             <View style={{width:"100%",height:75,backgroundColor:"#ddd",flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderBottomWidth:2,borderColor:"black",paddingHorizontal:20,paddingRight:10,marginBottom:10}}>
//                 <View style={{width:"65%",flexDirection:"row-reverse",justifyContent:"flex-start",alignItems:"center",gap:0}}>
//                 <HeaderRight isLarge={isLarge} liq={false}/>
//                 <Searchbar
//                     placeholder="Numero nChar..."
//                     onChangeText={(txt)=>handleResearchChange(txt)}
//                     value={null}
//                     style={{margin:0,backgroundColor:'rgba(255,255,255,0.9)',width:"70%",height:"auto"}}
//                 />
//                 </View>
//                 <Text style={{fontSize:12,textAlign:"center",fontWeight:'bold',width:"35%"}}>{/*nom ||name*/nameToDisplay}</Text>
//             </View>
//             <View style={{width:"100%",height:"auto",minHeight:740,maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
//                 <PowderHeaders headers={headers}/>
//                 {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
//                         ) : ( */}
//                     <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}>
//                           <FlatList
//                                         data={analysed}
//                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
//                                         renderItem={({ item },index) =>{
//                                         return <PowderRow
//                                                     key={index}
//                                                     K={K}
//                                                     setK={setK}
//                                                     item={item}
//                                                     items={analysed}
//                                                 />
//                                             }
//                                         }
//                           />
//                     </View>
//                 <View 
//                 style={{
//                         flex:1,
//                         maxHeight:60,
//                         width:"96%",
//                         paddingHorizontal:"2%",
//                         marginVertical:10,
//                         paddingVertical:8,
//                         flexDirection:"row",
//                         gap:40,
//                         position:"absolute",
//                         bottom:10,
//                         backgroundColor:"rgb(0,90,0)",
//                         borderBottomLeftRadius:8,
//                         borderBottomRightRadius:8,
//                         }}
//                 >
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>Les moyennes </Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"GG "+(GG/AnalysedLen).toFixed(2)}</Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"HUM. "+(HUMIDITE/AnalysedLen).toFixed(2)}</Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"MA "+(MATIERE_ACTIVE/AnalysedLen).toFixed(2)}</Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"ALCA. "+(ALCANITE/AnalysedLen).toFixed(2)}</Text>
//                 </View>
//             </View>
//                         {/* )
//                   } */}
//         </View>
// }

// export const AnalysedListTour=() => {
//         const [K,setK]=useState(null);
//         const scrollViewRef = useRef(null);

//         /* Experimentation: relation entre redux et le contexte(on set le redux->le context prend 
//         [auto: non pas auto finalement !il fautun useEffect dans le context
//          ou passer directement la valeur du redux dans l'objet du context pour que le context se met à jour automatiquement ]
//           du redux et hot-reload sur UI ???? )*/
//         const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed); // const {powderAnalysed/*,focusedListe*/}=useSelector(state=>{
//         //     const powderAnalysed=state.powderAnalysed.powderAnalysed;
//         //     // const focusedListe=state.currentProducted.focusedListe;
//         //     return {powderAnalysed/*,focusedListe*/};
//         // })
//         const [analysed,setAnalysed]=useState([]);
//         const {registred,focusedList}=useCurrentProducted();
        
//         useEffect/*useMemo*/(()=>{setAnalysed(focusedList.slice(-20))},[focusedList]);// focusedListe du store etait import pour cette partie

//         const {name,nom}=focusedList[0]||{};
//         const AnalysedLen=analysed.length;
//     return <View style={{flex:1,width:"100%",minHeight:400,borderWidth:1,borderColor:'grey',borderRadius:15,backgroundColor:'white',paddingVertical:20,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2,marginTop:40}}>
            
//             <View style={{width:"100%",height:"auto",minHeight:400,maxHeight:400,paddingHorizontal:10,paddingVertical:0}}>
//                 <PowderHeaders headers={headersTour}/>
//                     {/* <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}> */}
//                         <ScrollView 
//                                 ref={scrollViewRef}
//                                 horizontal={false}
//                                 onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//                                 style={{width:"100%",maxHeight:300,padding:10/*,overflowY:"scroll",*/}}
//                             >
//                           <FlatList
//                                         data={analysed}
//                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
//                                         renderItem={({ item },index) =>{
//                                         return <PowderRowTour
//                                                     key={index}
//                                                     K={K}
//                                                     setK={setK}
//                                                     item={item}
//                                                     items={analysed}
//                                                 />
//                                             }
//                                         }
//                           />
//                           </ScrollView>
//                     {/* </View> */}
//             </View>
//         </View>
// }

// export const AnalysedListe=({product,rend}) => {// Pour Poudre-full
//         // const [loading,setLoading]=useState(false);
//         const dispatch=useDispatch();
//         const {startedAt,endedAt}=useSelector(state=>state.period.targetPeriod);
//         const [K,setK]=useState(null);
//         const {setPop}=usePopup();
//         const {powderFiltred,powderAnalysed,powderType,focusedListe}=useSelector(state=>{
//             const powderFiltred=state.powderAnalysed.powderFiltred;
//             const powderAnalysed=state.powderAnalysed.powderAnalysed;
//             const powderType=state.powderAnalysed.powderType;
//             const focusedListe=state.currentProducted.focusedListe;
//             return {powderFiltred,powderAnalysed,powderType,focusedListe};
//         })
//         const [analysed,setAnalysed]=useState([]);
//         const {Everages}=useCurrentProducted();
//         // function handleResearchChange(txt){
//         //     const matchedAnalysed=registred.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
//         //     setAnalysed(matchedAnalysed);
//         //     // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
//         // }
//         useLayoutEffect(()=>{
//             fetch(`${dbBaseRoot}poudre/analyses?startedAt=${startedAt}&endedAt=${endedAt}`) 
//             .then(response=>response.json())
//             .then(data=>{dispatch(setPowderAnalysed(data.analyses));rend(powderAnalysed);})//;/*setAnalysed(data.analyses)*/})// losque powderAnalysed changera setAnalyses se fera du useEffect plus en dessous
//             .catch(function(error){ 
//                 setPop({show:true,message:error.message,code:"#880000"})
//             })
//             // setAnalysed(powderFiltred); 
//         },[]);
//         //  useMemo(()=>{
//         //     const products=product===null?analysed:analysed.filter((itm)=>isFormule(itm).estFormule?(isFormule(itm).nameToDisplay===product):itm.name===product);
//         //     setAnalysed(products)},[product]);// product pour gerer le cas du clic sur un decompte-item

//         useEffect/*useMemo*/(()=>{
//             setAnalysed(powderType); // filtrer suivant le type (extra,local,finies,get,diam,...)
//             ///** Essayons -le */ rend(powderAnalysed); // construit les chipps: doit rester constatn que owderAnalysed n'a pas changé: Pouvait se faire dans le useLayoutEffect si aucune mise a jour des powderAnalysed n'est envisagée
//         },[powderAnalysed,powderType]);// focusedListe du store etait import pour cette partie

//         const AnalysedLen=analysed.length;
//         const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
//     return <View style={{flex:1,width:"100%",height:"auto",padding:50,paddingTop:20,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
//             <View style={{width:"100%",height:"auto",height:"auto",maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
//                 <PowderHeaders headers={headers}/>
//                 {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
//                         ) : ( */}
//                     <View style={{width:"100%",height:"auto",maxHeight:740,marginBottom:70,overflowY:"scroll",}}>
//                           <FlatList
//                                         data={analysed}
//                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
//                                         renderItem={({ item },index) =>{
//                                         return <PowderRow
//                                                     key={index}
//                                                     K={K}
//                                                     setK={setK}
//                                                     item={item}
//                                                     items={analysed}
//                                                     ac={true}
//                                                 />
//                                             }
//                                         }
//                           />
//                     </View>
//                 {product!==null && <View 
//                 style={{
//                         flex:1,
//                         maxHeight:60,
//                         width:"96%",
//                         paddingHorizontal:"2%",
//                         marginVertical:10,
//                         paddingVertical:8,
//                         flexDirection:"row",
//                         gap:40,
//                         position:"absolute",
//                         bottom:10,
//                         backgroundColor:"rgb(0,90,0)",
//                         borderBottomLeftRadius:8,
//                         borderBottomRightRadius:8,
//                         }}
//                 >
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>Les moyennes </Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"GG "+(GG/AnalysedLen).toFixed(2)}</Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"HUM. "+(HUMIDITE/AnalysedLen).toFixed(2)}</Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"MA "+(MATIERE_ACTIVE/AnalysedLen).toFixed(2)}</Text>
//                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"ALCA. "+(ALCANITE/AnalysedLen).toFixed(2)}</Text>
//                 </View>}
//             </View>
//                         {/* )
//                   } */}
//         </View>
// }

// export const PowderRow=({K,ac,setK,item})=>{
//     const headersKeys=["gg","humidite","matiere_active","alcanite","silicate","sel"];
//     const clooned= useSelector(state => state.actived.clooned);
//     const [focusedIndex,setFocusedIndex]=useState(null);
//     const [isCollapsed,setIsCollapsed]=useState(false);
//     const [comment,setComment]=useState("");
//     const [toggle,setToggle]=useState(false);
//     const [comments,setComments]=useState([]);
//     const {nChar,name,identifier,couleur,taches,...rest}=item;
//     const {nameToDisplay}=isFormule(item);
//     const isHovered=K===identifier;
//     const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};
//     const handleAddComment=()=>{
//         const pseudo=toggle?"ndour":"Moneem";
//         const commnts=[[comment,"Mamadou","Ndour",null,true,pseudo],...comments];
//         setToggle(!toggle);
//         setComments(commnts);
//     }
//     const handleKeyPress=(e)=>{
//         if(e.nativeEvent.key==='Enter'){
//         handleAddComment();
//     }
//     }
//     return <TouchableOpacity 
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

//                 onPress={() => {setFocusedIndex(nChar);setIsCollapsed(!isCollapsed)}}
//                 onPressIn={()=>setFocusedIndex(nChar)}
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
//                     <Chariot oldCh={Number(nChar)}/>
//                     <Text style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",minWidth:100,fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{nameToDisplay}</Text>

//                     {
//                         headersKeys.map((ky,i)=>{
//                                 const isInHeadersKeys=rest[ky]!==undefined;
//                                 return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?rest[ky]:"..."}</Text>//isInHeadersKeys?vl[cle]:"..."
//                             })
//                     }
//                     <View style={{...styles.row,marginBottom:2,marginRight:4,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 38,}}>
//                         {isHovered && <Actions item={item} />}
//                     </View>
//                 </View>
//                 {
//                     focusedIndex===nChar && <Collapsible collapsed={isCollapsed}>
//                         <View style={{minWidth:ac?880:600,width:"100%",height:"auto",padding:20,paddingVertical:0,marginHorizontal:'auto',backgroundColor:'rgba(0,0,0,0.1)',
//                             flexDirection:"column",
//                             justifyContent:"flex-start",
//                             alignItems:"center",

//                         }}>
//                                 <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+"3.4.2026"+"   updated : "+"4.3.2026"+"  By:"+"ndour"+"  "}</Text></View>
//                                 {/* <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+ReduceDateTime(createdAt)+"   updated : "+ReduceDateTime(updatedAt)+"  By:"+chemist+"  "+(validation?(" validated by: "+validateur+" on: "+ReduceDateTime(validatedAt)):"")}</Text></View> */}
//                                 <View style={{width:'100%',minHeight:100,padding:24,borderRadius:5,paddingTop:5,backgroundColor:'rgb(180,180,180)',}}>
//                                     {/* <Text style={{color:'black',fontWeight:'bold',}}>{"Analyse "+id+" - "+categorie+"."+item.name+" Observations : "}<Observations obs={observations}/> </Text> */}
//                                     <ScrollView>
//                                     {/* <ScrollView ref={scrollViewRef}> */}
//                                         {/* <CommentsProvider commentaires={commentaires}> */}
//                                         <View style={{width:'100%',paddingBottom:50,flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
//                                             {comments.map((cmnt,index)=><Comment key={index} targetPseudo={null} color={Colors.Bleu} comnt={cmnt}/>)}
//                                         </View>
//                                         {/* <Comments targetPseudo={targetPseudo} itemColor={itemColor} />
//                                         </CommentsProvider> */}
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
// }

// const PowderRowTour=({K,ac,setK,item})=>{
//     const {UpdateFocusedProdByName,setAction}=useCurrentProducted();
//     const {setItemToSave}=useItemToSave();
//     const headersKeys=["nChar","name","densite","density"];
//     const clooned= useSelector(state => state.actived.clooned);
//     const [focusedIndex,setFocusedIndex]=useState(null);
//     const {name,nChar,densite,identifier}=item;
//     const ITEM={nChar:nChar,name:name,densite:densite,dap:densite};
//     const isHovered=K===identifier;
//     const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};
//     function handleUpdate(){
//         UpdateFocusedProdByName(item);
//         setItemToSave(item);
//         setFocusedIndex(nChar);
//         setAction(item?.id);
//     }
//     return <TouchableOpacity 
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

//                 onPress={()=>handleUpdate()}
//                 onPressIn={()=>setFocusedIndex(nChar)}
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
//                     {
//                         headersKeys.map((ky,i)=>{
//                                 const isInHeadersKeys=ITEM[ky]!==undefined;
//                                 return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?ITEM[ky]:"..."}</Text> 
//                             })
//                     }
//                 </View> 
                
       
//             </TouchableOpacity>
// }

// export const Chariot=({oldCh})=>{
//     const [ch,setCh]=useState(oldCh);
//     const {setPop}=usePopup();
//     const dispatch=useDispatch();
//     const {ListOfFocusedAndLastNumber}=useCurrentProducted();
//     const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed)
//     const {targetUser}=useSelector(state=>state.user);
//     function handleBlur(newCh){
//         const tourAllowed=allowTo("TOUR",targetUser?.privileges) || targetUser?.affecte_depart==='Tour';
//         if(!tourAllowed){setPop({show:true,message:"Vous n'ëtes pas habileté à modifier un  numero de chariot.",code:'#880000'});setCh(oldCh);return;};
//         const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.nChar)!==Number(oldCh));
//         const item=powderAnalysed.filter(it=>Number(it.nChar)===Number(oldCh))[0];
//         const {nChar,...rest}=item;const newItem={...rest,nChar:Number(newCh)};

//         const updteOwderAnalysed=[...updatedPowderAnalysed,newItem].sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar);
//         const {list}=ListOfFocusedAndLastNumber(item,updteOwderAnalysed);
//         dispatch(setPowderAnalysed(updteOwderAnalysed));
//         dispatch(storeFocusedListe(list));
//         if(!item.id){setPop({show:true,message:"Erreur sur l'ID cible ! Peut-etre UNDEFINED | NULL .",code:"#880000"});return}
//         fetch(dbBaseRoot+"poudre/analyses/update/"+item.id,
//                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(newItem)
//                     }) 
//                     .then(response=>response.json())
//                     .then(data=>{
//                         // console.log(data)
//                         const {message/*,analyses*/}=data;
//                         // const {lansas,formules}=analyses;
//                         // const ANALYSES=[...lansas,...formules];
//                         // const {list}=ListOfFocusedAndLastNumber(item,ANALYSES);
//                         // dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)));
//                         // dispatch(storeFocusedListe(list));
//                     })

//         // setCh(newCh);
//     }
//     return <TextInput
//         value={ch}
//         onBlur={()=>handleBlur(Number(ch))}
//         onChangeText={(CH)=>setCh(CH)}
//         style={{flex: 1,textAlign: "left",maxWidth:30,width:20,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:12,letterSpacing:2}}
//     />
// }

// export const Actions=({item})=>{
//     const dispatch=useDispatch();
//     const {setPop}=usePopup();
//     const {setFocusedPro,UpdateFocusedProdByName,setRegistred,setFocusedList,ListOfFocusedAndLastNumber,setAction,focusedPro}=useCurrentProducted();
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
//     UpdateFocusedProdByName(item);
//     setItemToSave(item);
//     setAction("update");

//   }

//   return <TouchableWithoutFeedback>
//     <View
//       style={{
//         height:"auto",
//         width:100,
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
//       </>
//       {/* :<Text>...</Text>
//     } */}
//     </View>
//   </TouchableWithoutFeedback>
// }

// const PoudreWorkSpace=() => {
//     const dispatch=useDispatch();
//     const {setPop}=usePopup();
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
//     const {toCreate,setAction,ListOfFocusedAndLastNumber,focusedList,currentProductedPro,currentProductedLen,setFocusedList,setFocusedPro,focusedPro,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
//     const chariots=Chariots(focusedList);
//     const {noErrors,errors,itemToSave}=useItemToSave();
//     // const numChariot=itemToSave?.nChar;
//     const numIdentifier=itemToSave?.identifier;
//     const {nom,name,couleur,taches,format,parfum,percarbonate,mousses,densite,compression,...Rest}=focusedPro;
//     const {estFormule,nameToDisplay}=isFormule(focusedPro);
//     const {silicate,sel,...REST}=Rest;
//     const rest=toCreate?REST:Rest;
//     const [visible,setVisible]=useState(false);
//     const [isMissing,setIsMissing]=useState(false);
//     const [missing,setMissing]=useState({});

//     function missingRequiredKeys(){
//         const keysAndRequireds=keysAndRequirements();
//         var missings=[];
//         keysAndRequireds.map(item=>{
//         if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
//             const msg=item[0].toUpperCase()+" is required !";
//             missings.push(msg);
//             return null;
//         }})
//         return missings;
//     };

//     // useMemo(()=>{setFocusedPro(focusedProduct);},[focusedProduct]);// pour mettre a jour focused chaque fois que le focused du store est mis a jour a partir de ce component
//     // useLayoutEffect(()=>{ // pour charger le focused initial apres initialisation

//     //     const currentProductedValues=Object.values(currentProductedPro);
//     //     const currentProductedLen=currentProductedValues.length;
//     //     const currentProducted_0=currentProductedLen!==0?currentProductedValues[0]:{};
//     //     // setCurrentProductedPro()
//     //     setFocusedPro(currentProducted_0);
//     // },[]);
// // console.log(focusedPro)
//     const handleEnregistrerPress=()=>{
//         if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
//             return;
//         }
//         if(!noErrors){
//             setVisible(true);
//         }else{
//             // const observations=errors.reduce((acc,er)=>acc+'JOIN'+er)||"";
//             const observations="";
//             const missings=missingRequiredKeys();
//             if(missings.length!==0){
//                 setMissing(missings);
//                 setIsMissing(true);
//                 setVisible(true); 
//             }else{
//                 var saveObject={};
//                 if(toCreate && !toCreate.toString().includes('falsy')){
//                     // ====================== build des non requis ==================================
//                     const {format}=focusedPro;
//                     const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
//                     notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];})// reconstruire notRequired sous forme d'objet js dans saveObject
//                     if(format!==undefined){
//                         const formats=format?.reduce((a,acc)=>acc+" "+a);
//                         saveObject['format']=formats;
//                     }
//                     // ====================== build du item a enregistre ============================
//                     const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedProduct,powderAnalysed);
//                     // const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedPro,registred);// registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
//                     const identifier=freeChariot.toString()+"_"+AdjentDayInMs(new Date(),0).toString();
//                     const {densite,silicate,sel,...rest}=saveObject;// pour retirer la densite ,le silicate et le sel
//                     const buildItem={...rest,...itemToSave,identifier:identifier/*,nChar:parseFloat(freeChariot)*/,observations:observations,categorie:"local",UtilisateurId:parseFloat(targetUser?.id)};
//                     // alert(JSON.stringify(buildItem))
//                     const enregistre=[...registred,buildItem];// 2
//                     // ===================== Envoi aux memoires bdd & Context & store =====================
//                     setFocusedList([...list,buildItem]);
//                     dispatch(storeFocusedListe([...list,buildItem]));

//                         fetch(`${dbBaseRoot}poudre/analyses/add?startedAt=${aujourdhui}&endedAt=${demain}`,
//                        {method: 'POST',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(buildItem)
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         // console.log(data)
//                         const {code,message,analyse,analyses}=data;
//                         if(code!=='red'){
//                             const {lansas,formules}=analyses;
//                             const ANALYSES=[...lansas,...formules];
//                             // alert(JSON.stringify(ANALYSES));
//                             setRegistred(ANALYSES);
//                             dispatch(setPowderAnalysed(ANALYSES));
//                             setPop({show:true,message:"Analyse ajoutée avec succes.",code:code});

//                         // }
//                         // const toPop=code==='green'?
//                         //         {show:true,message:"Analyse enregistrée avec succes.",code:code}
//                         //         :
//                         //         {show:true,message:"L'analyse n'a pas pu etre enregistrée :"+ message,code:'#880000'}
//                         // setPop(toPop);
//                         }else{
//                             throw new Error("L'analyse n'a pas pu etre ajoutée: "+message);
//                         }
//                         return analyse;
//                     })
//                     .then((analyse)=>{
//                         const ID=analyse?.id;
//                         socket.emit('analysePoudreAdded',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
//                     })
//                     .catch((error)=>{
//                         setPop({show:true,message:error.message,code:'#880000'});
//                     })
                    
//                     // dispatch(storeFocusedListe([...list,buildItem]));
//                     // setRegistred(enregistre);
//                     // dispatch(setPowderAnalysed(enregistre));
                   
//                 }else{
//                     // alert(JSON.stringify(id))
//                     // ====================== build des non requis ==================================
//                     const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
//                     notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];});
//                     // ====================== build du item a enregistre ============================
//                     // const registredWithoutTheFocused=registred.filter(tem=>Number(tem.nChar)!==Number(numChariot));
//                     const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
//                     const {list}=ListOfFocusedAndLastNumber(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
//                     const {densite,...rest}=saveObject;// pour retirer la densite
//                     const builtItem={...rest,...itemToSave,observations:observations,categorie:"local",UtilisateurId:targetUser?.id};
//                     const enregistre=[...registredWithoutTheFocused,builtItem];// 2
//                     // ===================== Envoi aux memoires Context & store =====================
//                     setFocusedList([...list,{...rest,...itemToSave,observations:observations,UtilisateurId:targetUser?.id}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
//                     dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
//                     // alert(JSON.stringify(builtItem))
//                     fetch(dbBaseRoot+"poudre/analyses/update/"+itemToSave.id,
//                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
//                         body:JSON.stringify(builtItem)
//                     })
//                     .then(response=>response.json())
//                     .then(data=>{
//                         const {code,message,analyses}=data;
//                         if(code!=='red'){
//                         const {lansas,formules}=analyses;
//                         const ANALYSES=[...lansas,...formules];
//                         setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
//                         dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
//                         setPop({show:true,message:"Analyse modifiée avec succes.",code:code});
//                         // const toPop=code==='green'?
//                         //         {show:true,message:"Analyse modifiée avec succes.",code:code}
//                         //         :{show:true,message:"L'analyse n'a pas pu etre modifiée: "+message,code:'#880000'}
//                         }else{
//                             throw new Error("L'analyse n'a pas pu etre modifiée: "+message);
//                         }
//                     })
//                     .then(()=>{
//                         const ID=builtItem?.id;
//                         socket.emit('analysePoudreUpdated',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
//                     })
//                     .catch((error)=>{
//                         setPop({show:true,message:error.message,code:'#880000'});
//                     })
//                     // setRegistred(enregistre.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
//                     // dispatch(setPowderAnalysed(enregistre.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
//                     // dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
//                     setAction("create");
//                 }
//             }
//         }
//     }
    
//     return <View style={{minWidth:"75%",paddingVertical:40}}>
//         {currentProductedLen!==0 && <View style={{width:"100%",height:"auto",/*minHeight:750,*/ borderRadius:10,backgroundColor:'rgba(255,255,255,0.4)',justifyContent:'flex-start',alignItems:'center',paddingHorizontal:30,paddingVertical:15,paddingBottom:40,gap:15}}>
//             {taches!==undefined && <HeaderOfEdit name={nameToDisplay} couleur={couleur} taches={taches} />}
//             <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
//             {Object.entries({'nChar':{normes:{min:1,max:999}},...rest}).map(([key,value],i)=><EditRow 
//                 inputRefs={inputRefs} 
//                 index={i} key={i} 
//                 obj={{key:key,value:value}}
//             />)}
//             {Object.keys(rest).length>0 && <TouchableOpacity 
//             disabled={!enregistrerAllowed}
//                             style={{
//                                 minWidth:"100%",
//                                 minHeight:40,
//                                 marginTop:20,
//                                 backgroundColor:couleurs[CLE][7],
//                                 borderRadius:10,
//                                 paddingHorizontal:40,
//                                 paddingVertical:10,
//                             }}
//                 onPress={handleEnregistrerPress}
//             >
//                 <Text style={{color:"white",fontWeight:"bold",textAlign:"center",width:"center"}}>{"Enregistrer"+(!toCreate?" les modificstions":"")}</Text>
//             </TouchableOpacity>}
//         </View>}
//         {/* <Pop/> */} 
//         {/* // etit bien pour workSpace  */}
//     </View>
// }

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
// // const ChariotRow=({inputRefs,obj})=>{
// //     const {key,value}=obj;
// //     const {focusedList}=useCurrentProducted();
// //     const chariots=Chariots(focusedList);
// //     const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
// //     const {pickItemToSave}=useItemToSave();
// //     const [input,setInput]=useState("");
// //     function handleCheckValidity(val){
// //         const valFormat=Number.isNaN(Number(val))?val:Number(val); 
// //         const {icon,obs}=InputIsValid({input:valFormat,label:'nChar',normes:{min:1,max:999}});// utilise un formatage de val pour adapter les types
// //         setInput(val);
// //         setIconAndObs({icon,obs});
// //         pickItemToSave({"key":key,"value":val,"message":obs});
// //     }
// //     return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
// //         <Picker 
// //                     selectedValue={input}
// //                     mode="dropdown"
// //                     // onKeyPress={(e)=>handleKeyPress(e,0)} 
// //                     ref={(el) => (inputRefs.current[0] = el)}
// //                     onValueChange={(itemValue) => handleCheckValidity(itemValue)} 
// //                     style={style.input}
// //                 >
// //                     <Picker.Item key={0} label="Chariot" value={null} />
// //                     {chariots.map((option, index) => {
// //                     return <Picker.Item style={{textAlign:'center',}} key={index} label={option} value={option} />
// //                     })}
// //         </Picker>
// //         {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
// //     </View>
// // }
// const EditRow=({inputRefs,index,obj})=>{
//     const {key,value}=obj;
//     const lablJoined=key.split("_").join(" ").replace("max ","").replace("gg","Gros grains");
//     const labelJoined=index===0?'N° chariot':lablJoined;
//     const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
//     const {pickItemToSave}=useItemToSave();
//     const [input,setInput]=useState("");
//     const uniquePropriete=["max_gg","max_humidite"];
//     const min=uniquePropriete.includes(key)?0:(value.normes?.min || 0);
//     const max=uniquePropriete.includes(key)?value.normes:(value.normes?.max || 1000);
//     function handleCheckValidity(val){
//         const valFormat=Number.isNaN(Number(val))?val:Number(val); 
//         const {icon,obs}=InputIsValid({input:valFormat,label:labelJoined,normes:{min,max}});// utilise un formatage de val pour adapter les types
//         setIconAndObs({icon,obs});
//         pickItemToSave({"key":key,"value":val,"message":obs});
//     }
//     return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
//         {index===0?<UniversalCombobox 
//             inputRefs={inputRefs} 
//             index={index} 
//             labelJoined='N° Chariot'
//             value={input}
//             icon={iconAndObs.icon}
//             renderValidity={()=>handleCheckValidity(input)}
//             renderVal={(val)=>setInput(val)}
//              />
//             :
//             <LansaValue 
//             inputRefs={inputRefs} 
//             index={index} 
//             value={input} 
//             labelJoined={labelJoined} 
//             icon={iconAndObs.icon}

//             renderValidity={()=>handleCheckValidity(input)}
//             renderVal={(val)=>setInput(val)}
//         />}
//         {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
//     </View>
// }

// export const LansaValue=({inputRefs,index,labelJoined,icon,value,renderValidity,renderVal})=>{
//     const {currentProductedLen,focusedPro,toCreate}=useCurrentProducted();
//     const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
//     const [textValue,setTextValue]=useState("");
//     const IamFocused=index===INDEX;
//     // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
//     // const currentProductedLen=currentProducted.length;
//     const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
//     useEffect(()=>{
//         if(!toCreate || toCreate.toString().includes('falsy')){
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
//         if (key === 'ArrowDown') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
//         if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
//     };

    
//     return <TextInput
//         disabled={currentProductedLen===0}
//         returnKeyType="next"
//         onKeyPress={handleKeyPress} 
//         onSubmitEditing={handleNext}
//         onFocus={()=>setIndex(index)}
//         blurOnSubmit={false}
//         selectTextOnFocus="true"
//         maxLength={5}
//         label={label}
//         value={textValue} 
//         style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
//         ref={(el) => (inputRefs.current[index] = el)}
//         onBlur={()=>renderValidity()}
//         onChangeText={(val)=>{setTextValue(val);renderVal(val);handleLenOverFive(val)}}
//         right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
//     />
// }

// export const LansaObservations=({obs})=>(obs!=="" && <Text style={style.lansaObservations}>{obs}</Text>);

// export function InputIsValid({input,label,normes}){
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
// function UniversalCombobox({inputRefs,labelJoined,icon,value,renderValidity,renderVal,index,obj}) {
//     const {currentProductedLen,focusedList,focusedPro,setAction,toCreate}=useCurrentProducted();
//     const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
//     // const [textValue,setTextValue]=useState("");
//     const IamFocused=index===INDEX;
//     // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
//     // const currentProductedLen=currentProducted.length;
//     const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
//     // const {focusedList}=useCurrentProducted();
//     const chariots=Chariots(focusedList);
//     const [inputValue, setInputValue] = useState('');
//     const [options, setOptions] = useState(chariots.slice(-35));
//     const [showDropdown, setShowDropdown] = useState(false);

//     useEffect(()=>{
//         if(!toCreate || toCreate.toString().includes('falsy')){
//             const valeur=itemToSave?.name && itemToSave?.nChar;
//             setInputValue(valeur);
//         }else{
//             setInputValue("");
//             setItemToSave({});
//         }
//     },[toCreate])

//     function isManual(val){
//         const isNumAndAlreadyIn=!Number.isNaN(Number(val)) && chariots.includes(Number(val));
//         return isNumAndAlreadyIn;
//     }
//     function handleLenOverFive(val){if (val.length === 5) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
//     const handleNext = () => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
//     const handleKeyPress = (e) => {const { key } = e.nativeEvent;
//         if (key === 'ArrowDown') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
//         if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
//     };

//   const filteredOptions = options.filter(item =>
//    item.toString().toLowerCase().includes((inputValue || "").toString().toLowerCase())
//   );

//   const isNewOption =inputValue!==undefined && inputValue.toString().trim()!== '' && !options.some(opt => opt.toString().toLowerCase() === inputValue.toString().toLowerCase());

//   const handleSelect = (value) => {
//     setInputValue(value);
//     setAction(itemToSave?.id);
//     setShowDropdown(false);
//   };

//   const handleAddNew = () => {
//     const newValue = inputValue.toString()/*.trim()*/;
//     setOptions([...options, newValue].slice(-35));
//     setShowDropdown(false);
//   };

//   const rendValidity=(cb)=>{
//     return new Promise((resolve,reject)=>{
//         try{
//             cb()
//             setTimeout(()=>resolve(true),500)
//         }catch(error){
//             reject(false)
//         }
//         })
//     }
// const handleBlur=()=>{
//     rendValidity(renderValidity)
//     .then(bool=>bool && setShowDropdown(false));
// }

//   return (
//     // 1. LE CONTENEUR PRINCIPAL DOIT ÊTRE EN EN RELATIF
//     <View style={style.lansaValue}>
      
//       <TextInput
//         style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
//         placeholder="Chariot..."
//         value={inputValue}
//         onFocus={() => {setIndex(index);setShowDropdown(true)}}
//         onChangeText={(val)=>{setInputValue(val);setShowDropdown(true);renderVal(val);handleLenOverFive(val);isManual(val) && setAction('create')}}
//         disabled={currentProductedLen===0}
//         returnKeyType="next"
//         onKeyPress={handleKeyPress} 
//         onSubmitEditing={handleNext}
//         blurOnSubmit={false}
//         selectTextOnFocus="true"
//         maxLength={5} 
//         label={label}
//         ref={(el) => (inputRefs.current[index] = el)}
//         onBlur={handleBlur}
//         right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
    
//       />

//       {/* 2. LE MENU DÉROULANT EST EN ABSOLUTE */}
//       {showDropdown && (
//         <View style={style.dropdown}>
//           <FlatList
//             data={filteredOptions}
//             keyExtractor={(item) => item}
//             style={{ maxHeight: 100 }}
//             keyboardShouldPersistTaps="handled"
//             renderItem={({ item }) => (
//               <TouchableOpacity style={style.item} onPress={() => handleSelect(item)}>
//                 <Text style={style.itemText}>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />

//           {isNewOption && (
//             <TouchableOpacity style={style.addItem} onPress={handleAddNew}>
//               <Text style={style.addItemText}>➕ Ajouter "{inputValue}"</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </View>
    
//   );
// }

// const style=StyleSheet.create({
//     lansaValue:{
//         minWidth:"90%",
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
//     input:{
//         backgroundColor:'rgb(80,80,80)',
//         width:'90%',
//         // maxHeight:'5rem',
//         height:50,
//         // padding:'1.5rem',
//         fontWeight:'bold',
//         textAlign:'center',
//         letterSpacing:4,
//         borderRadius:8,
//         color:'white',
//     },
//       container: {
//     width: '100%',
//     // maxWidth: 400,
//     alignSelf: 'center',
//     // position: 'relative', // 👈 Indispensable pour servir de repère au menu absolute
//     // zIndex: 1000,         // 👈 Force le menu à passer devant tout le reste sur Web/iOS
//   },
//   dropdown: {
//     // position: 'absolute', // 👈 Sort le menu du flux de mise en page (ne pousse plus rien)
//     // top: '100%',          // 👈 Se place pile au pixel près sous le TextInput
//     // marginTop: 5,         // 👈 Crée le petit espace de décalage propre (équivalent à votre -10)
//     // left: 0,
//     // right: 0,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     // zIndex: 2000,         // 👈 Sécurité additionnelle pour le rendu
    
//     // Ombres multiplateformes pour détacher le menu du fond
//     ...Platform.select({
//       ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//       android: { elevation: 5 },
//       web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.15)' }
//     }),
//   },
//   item: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   itemText: {
//     fontSize: 16,
//   },
//   addItem: {
//     padding: 15,
//     backgroundColor: '#f0f9ff',
//     borderTopWidth: 1,
//     borderTopColor: '#bae6fd',
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//   },
//   addItemText: {
//     color: '#0284c7',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },

// })








// // import { useMemo,useEffect,useLayoutEffect,useState,useRef } from 'react';
// // import { createDrawerNavigator } from '@react-navigation/drawer';
// // import { Picker } from '@react-native-picker/picker';
// // import { View, Text, StyleSheet,TouchableWithoutFeedback,Pressable,ActivityIndicator,Platform,FlatList, TouchableOpacity } from 'react-native';
// // // import { FontAwesome5 } from '@expo/vector-icons';
// // import { Searchbar,TextInput,Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
// // import Collapsible from 'react-native-collapsible';
// // import Icon from 'react-native-vector-icons/FontAwesome';
// // import { useDispatch,useSelector } from 'react-redux';
// // import socket from '../assets/socketService';
// // import { dbBaseRoot,primaryColor,couleurs  } from '../assets/constantes';
// // import { Periodes } from '../components/periode';
// // import { HeaderRight } from './DrawerNavigator';
// // import { PowderHeaders } from '../components/tables/componentTable';
// // import Pop from '../components/popup';
// // import CustomPoudreDrawerContent from '../components/customPoudreDrawerContent';
// // import {FormulesProvider,CurrentProductedProvider,useCurrentProducted,useFormules,ItemToSaveProvider, useItemToSave, usePopup } from '../components/wrappers/contexts';
// // import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
// // import { setPowderAnalysed } from '../components/store/reducers/powderAnalysesReducer';
// // import { storeFocusedListe } from '../components/store/reducers/currentProducted';
// // import PoudreAnalysedTab from './poudreTabNavigator';
// // import WinDim from '../assets/operatingData';
// // import { Lansas,routesAndHeadersPowder,headersTour } from '../iterables';
// // import { styles } from '../components/tables/componentTable';
// // import { ViewOrImgBgPowderWrapper } from '../components/wrappers/viewOrImgWrapper';
// // import { ScrollView } from 'react-native-gesture-handler';
// // import { Comment } from '../components/tables/chat-for-table';
// // import { AdjentDayInMs} from '../components/periode';
// // import { isFormule,allowTo,isAlreadyAnalysed,Chariots} from '../assets/functions';
// // import Colors from '../assets/colors';
// // const {aujourdhui,demain}=Periodes();
// // const {full}=routesAndHeadersPowder;
// // const {api_url,headers}=full;
// // const {isLarge,isWeb}=WinDim;
// // function Flex(dir,jC,aI){
// //   return {
// //     display:'flex',
// //     flexDirection:dir,
// //     justifyContent:jC,
// //     alignItems:aI,
// //   }
// // }
// // const Drawer = createDrawerNavigator();
// // export const colors={
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

// // export const Errors = ({visible,render,isMissing,missing}) => {
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

// // export const UpdateLansa = ({visible,item}) => {
// //   return<View >
// //         <Portal>
// //           <Dialog style={{maxWidth:700,minWidth:400,width:"40%",marginHorizontal:"auto"}} visible={visible} onDismiss={()=>render()}>
// //                 <Dialog.Title style={{fontSize:15,color:"grey",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>{"Mise a jour "+ item.name}</Dialog.Title>
// //             <Dialog.Content style={{maxWidth:700,minWidth:400,margin:"auto"}}>
// //                 <PoudreWorkSpace mission="update"/>
// //             </Dialog.Content>
// //             <Dialog.Actions>
// //               <Button onPress={()=>render()}>Enregistrer</Button>
// //               <Button onPress={()=>render()}>Annuler</Button>
// //             </Dialog.Actions>
// //           </Dialog>
// //         </Portal>
// //       </View>
// // }

// // export default function DrawerPoudre(){
// //     const dispatch=useDispatch();
// //     useLayoutEffect(()=>{
// //             fetch(dbBaseRoot+"poudre/analyses/lansasAndformules")
// //             .then(response=>response.json())
// //             .then(data=>{
// //                 const {lansas,formules}=data.analyses;
// //                 const analyses=[...lansas,...formules];
// //                 dispatch(setPowderAnalysed(analyses));
// //             })
// //             .catch(function(error){
// //                 alert(error.message)
// //             })
// //         },[]);
// //   return (<CurrentProductedProvider>
// //         <ItemToSaveProvider>
// //             <Drawer.Navigator initialRouteName="Formules"
// //             screenOptions={{
// //                     headerShown:false,
// //                     drawerType:isLarge?'permanent':'slide',
// //                     drawerStyle:isLarge?{width:'21%'/*'23%'*/,backgroundColor: '#ddd'}:{backgroundColor: '#ddd'},
// //                     overlayColor:isLarge && "transparent",
// //                     headerLeft:isLarge?()=>null:undefined,
// //                     switeEnabled:!isLarge,
// //                     headerStyle: { backgroundColor: '#6200ee',height:40 },
// //                     drawerPosition: 'left',
// //                     gestureEnabled:true,
// //                     gestureDirection:'horizontal',
// //                     headerTintColor: '#fff',
// //                     headerTitleAlign: 'left',
// //                     drawerLabelStyle: { fontSize: 18,letterSpacing:2, },
// //                     // headerRight:() => (<HeaderRight isLarge={isLarge}/>)
// //                     // headerRight:() => (<HeaderRight isLarge={isLarge}/>)
// //                 }}
// //                 drawerContent={()=> <FormulesProvider><CustomPoudreDrawerContent/> </FormulesProvider>}
// //                 >
// //                 <Drawer.Screen name="Basics" children={({navigation,route}) =>  <></>}/>
// //                 <Drawer.Screen name="Lansas" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
// //                 <Drawer.Screen name="Formules" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
                
// //             </Drawer.Navigator>
// //         </ItemToSaveProvider>
// //     </CurrentProductedProvider>
    
// //   );

// // }

// // const Tabs=({navigation,route}) => {
// //     return <View 
// //     style={{flex:1,
// //         flexDirection:'row',
// //         justifyContent:'center',
// //         alignItems:'flex-start',
// //         backgroundColor:'rgba(0,0,0,0.9)',
// //         width:"100%",
// //         padding:3,
// //         paddingVertical:0,
// //     }}
// // >
// //             <FormulesProvider>
// //                 <ViewOrImgBgPowderWrapper uri="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDM5MW5yYnZlcGE0Mm80YjlncTR5cG41cG5rNWhua2N2enBudXk2YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SnwifA7bOFDhe/giphy.gif">
// //                     <AnalysedTab/>
// //                 </ViewOrImgBgPowderWrapper>
// //                 <AnalysedList/>
// //             </FormulesProvider>
// //         </View>
// // }

// // const AnalysedTab=() => {
// //     return  <View style={{width:"100%",backgroundColor:'rgba(250,250,250,0.1)',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginRight:2}}>
// //         <PoudreAnalysedTab/>
// //         <PaperProvider><PoudreWorkSpace mission="create"/></PaperProvider>
// //     </View>
// // }

// // const AnalysedList=() => {
// //         // const [loading,setLoading]=useState(false);
// //         const [K,setK]=useState(null);
// //         const {powderAnalysed,focusedListe}=useSelector(state=>{
// //             const powderAnalysed=state.powderAnalysed.powderAnalysed;
// //             const focusedListe=state.currentProducted.focusedListe;
// //             return {powderAnalysed,focusedListe};
// //         })
// //         const [analysed,setAnalysed]=useState([]);
// //         const {registred,Everages}=useCurrentProducted();
// //         function handleResearchChange(txt){
// //             // alert(JSON.stringify(registred))
// //             const matchedAnalysed=powderAnalysed.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
// //             setAnalysed(matchedAnalysed);
// //             // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
// //         }
// //         useMemo(()=>{setAnalysed(focusedListe.filter(item=>isAlreadyAnalysed(item)))},[focusedListe]);// focusedListe du store etait import pour cette partie
// //         const {name,nom}=focusedListe[0]||{};
// //         const {nameToDisplay}=isFormule(focusedListe[0]||{})
// //         const AnalysedLen=analysed.length;
// //         const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
// //     return <View style={{flex:1,width:"55%",minHeight:700,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
// //             <View style={{width:"100%",height:75,backgroundColor:"#ddd",flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderBottomWidth:2,borderColor:"black",paddingHorizontal:20,paddingRight:10,marginBottom:10}}>
// //                 <View style={{width:"65%",flexDirection:"row-reverse",justifyContent:"flex-start",alignItems:"center",gap:0}}>
// //                 <HeaderRight isLarge={isLarge} liq={false}/>
// //                 <Searchbar
// //                     placeholder="Numero nChar..."
// //                     onChangeText={(txt)=>handleResearchChange(txt)}
// //                     value={null}
// //                     style={{margin:0,backgroundColor:'rgba(255,255,255,0.9)',width:"70%",height:"auto"}}
// //                 />
// //                 </View>
// //                 <Text style={{fontSize:12,textAlign:"center",fontWeight:'bold',width:"35%"}}>{/*nom ||name*/nameToDisplay}</Text>
// //             </View>
// //             <View style={{width:"100%",height:"auto",minHeight:740,maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
// //                 <PowderHeaders headers={headers}/>
// //                 {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
// //                         ) : ( */}
// //                     <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}>
// //                           <FlatList
// //                                         data={analysed}
// //                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
// //                                         renderItem={({ item },index) =>{
// //                                         return <PowderRow
// //                                                     key={index}
// //                                                     K={K}
// //                                                     setK={setK}
// //                                                     item={item}
// //                                                     items={analysed}
// //                                                 />
// //                                             }
// //                                         }
// //                           />
// //                     </View>
// //                 <View 
// //                 style={{
// //                         flex:1,
// //                         maxHeight:60,
// //                         width:"96%",
// //                         paddingHorizontal:"2%",
// //                         marginVertical:10,
// //                         paddingVertical:8,
// //                         flexDirection:"row",
// //                         gap:40,
// //                         position:"absolute",
// //                         bottom:10,
// //                         backgroundColor:"rgb(0,90,0)",
// //                         borderBottomLeftRadius:8,
// //                         borderBottomRightRadius:8,
// //                         }}
// //                 >
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>Les moyennes </Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"GG "+(GG/AnalysedLen).toFixed(2)}</Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"HUM. "+(HUMIDITE/AnalysedLen).toFixed(2)}</Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"MA "+(MATIERE_ACTIVE/AnalysedLen).toFixed(2)}</Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"ALCA. "+(ALCANITE/AnalysedLen).toFixed(2)}</Text>
// //                 </View>
// //             </View>
// //                         {/* )
// //                   } */}
// //         </View>
// // }

// // export const AnalysedListTour=() => {
// //         const [K,setK]=useState(null);
// //         const scrollViewRef = useRef(null);

// //         /* Experimentation: relation entre redux et le contexte(on set le redux->le context prend 
// //         [auto: non pas auto finalement !il fautun useEffect dans le context
// //          ou passer directement la valeur du redux dans l'objet du context pour que le context se met à jour automatiquement ]
// //           du redux et hot-reload sur UI ???? )*/
// //         const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed); // const {powderAnalysed/*,focusedListe*/}=useSelector(state=>{
// //         //     const powderAnalysed=state.powderAnalysed.powderAnalysed;
// //         //     // const focusedListe=state.currentProducted.focusedListe;
// //         //     return {powderAnalysed/*,focusedListe*/};
// //         // })
// //         const [analysed,setAnalysed]=useState([]);
// //         const {registred,focusedList}=useCurrentProducted();
        
// //         useEffect/*useMemo*/(()=>{setAnalysed(focusedList.slice(-20))},[focusedList]);// focusedListe du store etait import pour cette partie

// //         const {name,nom}=focusedList[0]||{};
// //         const AnalysedLen=analysed.length;
// //     return <View style={{flex:1,width:"100%",minHeight:400,borderWidth:1,borderColor:'grey',borderRadius:15,backgroundColor:'white',paddingVertical:20,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2,marginTop:40}}>
            
// //             <View style={{width:"100%",height:"auto",minHeight:400,maxHeight:400,paddingHorizontal:10,paddingVertical:0}}>
// //                 <PowderHeaders headers={headersTour}/>
// //                     {/* <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}> */}
// //                         <ScrollView 
// //                                 ref={scrollViewRef}
// //                                 horizontal={false}
// //                                 onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
// //                                 style={{width:"100%",maxHeight:300,padding:10/*,overflowY:"scroll",*/}}
// //                             >
// //                           <FlatList
// //                                         data={analysed}
// //                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
// //                                         renderItem={({ item },index) =>{
// //                                         return <PowderRowTour
// //                                                     key={index}
// //                                                     K={K}
// //                                                     setK={setK}
// //                                                     item={item}
// //                                                     items={analysed}
// //                                                 />
// //                                             }
// //                                         }
// //                           />
// //                           </ScrollView>
// //                     {/* </View> */}
// //             </View>
// //         </View>
// // }

// // export const AnalysedListe=({product,rend}) => {// Pour Poudre-full
// //         // const [loading,setLoading]=useState(false);
// //         const dispatch=useDispatch();
// //         const {startedAt,endedAt}=useSelector(state=>state.period.targetPeriod);
// //         const [K,setK]=useState(null);
// //         const {setPop}=usePopup();
// //         const {powderFiltred,powderAnalysed,powderType,focusedListe}=useSelector(state=>{
// //             const powderFiltred=state.powderAnalysed.powderFiltred;
// //             const powderAnalysed=state.powderAnalysed.powderAnalysed;
// //             const powderType=state.powderAnalysed.powderType;
// //             const focusedListe=state.currentProducted.focusedListe;
// //             return {powderFiltred,powderAnalysed,powderType,focusedListe};
// //         })
// //         const [analysed,setAnalysed]=useState([]);
// //         const {Everages}=useCurrentProducted();
// //         // function handleResearchChange(txt){
// //         //     const matchedAnalysed=registred.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.nChar.toString().includes(txt)));// registred a la place powderAnalysed
// //         //     setAnalysed(matchedAnalysed);
// //         //     // .sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)
// //         // }
// //         useLayoutEffect(()=>{
// //             fetch(`${dbBaseRoot}poudre/analyses?startedAt=${startedAt}&endedAt=${endedAt}`) 
// //             .then(response=>response.json())
// //             .then(data=>{dispatch(setPowderAnalysed(data.analyses));rend(powderAnalysed);})//;/*setAnalysed(data.analyses)*/})// losque powderAnalysed changera setAnalyses se fera du useEffect plus en dessous
// //             .catch(function(error){ 
// //                 setPop({show:true,message:error.message,code:"#880000"})
// //             })
// //             // setAnalysed(powderFiltred); 
// //         },[]);
// //         //  useMemo(()=>{
// //         //     const products=product===null?analysed:analysed.filter((itm)=>isFormule(itm).estFormule?(isFormule(itm).nameToDisplay===product):itm.name===product);
// //         //     setAnalysed(products)},[product]);// product pour gerer le cas du clic sur un decompte-item

// //         useEffect/*useMemo*/(()=>{
// //             setAnalysed(powderType); // filtrer suivant le type (extra,local,finies,get,diam,...)
// //             ///** Essayons -le */ rend(powderAnalysed); // construit les chipps: doit rester constatn que owderAnalysed n'a pas changé: Pouvait se faire dans le useLayoutEffect si aucune mise a jour des powderAnalysed n'est envisagée
// //         },[powderAnalysed,powderType]);// focusedListe du store etait import pour cette partie

// //         const AnalysedLen=analysed.length;
// //         const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
// //     return <View style={{flex:1,width:"100%",height:"auto",padding:50,paddingTop:20,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
// //             <View style={{width:"100%",height:"auto",height:"auto",maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
// //                 <PowderHeaders headers={headers}/>
// //                 {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
// //                         ) : ( */}
// //                     <View style={{width:"100%",height:"auto",maxHeight:740,marginBottom:70,overflowY:"scroll",}}>
// //                           <FlatList
// //                                         data={analysed}
// //                                         keyExtractor={(item,i) =>(item.nChar?.toString()+i.toString())}
// //                                         renderItem={({ item },index) =>{
// //                                         return <PowderRow
// //                                                     key={index}
// //                                                     K={K}
// //                                                     setK={setK}
// //                                                     item={item}
// //                                                     items={analysed}
// //                                                     ac={true}
// //                                                 />
// //                                             }
// //                                         }
// //                           />
// //                     </View>
// //                 {product!==null && <View 
// //                 style={{
// //                         flex:1,
// //                         maxHeight:60,
// //                         width:"96%",
// //                         paddingHorizontal:"2%",
// //                         marginVertical:10,
// //                         paddingVertical:8,
// //                         flexDirection:"row",
// //                         gap:40,
// //                         position:"absolute",
// //                         bottom:10,
// //                         backgroundColor:"rgb(0,90,0)",
// //                         borderBottomLeftRadius:8,
// //                         borderBottomRightRadius:8,
// //                         }}
// //                 >
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>Les moyennes </Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"GG "+(GG/AnalysedLen).toFixed(2)}</Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"HUM. "+(HUMIDITE/AnalysedLen).toFixed(2)}</Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"MA "+(MATIERE_ACTIVE/AnalysedLen).toFixed(2)}</Text>
// //                     <Text style={{fontWeight:"bold",fontSize:18,textAlign:"center",width:"auto",color:"white"}}>{"ALCA. "+(ALCANITE/AnalysedLen).toFixed(2)}</Text>
// //                 </View>}
// //             </View>
// //                         {/* )
// //                   } */}
// //         </View>
// // }

// // export const PowderRow=({K,ac,setK,item})=>{
// //     const headersKeys=["gg","humidite","matiere_active","alcanite","silicate","sel"];
// //     const clooned= useSelector(state => state.actived.clooned);
// //     const [focusedIndex,setFocusedIndex]=useState(null);
// //     const [isCollapsed,setIsCollapsed]=useState(false);
// //     const [comment,setComment]=useState("");
// //     const [toggle,setToggle]=useState(false);
// //     const [comments,setComments]=useState([]);
// //     const {nChar,name,identifier,couleur,taches,...rest}=item;
// //     const {nameToDisplay}=isFormule(item);
// //     const isHovered=K===identifier;
// //     const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};
// //     const handleAddComment=()=>{
// //         const pseudo=toggle?"ndour":"Moneem";
// //         const commnts=[[comment,"Mamadou","Ndour",null,true,pseudo],...comments];
// //         setToggle(!toggle);
// //         setComments(commnts);
// //     }
// //     const handleKeyPress=(e)=>{
// //         if(e.nativeEvent.key==='Enter'){
// //         handleAddComment();
// //     }
// //     }
// //     return <TouchableOpacity 
// //                 style={
// //                     [
// //                         {
// //                             flex:1,
// //                             flexDirection:"column",
// //                             justifyContent:"flex-start",
// //                             alignItems:"center",
// //                             minHeight:40,
// //                             paddingVertical:2,
// //                             paddingHorizontal:4
// //                         },
// //                         isHovered && hoveredStyle
// //                     ]
// //                 }

// //                 onPress={() => {setFocusedIndex(nChar);setIsCollapsed(!isCollapsed)}}
// //                 onPressIn={()=>setFocusedIndex(nChar)}
// //                 onMouseEnter={()=>setK(identifier)}
// //                 onMouseLeave={()=>setK(null)}
// //             >
// //                 <View 
// //                     style={{
// //                         flex:1,
// //                         width:"100%",
// //                         flexDirection:"row",
// //                         justifyContent:"flex-start",
// //                         alignItems:"center"
// //                     }}
// //                 >
// //                     <Chariot oldCh={Number(nChar)}/>
// //                     <Text style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",minWidth:100,fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{nameToDisplay}</Text>

// //                     {
// //                         headersKeys.map((ky,i)=>{
// //                                 const isInHeadersKeys=rest[ky]!==undefined;
// //                                 return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?rest[ky]:"..."}</Text>//isInHeadersKeys?vl[cle]:"..."
// //                             })
// //                     }
// //                     <View style={{...styles.row,marginBottom:2,marginRight:4,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 38,}}>
// //                         {isHovered && <Actions item={item} />}
// //                     </View>
// //                 </View>
// //                 {
// //                     focusedIndex===nChar && <Collapsible collapsed={isCollapsed}>
// //                         <View style={{minWidth:ac?880:600,width:"100%",height:"auto",padding:20,paddingVertical:0,marginHorizontal:'auto',backgroundColor:'rgba(0,0,0,0.1)',
// //                             flexDirection:"column",
// //                             justifyContent:"flex-start",
// //                             alignItems:"center",

// //                         }}>
// //                                 <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+"3.4.2026"+"   updated : "+"4.3.2026"+"  By:"+"ndour"+"  "}</Text></View>
// //                                 {/* <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+ReduceDateTime(createdAt)+"   updated : "+ReduceDateTime(updatedAt)+"  By:"+chemist+"  "+(validation?(" validated by: "+validateur+" on: "+ReduceDateTime(validatedAt)):"")}</Text></View> */}
// //                                 <View style={{width:'100%',minHeight:100,padding:24,borderRadius:5,paddingTop:5,backgroundColor:'rgb(180,180,180)',}}>
// //                                     {/* <Text style={{color:'black',fontWeight:'bold',}}>{"Analyse "+id+" - "+categorie+"."+item.name+" Observations : "}<Observations obs={observations}/> </Text> */}
// //                                     <ScrollView>
// //                                     {/* <ScrollView ref={scrollViewRef}> */}
// //                                         {/* <CommentsProvider commentaires={commentaires}> */}
// //                                         <View style={{width:'100%',paddingBottom:50,flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
// //                                             {comments.map((cmnt,index)=><Comment key={index} targetPseudo={null} color={Colors.Bleu} comnt={cmnt}/>)}
// //                                         </View>
// //                                         {/* <Comments targetPseudo={targetPseudo} itemColor={itemColor} />
// //                                         </CommentsProvider> */}
// //                                     </ScrollView>
// //                                 </View>
// //                                 <View style={{...Flex('row','center','center'),zIndex:10,width:'90%',height:80,marginTop:-12,bottom:0,}}>
// //                                     <TouchableWithoutFeedback style={{width:'80%',height:'60%',}}>
// //                                         <TextInput
// //                                             style={{display:'block',backgroundColor:'white',width:'100%',padding:5,margin:5,borderRadius:5,paddingHorizontal:12,overflowX:'wrap',minHeight:40,maxHeight:100,height:'60%'}}
// //                                             placeholder="Your new comment here ..."
// //                                             // ref={inputRef}
// //                                             onSubmitEditing={handleAddComment}
// //                                             onChangeText={(value)=>setComment(value)}
// //                                             onKeyPress={handleKeyPress}
// //                                             value={comment}
// //                                         />
                    
// //                                     </TouchableWithoutFeedback>
// //                                     <TouchableOpacity
// //                                     onPress={handleAddComment}
// //                                     style={{maxWidth:48,width:'20%',height:'50%',paddingHorizontal:6,paddingVertical:4,margin:6,backgroundColor:'blue',borderRadius:5,...Flex('column','center','center'),}}
// //                                     >
// //                                     <Text style={{color:'white',textAlign:'center',fontWeight:'bold',}}>
// //                                     <Icon name="paper-plane" size={17} color="#fff"/>
// //                                     </Text>
                    
// //                                     </TouchableOpacity>
// //                                 </View>
// //                         </View>
// //                     </Collapsible>
// //                 }
       
// //             </TouchableOpacity>
// // }

// // const PowderRowTour=({K,ac,setK,item})=>{
// //     const {UpdateFocusedProdByName,setAction}=useCurrentProducted();
// //     const {setItemToSave}=useItemToSave();
// //     const headersKeys=["nChar","name","densite","density"];
// //     const clooned= useSelector(state => state.actived.clooned);
// //     const [focusedIndex,setFocusedIndex]=useState(null);
// //     const {name,nChar,densite,identifier}=item;
// //     const ITEM={nChar:nChar,name:name,densite:densite,dap:densite};
// //     const isHovered=K===identifier;
// //     const hoveredStyle={backgroundColor:'rgba(0,0,255,0.1)',borderWidth:0.2,borderColor:primaryColor,borderRadius:5};
// //     function handleUpdate(){
// //         UpdateFocusedProdByName(item);
// //         setItemToSave(item);
// //         setFocusedIndex(nChar);
// //         setAction(item?.id);
// //     }
// //     return <TouchableOpacity 
// //                 style={
// //                     [
// //                         {
// //                             flex:1,
// //                             flexDirection:"column",
// //                             justifyContent:"flex-start",
// //                             alignItems:"center",
// //                             minHeight:40,
// //                             paddingVertical:2,
// //                             paddingHorizontal:4
// //                         },
// //                         isHovered && hoveredStyle
// //                     ]
// //                 }

// //                 onPress={()=>handleUpdate()}
// //                 onPressIn={()=>setFocusedIndex(nChar)}
// //                 onMouseEnter={()=>setK(identifier)}
// //                 onMouseLeave={()=>setK(null)}
// //             >
// //                 <View 
// //                     style={{
// //                         flex:1,
// //                         width:"100%",
// //                         flexDirection:"row",
// //                         justifyContent:"flex-start",
// //                         alignItems:"center"
// //                     }}
// //                 >
// //                     {
// //                         headersKeys.map((ky,i)=>{
// //                                 const isInHeadersKeys=ITEM[ky]!==undefined;
// //                                 return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?ITEM[ky]:"..."}</Text> 
// //                             })
// //                     }
// //                 </View> 
                
       
// //             </TouchableOpacity>
// // }

// // export const Chariot=({oldCh})=>{
// //     const [ch,setCh]=useState(oldCh);
// //     const {setPop}=usePopup();
// //     const dispatch=useDispatch();
// //     const {ListOfFocusedAndLastNumber}=useCurrentProducted();
// //     const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed)
// //     const {targetUser}=useSelector(state=>state.user);
// //     function handleBlur(newCh){
// //         const tourAllowed=allowTo("TOUR",targetUser?.privileges) || targetUser?.affecte_depart==='Tour';
// //         if(!tourAllowed){setPop({show:true,message:"Vous n'ëtes pas habileté à modifier un  numero de chariot.",code:'#880000'});setCh(oldCh);return;};
// //         const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.nChar)!==Number(oldCh));
// //         const item=powderAnalysed.filter(it=>Number(it.nChar)===Number(oldCh))[0];
// //         const {nChar,...rest}=item;const newItem={...rest,nChar:Number(newCh)};

// //         const updteOwderAnalysed=[...updatedPowderAnalysed,newItem].sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar);
// //         const {list}=ListOfFocusedAndLastNumber(item,updteOwderAnalysed);
// //         dispatch(setPowderAnalysed(updteOwderAnalysed));
// //         dispatch(storeFocusedListe(list));
// //         if(!item.id){setPop({show:true,message:"Erreur sur l'ID cible ! Peut-etre UNDEFINED | NULL .",code:"#880000"});return}
// //         fetch(dbBaseRoot+"poudre/analyses/update/"+item.id,
// //                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
// //                         body:JSON.stringify(newItem)
// //                     }) 
// //                     .then(response=>response.json())
// //                     .then(data=>{
// //                         // console.log(data)
// //                         const {message/*,analyses*/}=data;
// //                         // const {lansas,formules}=analyses;
// //                         // const ANALYSES=[...lansas,...formules];
// //                         // const {list}=ListOfFocusedAndLastNumber(item,ANALYSES);
// //                         // dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)));
// //                         // dispatch(storeFocusedListe(list));
// //                     })

// //         // setCh(newCh);
// //     }
// //     return <TextInput
// //         value={ch}
// //         onBlur={()=>handleBlur(Number(ch))}
// //         onChangeText={(CH)=>setCh(CH)}
// //         style={{flex: 1,textAlign: "left",maxWidth:30,width:20,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:12,letterSpacing:2}}
// //     />
// // }

// // export const Actions=({item})=>{
// //     const dispatch=useDispatch();
// //     const {setPop}=usePopup();
// //     const {setFocusedPro,UpdateFocusedProdByName,setRegistred,setFocusedList,ListOfFocusedAndLastNumber,setAction,focusedPro}=useCurrentProducted();
// //     const {targetUser,powderNormes,powderAnalysed,focusedListe}=useSelector(state=>{
// //         const powderNormes=state.powderNormes.powderNormes;
// //         const targetUser = state.user.targetUser;
// //         const {powderAnalysed,focusedListe}=state.powderAnalysed;
// //         return {targetUser,powderNormes,powderAnalysed,focusedListe};
// //     });
// //     const deleteAllowed=allowTo("supprimer analyse",targetUser?.privileges);
// //     const updateAllowed=allowTo("modifier analyse",targetUser?.privileges);
// //     const delKey=deleteAllowed?"allowed":"notAllowed";
// //     const updKey=updateAllowed?"allowed":"notAllowed";
// //     const {setItemToSave}=useItemToSave();
// //     const {name,id}=item;
// //     const handleDelete=async ()=>{
// //         // if(!deleteAllowed){setPop({show:true,message:"Vous n'avez pas la permission de supprimer une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#88000'});return;}
// //         try{
// //             const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.id)!==Number(id));
// //             const {list}=ListOfFocusedAndLastNumber(item,updatedPowderAnalysed);
// //            if(!id){setPop({show:true,message:"Erreur sur l'ID cible. ID undefined || null .",code:'#880000'});return}
// //             fetch(dbBaseRoot+"poudre/analyses/delete/"+targetUser.id+"/"+id,
// //                        {method: 'DELETE',headers: {'Content-Type': 'application/json'}
// //                     })
// //                     .then(response=>response.json())
// //                     .then(data=>{
// //                         // console.log(data)
// //                         const {code,message/*,analyses*/}=data;
// //                         // const {lansas,formules}=analyses;
// //                         // const ANALYSES=[...lansas,...formules];
// //                         // const {list}=ListOfFocusedAndLastNumber(item,ANALYSES);
// //                         // dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => firstItem.nChar - secondItem.nChar)));
// //                         // dispatch(storeFocusedListe(list));
// //                          // mise a jour des data statement ==========================
// //                             // Provider
// //                         if(code==="green"){
// //                             setFocusedList(list);
// //                             setRegistred(updatedPowderAnalysed);
// //                                 // store de redux
// //                             dispatch(setPowderAnalysed(updatedPowderAnalysed));
// //                             dispatch(storeFocusedListe(list));
// //                         }
// //                         const toPop=code==='green'?
// //                                 {show:true,message:"Analyse "+id+" avec succes.",code:code}
// //                                 :
// //                                 {show:true,message:"L'analyse "+id+" n'a pas pu etre supprimée :"+error.message,code:'#880000'}
// //                         setPop(toPop);
// //                     })
// //             // ==========================================================
            
// //             // render(updatedPowderAnalysed);
// //           // Mise a jour coté bdd
// //         // /*const response=*/ await fetch(`${dbBaseRoot}analyses/delete/${id}`,{
// //         //   method:'DELETE',
// //         //   headers: {
// //         //       'Content-Type':'application/json'
// //         //   },});
// //           // Mise à jour coté UI
// //             // const itms=items.filter(item=>item.id!==id);
// //             // dispatch(postAnalyses(null));
// //             // render(itms);
// //         }catch(error){
// //             setPop({show:true,mesage:"Analyse "+item.id+" n'a pu etre supprimee !"+error,code:'#880000'});
// //         }
// //     }
// //     const confirmDelete=()=>{
// //         if(!deleteAllowed){setPop({show:true,message:"Vous n'avez pas la permission de supprimer une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#88000'});return;}
// //         isWeb?(confirm("Etes-vous sur de  vouloir supprimer cet enregistrement ?")?handleDelete():null)
// //       :
// //       Alert.alert("Confirmation",
// //           "Etes-vous sur de  vouloir supprimer cet enregistrement ?",
// //           [
// //             {
// //               text:"Annuler",
// //               style:"cancel",
// //               onPress:()=>null
// //             },
// //             {
// //               text:"Continuer la suppression",
// //               onPress:()=>handleDelete()
// //             }
// //           ],
// //           {cancelable:true}
// //         )}

// //   const handleUpdate=async ()=>{
// //     if(!updateAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission de modifier une analyse !\nRapprochez-vous de votre responsable de departement.",code:'#880000'});return;}

// //     //   const itemKey=name.split(" ").join("_").toLowerCase();
// //     //   const itemNormes=powderNormes[itemKey];
// //     //   setFocusedPro(itemNormes);
// //     UpdateFocusedProdByName(item);
// //     setItemToSave(item);
// //     setAction("update");

// //   }

// //   return <TouchableWithoutFeedback>
// //     <View
// //       style={{
// //         height:"auto",
// //         width:100,
// //         paddingVertical: 3,
// //         borderRadius: 8,
// //         backgroundColor:'white',
// //         // ...Flex('row','center','center')
// //         }}
// //     >
// //     {/* {
// //       user && user.isAdmin? */}
// //       <>
// //         <Pressable style={{...style.actions,marginRight:45,}} disabled={!deleteAllowed} onPress={confirmDelete}>
// //             <Icon size={14} name="trash" color={couleurs[delKey][8]}/>
// //         </Pressable>
// //         <Pressable style={{...style.actions,marginLeft:50,}} disabled={!updateAllowed} onPress={handleUpdate}>
// //             <Icon size={14} name="pencil" color={couleurs[updKey][7]}/>
// //         </Pressable>
// //       </>
// //       {/* :<Text>...</Text>
// //     } */}
// //     </View>
// //   </TouchableWithoutFeedback>
// // }

// // const PoudreWorkSpace=() => {
// //     const dispatch=useDispatch();
// //     const {setPop}=usePopup();
// //     const inputRefs = useRef([]);
// //     const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
// //     const {targetUser,focusedProduct,powderAnalysed,currentProducted}=useSelector(state=>{
// //         const targetUser = state.user.targetUser;
// //         const powderAnalysed=state.powderAnalysed.powderAnalysed;
// //         const focusedProduct=state.focusedProduct.focusedProduct;
// //         const currentProducted=state.currentProducted.currentProducted;
// //         return {targetUser,focusedProduct,powderAnalysed,currentProducted};
// //     });
// //     const enregistrerAllowed=allowTo("enregistrer analyse",targetUser?.privileges);
// //     const CLE=enregistrerAllowed?"allowed":"notAllowed";
// //     // alert(JSON.stringify(currentProducted))
// //     const {toCreate,setAction,ListOfFocusedAndLastNumber,focusedList,currentProductedPro,currentProductedLen,setFocusedList,setFocusedPro,focusedPro,keysAndRequirements,registred,setRegistred}=useCurrentProducted();
// //     const chariots=Chariots(focusedList);
// //     const {noErrors,errors,itemToSave}=useItemToSave();
// //     // const numChariot=itemToSave?.nChar;
// //     const numIdentifier=itemToSave?.identifier;
// //     const {nom,name,couleur,taches,format,parfum,percarbonate,mousses,densite,compression,...Rest}=focusedPro;
// //     const {estFormule,nameToDisplay}=isFormule(focusedPro);
// //     const {silicate,sel,...REST}=Rest;
// //     const rest=toCreate?REST:Rest;
// //     const [visible,setVisible]=useState(false);
// //     const [isMissing,setIsMissing]=useState(false);
// //     const [missing,setMissing]=useState({});

// //     function missingRequiredKeys(){
// //         const keysAndRequireds=keysAndRequirements();
// //         var missings=[];
// //         keysAndRequireds.map(item=>{
// //         if(item[1] && (itemToSave[item[0]]===undefined || itemToSave[item[0]]==="")){
// //             const msg=item[0].toUpperCase()+" is required !";
// //             missings.push(msg);
// //             return null;
// //         }})
// //         return missings;
// //     };

// //     // useMemo(()=>{setFocusedPro(focusedProduct);},[focusedProduct]);// pour mettre a jour focused chaque fois que le focused du store est mis a jour a partir de ce component
// //     // useLayoutEffect(()=>{ // pour charger le focused initial apres initialisation

// //     //     const currentProductedValues=Object.values(currentProductedPro);
// //     //     const currentProductedLen=currentProductedValues.length;
// //     //     const currentProducted_0=currentProductedLen!==0?currentProductedValues[0]:{};
// //     //     // setCurrentProductedPro()
// //     //     setFocusedPro(currentProducted_0);
// //     // },[]);
// // // console.log(focusedPro)
// //     const handleEnregistrerPress=()=>{
// //         if(!enregistrerAllowed){setPop({show:true,mesage:"Vous n'avez pas la permission d'enregistrer une analyse !",code:'#880000'});
// //             return;
// //         }
// //         if(!noErrors){
// //             setVisible(true);
// //         }else{
// //             // const observations=errors.reduce((acc,er)=>acc+'JOIN'+er)||"";
// //             const observations="";
// //             const missings=missingRequiredKeys();
// //             if(missings.length!==0){
// //                 setMissing(missings);
// //                 setIsMissing(true);
// //                 setVisible(true); 
// //             }else{
// //                 var saveObject={};
// //                 if(toCreate && !toCreate.toString().includes('falsy')){
// //                     // ====================== build des non requis ==================================
// //                     const {format}=focusedPro;
// //                     const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
// //                     notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];})// reconstruire notRequired sous forme d'objet js dans saveObject
// //                     if(format!==undefined){
// //                         const formats=format?.reduce((a,acc)=>acc+" "+a);
// //                         saveObject['format']=formats;
// //                     }
// //                     // ====================== build du item a enregistre ============================
// //                     const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedProduct,powderAnalysed);
// //                     // const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedPro,registred);// registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
// //                     const identifier=freeChariot.toString()+"_"+AdjentDayInMs(new Date(),0).toString();
// //                     const {densite,silicate,sel,...rest}=saveObject;// pour retirer la densite ,le silicate et le sel
// //                     const buildItem={...rest,...itemToSave,identifier:identifier/*,nChar:parseFloat(freeChariot)*/,observations:observations,categorie:"local",UtilisateurId:parseFloat(targetUser?.id)};
// //                     // alert(JSON.stringify(buildItem))
// //                     const enregistre=[...registred,buildItem];// 2
// //                     // ===================== Envoi aux memoires bdd & Context & store =====================
// //                     setFocusedList([...list,buildItem]);
// //                     dispatch(storeFocusedListe([...list,buildItem]));

// //                         fetch(`${dbBaseRoot}poudre/analyses/add?startedAt=${aujourdhui}&endedAt=${demain}`,
// //                        {method: 'POST',headers: {'Content-Type': 'application/json'},
// //                         body:JSON.stringify(buildItem)
// //                     })
// //                     .then(response=>response.json())
// //                     .then(data=>{
// //                         // console.log(data)
// //                         const {code,message,analyse,analyses}=data;
// //                         if(code!=='red'){
// //                             const {lansas,formules}=analyses;
// //                             const ANALYSES=[...lansas,...formules];
// //                             // alert(JSON.stringify(ANALYSES));
// //                             setRegistred(ANALYSES);
// //                             dispatch(setPowderAnalysed(ANALYSES));
// //                             setPop({show:true,message:"Analyse ajoutée avec succes.",code:code});

// //                         // }
// //                         // const toPop=code==='green'?
// //                         //         {show:true,message:"Analyse enregistrée avec succes.",code:code}
// //                         //         :
// //                         //         {show:true,message:"L'analyse n'a pas pu etre enregistrée :"+ message,code:'#880000'}
// //                         // setPop(toPop);
// //                         }else{
// //                             throw new Error("L'analyse n'a pas pu etre ajoutée: "+message);
// //                         }
// //                         return analyse;
// //                     })
// //                     .then((analyse)=>{
// //                         const ID=analyse?.id;
// //                         socket.emit('analysePoudreAdded',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
// //                     })
// //                     .catch((error)=>{
// //                         setPop({show:true,message:error.message,code:'#880000'});
// //                     })
                    
// //                     // dispatch(storeFocusedListe([...list,buildItem]));
// //                     // setRegistred(enregistre);
// //                     // dispatch(setPowderAnalysed(enregistre));
                   
// //                 }else{
// //                     // alert(JSON.stringify(id))
// //                     // ====================== build des non requis ==================================
// //                     const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
// //                     notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];});
// //                     // ====================== build du item a enregistre ============================
// //                     // const registredWithoutTheFocused=registred.filter(tem=>Number(tem.nChar)!==Number(numChariot));
// //                     const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du nChar et de la date de creation pour eviter les problemes de chariots identiques
// //                     const {list}=ListOfFocusedAndLastNumber(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
// //                     const {densite,...rest}=saveObject;// pour retirer la densite
// //                     const builtItem={...rest,...itemToSave,observations:observations,categorie:"local",UtilisateurId:targetUser?.id};
// //                     const enregistre=[...registredWithoutTheFocused,builtItem];// 2
// //                     // ===================== Envoi aux memoires Context & store =====================
// //                     setFocusedList([...list,{...rest,...itemToSave,observations:observations,UtilisateurId:targetUser?.id}].sort((firstItem, secondItem) => Number(firstItem.nChar )- Number(secondItem.nChar)));
// //                     dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
// //                     // alert(JSON.stringify(builtItem))
// //                     fetch(dbBaseRoot+"poudre/analyses/update/"+itemToSave.id,
// //                        {method: 'PUT',headers: {'Content-Type': 'application/json'},
// //                         body:JSON.stringify(builtItem)
// //                     })
// //                     .then(response=>response.json())
// //                     .then(data=>{
// //                         const {code,message,analyses}=data;
// //                         if(code!=='red'){
// //                         const {lansas,formules}=analyses;
// //                         const ANALYSES=[...lansas,...formules];
// //                         setRegistred(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
// //                         dispatch(setPowderAnalysed(ANALYSES.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
// //                         setPop({show:true,message:"Analyse modifiée avec succes.",code:code});
// //                         // const toPop=code==='green'?
// //                         //         {show:true,message:"Analyse modifiée avec succes.",code:code}
// //                         //         :{show:true,message:"L'analyse n'a pas pu etre modifiée: "+message,code:'#880000'}
// //                         }else{
// //                             throw new Error("L'analyse n'a pas pu etre modifiée: "+message);
// //                         }
// //                     })
// //                     .then(()=>{
// //                         const ID=builtItem?.id;
// //                         socket.emit('analysePoudreUpdated',{startedAt:aujourdhui,endedAt:demain,code:'green',id:ID})
// //                     })
// //                     .catch((error)=>{
// //                         setPop({show:true,message:error.message,code:'#880000'});
// //                     })
// //                     // setRegistred(enregistre.sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar)));
// //                     // dispatch(setPowderAnalysed(enregistre.sort((firstItem, secondItem) => Number(firstItem.nChar)- Number(secondItem.nChar))));
// //                     // dispatch(storeFocusedListe([...list,builtItem].sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar))));
// //                     setAction("create");
// //                 }
// //             }
// //         }
// //     }
    
// //     return <View style={{minWidth:"75%",paddingVertical:40}}>
// //         {currentProductedLen!==0 && <View style={{width:"100%",height:"auto",/*minHeight:750,*/ borderRadius:10,backgroundColor:'rgba(255,255,255,0.4)',justifyContent:'flex-start',alignItems:'center',paddingHorizontal:30,paddingVertical:15,paddingBottom:40,gap:15}}>
// //             {taches!==undefined && <HeaderOfEdit name={nameToDisplay} couleur={couleur} taches={taches} />}
// //             <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
// //             {Object.entries({'nChar':{normes:{min:1,max:999}},...rest}).map(([key,value],i)=><EditRow 
// //                 inputRefs={inputRefs} 
// //                 index={i} key={i} 
// //                 obj={{key:key,value:value}}
// //             />)}
// //             {Object.keys(rest).length>0 && <TouchableOpacity 
// //             disabled={!enregistrerAllowed}
// //                             style={{
// //                                 minWidth:"100%",
// //                                 minHeight:40,
// //                                 marginTop:20,
// //                                 backgroundColor:couleurs[CLE][7],
// //                                 borderRadius:10,
// //                                 paddingHorizontal:40,
// //                                 paddingVertical:10,
// //                             }}
// //                 onPress={handleEnregistrerPress}
// //             >
// //                 <Text style={{color:"white",fontWeight:"bold",textAlign:"center",width:"center"}}>{"Enregistrer"+(!toCreate?" les modificstions":"")}</Text>
// //             </TouchableOpacity>}
// //         </View>}
// //         {/* <Pop/> */} 
// //         {/* // etit bien pour workSpace  */}
// //     </View>
// // }

// // const HeaderOfEdit=({inputRefs,name,couleur,taches})=>{
// // const {toCreate}=useCurrentProducted();
// // const tachesSplit=taches?.split("-")|| [];
// // return <View 
// //                         style={{
// //                         minWidth:"100%",
// //                         minHeight:40,
// //                         marginTop:0,
// //                         backgroundColor:"rgba(250,250,250,0.06)",
// //                         borderRadius:8,
// //                         paddingHorizontal:40,
// //                         paddingVertical:0,
// //                         flexDirection:"row",
// //                         justifyContent:"flex-start",
// //                         alignItems:"center",
// //                         gap:30
// //                         }}
// //                     >
// //         <Text style={{height:"100%",fontWeight:"bold",textAlign:"center"}}> 
// //             {!toCreate?"MAJ "+name?.toUpperCase():name?.toUpperCase()} 
// //         </Text>
// //         <View 
// //             style={{
// //                     borderWidth:1,
// //                     borderColor:"rgba(0,0,0,0.1)",
// //                     minWidth:"40%",
// //                     minHeight:"90%",
// //                     paddingHorizontal:40,
// //                     backgroundColor:couleur,
// //                     borderRadius:5,
// //                     flexDirection:"row",
// //                     justifyContent:"flex-start",
// //                     alignItems:"center",
// //                     gap:5
// //                 }}>
// //             <Text style={{minWidth:"55%",height:"100%",textAlign:"left",color:"grey"}}>{colors[couleur].nom}</Text>
// //             {tachesSplit.map((clr,i)=><Text key={i} style={{width:"auto",height:"100%",color:"grey",textAlign:"center",backgroundColor:colors[clr].color,paddingHorizontal:5}}>{colors[clr].nom}</Text>)}
// //         </View>
// // </View>}
// // // const ChariotRow=({inputRefs,obj})=>{
// // //     const {key,value}=obj;
// // //     const {focusedList}=useCurrentProducted();
// // //     const chariots=Chariots(focusedList);
// // //     const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
// // //     const {pickItemToSave}=useItemToSave();
// // //     const [input,setInput]=useState("");
// // //     function handleCheckValidity(val){
// // //         const valFormat=Number.isNaN(Number(val))?val:Number(val); 
// // //         const {icon,obs}=InputIsValid({input:valFormat,label:'nChar',normes:{min:1,max:999}});// utilise un formatage de val pour adapter les types
// // //         setInput(val);
// // //         setIconAndObs({icon,obs});
// // //         pickItemToSave({"key":key,"value":val,"message":obs});
// // //     }
// // //     return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
// // //         <Picker 
// // //                     selectedValue={input}
// // //                     mode="dropdown"
// // //                     // onKeyPress={(e)=>handleKeyPress(e,0)} 
// // //                     ref={(el) => (inputRefs.current[0] = el)}
// // //                     onValueChange={(itemValue) => handleCheckValidity(itemValue)} 
// // //                     style={style.input}
// // //                 >
// // //                     <Picker.Item key={0} label="Chariot" value={null} />
// // //                     {chariots.map((option, index) => {
// // //                     return <Picker.Item style={{textAlign:'center',}} key={index} label={option} value={option} />
// // //                     })}
// // //         </Picker>
// // //         {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
// // //     </View>
// // // }
// // const EditRow=({inputRefs,index,obj})=>{
// //     const {key,value}=obj;
// //     const lablJoined=key.split("_").join(" ").replace("max ","").replace("gg","Gros grains");
// //     const labelJoined=index===0?'N° chariot':lablJoined;
// //     const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
// //     const {pickItemToSave}=useItemToSave();
// //     const [input,setInput]=useState("");
// //     const uniquePropriete=["max_gg","max_humidite"];
// //     const min=uniquePropriete.includes(key)?0:(value.normes?.min || 0);
// //     const max=uniquePropriete.includes(key)?value.normes:(value.normes?.max || 1000);
// //     function handleCheckValidity(val){
// //         const valFormat=Number.isNaN(Number(val))?val:Number(val); 
// //         const {icon,obs}=InputIsValid({input:valFormat,label:labelJoined,normes:{min,max}});// utilise un formatage de val pour adapter les types
// //         setIconAndObs({icon,obs});
// //         pickItemToSave({"key":key,"value":val,"message":obs});
// //     }
// //     return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
// //         {index===0?<UniversalCombobox 
// //             inputRefs={inputRefs} 
// //             index={index} 
// //             labelJoined='N° Chariot'
// //             value={input}
// //             icon={iconAndObs.icon}
// //             renderValidity={()=>handleCheckValidity(input)}
// //             renderVal={(val)=>setInput(val)}
// //              />
// //             :
// //             <LansaValue 
// //             inputRefs={inputRefs} 
// //             index={index} 
// //             value={input} 
// //             labelJoined={labelJoined} 
// //             icon={iconAndObs.icon}

// //             renderValidity={()=>handleCheckValidity(input)}
// //             renderVal={(val)=>setInput(val)}
// //         />}
// //         {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
// //     </View>
// // }

// // export const LansaValue=({inputRefs,index,labelJoined,icon,value,renderValidity,renderVal})=>{
// //     const {currentProductedLen,focusedPro,toCreate}=useCurrentProducted();
// //     const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
// //     const [textValue,setTextValue]=useState("");
// //     const IamFocused=index===INDEX;
// //     // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
// //     // const currentProductedLen=currentProducted.length;
// //     const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
// //     useEffect(()=>{
// //         if(!toCreate || toCreate.toString().includes('falsy')){
// //             const valeur=itemToSave?.name && itemToSave[label.replace("Gros grains","gg").replace("Matiere active","matiere_active").toLowerCase()];
// //             setTextValue(valeur); 
// //             // alert(JSON.stringify(itemToSave))
// //         }else{
// //             setTextValue("");
// //             setItemToSave({});
// //         }
// //     },[toCreate])

// //     function handleLenOverFive(val){if (val.length === 5) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
// //     const handleNext = () => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
// //     const handleKeyPress = (e) => {const { key } = e.nativeEvent;
// //         if (key === 'ArrowDown') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
// //         if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
// //     };

    
// //     return <TextInput
// //         disabled={currentProductedLen===0}
// //         returnKeyType="next"
// //         onKeyPress={handleKeyPress} 
// //         onSubmitEditing={handleNext}
// //         onFocus={()=>setIndex(index)}
// //         blurOnSubmit={false}
// //         selectTextOnFocus="true"
// //         maxLength={5}
// //         label={label}
// //         value={textValue} 
// //         style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
// //         ref={(el) => (inputRefs.current[index] = el)}
// //         onBlur={()=>renderValidity()}
// //         onChangeText={(val)=>{setTextValue(val);renderVal(val);handleLenOverFive(val)}}
// //         right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
// //     />
// // }

// // export const LansaObservations=({obs})=>(obs!=="" && <Text style={style.lansaObservations}>{obs}</Text>);

// // export function InputIsValid({input,label,normes}){
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
// // function UniversalCombobox({inputRefs,labelJoined,icon,value,renderValidity,renderVal,index,obj}) {
// //     const {currentProductedLen,focusedList,focusedPro,setAction,toCreate}=useCurrentProducted();
// //     const {itemToSave,setItemToSave,setIndex,INDEX}=useItemToSave();
// //     // const [textValue,setTextValue]=useState("");
// //     const IamFocused=index===INDEX;
// //     // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
// //     // const currentProductedLen=currentProducted.length;
// //     const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
// //     // const {focusedList}=useCurrentProducted();
// //     const chariots=Chariots(focusedList);
// //     const [inputValue, setInputValue] = useState('');
// //     const [options, setOptions] = useState(chariots.slice(-35));
// //     const [showDropdown, setShowDropdown] = useState(false);

// //     useEffect(()=>{
// //         if(!toCreate || toCreate.toString().includes('falsy')){
// //             const valeur=itemToSave?.name && itemToSave?.nChar;
// //             setInputValue(valeur);
// //         }else{
// //             setInputValue("");
// //             setItemToSave({});
// //         }
// //     },[toCreate])

// //     function isManual(val){
// //         const isNumAndAlreadyIn=!Number.isNaN(Number(val)) && chariots.includes(Number(val));
// //         return isNumAndAlreadyIn;
// //     }
// //     function handleLenOverFive(val){if (val.length === 5) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
// //     const handleNext = () => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
// //     const handleKeyPress = (e) => {const { key } = e.nativeEvent;
// //         if (key === 'ArrowDown') {const nextInput = inputRefs.current[index + 1];if (nextInput) nextInput.focus();}
// //         if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
// //     };

// //   const filteredOptions = options.filter(item =>
// //    item.toString().toLowerCase().includes((inputValue || "").toString().toLowerCase())
// //   );

// //   const isNewOption =inputValue!==undefined && inputValue.toString().trim()!== '' && !options.some(opt => opt.toString().toLowerCase() === inputValue.toString().toLowerCase());

// //   const handleSelect = (value) => {
// //     setInputValue(value);
// //     setAction(itemToSave?.id);
// //     setShowDropdown(false);
// //   };

// //   const handleAddNew = () => {
// //     const newValue = inputValue.toString()/*.trim()*/;
// //     setOptions([...options, newValue].slice(-35));
// //     setShowDropdown(false);
// //   };

// //   const rendValidity=(cb)=>{
// //     return new Promise((resolve,reject)=>{
// //         try{
// //             cb()
// //             setTimeout(()=>resolve(true),500)
// //         }catch(error){
// //             reject(false)
// //         }
// //         })
// //     }
// // const handleBlur=()=>{
// //     rendValidity(renderValidity)
// //     .then(bool=>bool && setShowDropdown(false));
// // }

// //   return (
// //     // 1. LE CONTENEUR PRINCIPAL DOIT ÊTRE EN EN RELATIF
// //     <View style={style.lansaValue}>
      
// //       <TextInput
// //         style={[style.lansaValue,{borderWidth:IamFocused && 2,borderColor:IamFocused && primaryColor}]}
// //         placeholder="Chariot..."
// //         value={inputValue}
// //         onFocus={() => {setIndex(index);setShowDropdown(true)}}
// //         onChangeText={(val)=>{setInputValue(val);setShowDropdown(true);renderVal(val);handleLenOverFive(val);isManual(val) && setAction('create')}}
// //         disabled={currentProductedLen===0}
// //         returnKeyType="next"
// //         onKeyPress={handleKeyPress} 
// //         onSubmitEditing={handleNext}
// //         blurOnSubmit={false}
// //         selectTextOnFocus="true"
// //         maxLength={5} 
// //         label={label}
// //         ref={(el) => (inputRefs.current[index] = el)}
// //         onBlur={handleBlur}
// //         right={<TextInput.Icon icon={value!==""?icon:"minus"} size={value===""?1:15} color={value===""?"grey":(icon==="check"?"green":"red")}/>}
    
// //       />

// //       {/* 2. LE MENU DÉROULANT EST EN ABSOLUTE */}
// //       {showDropdown && (
// //         <View style={style.dropdown}>
// //           <FlatList
// //             data={filteredOptions}
// //             keyExtractor={(item) => item}
// //             style={{ maxHeight: 100 }}
// //             keyboardShouldPersistTaps="handled"
// //             renderItem={({ item }) => (
// //               <TouchableOpacity style={style.item} onPress={() => handleSelect(item)}>
// //                 <Text style={style.itemText}>{item}</Text>
// //               </TouchableOpacity>
// //             )}
// //           />

// //           {isNewOption && (
// //             <TouchableOpacity style={style.addItem} onPress={handleAddNew}>
// //               <Text style={style.addItemText}>➕ Ajouter "{inputValue}"</Text>
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       )}
// //     </View>
    
// //   );
// // }

// // const style=StyleSheet.create({
// //     lansaValue:{
// //         minWidth:"90%",
// //         borderWidth:1,
// //         borderRadius:5,
// //         textAlign:"center",
// //         fontSize:15,
// //     },
// //     lansaObservations:{
// //         maxWidth:65,
// //         width:"auto",
// //         backgroundColor:"rgba(0,0,0,0.15)",
// //         borderWidth:1,
// //         borderColor:"red",
// //         borderRadius:8,
// //         borderBottomLeftRadius:1,
// //         fontSize:9,
// //         fontWeight:"bold",
// //         padding:10,
// //         paddingVertical:5,
// //         marginTop:-10
// //     },
// //     actions:{
// //         position:'absolute',
// //         zIndex:1000,
// //         height:'80%',
// //         width:35,
// //         flexDirection:'row',
// //         alignItems:'center',
// //         justifyContent:'center',
// //     },
// //     input:{
// //         backgroundColor:'rgb(80,80,80)',
// //         width:'90%',
// //         // maxHeight:'5rem',
// //         height:50,
// //         // padding:'1.5rem',
// //         fontWeight:'bold',
// //         textAlign:'center',
// //         letterSpacing:4,
// //         borderRadius:8,
// //         color:'white',
// //     },
// //       container: {
// //     width: '100%',
// //     // maxWidth: 400,
// //     alignSelf: 'center',
// //     // position: 'relative', // 👈 Indispensable pour servir de repère au menu absolute
// //     // zIndex: 1000,         // 👈 Force le menu à passer devant tout le reste sur Web/iOS
// //   },
// //   dropdown: {
// //     // position: 'absolute', // 👈 Sort le menu du flux de mise en page (ne pousse plus rien)
// //     // top: '100%',          // 👈 Se place pile au pixel près sous le TextInput
// //     // marginTop: 5,         // 👈 Crée le petit espace de décalage propre (équivalent à votre -10)
// //     // left: 0,
// //     // right: 0,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 8,
// //     backgroundColor: '#fff',
// //     // zIndex: 2000,         // 👈 Sécurité additionnelle pour le rendu
    
// //     // Ombres multiplateformes pour détacher le menu du fond
// //     ...Platform.select({
// //       ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
// //       android: { elevation: 5 },
// //       web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.15)' }
// //     }),
// //   },
// //   item: {
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   itemText: {
// //     fontSize: 16,
// //   },
// //   addItem: {
// //     padding: 15,
// //     backgroundColor: '#f0f9ff',
// //     borderTopWidth: 1,
// //     borderTopColor: '#bae6fd',
// //     borderBottomLeftRadius: 8,
// //     borderBottomRightRadius: 8,
// //   },
// //   addItemText: {
// //     color: '#0284c7',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },

// // })


