import { useEffect,useLayoutEffect,useMemo} from 'react';
import WinDim from '../assets/operatingData';
import { Provider as PaperProvider} from 'react-native-paper';
import { NavigationContainer, TabActions, useNavigation} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationIndependentTree } from '@react-navigation/native';
import socket from '../assets/socketService';
import { useDispatch,useSelector } from 'react-redux';
import { Image } from 'expo-image';
import { Tabs } from './DrawerTour';
// du store
import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
import { storeFocusedListe } from '../components/store/reducers/currentProducted';
import { setJavelFocusedProduct } from '../components/store/reducers/javelFocusedProduct';
import { storeJavelFocusedListe } from '../components/store/reducers/currentJavelProducted';
// du Contexts
import { useCurrentProducted,useCurrentJavelProducted  } from '../components/wrappers/contexts';
import { primaryColor } from '../assets/constantes';
import { isFormule } from '../assets/functions';
import Colors from '../assets/colors';
const {isMobile}=WinDim;

const Tab = createBottomTabNavigator();
export default function  PoudreAnalysedTab({nested}) {
    const dispatch=useDispatch();
    const iconPoudre=require('../assets/images/poudre.png');
    const {currentProducted,focusedProduct,powderAnalysed}= useSelector(state => {
            const powderAnalysed=state.powderAnalysed.powderAnalysed;
            const currentProducted = state.currentProducted.currentProducted;
            const focusedProduct = state.focusedProduct.focusedProduct;
            return {currentProducted,focusedProduct,powderAnalysed};
            });

    const {ListOfFocusedAndLastNumber,setFocusedList,setFocusedPro,setAction}=useCurrentProducted();
    const currenProductedLen=Object.keys(currentProducted).length;
    useMemo(()=>{currenProductedLen===0 && dispatch(setFocusedProduct({}))},[currenProductedLen])
    
    useEffect(() => {// Mis ici pour ne pas trop importer encore
                socket.on('analysedPoudreAdded', (data)=>{
                    const {code,newAnalyse,analyses}=data;
                    const {list}=ListOfFocusedAndLastNumber(setFocusedPro,analyses);
                    dispatch(storeFocusedListe(list));
                });
                return () => {socket.off('analysedPoudreAdded');}
            }, []);

    useEffect(()=>{
      const firstElem=Object.values(currentProducted).length!==0?Object.values(currentProducted)[0]:{};
      const {list}=ListOfFocusedAndLastNumber(firstElem,powderAnalysed);
      dispatch(storeFocusedListe(list));

    },[]);
  return (<PaperProvider>
        <NavigationIndependentTree style={{backgroundColor:"white",maxWidth:"100%",height:"100%"}}>
        <NavigationContainer>
          <Tab.Navigator 
          screenOptions={{
                headerShown:false,
                tabBarActiveTintColor:'white',
                tabBarActiveBackgroundColor:'rgba(0,0,255,0.1)',
                tabBarInactiveTintColor:'black',
                // tabBarInactiveBackgroundColor:'rgba(0,0,0,0.1)',

                tabBarPosition:'top',
                tabBarLabelPosition:'below-icon',
                // tabBarBadge:"*",
                // animationEnabled:true,
                animation:"shift",
                // tabBarIcon:()=> <Image source={iconPoudre} style={{width:50,height:30}}/>,
                tabBarStyle:{
                  maxWidth:"100%",
                  minWidth:598,
                  width:"100%",
                  height:75,
                  backgroundColor:"#ddd",//'rgba(221, 221, 221,0.2)',
                  flexDirection:'row',
                  alignItems:'center',
                  justifyContent:!isMobile?'flex-start':undefined,//!isMobile
                  paddingLeft:!isMobile?20:undefined,//!isMobile
                  paddingVertical:!isMobile?'auto':undefined,//!isMobile
                  paddingHorizontal:25,
                  // marginBottom:!isMobile?5:undefined,//!isMobile
                  // border:!isMobile && 'none',
                  borderBottomWidth:2,
                  borderBottomColor:"black",
                },
                tabBarItemStyle:{
                  borderWidth:1,
                  maxWidth:120,
                  borderColor:'rgba(0,0,0,0.9)',
                  height:'55%',
                  marginHorizontal:3,
                  borderRadius:8,
                },
                tabBarLabelStyle:{
                  fontWeight:'bold',
                  letterSpacing:1,
                  fontSize:10,
                  color:primaryColor
                },
                // tabBarIconStyle:{
                //   display:"none",
                // },
            }}
          >
            {currenProductedLen===0 && <Tab.Screen
                name="Aucune sélection"
                component={() => <Dispatcher/>}
              />}
            {Object.entries(currentProducted).map(([lansaKey, lansa],i) => {
              // i!==len-1 && pourcorriger le probleme de  navigator de meme nom
              // const isFormule=lansaKey.includes("fini");
              // const formats=isFormule?lansa.format.reduce((acc,k)=>acc+" "+k,""):"";
              const {estFormule,nameToDisplay}=isFormule(lansa);
              return <Tab.Screen
                key={lansaKey}
                name={nameToDisplay.charAt(0).toUpperCase()+nameToDisplay.slice(1)}
                component={() =>nested?<Tabs/>:<Dispatcher/>}
                
                options={{
                    tabBarBadge:estFormule?"fini":"lansa",
                    tabBarBadgeStyle:{backgroundColor:"rgba(0,0,0,0.15)",fontWeight:"bold",borderWidth:1,borderColor:"grey",minWidth:60},
                    tabBarIcon:()=> <Image source={iconPoudre} style={{width:50,height:30}}/>,
                }}
                listeners={{tabPress:()=>{
                  const {list}=ListOfFocusedAndLastNumber(lansa,powderAnalysed);
                  setFocusedPro(lansa);// {} normes du produit ayant le focus cote provider
                  setFocusedList(list); // [] liste des analyses du produit ayant le focus
                  dispatch(storeFocusedListe(list));
                  dispatch(setFocusedProduct(lansa));// {} normes du produit ayant le focus cote store de redux
                  setAction("create");
                }}}
              />
            })}
          </Tab.Navigator>
        </NavigationContainer>
        </NavigationIndependentTree>
    </PaperProvider>
  );
}

export function JavelAnalysedTab() {
    const dispatch=useDispatch();
    const iconJavel=require('../assets/images/madar-javel.png');
    const {currentJavelProducted,javelFocusedProduct,javelAnalysed}= useSelector(state => {
            const javelAnalysed=state.javelAnalysed.javelAnalysed;
            const currentJavelProducted = state.currentJavelProducted.currentJavelProducted;
            const javelFocusedProduct = state.javelFocusedProduct.javelFocusedProduct;
            return {currentJavelProducted,javelFocusedProduct,javelAnalysed};
            });

    const {ListOfFocusedAndLastNumber,setFocusedList,setFocusedPro,setAction}=useCurrentJavelProducted();
    const currenProductedLen=Object.keys(currentJavelProducted).length;
    useMemo(()=>{currenProductedLen===0 && dispatch(setJavelFocusedProduct({}))},[currenProductedLen])
    useEffect(()=>{
      const firstElem=Object.values(currentJavelProducted).length!==0?Object.values(currentJavelProducted)[0]:{};
      const {list}=ListOfFocusedAndLastNumber(firstElem,javelAnalysed);
      dispatch(storeJavelFocusedListe(list));

    },[]);
  return (
    <PaperProvider>
        <NavigationIndependentTree style={{backgroundColor:"white",maxWidth:"100%",height:"100%"}}>
        <NavigationContainer>
          <Tab.Navigator 
          screenOptions={{
                headerShown:false,
                tabBarActiveTintColor:'white',
                tabBarActiveBackgroundColor:'rgba(0,0,255,0.1)',
                tabBarInactiveTintColor:'black',
                tabBarPosition:'top',
                tabBarLabelPosition:'below-icon',
                animation:"shift",
                tabBarStyle:{
                  maxWidth:"100%",
                  minWidth:598,
                  width:"100%",
                  height:75,
                  backgroundColor:'rgb(203, 192, 150)',//'rgba(221, 221, 221,0.2)',
                  flexDirection:'row',
                  alignItems:'center',
                  justifyContent:!isMobile?'flex-start':undefined,//!isMobile
                  paddingLeft:!isMobile?20:undefined,//!isMobile
                  paddingVertical:!isMobile?'auto':undefined,//!isMobile
                  paddingHorizontal:25,
                  marginBottom:!isMobile?5:undefined,//!isMobile
                  borderBottomWidth:2,
                  borderBottomColor:"black",
                },
                tabBarItemStyle:{
                  borderWidth:1,
                  maxWidth:120,
                  borderColor:'rgba(0,0,0,0.9)',
                  height:'55%',
                  marginHorizontal:3,
                  borderRadius:8,
                },
                tabBarLabelStyle:{
                  fontWeight:'bold',
                  letterSpacing:1,
                  fontSize:10,
                  color:primaryColor
                }
            }}
          >
            {currenProductedLen===0 && <Tab.Screen
                name="Aucune sélection"
                component={() => <Dispatcher/>}
              />}
            {Object.entries(currentJavelProducted).map(([lansaKey, lansa],i) => {
              // i!==len-1 && pourcorriger le probleme de  navigator de meme nom
              // const isFormule=lansaKey.includes("fini");
              // const formats=isFormule?lansa.format.reduce((acc,k)=>acc+" "+k,""):"";
              return <Tab.Screen
                key={lansaKey}
                name={lansa.name.charAt(0).toUpperCase()+lansa.name.slice(1)}
                // +"       "+formats}
                component={() => <Dispatcher/>}
                options={{
                    // tabBarBadge:isFormule?"":"",
                    tabBarLabelStyle:{fontWeight:'bold',fontSize:12,color:"white"},
                    tabBarBadgeStyle:{backgroundColor:"rgba(0,0,0,0.15)",fontWeight:"bold",borderWidth:1,borderColor:"grey",minWidth:60},
                    tabBarIcon:()=> <Image source={iconJavel} style={{width:50,height:30}}/>,
                }}
                listeners={{tabPress:()=>{
                  const {list}=ListOfFocusedAndLastNumber(lansa,javelAnalysed);
                  setFocusedPro(lansa);// {} normes du produit ayant le focus cote provider
                  setFocusedList(list); // [] liste des analyses du produit ayant le focus
                  dispatch(storeJavelFocusedListe(list));console.log(list);
                  dispatch(setJavelFocusedProduct(lansa));// {} normes du produit ayant le focus cote store de redux
                  setAction("create");
                }}}
              />
            })}
          </Tab.Navigator>
        </NavigationContainer>
        </NavigationIndependentTree>
    </PaperProvider>
  );
}

const Dispatcher=()=>{
  
    return ""
}    


// import { useEffect,useLayoutEffect,useMemo} from 'react';
// import WinDim from '../assets/operatingData';
// import { Provider as PaperProvider} from 'react-native-paper';
// import { NavigationContainer, TabActions, useNavigation} from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationIndependentTree } from '@react-navigation/native';
// import { useDispatch,useSelector } from 'react-redux';
// import { Image } from 'expo-image';
// // du store
// import { setFocusedProduct } from '../components/store/reducers/focusedProduct';
// import { storeFocusedListe } from '../components/store/reducers/currentProducted';
// import { setJavelFocusedProduct } from '../components/store/reducers/javelFocusedProduct';
// import { storeJavelFocusedListe } from '../components/store/reducers/currentJavelProducted';
// // du Contexts
// import { useCurrentProducted,useCurrentJavelProducted  } from '../components/wrappers/contexts';
// import { primaryColor } from '../assets/constantes';
// import { isFormule } from '../assets/functions';
// import Colors from '../assets/colors';
// const {isMobile}=WinDim;

// const Tab = createBottomTabNavigator();
// export default function PoudreAnalysedTab() {
//     const dispatch=useDispatch();
//     const iconPoudre=require('../assets/images/poudre.png');
//     const {currentProducted,focusedProduct,powderAnalysed}= useSelector(state => {
//             const powderAnalysed=state.powderAnalysed.powderAnalysed;
//             const currentProducted = state.currentProducted.currentProducted;
//             const focusedProduct = state.focusedProduct.focusedProduct;
//             return {currentProducted,focusedProduct,powderAnalysed};
//             });

//     const {ListOfFocusedAndLastNumber,setFocusedList,setFocusedPro,setAction}=useCurrentProducted();
//     const currenProductedLen=Object.keys(currentProducted).length;
//     useMemo(()=>{currenProductedLen===0 && dispatch(setFocusedProduct({}))},[currenProductedLen])
//     useEffect(()=>{
//       const firstElem=Object.values(currentProducted).length!==0?Object.values(currentProducted)[0]:{};
//       const {list}=ListOfFocusedAndLastNumber(firstElem,powderAnalysed);
//       dispatch(storeFocusedListe(list));

//     },[]);
//   return (<PaperProvider>
//         <NavigationIndependentTree style={{backgroundColor:"white",maxWidth:"100%",height:"100%"}}>
//         <NavigationContainer>
//           <Tab.Navigator 
//           screenOptions={{
//                 headerShown:false,
//                 tabBarActiveTintColor:'white',
//                 tabBarActiveBackgroundColor:'rgba(0,0,255,0.1)',
//                 tabBarInactiveTintColor:'black',
//                 // tabBarInactiveBackgroundColor:'rgba(0,0,0,0.1)',

//                 tabBarPosition:'top',
//                 tabBarLabelPosition:'below-icon',
//                 // tabBarBadge:"*",
//                 // animationEnabled:true,
//                 animation:"shift",
//                 // tabBarIcon:()=> <Image source={iconPoudre} style={{width:50,height:30}}/>,
//                 tabBarStyle:{
//                   maxWidth:"100%",
//                   minWidth:598,
//                   width:"100%",
//                   height:75,
//                   backgroundColor:"#ddd",//'rgba(221, 221, 221,0.2)',
//                   flexDirection:'row',
//                   alignItems:'center',
//                   justifyContent:!isMobile?'flex-start':undefined,//!isMobile
//                   paddingLeft:!isMobile?20:undefined,//!isMobile
//                   paddingVertical:!isMobile?'auto':undefined,//!isMobile
//                   paddingHorizontal:25,
//                   marginBottom:!isMobile?5:undefined,//!isMobile
//                   // border:!isMobile && 'none',
//                   borderBottomWidth:2,
//                   borderBottomColor:"black",
//                 },
//                 tabBarItemStyle:{
//                   borderWidth:1,
//                   maxWidth:120,
//                   borderColor:'rgba(0,0,0,0.9)',
//                   height:'55%',
//                   marginHorizontal:3,
//                   borderRadius:8,
//                 },
//                 tabBarLabelStyle:{
//                   fontWeight:'bold',
//                   letterSpacing:1,
//                   fontSize:10,
//                   color:primaryColor
//                 },
//                 // tabBarIconStyle:{
//                 //   display:"none",
//                 // },
//             }}
//           >
//             {currenProductedLen===0 && <Tab.Screen
//                 name="Aucune sélection"
//                 component={() => <Dispatcher/>}
//               />}
//             {Object.entries(currentProducted).map(([lansaKey, lansa],i) => {
//               // i!==len-1 && pourcorriger le probleme de  navigator de meme nom
//               // const isFormule=lansaKey.includes("fini");
//               // const formats=isFormule?lansa.format.reduce((acc,k)=>acc+" "+k,""):"";
//               const {estFormule,nameToDisplay}=isFormule(lansa);
//               return <Tab.Screen
//                 key={lansaKey}
//                 name={nameToDisplay.charAt(0).toUpperCase()+nameToDisplay.slice(1)}
//                 component={() => <Dispatcher/>}
//                 options={{
//                     tabBarBadge:estFormule?"fini":"lansa",
//                     tabBarBadgeStyle:{backgroundColor:"rgba(0,0,0,0.15)",fontWeight:"bold",borderWidth:1,borderColor:"grey",minWidth:60},
//                     tabBarIcon:()=> <Image source={iconPoudre} style={{width:50,height:30}}/>,
//                 }}
//                 listeners={{tabPress:()=>{
//                   const {list}=ListOfFocusedAndLastNumber(lansa,powderAnalysed);
//                   setFocusedPro(lansa);// {} normes du produit ayant le focus cote provider
//                   setFocusedList(list); // [] liste des analyses du produit ayant le focus
//                   dispatch(storeFocusedListe(list));
//                   dispatch(setFocusedProduct(lansa));// {} normes du produit ayant le focus cote store de redux
//                   setAction("create");
//                 }}}
//               />
//             })}
//           </Tab.Navigator>
//         </NavigationContainer>
//         </NavigationIndependentTree>
//     </PaperProvider>
//   );
// }

// export function JavelAnalysedTab() {
//     const dispatch=useDispatch();
//     const iconJavel=require('../assets/images/madar-javel.png');
//     const {currentJavelProducted,javelFocusedProduct,javelAnalysed}= useSelector(state => {
//             const javelAnalysed=state.javelAnalysed.javelAnalysed;
//             const currentJavelProducted = state.currentJavelProducted.currentJavelProducted;
//             const javelFocusedProduct = state.javelFocusedProduct.javelFocusedProduct;
//             return {currentJavelProducted,javelFocusedProduct,javelAnalysed};
//             });

//     const {ListOfFocusedAndLastNumber,setFocusedList,setFocusedPro,setAction}=useCurrentJavelProducted();
//     const currenProductedLen=Object.keys(currentJavelProducted).length;
//     useMemo(()=>{currenProductedLen===0 && dispatch(setJavelFocusedProduct({}))},[currenProductedLen])
//     useEffect(()=>{
//       const firstElem=Object.values(currentJavelProducted).length!==0?Object.values(currentJavelProducted)[0]:{};
//       const {list}=ListOfFocusedAndLastNumber(firstElem,javelAnalysed);
//       dispatch(storeJavelFocusedListe(list));

//     },[]);
//   return (
//     <PaperProvider>
//         <NavigationIndependentTree style={{backgroundColor:"white",maxWidth:"100%",height:"100%"}}>
//         <NavigationContainer>
//           <Tab.Navigator 
//           screenOptions={{
//                 headerShown:false,
//                 tabBarActiveTintColor:'white',
//                 tabBarActiveBackgroundColor:'rgba(0,0,255,0.1)',
//                 tabBarInactiveTintColor:'black',
//                 tabBarPosition:'top',
//                 tabBarLabelPosition:'below-icon',
//                 animation:"shift",
//                 tabBarStyle:{
//                   maxWidth:"100%",
//                   minWidth:598,
//                   width:"100%",
//                   height:75,
//                   backgroundColor:'rgb(203, 192, 150)',//'rgba(221, 221, 221,0.2)',
//                   flexDirection:'row',
//                   alignItems:'center',
//                   justifyContent:!isMobile?'flex-start':undefined,//!isMobile
//                   paddingLeft:!isMobile?20:undefined,//!isMobile
//                   paddingVertical:!isMobile?'auto':undefined,//!isMobile
//                   paddingHorizontal:25,
//                   marginBottom:!isMobile?5:undefined,//!isMobile
//                   borderBottomWidth:2,
//                   borderBottomColor:"black",
//                 },
//                 tabBarItemStyle:{
//                   borderWidth:1,
//                   maxWidth:120,
//                   borderColor:'rgba(0,0,0,0.9)',
//                   height:'55%',
//                   marginHorizontal:3,
//                   borderRadius:8,
//                 },
//                 tabBarLabelStyle:{
//                   fontWeight:'bold',
//                   letterSpacing:1,
//                   fontSize:10,
//                   color:primaryColor
//                 }
//             }}
//           >
//             {currenProductedLen===0 && <Tab.Screen
//                 name="Aucune sélection"
//                 component={() => <Dispatcher/>}
//               />}
//             {Object.entries(currentJavelProducted).map(([lansaKey, lansa],i) => {
//               // i!==len-1 && pourcorriger le probleme de  navigator de meme nom
//               // const isFormule=lansaKey.includes("fini");
//               // const formats=isFormule?lansa.format.reduce((acc,k)=>acc+" "+k,""):"";
//               return <Tab.Screen
//                 key={lansaKey}
//                 name={lansa.name.charAt(0).toUpperCase()+lansa.name.slice(1)}
//                 // +"       "+formats}
//                 component={() => <Dispatcher/>}
//                 options={{
//                     // tabBarBadge:isFormule?"":"",
//                     tabBarLabelStyle:{fontWeight:'bold',fontSize:12,color:"white"},
//                     tabBarBadgeStyle:{backgroundColor:"rgba(0,0,0,0.15)",fontWeight:"bold",borderWidth:1,borderColor:"grey",minWidth:60},
//                     tabBarIcon:()=> <Image source={iconJavel} style={{width:50,height:30}}/>,
//                 }}
//                 listeners={{tabPress:()=>{
//                   const {list}=ListOfFocusedAndLastNumber(lansa,javelAnalysed);
//                   setFocusedPro(lansa);// {} normes du produit ayant le focus cote provider
//                   setFocusedList(list); // [] liste des analyses du produit ayant le focus
//                   dispatch(storeJavelFocusedListe(list));console.log(list);
//                   dispatch(setJavelFocusedProduct(lansa));// {} normes du produit ayant le focus cote store de redux
//                   setAction("create");
//                 }}}
//               />
//             })}
//           </Tab.Navigator>
//         </NavigationContainer>
//         </NavigationIndependentTree>
//     </PaperProvider>
//   );
// }

// const Dispatcher=()=>{
  
//     return ""
// }    