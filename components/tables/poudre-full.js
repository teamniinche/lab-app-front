
import {useRef,useLayoutEffect,useEffect,useState} from 'react';
import {View,Text,useWindowDimensions,ScrollView,Pressable,RefreshControl,TouchableOpacity,KeyboardAvoidingView /*,findNodeHandle*/,Platform,Button,StyleSheet} from 'react-native';
import { useSelector,useDispatch} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DrawerActions} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {CurrentProductsProvider,ChipProvider,CurrentProductedProvider,ItemToSaveProvider} from '../wrappers/contexts';
import { AnalysedListe } from '../../navigators/DrawerPoudre';
import WinDim from '../../assets/operatingData';
import { MyChipp,Filter } from '../chip';
import { productsAndCountsFormat,Flex, isFormule } from '../../assets/functions';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomSheet from '../modaux.js/bottomSheet';
// import getNormesLansas from '../../hooks/fetchNormes/normesLansas';
import { dbBaseRoot } from '../../assets/constantes';
const Stack=createNativeStackNavigator();
const {isLarge,screenHeight}=WinDim;

export default PoudreFull=({navigation/*,route,routeNheaders*/})=>{
    const viewRef=useRef();
    const safeAreaRef=useRef();
    // const {buildAnalytics}=useEverages();
    // const {api_url,headers}=routeNheaders;
    // const [modalShow,setModalShow]=useState(false);
    const {startedAt,endedAt,clooned}= useSelector(state => {
        const {startedAt,endedAt}=state.period.targetPeriod;
        const clooned=state.actived.clooned;
        return {startedAt,endedAt,clooned};});
    const [productsAndCounts,setProductsAndCounts]=useState(null);
    // const [analysesCount,setAnalysesCount]=useState(null)
    const [product,setProduct]=useState(null)
    const [refreshing,setRefreshing]=useState(false);
    const [isDrop,setIsDrop]=useState(false);

    const refresh=()=>{// Pour raffraichir le screen d'accueil
        // setRefreshing(true); // je trouve la similation moche
        setTimeout(()=>{
            setProduct("refresh");
            setTimeout(()=>{
                setProduct(null);
                // setRefreshing(false);
            },500)
        },500);
    }

    // const genratePDF = async () => {
    //     const months=['Janvier','Fèvrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
    //     try {

    //         const {count,delth,items}=toPrint;
    //         var titre=product?("Mélanges de "+ `<span style="font-size:18px;font-weight:bold;text-decoration:underline;color:${Colors[colorFromName(product)]};">${product.toUpperCase()}</span>`+" sur cette période choisie"):"Tous sur cette période choisie";
    //         const html = `
    //             <style>
    //                 html{margin:0px;padding:0px;}
    //                 body { font-family: Arial, sans-serif; font-size: 14px;padding:15px; }
    //                 h1 { margin:5px;margin-top: 15px; color: #07108fff; }
    //                 h2 { margin-top: 20px; color: #2c3e50; }
    //                 ul { list-style-type: none; padding-left: 0; }
    //                 li { margin: 4px 15px; padding: 6px; border-bottom: 1px solid #ddd; }
    //                 .header{font-size:8px;color:rgba(0,0,0,0.5);margin:8px;}
    //                 h4 { margin-top: 20px; color: #2c3e50; }
    //                 .key1{font-size:16px;color:rgba(0,0,0,0.8);margin: 4px 15px;margin-left:2px;padding: 6px; border-bottom: 1px solid #444; }
    //                 .key2{font-size:14px;color:rgba(0,0,0,0.5);margin:8px;margin-left:6px;}
    //                 .key3{font-size:14px;color:rgba(0,0,0,0.2);margin:8px;margin-left:10px;}
    //             </style>
    //             <html>
    //             <body>
    //                 <h1>Du ${startedAt} au ${endedAt}</h1>
    //                 ${`<li>Nombre d'analyses enregistrées : ${count}</li>`}
    //                 <ul>
    //                     ${headers.map((header, index) => (index<=10?
    //                         `<span class="header"  key=${index}>
    //                         ${header.toUpperCase()}
    //                         </span>`:""
    //                     )).join("")}
    //                 </ul>)
    //                 <div style="font-size:14px;">
    //                     ${items.map(object1 => {
    //                         return `<div >${Object.entries(object1).map(([key2,object2]) => {
    //                             const count2=Object.values(object2).length;
    //                             return `<h3 class="key1">${key2+'  '+count2}</h3>
    //                             <div>
    //                                 ${object2.map(object3 => {
    //                                     return `<div>
    //                                         ${Object.entries(object3).map(([key4,object4]) => {
    //                                             const count4=Object.values(object4).length;
    //                                             return `<h3 class="key2">${key4}<h3>
    //                                             <div>
    //                                                 ${Object.entries(object4).map(([key5,object5]) => {
    //                                                     const count5=Object.values(object5).length;
    //                                                     return `<h3 class="key3">${key5+'  '+count5}<h3>
    //                                                         </div>
    //                                                             ${object5.map(item => {
    //                                                                 const {id,updatedAt,parfum,color,observations,commentaires,categorie,
    //                                                                         createdAt,validation,Utilisateur,
    //                                                                         ...rest} = item;
    //                                                                 const validateur = validation?.Utilisateur?.pseudo || "";
    //                                                                 const chemist = Utilisateur?.pseudo || "";
    //                                                                 const valeurs=['ph','matiere_active','viscosite','densite','silicate','caustique','durete'];
    //                                                                 const vallues = VALEURS(rest,valeurs);
    //                                                                 return `<p style="margin-left:5px;color:${Colors[colorFromName(item.name)]};font-size:${Platform.OS!=='web'?'14px':'15px'};letter-spacing:0.7px;border-bottom:${Platform.OS==='web' && `1px solid ${Colors[colorFromName(item.name)]}`};">
    //                                                                             ${Time(createdAt)}${vallues} -- ${chemist}${
    //                                                                             validation?" -- ✔ ":""}${validation?' -- '+validateur:""}
    //                                                                         </p>`;
    //                                                                 }).join("")}
    //                                                         </div>`
    //                                                 }).join("")}
    //                                             </div>`
    //                                         }).join("")}
    //                                     </div>`
    //                                 }).join("")}
    //                             <div>`
    //                         }).join("")}
    //                         <div>`
    //                     }).join("")}
    //                 </div>
    //                 ${Platform.OS==='web' && `<script>
    //                     window.onload=function(){
    //                         window.print();
    //                         window.close();
    //                     }
    //                 </script>`}
    //             </body>
    //         </html> `;
    //             if(Platform.OS!=='web'){
    //                 const { uri } = await Print.printToFileAsync({ html });
    //                 if(await Sharing.isAvailableAsync()){await Sharing.shareAsync(uri);}
    //                 return uri;
    //             }else{
    //                 const newWindow=window.open("","_blank");
    //                 newWindow.document.write(html);
    //                 newWindow.document.close();
    //             }
    //         } catch (error) {
    //             alert("Erreur de chargement : "+error.message);
    //         }
    //     };

    // const gneratePDF = async () => {
    //     const months=['Janvier','Fèvrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
    //     try {

    //         const response = await fetch(`${api_url}?page=1&limit=10000&startedAt=${startedAt}&endedAt=${endedAt}`);
    //         const data = await response.json();
    //         const ANALYSES=product?data.analyses.filter(item=>item.name.includes(product)):data.analyses;
    //         const grpedItems=GroupItems(ANALYSES);//ICI va correspondre avec les filtres
    //         var monthCurrent=[];
    //         var titre=product?("Mélanges de "+ `<span style="font-size:18px;font-weight:bold;text-decoration:underline;color:${Colors[colorFromName(product)]};">${product.toUpperCase()}</span>`+" sur cette période choisie"):"Tous sur cette période choisie";
    //         const html = `
    //             <style>
    //                 html{margin:0px;padding:0px;}
    //                 body { font-family: Arial, sans-serif; font-size: 14px;padding:15px; }
    //                 h1 { margin:5px;margin-top: 15px; color: #07108fff; }
    //                 h2 { margin-top: 20px; color: #2c3e50; }
    //                 ul { list-style-type: none; padding-left: 0; }
    //                 li { margin: 4px 15px; padding: 6px; border-bottom: 1px solid #ddd; }
    //                 .header{font-size:8px;color:rgba(0,0,0,0.5);margin:8px;}
    //             </style>
    //             <html>
    //             <body>
    //                 <h1>Du ${startedAt} au ${endedAt}</h1>
    //                 ${`<li>Nombre d'analyses enregistrées : ${data.totalAnalyses}</li>`}
    //                 <ul style="list-style-type: none;padding:20px;">
    //                     ${productsAndCounts.map(item => (
    //                         `<h2 style="color:${Colors[colorFromName(item.name)]};padding:2px;margin:0px;
    //                         ">
    //                         ${item.name} : ${item.count}
    //                         </h2>`))
    //                     .join("")}
    //                 </ul>
    //                 <h2 style="color:rgba(0,0,0,0.7);letter-spacing:1px;margin-bottom:40px;">${titre}</h2>
    //                 <ul>
    //                     ${headers.map((header, index) => (index<=10?
    //                         `<span class="header"  key=${index}>
    //                         ${header.toUpperCase()}
    //                         </span>`:""
    //                     )).join("")}
    //                 </ul>
    //                 <ul>
    //                     ${Object.entries(grpedItems).map(([key,value]) => {
    //                         const dateArray=key.split('-');const annee=dateArray[0];
    //                         var month=dateArray[1];//grpedItems
    //                         const monthYear=(months[month-1]+' '+annee);

    //                         function toDisplay(){if(!monthCurrent.includes(month)){
    //                             monthCurrent.push(month);
    //                             return `<h2>${monthYear}</h2>
    //                             <p style="font-size:14px;letter-spacing:1px;color:rgba(0,0,0,0.8);margin:14px 8px;">${key}</p>
    //                             `
    //                         }else{
    //                             return `<p style="font-size:16px;letter-spacing:1px;color:rgba(0,0,0,0.8);margin:14px 8px;">${key}</p>`
    //                         }}

    //                         return `
    //                             ${toDisplay()}
    //                             ${value.sort((a, b) =>a.name.localeCompare(b.name)).map(item => {
    //                                 const {id,updatedAt,parfum,color,observations,commentaires,categorie,
    //                                         createdAt,validation,Utilisateur,
    //                                         ...rest} = item;
    //                                 const validateur = validation?.Utilisateur?.pseudo || "";
    //                                 const chemist = Utilisateur?.pseudo || "";
    //                                 const valeurs=['ph','matiere_active','viscosite','densite','silicate','caustique','durete'];
    //                                 const vallues = VALEURS(rest,valeurs);
    //                                 return `<p style="margin-left:5px;color:${Colors[colorFromName(item.name)]};font-size:${Platform.OS!=='web'?'14px':'15px'};letter-spacing:0.7px;border-bottom:${Platform.OS==='web' && `1px solid ${Colors[colorFromName(item.name)]}`};">
    //                                             ${Time(updatedAt)}${vallues} -- ${chemist}${
    //                                             validation?" -- ✔ ":""}${validation?' -- '+validateur:""}
    //                                         </p>`;
    //                                 })
    //                         .join("")}`;
    //                     })
    //                     .join("")}
    //                 </ul>
    //                 ${Platform.OS==='web' && `<script>
    //                     window.onload=function(){
    //                         window.print();
    //                         window.close();
    //                     }
    //                 </script>`}
    //             </body>
    //         </html> `;
    //             if(Platform.OS!=='web'){
    //                 const { uri } = await Print.printToFileAsync({ html });
    //                 if(await Sharing.isAvailableAsync()){await Sharing.shareAsync(uri);}
    //                 return uri;
    //             }else{
    //                 const newWindow=window.open("","_blank");
    //                 newWindow.document.write(html);
    //                 newWindow.document.close();
    //             }
    //         } catch (error) {
    //             alert("Erreur de chargement : "+error.message);
    //         }
    //     };

    // console.log(Analytics)
    const bottomSheetRef = useRef(null);
    return <BottomSheet ref={bottomSheetRef}>
{/* <KeyboardAvoidingView  behavior={Platform.OS==='ios'?'padding':'height'}> */}

    <ScrollView
        ref={viewRef}
        horizontal={false} 
        style={styles.container}
        refreshControl={<RefreshControl  refreshing={refreshing} onRefresh={refresh}/>}
    >

        <ChipProvider>
            <View  style={{fontSize:10,gap:5,minWidth:'100%',flexDirection:'column',/*flexWrap:'wrap',*/backgroundColor:'black',padding:10,borderRadius:5,marginTop:10,}}>
                <View style={{fontSize:10,minWidth:'100%',maxWidth:'100%',flexDirection:'row',flexWrap:'wrap',marginBottom:10,}}>
                    <Pressable onPress={()=>navigation.dispatch(DrawerActions.openDrawer())} style={styles.period}>
                        <Text style={{...styles.periodText,paddingVertical:8,borderBottomLeftRadius:4,borderTopLeftRadius:4,}}>{'Du '+ startedAt.toUpperCase()}</Text>
                        <Text style={{...styles.periodText,paddingVertical:8,borderTopRightRadius:4,borderBottomRightRadius:4,}}>{'au  '+ endedAt.toUpperCase()}</Text>
                    </Pressable>
                    <MyChipp product={null} clooned={clooned} render={()=>setProduct(null)} />
                    
                </View>
                
                {isDrop && <View style={{fontSize:10,gap:5,minWidth:'100%',flexDirection:'row',flexWrap:'wrap',paddingHorizontal:10,backgroundColor:'black',marginTop:-5,borderRadius:5,}}>
                {productsAndCounts && productsAndCounts.map((item,index)=>{
                    const {estFormule,nameToDisplay}=isFormule(item);const produit=estFormule?nameToDisplay:item.name;
                    return <MyChipp key={index} clooned={clooned} product={item} render={()=>setProduct(produit)} />})}
                </View>}
                <TouchableOpacity
                        style={{position:'absolute',right:20,top:8,backgroundColor:'rgba(255,255,255,0.2)',width:'auto',height:"auto",padding:10,borderWidth:0.5,
                        borderColor:'grey',borderRadius:8,paddingVertical:8,margin:'auto',marginTop:4,}}
                        onPress={() => setIsDrop(!isDrop)}
                      >
                        <Text style={{color:isDrop?'grey':'white',textAlign:'center',fontSize:14,fontWeight:'bold',letterSpacing:-1,}}>{isDrop ? <FontAwesome5 name="eye-slash" size={20} color="white"/> : <FontAwesome5 name="eye" size={20} color ="white"/>}{' décomptes'}</Text>
                        {/* // <Indix Type="toOpen" clr="white"/> : <Indix Type="toClose" clr="white"/> */}
                </TouchableOpacity>
            </View>
        </ChipProvider>
               
        <ScrollView horizontal={true} style={styles.table}>
            <SafeAreaProvider ref={safeAreaRef} style={{...styles.safeAreaView,maxWidth:'80%',marginHorizontal:"10%",marginVertical:10,minWidth:isLarge?1000:1000,}}>
                <CurrentProductsProvider>
                    <AnalysedListe product={product} rend={(data)=>{refresh();setProductsAndCounts(productsAndCountsFormat(data))}}/>
                    {/* <Table current={false} product={product} navigation={navigation} rend={(data)=>{refresh();setProductsAndCounts(productsAndCountsFormat(data))}} render={()=>setModalShow(true)} API_URL={api_url} headers={headers}/> */}
                </CurrentProductsProvider>
            </SafeAreaProvider>
        </ScrollView>
    </ScrollView>
    </BottomSheet>
}


export const UPNavigator=()=>{
    return (<CurrentProductedProvider>
            <ItemToSaveProvider>
                    <Stack.Navigator screenOptions={{headerShown: false,}}>
                        <Stack.Screen name="Accueil" children={() => <PoudreFull/>}/>
                        <Stack.Screen name="analyses/poudres/updatePoudres" children={({navigation,route}) => <Text>test</Text>} options={{presentation:'transparentModal'}}/>
                    </Stack.Navigator>
            </ItemToSaveProvider>
        </CurrentProductedProvider>
    )}

const styles=StyleSheet.create({
    container: {
        paddingHorizontal:5,
        // flex:1,
        // maxHeight:screenHeight*0.8, //0.6

        // ...Flex('column','flex-start','flex-start'),
      },
      everageColumn:{flex:1/5,color:'black',paddingLeft:20,fontWeight:'bold',fontSize:11,color:"black",borderRightColor:'black',borderRightWidth:1},
      period:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        // gap:-8,
        marginRight:6,
        padding:2,
        borderWidth:0.5,
        borderColor:'white',
        borderRadius:6,
      },
    chips: {
        // ...Flex(1/5,'flex-start','flex-start'),
        display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center',
        gap:5,
        flexWrap:'wrap',
        width:'100%',
        paddingHorizontal:15,
        paddingVertical:10,
        backgroundColor:'rgba(0,0,0,0.1)',
        borderRadius:5,
      },
    table: {
        // overflow:'scroll',
        // maxHeight:'78vh',
        // minHeight:'70vh',
        // maxWidth:865,//a remplacé =//maxWidth:'100%',
        maxWidth:'100%',
        width:'100%',
        // height:'100%',
        // maxHeight: screenHeight * 0.78,
        // minHeight: screenHeight * 0.70,
      },
    safeAreaView:{
        width:'100%',
        // minWidth:1000, //a)
        // minWidth:865, //a remplacé a)
        // maxWidth:865,//added
      },
    periodText:{
        fontSize:12,
        backgroundColor:'rgba(250,250,250,0.5)',
        color:'black',
        paddingHorizontal:10,
        fontWeight:'bold',
    }
})


            // <Button
            //       icon="file-pdf"
            //       mode="contained"
            //     //   onPress={() => {
            //     //             if (Platform.OS !== 'web' && viewRef.current) {
            //     //                 const nodeHandle = findNodeHandle(viewRef.current);
            //     //                 generatePDF(nodeHandle);
            //     //             }
            //     //             }}
            //     onPress={async () => {
            //         if (Platform.OS === 'web') {
            //             setTimeout(async () => {
            //             const uri = await generateWebPDF();
            //             }, 500);
            //         }
            //         }}
            //       style={{marginTop:50,fontWeight:'bold',}}
            //       title='PDF Rows'
            // />