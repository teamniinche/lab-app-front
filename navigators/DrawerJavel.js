// packages
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useMemo,useEffect,useLayoutEffect,useState,useRef } from 'react';
import { View, Text, StyleSheet,TouchableWithoutFeedback,Pressable,ActivityIndicator,FlatList, TouchableOpacity } from 'react-native';
import { Searchbar,TextInput,Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch,useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
// components
import { HeaderRight } from './DrawerNavigator'; // component 1 ✔️✔️
// import { PowderHeaders } from '../components/tables/componentTable'; // component 2//✔️✔️
import CustomJavelDrawerContent from '../components/customJavelDrawerContent'; // component 3//✔️✔️
import {JavelAnalysedTab} from './poudreTabNavigator'; // component 4
import { ViewOrImgBgPowderWrapper } from '../components/wrappers/viewOrImgWrapper'; // component 5 //✔️✔️
// contexts & functions
import {
    JavelFormulesProvider,
    CurrentJavelProductedProvider,
    useCurrentJavelProducted,
    useJavelFormules,
    ItemJavelToSaveProvider,
    useItemJavelToSave 
} from '../components/wrappers/contexts';
import { setJavelFocusedProduct } from '../components/store/reducers/javelFocusedProduct';
import { storeFocusedListe } from '../components/store/reducers/currentJavelProducted';
import { setJavelAnalysed } from '../components/store/reducers/javelAnalysesReducer';
import WinDim from '../assets/operatingData';
import { Lansas,typesJavel,routesAndHeadersPowder } from '../iterables';
import { primaryColor } from '../assets/constantes';
import { styles } from '../components/tables/componentTable';
import { Comment } from '../components/tables/chat-for-table';
import { AdjentDayInMs} from '../components/periode';
import Colors from '../assets/colors';

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
const colors={
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

const Errors = ({visible,render,isMissing,missing}) => {
    const {errors,noErrors}=useItemJavelToSave();
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

const UpdateLansa = ({visible,item}) => {
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
const JavelHeaders=()=>{
    const headers=["N°Mel.","Type","Quantite","Volume thio","°Chl","C. Libre","ph"];
    const firstHeadStyle={borderTopWidth:2,borderLeftWidth:2,borderColor:"green",borderTopLeftRadius:5};
    const lastHeadStyle={borderTopWidth:2,borderRightWidth:2,borderColor:"green",borderTopRightRadius:5};
    const headersLen=headers.length;
  return <View style={[styles.row,{width:"100%"}]}>
        {headers.map((header, index) => (
              <Text  key={index} style={[styles.cell,{fontWeight: "bold",minWidth:index===1 && 100,fontSize:8,backgroundColor:'none',color:'rgba(0,0,0,0.4)',maxWidth:index===0 && 30,width:index===0 && 20},index===0 && firstHeadStyle,index===headersLen-1 && lastHeadStyle]}>
                {header.toUpperCase()}
              </Text>
            ))
        }
      </View>
}
export default function DrawerPoudre(){
  return (<CurrentJavelProductedProvider>
        <ItemJavelToSaveProvider>
            <Drawer.Navigator initialRouteName="Formules"
            screenOptions={{
                    headerShown:false,
                    drawerType:isLarge?'permanent':'slide',
                    drawerStyle:isLarge?{width:'21%'/*'23%'*/,backgroundColor: Colors.Javel}:{backgroundColor: Colors.Javel},
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
                drawerContent={()=> <JavelFormulesProvider><CustomJavelDrawerContent/> </JavelFormulesProvider>}
                >
                <Drawer.Screen name="Basics" children={({navigation,route}) =>  <></>}/>
                <Drawer.Screen name="Lansas" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
                <Drawer.Screen name="Formules" children={({navigation,route}) => <Tabs navigation={navigation} route={route}/>} />
                
            </Drawer.Navigator>
        </ItemJavelToSaveProvider>
    </CurrentJavelProductedProvider>
    
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
            <JavelFormulesProvider>
                <ViewOrImgBgPowderWrapper uri="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3M3VhcDZhNGwzaWVkbzlvOXRpdmQ0YzlwMTBjemNpMW1ldnd0eWNkZSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/ubIJmD8SfSE35HuOjj/giphy.gif">
                    <AnalysedTab/>
                </ViewOrImgBgPowderWrapper>
                <AnalysedList/>
            </JavelFormulesProvider>
        </View>
}

const AnalysedTab=() => {
    return  <View style={{width:"100%",backgroundColor:'rgba(250,250,250,0.1)',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginRight:2}}>
        <JavelAnalysedTab/>
        <PaperProvider><WorkSpace mission="create"/></PaperProvider>
    </View>
}

const AnalysedList=() => {
        const [K,setK]=useState(null);
        const {javelAnalysed,javelFocusedListe}=useSelector(state=>{
            const javelAnalysed=state.javelAnalysed.javelAnalysed;
            const javelFocusedListe=state.currentJavelProducted.javelFocusedListe;
            return {javelAnalysed,javelFocusedListe};
        })
        const [analysed,setAnalysed]=useState([]);
        const {registred,Everages}=useCurrentJavelProducted();
        function handleResearchChange(txt){
            const matchedAnalysed=registred.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.chariot.toString().includes(txt)));// registred a la place powderAnalysed
            setAnalysed(matchedAnalysed);
        }
        useMemo(()=>{setAnalysed(javelFocusedListe)},[javelFocusedListe]);// javelFocusedListe du store etait import pour cette partie
        const {name,nom}=javelFocusedListe[0]||{};
        const AnalysedLen=analysed.length;
        const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
    return <View style={{flex:1,width:"55%",minHeight:700,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
            <View style={{width:"100%",height:75,backgroundColor:Colors.Javel,flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderBottomWidth:2,borderColor:"black",paddingHorizontal:20,paddingRight:10,marginBottom:10}}>
                <View style={{width:"65%",flexDirection:"row-reverse",justifyContent:"flex-start",alignItems:"center",gap:0}}>
                <HeaderRight isLarge={isLarge} liq={false}/>
                <Searchbar
                    placeholder="Numero chariot..."
                    onChangeText={(txt)=>handleResearchChange(txt)}
                    value={null}
                    style={{margin:0,backgroundColor:'rgba(255,255,255,0.9)',width:"70%",height:"auto"}}
                />
                </View>
                <Text style={{fontSize:12,textAlign:"center",fontWeight:'bold',width:"35%"}}>{nom ||name}</Text>
            </View>
            <View style={{width:"100%",height:"auto",minHeight:740,maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
                <JavelHeaders/>
                {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
                        ) : ( */}
                    <View style={{width:"100%",minHeight:740,maxHeight:740,overflowY:"scroll",}}>
                          <FlatList
                                        data={analysed}
                                        keyExtractor={(item,i) =>(item.chariot?.toString()+i.toString())}
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
                <View 
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
                </View>
            </View>
                        {/* )
                  } */}
        </View>
}

export const AnalysedListe=({product,rend}) => {
        // const [loading,setLoading]=useState(false);
        const [K,setK]=useState(null);
        const {powderFiltred,powderAnalysed,powderType,focusedListe}=useSelector(state=>{
            const powderFiltred=state.powderAnalysed.powderFiltred;
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            const powderType=state.powderAnalysed.powderType;
            const focusedListe=state.currentProducted.focusedListe;
            return {powderFiltred,powderAnalysed,powderType,focusedListe};
        })
        const [analysed,setAnalysed]=useState([]);
        const {Everages}=useCurrentProducted();
        // function handleResearchChange(txt){
        //     const matchedAnalysed=registred.filter(it=>(it.name.toLowerCase().includes(txt.toLowerCase()) || it.chariot.toString().includes(txt)));// registred a la place powderAnalysed
        //     setAnalysed(matchedAnalysed);
        //     // .sort((firstItem, secondItem) => firstItem.chariot - secondItem.chariot)
        // }
        useEffect(()=>{setAnalysed(powderFiltred)},[product]);
        useMemo(()=>{setAnalysed(powderType),rend(powderType)},[powderType]);// focusedListe du store etait import pour cette partie
        const AnalysedLen=analysed.length;
        const {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE}=Everages(analysed);
    return <View style={{flex:1,width:"100%",height:"auto",padding:50,paddingTop:20,backgroundColor:'white',flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:2}}>
            <View style={{width:"100%",height:"auto",height:"auto",maxHeight:740,paddingHorizontal:10,paddingVertical:0}}>
                <JavelHeaders/>
                {/* {loading ? (<ActivityIndicator size="large" color="#0000ff" />
                        ) : ( */}
                    <View style={{width:"100%",height:"auto",maxHeight:740,marginBottom:70,overflowY:"scroll",}}>
                          <FlatList
                                        data={analysed}
                                        keyExtractor={(item,i) =>(item.chariot?.toString()+i.toString())}
                                        renderItem={({ item },index) =>{
                                        return <PowderRow
                                                    key={index}
                                                    K={K}
                                                    setK={setK}
                                                    item={item}
                                                    items={analysed}
                                                    ac={true}
                                                />
                                            }
                                        }
                          />
                    </View>
                {product!==null && <View 
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
                </View>}
            </View>
                        {/* )
                  } */}
        </View>
}


const PowderRow=({K,ac,setK,item})=>{
    const headersKeys=["name","gg","humidite","matiere_active","alcanite","silicate","sel"];
    const clooned= useSelector(state => state.actived.clooned);
    const [focusedIndex,setFocusedIndex]=useState(null);
    const [isCollapsed,setIsCollapsed]=useState(false);
    const [comment,setComment]=useState("");
    const [toggle,setToggle]=useState(false);
    const [comments,setComments]=useState([]);
    const {chariot,identifier,couleur,taches,...rest}=item;
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
    }7
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

                onPress={() => {setFocusedIndex(chariot);setIsCollapsed(!isCollapsed)}}
                onPressIn={()=>setFocusedIndex(chariot)}
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
                    <Chariot oldCh={Number(chariot)}/>
                    {
                        headersKeys.map((ky,i)=>{
                                const isInHeadersKeys=rest[ky]!==undefined;
                                return <Text key={i} style={{ flex:1,color: isHovered && primaryColor,borderBottomWidth:1,borderColor:"rgba(0,0,0,0.095)",height:"100%",textAlign:"center",minWidth:i===0 && 100,fontSize:isHovered?16:11,fontWeight:"bold",paddingVertical:2,paddingBottom:10}}>{isInHeadersKeys?rest[ky]:"..."}</Text>//isInHeadersKeys?vl[cle]:"..."
                            })
                    }
                    <View style={{...styles.row,marginBottom:2,marginRight:4,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 38,}}>
                        {isHovered && <Actions item={item} />}
                    </View>
                </View>
                {
                    focusedIndex===chariot && <Collapsible collapsed={isCollapsed}>
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

const Chariot=({oldCh})=>{
    const [ch,setCh]=useState(oldCh);
    const dispatch=useDispatch();
    const {ListOfFocusedAndLastNumber}=useCurrentProducted();
    const powderAnalysed=useSelector(state=>state.powderAnalysed.powderAnalysed)
    function handleBlur(newCh){
        const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.chariot)!==Number(oldCh));
        const item=powderAnalysed.filter(it=>Number(it.chariot)===Number(oldCh))[0];
        const {chariot,...rest}=item;const newItem={...rest,chariot:Number(newCh)};
        const updteOwderAnalysed=[...updatedPowderAnalysed,newItem].sort((firstItem, secondItem) => firstItem.chariot - secondItem.chariot);
        const {list}=ListOfFocusedAndLastNumber(item,updteOwderAnalysed);
        dispatch(setPowderAnalysed(updteOwderAnalysed));
        dispatch(storeFocusedListe(list));
        // setCh(newCh);
    }
    return <TextInput
        value={ch}
        onBlur={()=>handleBlur(Number(ch))}
        onChangeText={(CH)=>setCh(CH)}
        style={{flex: 1,textAlign: "left",maxWidth:30,width:20,borderWidth:0,backgroundColor:"none",color:'rgba(0,0,0,0.4)',maxHeight:20,height:20,cursor:"pointer",fontWeight:"bold",paddingHorizontal:0,paddingLeft:8,paddingVertical:2,fontSize:12,letterSpacing:2}}
    />
}

const Actions=({item})=>{
    const dispatch=useDispatch();
    const {setFocusedPro,UpdateFocusedProdByName,setRegistred,setFocusedList,ListOfFocusedAndLastNumber,setAction,focusedPro}=useCurrentProducted();
    const {powderNormes,powderAnalysed,focusedListe,token}=useSelector(state=>{
        const powderNormes=state.powderNormes.powderNormes;
        const {powderAnalysed,focusedListe}=state.powderAnalysed;
        const token =state.user.targetUser.token;
        return {powderNormes,powderAnalysed,focusedListe,token};
    });
    const {setItemToSave}=useItemJavelToSave();
    const {name,id}=item;
    const handleDelete=async ()=>{
        try{
            const updatedPowderAnalysed=powderAnalysed.filter(it=>Number(it.chariot)!==Number(item.chariot));
            const {list}=ListOfFocusedAndLastNumber(item,updatedPowderAnalysed);
            // mise a jour des data statement ==========================
                // Provider
            setFocusedList(list);
            setRegistred(updatedPowderAnalysed);
                // store de redux
            dispatch(setPowderAnalysed(updatedPowderAnalysed));
            dispatch(storeFocusedListe(list));
            // ==========================================================
            
            // render(updatedPowderAnalysed);
          // Mise a jour coté bdd
        // /*const response=*/ await fetch(`${dbBaseRoot}analyses/delete/${id}`,{
        //   method:'DELETE',
        //   headers: {
        //       'Content-Type':'application/json',
        //       'Authorization': `Bearer ${targetUser.token}`
        //   },});
          // Mise à jour coté UI
            // const itms=items.filter(item=>item.id!==id);
            // dispatch(postAnalyses(null));
            // render(itms);
        }catch(error){
            alert("Analyse "+item.id+" n a pu etre supprimee !"+error);
        }
    }
    const confirmDelete=()=>{isWeb?
        (confirm("Etes-vous sur de  vouloir supprimer cet enregistrement ?")?handleDelete():null)
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
    //   const itemKey=name.split(" ").join("_").toLowerCase();
    //   const itemNormes=powderNormes[itemKey];
    //   setFocusedPro(itemNormes);
    UpdateFocusedProdByName(name);
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
        <Pressable style={{...style.actions,marginRight:45,}} onPress={confirmDelete}>
            <Icon size={14} name="trash" color="red"/>
        </Pressable>
        <Pressable style={{...style.actions,marginLeft:50,}} onPress={handleUpdate}>
            <Icon size={14} name="pencil" color="blue"/>
        </Pressable>
      </>
      {/* :<Text>...</Text>
    } */}
    </View>
  </TouchableWithoutFeedback>
}

const WorkSpace=() => {
    const dispatch=useDispatch();
    const inputRefs = useRef([]);
    const {
            toCreate,
            setAction,
            ListOfFocusedAndLastNumber,
            currentProductedPro,
            currentProductedLen,
            setFocusedList,
            setFocusedPro,
            focusedPro,
            keysAndRequirements,
            registred,
            setRegistred
        }=useCurrentJavelProducted();
    const {noErrors,itemToSave}=useItemJavelToSave();
    const numIdentifier=itemToSave?.identifier;
    const {nom,name,couleur,taches,format,parfum,percarbonate,mousses,densite,compression,...Rest}=focusedPro;
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

    const handleEnregistrerPress=()=>{
        if(!noErrors){
            setVisible(true);
        }else{
            const missings=missingRequiredKeys();
            if(missings.length!==0){
                setMissing(missings);
                setIsMissing(true);
                setVisible(true);
            }else{
                var saveObject={};
                if(toCreate){
                    const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
                    notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];})
                    // const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedProduct,powderAnalysed);
                    const {list,freeChariot}=ListOfFocusedAndLastNumber(focusedPro,registred); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const identifier=freeChariot.toString()+"_"+AdjentDayInMs(new Date(),0).toString();
                    const {densite,silicate,sel,...rest}=saveObject;// pour retirer la densite ,le silicate et le sel
                    const enregistre=[...registred,{...rest,...itemToSave,identifier:identifier,chariot:freeChariot}];// 2
                    setFocusedList([...list,{...rest,...itemToSave,identifier:identifier,chariot:freeChariot}]);
                    setRegistred(enregistre);
                    dispatch(setPowderAnalysed(enregistre));
                    dispatch(storeFocusedListe([...list,{...rest,...itemToSave,identifier:identifier,chariot:freeChariot}]));
                }else{
                    const notRequired=Object.entries(focusedPro).filter(([ky,vl])=>!Object.keys(itemToSave).includes(ky.replace("max_","")));
                    notRequired.forEach((nr,index)=>{saveObject[nr[0]]=typeof(nr[1])==="object"?null:nr[1];});
                    // const registredWithoutTheFocused=registred.filter(tem=>Number(tem.chariot)!==Number(numChariot));
                    const registredWithoutTheFocused=registred.filter(tem=>tem.identifier!==numIdentifier);// pour identifier on utilise l'identifiant unique qui est une combinaison du chariot et de la date de creation pour eviter les problemes de chariots identiques
                    const {list}=ListOfFocusedAndLastNumber(focusedPro,registredWithoutTheFocused); // registred  et focusedPro a la place de focusedProduct a la place powderAnalysed 1
                    const {densite,...rest}=saveObject;// pour retirer la densite
                    const enregistre=[...registredWithoutTheFocused,{...rest,...itemToSave}];// 2
                    setFocusedList([...list,{...rest,...itemToSave}].sort((firstItem, secondItem) => Number(firstItem.chariot )- Number(secondItem.chariot)));
                    setRegistred(enregistre.sort((firstItem, secondItem) => Number(firstItem.chariot) - Number(secondItem.chariot)));
                    dispatch(setPowderAnalysed(enregistre.sort((firstItem, secondItem) => Number(firstItem.chariot)- Number(secondItem.chariot))));
                    dispatch(storeFocusedListe([...list,{...rest,...itemToSave}].sort((firstItem, secondItem) => Number(firstItem.chariot) - Number(secondItem.chariot))));
                    setAction("create");
                    
                }
            }
        }
    }

    return <View style={{minWidth:"75%",paddingVertical:40}}>
        {currentProductedLen!==0 && <View style={{width:"100%",height:"auto",/*minHeight:750,*/ borderRadius:10,backgroundColor:'rgba(255,255,255,0.4)',justifyContent:'flex-start',alignItems:'center',paddingHorizontal:30,paddingVertical:15,paddingBottom:40,gap:15}}>
            <HeaderOfEdit name={name} couleur={couleur} taches={taches} />
            <Errors visible={visible} isMissing={isMissing} missing={missing} render={()=>setVisible(false)}/>
            {Object.entries(rest).map(([key,value],i)=><EditRow inputRefs={inputRefs} index={i} key={i} obj={{key:key,value:value}}/>)}
            {Object.keys(rest).length>0 && <TouchableOpacity 
                            style={{
                                minWidth:"100%",
                                minHeight:40,
                                marginTop:20,
                                backgroundColor:primaryColor,
                                borderRadius:10,
                                paddingHorizontal:40,
                                paddingVertical:10,
                            }}
                onPress={handleEnregistrerPress}
            >
                <Text style={{color:"white",fontWeight:"bold",textAlign:"center",width:"center"}}>{"Enregistrer"+(!toCreate?" les modificstions":"")}</Text>
            </TouchableOpacity>}
        </View>}
    </View>
}

const HeaderOfEdit=({inputRefs,name,couleur,taches})=>{
const {toCreate}=useCurrentJavelProducted();
// const tachesSplit=taches?.split("-")|| [];
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
            <Text style={{minWidth:"55%",height:"100%",textAlign:"left",color:"grey"}}>{name /*colors[couleur].nom*/}</Text>
            {/* {tachesSplit.map((clr,i)=><Text key={i} style={{width:"auto",height:"100%",color:"grey",textAlign:"center",backgroundColor:colors[clr].color,paddingHorizontal:5}}>{colors[clr].nom}</Text>)} */}
        </View>
</View>}

const EditRow=({inputRefs,index,obj})=>{
    const {key,value}=obj;
    const labelJoined=key.split("_").join(" ").replace("max ","").replace("gg","Gros grains");
    const [iconAndObs,setIconAndObs]=useState({icon:"",obs:""});
    const {pickItemToSave}=useItemJavelToSave();
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
    return <View style={{width:"100%",flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginHorizontal:"auto",gap:10}}>
        <LansaValue inputRefs={inputRefs} index={index} value={input} labelJoined={labelJoined} icon={iconAndObs.icon} renderValidity={()=>handleCheckValidity(input)} renderVal={(val)=>setInput(val)}/>
        {input!=="" && <LansaObservations obs={iconAndObs.obs}/>}
    </View>
}

const LansaValue=({inputRefs,index,labelJoined,icon,value,renderValidity,renderVal})=>{
    const {currentProductedLen,focusedPro,toCreate}=useCurrentJavelProducted();
    const {itemToSave,setItemToSave,setIndex,INDEX}=useItemJavelToSave();
    const [textValue,setTextValue]=useState("");
    const IamFocused=index===INDEX;
    // const currentProducted=useSelector(state=>state.currentProducted.currentProducted);
    // const currentProductedLen=currentProducted.length;
    const label=labelJoined.charAt(0).toUpperCase()+labelJoined.slice(1);
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

const LansaObservations=({obs})=>(obs!=="" && <Text style={style.lansaObservations}>{obs}</Text>);

function InputIsValid({input,label,normes}){
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

const style=StyleSheet.create({
    lansaValue:{
        minWidth:"90%",
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
    }

})




