import {useContext,useState,useEffect,useLayoutEffect,useRef} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Platform,useWindowDimensions,ScrollView,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch,useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// MES PROPRES COMPONENTS
import CustomBottomSheet from '../butomSheet';
import Pop from './popup';
// draws
import ModalReserv from './modaux.js/modalReserv';
import ModalVariances from './modaux.js/modalVariances';
import ModalPates from './modaux.js/modalPates';
import {varianceImgs} from '../kernel/cosmetiques/cosmetiquesResults';
// data statements
import Colors from '../assets/colors';
import { ProductsProvider,useProducts } from './productsProvider';
import { AccueilProvider,useMonoProducts,CurrentProductsProvider,CurrentProductsContext,MonoProductsProvider} from './wrappers/contexts';
import { CurrentUsers } from './modaux.js/users/ListeUsers';
import { idToUpdate } from './store/reducers/idReducer';
import Objects from './lineHdiObjects';
import ViewOrImgWrapper from './wrappers/viewOrImgWrapper';
import ModalMesures from './modaux.js/modalMesures';
import {ModalVariants} from './variances';
import { cosmetiquesFormat, meraResultsFormat } from '../assets/functions';
import NewAnalysis from './newAnalysis';
const Stack = createNativeStackNavigator();
export function clooner(text){
  const TEXT=text?.replace(/e/g,"3")?.replace(/a/g,"r")?.replace(/o/g,"a");
  return TEXT;
}
const Grid=()=>{
    return <ProductsProvider>
            <Accueil/>
        </ProductsProvider>
  }
const path='../assets/images/';
export function Flex(dir,jC,aI){
  return {
    flex:1,
    flexDirection:dir,
    justifyContent:jC,
    alignItems:aI,
  }
}


const Accueil=()=>{
    const [modal,setModal]=useState({from: '',results:{},machines:[],reservoirs:[],color:null});
    const [bool,setBool]=useState(false);
    const [build,setBuild]=useState({});
    const [boolSplit,setBoolSplit]=useState(false);
    const [boolVariance,setBoolVariance]=useState(false);
    const [variancesObject,setVariancesObject]=useState(false);
    const [imagesVariances,setImagesVariances]=useState(false);
    const [machinesReservoirs,setMachinesResrervoirs]=useState({})
    const {currentProductsLenIsNotNull}=useContext(CurrentProductsContext);
    const {width}=useWindowDimensions();const widthReitherThanMille=width>=1000;
    const dispatch=useDispatch();
    const navigation=useNavigation();
    const {products,globalCosmetiquesResults}=useProducts();
    const [item,setItem]=useState({title:'rien'});

    const bottomSheetRef = useRef(null);
  // const handleClosePress = () => bottomSheetRef.current?.close();
    function handleOpenPress(obj){ 
      setModal(obj);
      bottomSheetRef.current?.snapToIndex(2);}//.snapToPosition('50%'):bloque le handle;// || '25%' || '50%' || '75%'
  
    useEffect(()=>{
      dispatch(idToUpdate({targetId:null,product:null}));
    },[modal])

    useLayoutEffect(()=>{
          navigation.setOptions({
              headerRight:()=><CurrentUsers render={()=>null}/>
          })
      })
    return (<>
        <GestureHandlerRootView style={[styles.container,{flexDirection:widthReitherThanMille && 'row-reverse',paddingVertical:widthReitherThanMille && 0,}]}>
          <>{/* Pour affichage des produits analysés aujourd'hui*/}
            <ViewOrImgWrapper>
                <Objects navigation={navigation}/>
                
                  {/* <View style={{paddingVertical:50,width:"100%",height:"auto",backgrondColor:"transparent"}}>
                    <NewAnalysis/>
                  </View> */}
                
            </ViewOrImgWrapper>
            <ScrollView style={styles.scrollView}>
                <View
                    style={{
                          // ...Flex('row','center','center'),
                          flexDirection:'row',
                          justifyContent:'center',
                          alignItems:'center',

                          flexWrap:'wrap',
                          // minHeight:'70%',
                          maxHeight:1000,
                          height:'100%',
                          // minWidth:'95%',
                          width:'100%',
                          paddingHorizontal:'auto',
                          marginHorizontal:'auto',
                          paddingVertical:0, // 10
                          paddingVertical:!currentProductsLenIsNotNull && 60, // 10
                          backgroundColor:'none',//'whitesmoke',
                          // border:'1px solid grey',
                          borderRadius:8,//'8px',
                          gap:5,
                      }}
                >
                     { Platform.OS==='web' &&
                     <CurrentProducts 
                        // rendItem={(i)=>setNewItem(i)}
                        products={products}
                        globalCosmetiquesResults={globalCosmetiquesResults}
                        render={(objt)=>{setModal(objt);setBool(true)}}
                        renders={({
                          im,
                          variancesObject,images
                        })=>{
                          im.title.includes('mera')?
                                  () =>{dispatch(idToUpdate({targetId:null,product:'mera'}));setBoolSplit(true)}
                                  :() =>{setVariancesObject(variancesObject);setImagesVariances(images);setBoolVariance(true);}
                        }}
                        // render={(currentProducts,currentsProductsNames)=>setCurrentObj({currentProducts:currentProducts,currentsProductsNames:currentsProductsNames})}
                     >
                     </CurrentProducts>}
                    {/* MOBILE */}
                    {
                    Platform.OS!=='web' && products.map((item,index)=>!item.variance?
                          <Produit key={index}  item={item} render={(objt)=>{setItem(item);handleOpenPress(objt)}} />
                          :<Produits key={index}  item={item} render={
                                  item.title.includes('mera')?
                                  () =>{dispatch(idToUpdate({targetId:null,product:'mera'}));setItem(item);bottomSheetRef.current?.snapToIndex(2);}
                                  :({variancesObject,machines,reservoirs,images}) =>{setMachinesResrervoirs({machines,reservoirs});setVariancesObject(variancesObject);setImagesVariances(images);setItem(item);bottomSheetRef.current?.snapToIndex(3);}
                              }
                          />
                      )
                    }
                    {/*  WEB */}
                    {/* {
                      Platform.OS==='web' && products.map((item,index)=>!item.variance?
                          <Produit key={index} item={item} render={(objt)=>{setModal(objt);setBool(true)}} />
                          :<Produits key={index} item={item} render={
                                  item.title.includes('mera')?
                                  () =>{dispatch(idToUpdate({targetId:null,product:'mera'}));setBoolSplit(true)}
                                  :({variancesObject,images}) =>{setVariancesObject(variancesObject);setImagesVariances(images);setBoolVariance(true);}
                              }
                          />
                      )
                    } */}
                    {
                      Platform.OS==='web' && products.map((item,index)=>!item.variance?
                          <Produit key={index} item={item} render={(objt)=>{setModal(objt);setBool(true)}} />
                          :<Produits key={index} item={item} render={
                                  item.title.includes('mera')?
                                  () =>{dispatch(idToUpdate({targetId:null,product:'mera'}));setBoolSplit(true)}
                                  :({variancesObject,machines,reservoirs,images}) =>navigation.navigate("analyses/liquides/variances", {data:{variancesObject:variancesObject,machinesReservoirs:{machines,reservoirs},imagesVariances:images}})
                              }
                          />
                      )
                    }

                </View>
            </ScrollView>
            {/*MOBILE*/}<CustomBottomSheet navigation={navigation} data={{modal:modal,item:item,machinesReservoirs:machinesReservoirs,variancesObject:variancesObject,imagesVariances:imagesVariances}} ref={bottomSheetRef}/>
          <Pop/>
          </>
        </GestureHandlerRootView>
        
        {/*WEB*/}
        <ModalReserv data={modal} bool={bool} render={(b)=>setBool(b)}/>
        <ModalPates bool={boolSplit} render={(b)=>setBoolSplit(b)}/>
        <ModalVariances
            navigation={navigation}
            variancesObject={variancesObject}
            machinesReservoirs={machinesReservoirs}
            imagesVariances={imagesVariances}
            bool={boolVariance}
            render={(b)=>setBoolVariance(b)}
        />
    </> )}

const Produit=({item,coef,render})=>{
    const clooned= useSelector(state => state.actived.clooned);
    const {buildMonoproducts}=useMonoProducts();
        const {title,results,machines,reservoirs,color,variance,url,imgStyle,textStyle,text}=item;
        const txt=coef?text.replace("Premium","Prem").replace("Platinium","Plat"):text;
  return <TouchableOpacity style={[styles.button,coef && {width:coef*95,height:coef*120}]}
          // onPress={() =>{render({from:title,results:results,machines:machines,reservoirs:reservoirs,color:color,variance:variance})}}
          onPress={() =>buildMonoproducts(item)}
        >
            <Image resizeMode="contain" source={clooned?require("../assets/images/any.png"):url} style={imgStyle}/>
            <Text style={textStyle}>{clooned ? clooner(txt) : txt}</Text>
        </TouchableOpacity> 
}
const Produits=({item,render})=>{
    const clooned= useSelector(state => state.actived.clooned);
        const {
          // results,color,variance,
          title,variancesObject,machines,reservoirs,images,url,imgStyle,textStyle,text}=item;
         
return <TouchableOpacity
          style={styles.button}
          title={title}
          onPress={() =>render({variancesObject,machines,reservoirs,images})}
        >
        <Image resizeMode="contain" source={clooned?require("../assets/images/anies.png"):url} style={imgStyle}/>

        <Text style={textStyle}>{clooned ? clooner(text) : text}</Text>
        </TouchableOpacity>
}

const CurrentProducts=({products,globalCosmetiquesResults,render,renders})=>{// Pour affichage des produits analysés aujourd'hui
  const bg={backgroundColor:'black',fontSize:16};
  const {currentProductsLenIsNotNull,currentProducts,currentsProductsNames}=useContext(CurrentProductsContext);
  const {setTargetedBadge,badgeId,setBadgeId}=useMonoProducts();
  let notVarianceProducts={};

  return currentProductsLenIsNotNull && <View
            style={{
              flexDirection:'row',
              justifyContent:'flex-start',
              alignItems:'center',
              maxWidth:'100%',
              width:'100%',
              backgroundColor:'rgba(0,0,0,0.1)',
              flexWrap:'wrap',
              minHeight:120,
              padding:10,
              paddingBottom:6,
              // marginBottom:4,
              borderBottomWidth:1,
              borderStyle:'solid',
              borderColor:'white',
              gap:5,
            }}
          >
    {products.map((item,index)=>
        {
          const isIn=currentsProductsNames.includes(item.title);
          isIn && (notVarianceProducts[item.title.split(' ').join(('_'))] = "exists");
          const iAmTheBage=badgeId===item.title;
          const coef=0.8;
          return isIn && <View key={index}
          style={
            [styles.button,{width:coef*95,height:coef*120,backgroundColor:'white',color:'grey',padding:10,}]
            }
        >
            {/* {
              !item.variance? */}
              <Produit key={index} item={item} coef={0.8} render={(objt)=>render(objt)} />
              {/* :<Produits key={index} item={item} render={({variancesObject,images}) =>renders({item,variancesObject,images})}
              />
            } */}
            <Text
              style={[
                {paddingVertical:'6%',
                textAlign:'center',
                borderRadius:'50%',
                position:'absolute',
                backgroundColor:'rgba(0,0,255,0.6)',
                top:-2,
                right:-2,
                width:34,
                height:34,
                color:'white',
                fontWeight:'bold'},
                iAmTheBage && bg,
              ]}
              onPress={()=>setTargetedBadge(item.title)}
              onMouseEnter={()=>setBadgeId(item.title)}
              onMouseLeave={()=>setBadgeId(null)}
            >
            {currentProducts[item.title.split(' ').join(('_'))]}
            </Text>
        </View>}
    )}
    {Object.entries(currentProducts).filter(([ky, vlue]) => !Object.keys(notVarianceProducts).includes(ky)).map((ar,index)=>
        {
          const titre=ar[0].split('_').join(' ');
          const key1=ar[0].toLowerCase();
          const varianceUrl=varianceImgs[key1];
          const item={
            title:titre,
            results:globalCosmetiquesResults[key1] && meraResultsFormat(globalCosmetiquesResults[key1]),
            machines:['F','E'],
            reservoirs:[40,41,42,43,44,45,46,47,48],
            color:Colors.Bleu,
            variance:true,
            url:varianceUrl,
            imgStyle:styles.image,
            textStyle:styles.title,
            text:titre.replace('Noura net','Nnet')
    
        };
          const iAmTheBage=badgeId===item.title;
          const coef=0.8;
          return <View key={index}
              style={[styles.button,{width:coef*95,height:coef*120,backgroundColor:'white',color:'grey',padding:10,}]}
            >
              <Produit key={index} item={item} coef={0.8} render={(objt)=>render(objt)} />
            <Text
              style={[
                {paddingVertical:'6%',
                textAlign:'center',
                borderRadius:'50%',
                position:'absolute',
                backgroundColor:'rgba(0,0,255,0.6)',
                top:-2,
                right:-2,
                width:34,
                height:34,
                color:'white',
                fontWeight:'bold'},
                iAmTheBage && bg,
              ]}
              onPress={()=>setTargetedBadge(item.title)}
              onMouseEnter={()=>setBadgeId(item.title)}
              onMouseLeave={()=>setBadgeId(null)}
            >
            {ar[1]}
            </Text>
        </View>}
    )}
  </View>
}

const OpNavigator=()=>{// ceci marchera t'il pour le mobile ?
    return <AccueilProvider>
        <CurrentProductsProvider>
          <MonoProductsProvider>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#6200ee',height:'100%'},
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold',},
                    gestureEnabled: true, // Active les gestes de navigation (par ex. swipe pour revenir en arrière)
                    headerShown:true
                }}>
                <Stack.Screen name="LiquidesOp" options={{title: 'N&D Laboratoire | Liquides analysés'}} children={() => <Grid/>}/>
                <Stack.Screen name="analyses/liquides/updateLiquides" children={() => <ModalMesures /*N'utilise pas l'AccuielContext*//>} options={{presentation:'transparentModal'}}/>
                <Stack.Screen name="analyses/liquides/variances" children={({route}) => <ModalVariants route={route}/>} options={{presentation:'transparentModal'}}/>
            </Stack.Navigator>
          </MonoProductsProvider>
        </CurrentProductsProvider>
    </AccueilProvider>
    }

const styles=StyleSheet.create({
    container:{
        flexDirection:'column',
        paddingHorizontal:2,
        paddingVertical:5,
        minHeight:'100%',
        maxHeight:'100%',
        height:'100%',backgroundColor:'#f4ede2',
        width:'100%',
    },
    scrollView:{
      maxHeight:'98%',

      height:'98%',borderWidth:2,borderColor:'whitesmoke',borderStyle:'solid',borderRadius:8,
      margin:'0.5%',
      backgroundColor:'rgba(0,0,0,0.08)',
    },
    button:{
        width:95,
        height:120,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(0,0,0,0.2)',
        borderRadius:10,
        backgroundColor:'white',//rgba(49, 141, 247, 0.7)',
        // ...Flex('row','flex-start','center'),

    },
        title:{
          letterSpacing:-1.2,
          textAlign:'center',
          width:'90%',
          height:'15%',
          fontSize:14,
          color:'grey',
          fontWeight:'bold',
          // marginTop:-10,
          // transform:[{rotate:'-90deg'}],
        },
        image:{
            // width:'30%',
            height:'75%',//150,
            // marginLeft:-14,
        }
})


export default OpNavigator

