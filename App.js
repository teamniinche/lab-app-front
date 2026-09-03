// CALLED PACKAGES
// element.style {
//     background-color: rgb(242, 242, 242);
//     display: flex;
// }
import {View,Text,Easing,StyleSheet,TextInput,ActivityIndicator,
  TouchableOpacity,Platform,ImageBackground} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {useState,useMemo,useEffect,useRef,useLayoutEffect} from "react";
import { NavigationContainer,getPathFromState} from "@react-navigation/native";
import { Provider as PaperProvider,Portal} from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import socket from './assets/socketService.js';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorBoundary } from 'react-error-boundary';
import Slider from "@react-native-community/slider";
import { useSelector,useDispatch,Provider } from 'react-redux';
import { Ionicons,FontAwesome} from '@expo/vector-icons';
import { Image } from 'expo-image';
// DATA STATEMENTS
import { EveragesProvider,PopupProvider,EveragesPowderProvider,
  ReservoirsProvider, MonoProductsProvider,JavelFormulesProvider,
  CurrentJavelProductedProvider,usePopup,useCurrentProducted,CurrentProductedProvider} from './components/wrappers/contexts.js';
import { store, persistor } from './components/store/store.js';
import {themes} from './assets/colors.js';
// NAVIGATORS & COMPONENTS
import LiquidesNavigator from "./navigators/liquidesNavigator.js";
// import PoudreNavigator from "./navigators/poudreNavigator.js";
import DrawerNavigator from "./navigators/DrawerNavigator.js";
import DrawerPoudre from "./navigators/DrawerPoudre.js";
import DrawerJavel from "./navigators/DrawerJavel.js";
import DrawerTour from "./navigators/DrawerTour.js";
import Pop, { NewAnalysed }  from "./components/popup.js";
// UTILS
import { isAcceptable,allowTo } from "./assets/functions.js";
import { primaryColor,possibleRooms } from "./assets/constantes.js";
import WinDim from './assets/operatingData'
import { Lansas } from "./iterables.js";
import { LinearGradient } from 'expo-linear-gradient';

// Force Gifted Charts à trouver le package sur la plateforme Web
if (!global.LinearGradient) {
  global.LinearGradient = LinearGradient;
}


const {isLarge,isWeb,isMobile,screenHeight}=WinDim;
const Tab = createBottomTabNavigator();

function Fallback({ error, resetErrorBoundary }) {
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:'#00000080'}}>
      <View style={{backgroundColor:'white',borderRadius:15,flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,paddingTop:0,margin:'auto'}}>
        <Text style={{fontSize:18,fontWeight:'bold',height:60,paddingVertical:20,maxWidth:300,width:'100%',borderBottomWidth:1,borderColor:'#00000025',textAlign:'center'}}
        >MSN.Chasseur d'erreurs</Text>
        <View style={{width:200,height:200}}>
          <ImageBackground 
            source={{uri:'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanhrOTU4OWJyanFzZWlxYXpmM3c4cjFwdGgwdWU2dnluaHNod2cyNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RM0FFEcOLBzEjtrbCK/giphy.gif'}}
            resizeMode="cover"
            style={{minHeight:'100%',}}
          />
        </View>
        <Text style={{fontSize:16,color:'red'}}>{error.message}</Text>
        <TouchableOpacity style={{flexDirection:'column',justifyContent:'center',borderRadius:10,backgroundColor:primaryColor,paddingHorizontal:20,height:40,minWidth:'100%',marginTop:50}} onPress={resetErrorBoundary}>
          <Text style={{width:'100%',textAlign:'center',fontWeight:'bold',letterSpacing:2,color:'white'}}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

}

export default function App() {

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={() => isWeb?window.location.reload():null}
    > 
    <AppRoot/>

    </ErrorBoundary>
  );
}

function AppRoot() {

  return ( <Provider store={store}>
    <PaperProvider><CurrentProductedProvider>
      <PopupProvider><MonoProductsProvider><EveragesPowderProvider><EveragesProvider><ReservoirsProvider><CurrentJavelProductedProvider><JavelFormulesProvider>
      <PersistGate loading={null} persistor={persistor}>
        <MainNavigator />
      </PersistGate>
      </JavelFormulesProvider></CurrentJavelProductedProvider></ReservoirsProvider></EveragesProvider></EveragesPowderProvider></MonoProductsProvider></PopupProvider>
    </CurrentProductedProvider></PaperProvider>
    </Provider>
  )
}

const MainNavigator=()=>{// Pour rester dans le context du store
  const dispatch=useDispatch();
  const {setPop,setNewAna}=usePopup();
  const {ListOfFocusedAndLastNumber}=useCurrentProducted();
  const navigationRef=useRef();
  const {targetUser}=useSelector(state=>state.user);
  const department=targetUser?.depart_affecte;
  const {poudreAllowed,tourAllowed,liquidesAllowed,javelAllowed}=useMemo(()=>{
    const poudreAllowed=allowTo("POUDRE",targetUser?.privileges) && department==='Laboratoire central';
    const tourAllowed=allowTo("TOUR",targetUser?.privileges) || department==='Tour';
    // const respoAllowed=allowTo("RESPO",targetUser?.privileges) || department==='Responsable';
    const liquidesAllowed=allowTo("LIQUIDES",targetUser?.privileges) && department==='Laboratoire central';
    const javelAllowed=allowTo("JAVEL",targetUser?.privileges) || department==='Javel bouteilles';
    return {poudreAllowed,tourAllowed,liquidesAllowed,javelAllowed};
  }, [targetUser]);
  const [routeName,setRouteName]=useState('comptabilite');
    var name='';
    const styleInline=isLarge?{
      accueil:{
        size:20,
        color:'grey',
      },
      others:{
        size:25,
        color:'grey',
      }
    }:{
      accueil:{
        size:45,
        color:'grey',
      },
      others:{
        size:60,
        color:'grey',
      }
    }

      useEffect(() => {
      if (!socket.connected) {
        socket.connect();
      }
      function onConnect(){setPop({show:true,message:'Even-driver connected',code:'green'});}
      function onDisconnect(){setPop({show:true,message:'Even-driver disconnected',status:'middle',code:'#880000'});}
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      
      return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
      };
    }, []);

    //// function onAnalysePoudreAdded(data){
    //       setNewAna({show:true,id:data?.id||101,code:data?.code || 'green'});
    //   }
    useEffect(() => {
                // setNewAna({show:true,id:101,code:'green'});
      /*async*/ function onAnalysePoudreAdded(data){
                const {newAnalyse,lansas,analyses,code}=data;
                const {list}=/*await*/ ListOfFocusedAndLastNumber(newAnalyse,analyses);
                /*await*/ dispatch(storeFocusedListe(list));
                /*await*/ dispatch(setPowderAnalysed(analyses));
                /*await*/ setNewAna({show:true,nChar:newAnalyse?.nChar||101,code:code || 'green'});
            }
      if (!socket.connected) {socket.connect();}
      socket.emit('joinRoom',{roomName:possibleRooms[routeName] || 'Comptabilite'});
      socket.on('roomJoiningStatus', (data) => {
        const {success,message}=data;
        if(!success){
          setTimeout(() => {
            setPop({show:true,message:message,status:'middle',code:'#880000'});
          }, 3000);
          return;
        }
        setTimeout(() => {
          setPop({show:true,message:message,status:'low',code:'green'});
        }, 3000);
      })
      socket.on('analysePoudreAdded', /*async*/ (data)=>/*await*/ onAnalysePoudreAdded(data));
      socket.on('analysePoudreUpdated', /*async*/ (data)=>/*await*/ onAnalysePoudreAdded(data));

      return () => {
        socket.off('analysePoudreAdded');
      };
      }, [socket,routeName]);

    const {accueil,others}=styleInline;
    useLayoutEffect(()=>{
      name='ACCUEIL';
    },[])
  return <View style={styles.grandMere}>
      <View style={styles.mere}>        
        <NavigationContainer
          ref={navigationRef}
          style={{backgroundColor:'black'}}
          onStateChange={() => {
            const state = navigationRef.current.getRootState();
            const currentUrlPath = getPathFromState(state);
            const currentUrlPathSplit = currentUrlPath?.split('/')[1] || 'Comptabilite ';
            const activeRouteName = currentUrlPathSplit?.replace(' ','_').toLowerCase();
            setRouteName(activeRouteName);
          }}
        >
          <Tab.Navigator 
          screenOptions={{
                headerShown:false,
                tabBarShowLabel:isLarge?true:false,
                tabBarActiveTintColor:'yellow',
                tabBarInactiveTintColor:'white',
                tabBarPosition:isLarge?'top':'bottom',
                gestureEnabled:true,
                gestureDirection:'horizontal',
                animation:"shift",
                transitionSpec: {
                  animation: 'timing',
                  config: {
                    duration: 250,
                    easing: Easing.inOut(Easing.ease),
                  },
                },
                sceneStyleInterpolator: ({ current }) => ({
                  sceneStyle: {
                    opacity: current.progress.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [0, 1, 0],
                    }),
                  },
                }),
                tabBarStyle:{
                  backgroundColor:isLarge?'rgba(221, 221, 221,0.2)':'#6400f0ee',
                  height:isLarge?45:(isMobile?85:85),
                  justifyContent:isLarge?'flex-start':undefined,//isLarge
                  paddingLeft:isLarge?20:undefined,//isLarge
                  paddingVertical:isLarge?'auto':undefined,//isLarge
                  marginBottom:isLarge?5:undefined,//isLarge
                  border:isLarge && 'none',
                },
                tabBarItemStyle:isLarge?{//isLarge
                  backgroundColor:isLarge?'#6400f0ee':'whitesmoke',
                  height:'75%',
                  marginVertical:'auto',
                  marginHorizontal:3,
                  borderRadius:5,
                  maxWidth:150,
                  alignItems:'flex-start',
                  letterSpacing:1
                }:{marginTop:18,},//isMobile?-28:-12,},
                tabBarLabelStyle:{
                  fontSize:isLarge?12:16,
                  fontWeight:'bold',
                  margin:isLarge && 5,
                  textAlign:'left',
                  color:!isLarge?'blue':'white',
                },
                tabBarOptions:{
                  indicatorStyle:{
                    height:2,
                    backgroundColor:'white',
                    color:'red',
                  }
                }
            }}
          >
            <Tab.Screen options={{tabBarIcon:()=><Text style={{textAlign:'center',width:others.size,height:others.size,}}><Ionicons name="home" size={accueil.size} color={name.includes('ACCUEIL')?'white':accueil.color} /></Text>}} name="COMPTABILITE" component={DrawerNavigator} />
            {liquidesAllowed && (
              <Tab.Screen options={{tabBarIcon:()=><Image source={require('./assets/images/liquides.png')} style={{borderWidth:name.includes('ACCUEIL')?2:1,borderColor:name.includes('LIQUIDES')?'white':others.color,borderRadius:'50%',width:others.size,height:others.size,}} contentFit='contain'/>}} name="LIQUIDES" component={LiquidesNavigator} />
            )}
            {tourAllowed && (
              <Tab.Screen options={{tabBarIcon:()=><Image source={require('./assets/images/poudre.png')} style={{borderWidth:name.includes('ACCUEIL')?2:1,borderColor:name.includes('TOUR')?'white':others.color,borderRadius:'50%',width:others.size,height:others.size,}} contentFit='contain'/>}} name="TOUR" component={DrawerTour} />
            )}
            {poudreAllowed && (
              <Tab.Screen options={{tabBarIcon:()=><Image source={require('./assets/images/poudre.png')} style={{borderWidth:name.includes('ACCUEIL')?2:1,borderColor:name.includes('POUDRE')?'white':others.color,borderRadius:'50%',width:others.size,height:others.size,}} contentFit='contain'/>}} name="POUDRE" component={DrawerPoudre} />
            )}
            {javelAllowed && (
              <Tab.Screen options={{tabBarIcon:()=><Image source={require('./assets/images/poudre.png')} style={{borderWidth:name.includes('ACCUEIL')?2:1,borderColor:name.includes('JAVEL')?'white':others.color,borderRadius:'50%',width:others.size,height:others.size,}} contentFit='contain'/>}} name="JAVEL" component={DrawerJavel} />
            )}
            {/* <Tab.Screen options={{tabBarButton: () => <Text>📋 </Text>}} name="home" component={Test} /> */}
            
          </Tab.Navigator>
        </NavigationContainer>
        <ToggleTheme/>
        </View>
        <Pop/>
        <NewAnalysed/>
        </View>
}

export const ToggleTheme=()=>{

    const storage=Platform.OS===('web' || 'window' || 'macos')?localStorage:AsyncStorage;
    // const themesCouple=['light','dark'];
    const thm=storage.getItem('theme')||'light';
    const [theme,setTheme]=useState(thm);
    const THEME=themes[theme];
    const handleThemeChange=() => {
        const emeht=theme==='light'?'dark':'light';
        if(Platform.OS===('web' || 'window' || 'macos')){
            storage.setItem('theme',emeht);
            setTheme(emeht);
        }
    }


return <TouchableOpacity style={{position:'absolute',right:20,top:8,backgroundColor:THEME.backgroundClr,padding:8,paddingHorizontal:24,borderRadius:8,}}  onPress={handleThemeChange}>
          <Text style={{color:'transparent',}}>
            <FontAwesome name={THEME.icone} size={15} color={THEME.iconeColor}/>
          </Text>
    </TouchableOpacity>
}

const Viscosimetre=()=>{
  const txtWidth=400;
  // var wdth=txtRef.current?txtRef.current.offsetWidth:0;
  const [value,setValue]=useState("");
  const [comment,setComment]=useState("");
  const values=[1,2,3,4,5,6,7.,"DEL","CLEAR",8,9,0,"ENTER"];
  const {max,min}={max:7000,min:4000};const marges={down:500,up:500};
  function handleJoin(val){
    if(val==="DEL"){
      setValue(prev=>prev.slice(0,-1));}
      // setWidth(((Number(value)/8000)*txtWidth).toFixed(0));
    if(val==="CLEAR"){
      setValue("");
      setWidth(0);
    }
    if(val==="ENTER"){
      alert(((Number(value)/8000)*txtWidth).toFixed(0));
    }
    if(typeof(val)==="number"){
      setValue(prev=>prev+(val.toString()));
      // setWidth(((Number(value+val.toString())/8000)*txtWidth).toFixed(0));
    }
    (handleComment(val))();
  }
const handleComment=(v)=>{
  const input =Number(v);
    const notNormal=(input<min || input>max);const isNormal=(input>=min && input<=max);
    const isAccepted=((input < (min-marges.down) && input >= (min-marges.down)) || (input>(max+marges.up) && input<=(max+marges.up)))
    if(isNormal){setComment("✔️ viscosite")};
    if(isAccepted){setComment("⚠️ viscosite proche des limites de conformité")};
    if(notNormal){setComment("❌ viscosite non conforme")};
}
  const handleValChange=()=>{ }
// const barreWidth=((Number(value)/8000)*400).toFixed(0);
// const bckgrndColor=(Number(value)<4000 || Number(value)>=8000)?"rgba(255,0,0,0.5)":"rgba(0,255,0,0.5)";
  return <View style={styles.viscometreStyles}>
    <View style={styles.viscometreMainScreen}>
      <View style={styles.viscometreScreen}>
          <Text style={{maxHeight:20,minHeight:20,fontSize:10,alignContent:"center",minWidth:'100%',backgroundColor:"transparent"}}>{comment}</Text>
          {/* <View style={{maxHeight:6,minHeight:6,borderWidth:1,borderColor:'grey',minWidth:"100%",backgroundColor:bckgrndColor,borderRadius:20}}> */}
            {/* <View style={{maxHeight:4,minHeight:4,width:Width,backgroundColor:bckgrndColor,borderRadius:20}}></View> */}
          {/* </View> */}
          <Slider
                      style={{minWidth:'100%', minHeight:10,maxHeight:10}}
                      maximumValue={10000}
                      minimumValue={200}
                      step={1}
                      // thumbTouchSize={{width:40,height:40,}}
                      tapToSeek={true}
                      trackStyle={{height:8,borderRadius:4,}}
                      thumbImage={require('./assets/images/hdThumbs-solid/thumb-visco.png')}
                      // minimumTrackStyle={{backgroundColor:'green',}}
                      // maximumTrackStyle={{backgroundColor:'red',}}
                      value={Number(value)}
                      onValueChange={handleValChange}
                      minimumTrackTintColor={isAcceptable({min:min,max:max},marges,Number(value))}
                      maximumTrackTintColor="#00FFFF"
                      thumbTintColor={isAcceptable({min:min,max:max},marges,Number(value))}
                    />
          <Text style={{ fontSize:45,minWidth:"100%",fontFamily:"Arial",paddingBottom:5,textAlign:"right",fontWeight:"bold",minHeight:64,
          flexDirection:"row",alignContent:"flex-end"

          }}>{value}</Text>
      </View>
    </View>
    <View style={styles.viscometreNumPad}>
{values.map((val,index)=><Text
key={index}
onPress={()=>handleJoin(val)}
style={{
          flex:val==="DEL"?1/2:(val==="CLEAR" || val==="ENTER")?3/8:1/4,
          width:'30%',
          padding:10,
          backgroundColor:val==="CLEAR"?"red":(val==="ENTER"?primaryColor:(val==="DEL"?"red":'rgba(165, 54, 54, 0.1)')),
          borderWidth:1,
          borderTopColor:'grey',
          borderLeftColor:'grey',
          margin:5,
          borderRadius:5,
          textAlign:'center',
          fontSize:(val==="CLEAR" || val==="ENTER")?10:18,
          fontWeight:'bold',
          color:'white'
      }}
>{val}</Text>
// </TouchableOpacity>
  )}
    </View>
  </View>
}


const HeaderRight=()=>{
  return <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>HD LAB APP</Text>
}

const styles=StyleSheet.create({
  viscometreStyles:{
    // width:"100%",
    maxWidth:400,
    minWidth:400,
    backgroundColor:"grey",
    flexDirection:"column",
    justifyContent:"flex-start",
    alignItems:"center",
    padding:10,
    minHeight:200,
    height:"auto",
    borderRadius:10,
    margin:100
    
  },
  viscometreMainScreen:{
    width:"100%",
    maxHeight:80,
    flex:1,
    flexDirection:"row",
    backgroundColor:"rgba(0,0,0,0.1)",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderRadius:10,
    height:80
  },
  viscometreScreen:{
    width:"96%",
    flex:1,
    // // fontSize:40,
    // fontFamily:"Arial",
    // textAlign:"right",
    // fontWeight:"bold",
    flexDirection:"column",
    alignItems:"flex-end",
    backgroundColor:"whitesmoke",
    justifyContent:"center",
    paddingVertical:4,
    paddingHorizontal:4,
    borderRadius:5,
    height:80
  },
  viscometreNumPad:{
    flex:1,
    width:"96%",
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"flex-start",
  },
  grandMere:{
    width:'100%',
    height:'100%',
    margin:0,
    padding:0,
    backgroundColor:'black',
  },
  mere:{
    flex:1,
    maxWidth:'100%',//1024,
    width:'100%',
    height:screenHeight*90,
    margin:0,
    marginHorizontal:'auto',
    padding:0,
    }
})




