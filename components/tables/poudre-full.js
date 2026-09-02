import {useRef,useLayoutEffect,useEffect,useState} from 'react';
import {View,Text,useWindowDimensions,ScrollView,Pressable,RefreshControl,TouchableOpacity,KeyboardAvoidingView,Platform,Button,StyleSheet} from 'react-native';
import { useSelector,useDispatch} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DrawerActions} from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {CurrentProductsProvider,ChipProvider,CurrentProductedProvider,useCurrentProducted,ItemToSaveProvider,usePopup,useEverages,usePowderEverages} from '../wrappers/contexts';
import { AnalysedListe } from '../../navigators/DrawerPoudre';
import { MyChipp,Filter } from '../chip';
import FiltersP from '../../kernel/classes/formatTablesAnalysesPoudre';
import { productsAndCountsFormat,Flex,VALEURSPOUDRE,isFormule,moy,keyReduce } from '../../assets/functions';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomSheet from '../modaux.js/bottomSheet';
import WinDim from '../../assets/operatingData';
import {Time } from '../../hooks/littleBiblio';
import Colors from '../../assets/colors';
import { dbBaseRoot } from '../../assets/constantes';
const Stack=createNativeStackNavigator();
const {isLarge,screenHeight}=WinDim;

export default PoudreFull=({navigation,routeNheaders})=>{
    const viewRef=useRef();
    const safeAreaRef=useRef();
    const {api_url,headers}=routeNheaders;
    const {startedAt,endedAt,postedAnalyses,clooned}= useSelector(state => {
        const {startedAt,endedAt}=state.period.targetPeriod;
        const postedAnalyses=state.data.postedAnalyses;
        const clooned=state.actived.clooned;
        return {startedAt,endedAt,postedAnalyses,clooned};});
    
    const {buildAnalytics}=useEverages();
    const {buildPowderAnalytics}=usePowderEverages();
    const {toDisplayPrint, setToDisplayPrint,toPrint,setToPrint}=useCurrentProducted();
    const [productsAndCounts,setProductsAndCounts]=useState(null);
    const [product,setProduct]=useState(null);
    // const [toPrint,setToPrint]=useState({});
    // const [toDisplayPrint, setToDisplayPrint] = useState([]);
    const [titre,setTitre]=useState('');
    const [refreshing,setRefreshing]=useState(false);
    const [isDrop,setIsDrop]=useState(false);
    const {setPop}=usePopup();
    const filter=new FiltersP();
    const dataFilters=[
        {name:'NoC',data:filter.isValidated_mois_date_product(toPrint),active:true},//suivant Non conforme par produit
        {name:'Per',data:filter.mois_date_product(toPrint),active:true},// sur une periode donnée
        {name:'Pro',data:filter.product_mois_date(toPrint),active:true},//suivant produit
    ];

        // ============== POUR L'IMPRESSION SEULEMENT ============
    useLayoutEffect(()=>{
        fetch(`${api_url}?page=1&limit=10000&startedAt=${startedAt}&endedAt=${endedAt}`)
        .then(response=>response.json())
        .then(data=>{
            try{
                const toPrintAnalyses=product?data.analyses.filter(item=>item.name.includes(product)):data.analyses;
                buildAnalytics(postedAnalyses);
                buildPowderAnalytics(toPrintAnalyses);
                // const toPrintAnal=JSON.stringify(filter.dep_date_engine(toPrintAnalyses));
                const toPrintAnal=filter.mois_date_product(toPrintAnalyses);
                setToDisplayPrint(toPrintAnal);////(toPrintAnal);
                setToPrint(toPrintAnalyses);
            }catch(error){throw new Error(error.message);}
    
    })
    .catch(function(error){setPop({show:true,message:"Erreur de chargement : "+error.message,code:'#880000'})})
    },[product,api_url,startedAt,endedAt]);
    // =======================================================

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
    
    const terminate=({key,object}) => {
                const valeurs=['nChar','humidite','matiere_active','alcanite','gg','silicate','sel','densite'];
                const [premier,...rest]=valeurs;
                const count=Object.values(object).length;
                return `<h3 class="key3">${key.toUpperCase()}<span style="display:inline-block;background-color:rgba(0,0,0,0.1);font-weight:bold;font-size:14px;border-radius:50%;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:black;border:1px solid grey">${count}</span><h3>
                    
                    <h3 class="key3">${' Moyennes '+rest.map(r=>{
                    return `<span style="margin:15px;">${keyReduce(r)+': ' +moy(Object.values(object),r)}</span>`})}<h3>
                    <div>
                        ${Object.entries(object).map(([k,item]) => {
                            var it= item[0] || item;
                            const {id,updatedAt,createdAt,identifier,type,categorie,taches,...rest} = it;
                            const vallues = VALEURSPOUDRE(rest,valeurs);
                            return `<p style="margin-left:5px;color:'grey';font-size:${Platform.OS!=='web'?'12px':'15px'};text-wrap:nowrap;text-overflow: ellipsis;letter-spacing:0.7px;border-bottom:${Platform.OS==='web' && `1px solid grey`};">
                                        ${Time(createdAt)}${vallues}
                                    </p>`;
                            }).join("")}
                    </div>`};

    const dateFr=(date)=>{
            const months={Jan:"Janvier",Fev:"Fèvrier",Mar:"Mars",Apr:"Avril",May:"Mai",Jun:"Juin",Jul:"Juillet",Aug:"Aout",Sep:"Septembre",Oct:"Octobre",Nov:"Novembre",Dec:"Décembre"};
            const splitDate=date.toString().split(" ");
            const frDate=splitDate[2]+" "+months[splitDate[1]]+" "+splitDate[3];
            return `<span style="font-size:18px;border:1px dotted blue;border-radius:5px;padding:5px;padding-left:15px;padding-right:15px;color:grey;font-weight:bold;">${frDate}</span>`;
        };
    
    
    const generatePDF = async () => {
         try {
            const {count,delth,items}=toDisplayPrint;const html =`
                <style>
                    html{margin:0px;padding:0px;}
                    body { font-family: Arial, sans-serif; font-size: 14px;padding:15px; }
                    h1 {text-align:center;margin:5px;margin-top: 15px; color: #07108fff;font-size:14; }
                    h2 { margin-top: 20px; color: #2c3e50; }
                    ul { width:100%;list-style-type: none; padding-left: 0; }
                    li {text-align:center; margin: 4px 15px; padding: 6px; border-bottom: 1px solid #ddd; }
                    .header{display:inline-block;width:6.5%;text-align:center;font-size:8px;color:rgba(0,0,0,0.5);margin:8px;}
                    h4 { margin-top: 20px; color: #2c3e50; }
                    .key1{font-size:16px;color:rgba(0,0,0,0.8);margin: 4px 15px;margin-left:2px;padding: 6px;border-bottom: 1px solid #444; }
                    .key2{font-size:14px;color:rgba(0,0,0,0.5);margin:8px;margin-left:6px;}
                    .key3{font-size:14px;color:rgba(0,0,0,0.2);margin:8px;margin-left:10px;}
                    .counts{display:inline-block;background-color:blue;font-weight:bold;font-size:14px;border-radius:50%;border:2px solid blue;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:white;}
                    .counts1{display:inline-block;background-color:grey;font-weight:bold;font-size:14px;border-radius:50%;border:2px solid blue;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:blue;}
                    .counts2{display:inline-block;background-color:rgba(0,0,0,0.3);font-weight:bold;font-size:14px;border-radius:50%;border:2px solid blue;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:black;}
                    .counts3{display:inline-block;background-color:rgba(0,0,0,0.1);font-weight:bold;font-size:14px;border-radius:50%;border:2px solid blue;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:black;}
                    .pCounts{color:rgba(0,0,0,0.4);padding-left:100px;}
                </style>
                <html>
                <body>
                    <h1>Rapport d'analyses du ${dateFr(startedAt)} au ${dateFr(endedAt)}</h1>
                    ${`<li>Nombre d'analyses enregistrées <span class="counts">${count}</span></li>`}
                    <div style="font-size:14px;">
                        ${items.map(object1 => {
                            const {count,...rest1}=object1;
                            const firstCount=count;
                            return `<div >${Object.entries(rest1).map(([key2,object2]) => {
                                const {count,...rest}=object2;
                                return `<h3 class="key1">👉 ${key2} <span class="counts" style="border:3px solid grey">${firstCount}</span></h3>
                                <div>
                                    ${Object.entries(rest).map(([key3,object3]) => {
                                        const {count,...rest3}=object3;
                                        return `<div>
                                            ${Object.entries(rest3).map(([key4,object4]) => {
                                                const {count,...rest4}=object4;
                                                const item4=Object.values(rest4)[0].name;
                                                // }
                                                // var bool4=(item4!==null && item4!==undefined);
                                                return item4?terminate({key:key4,object:rest4}):`<h3 class="key2">${key4}<h3>
                                                <div>
                                                    ${Object.entries(rest4).map(([key5,object5]) => {
                                                        const {count,...rest5}=object5;
                                                        const item5=Object.values(rest5)[0]?.name;
                                                        // var bool5=(item5!==null && item5!==undefined);
                                                        return item5?terminate({key:key5,object:rest5}):`<h3 class="key3">${key5}<span class="counts1" style="border:1px solid grey">${count}</span><h3>
                                                            </div>
                                                                ${Object.entries(rest5).map(([key6,object6]) => {
                                                                    const {count,...rest6}=object6;
                                                                    const item6=Object.values(rest6)[0].name;
                                                                    // var bool6=(item6!==null && item6!==undefined);
                                                                    return item6?terminate({key:key6,object:rest6}):`<h3 class="key3">${key6}<span class="counts2" style="border:1px solid grey">${count}</span><h3>
                                                                        </div>
                                                                            ${Object.entries(rest6).map(([key7,object7]) => {
                                                                                const {count,...rest7}=object7;
                                                                                const item7=Object.values(rest7)[0].name;//alert(item7);
                                                                                // var bool7=(item7!==null && item7!==undefined);
                                                                                return item7?terminate({key:key7,object:rest7}):`<h3 class="key3">${key7}<span class="counts3" style="border:1px solid grey">${count}</span><h3>
                                                                                    </div>
                                                                                        ${Object.entries(rest7).map(([key8,object8]) => {
                                                                                            const {count,...rest8}=object8;
                                                                                            const item8=Object.values(rest8)[0].name;//alert(item7);
                                                                                            // var bool8=(item8!==null && item8!==undefined);
                                                                                            return item8?terminate({key:key8,object:rest8}):`<h3 class="key3">${key8+'  '+count}<h3>`
                                                                                        }).join("")}
                                                                                    </div>`
                                                                            }).join("")}
                                                                        </div>`
                                                                }).join("")}
                                                            </div>`
                                                    }).join("")}
                                                </div>`
                                            }).join("")}
                                        </div>`
                                    }).join("")}
                                <div>`
                            }).join("")}
                            <div>`
                        }).join("")}
                    </div>
                    ${Platform.OS==='web' && `<script>
                        window.onload=function(){
                            window.print();
                            window.close();
                        }
                    </script>`}
                </body>
            </html>`;
                if(Platform.OS!=='web'){
                    const { uri } = await Print.printToFileAsync({ html });
                    if(await Sharing.isAvailableAsync()){await Sharing.shareAsync(uri);}
                    return uri;
                }else{
                    const newWindow=window.open("","_blank");
                    newWindow.document.write(html);
                    newWindow.document.close();
                }
            } catch (error) {
                setPop({show:true,message:error.message,code:'#880000'});
                //(error);
            }
        };

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => { bottomSheetRef.current?.snapToPosition('100%')}//snapToIndex(2);}//.snapToPosition('50%'):bloque le handle;// || '25%' || '50%' || '75%'
    
return <BottomSheet ref={bottomSheetRef}>

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
                    
                    {dataFilters.map((o,index)=>{
                        const {name,data,active}=o;
                        return <Filter key={index} active={active} title={name} text={titre} render={(txt)=>{setToDisplayPrint(data);setTitre(txt)}} />
                    })}
                    
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
                </TouchableOpacity>
            </View>
        </ChipProvider>

                        <Pressable
                            disabled={false/*!allowTo("ajouter une norme|user",targetUser?.privileges)*/}
                                style={
                                    {
                                        width:50,
                                        paddingHorizontal:10,
                                        paddingVertical:10,
                                        marginVertical:15,
                                        marginHorizontal:20,
                                        borderRadius:10,
                                        backgroundColor:'rgba(0,0,0,0.2)',
                                    }
                                }

                            onPress={()=>navigation.navigate("analyses/poudres/graphes")}
                        >
                            <FontAwesome5 size={20} name="chart-bar" color='blue'/>
                        </Pressable>

        <ScrollView horizontal={true} style={styles.table}>
            <SafeAreaProvider ref={safeAreaRef} style={{...styles.safeAreaView,maxWidth:'80%',marginHorizontal:"10%",marginVertical:10,minWidth:isLarge?1000:1000,}}>
                <CurrentProductsProvider>
                    <AnalysedListe product={product} rend={(data)=>{refresh();setProductsAndCounts(productsAndCountsFormat(data))}}/>
                </CurrentProductsProvider>
            </SafeAreaProvider>
        </ScrollView>
    </ScrollView>

            <TouchableOpacity  onPress={handleOpenPress} style={styles.moy} >
                <Text style={styles.moy_text}>MOY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pdf} onPress={async () => {setTimeout(async () => {await generatePDF();},500);}}>
                <Text ><FontAwesome5 name="file-pdf" size={50} color="white"/></Text>
            </TouchableOpacity>

    </BottomSheet>
}


export const UPNavigator=({routeNheaders})=>{
    return (<CurrentProductedProvider>
            <ItemToSaveProvider>
                    <Stack.Navigator screenOptions={{headerShown: false,}}>
                        <Stack.Screen name="Accueil" children={({navigation}) => <PoudreFull navigation={navigation} routeNheaders={routeNheaders}/>}/>
                        <Stack.Screen name="analyses/poudres/graphes" children={({navigation,route}) => <GraphesPoudre navigation={navigation}/>} />
                        {/* <Stack.Screen name="analyses/poudres/updatePoudres" children={({navigation,route}) => <Text>test</Text>} options={{presentation:'transparentModal'}}/> */}
                    </Stack.Navigator>
            </ItemToSaveProvider>
        </CurrentProductedProvider>
    )}

// export const UPNav=({routeNheaders})=>{
//     return (
//             <Stack.Navigator screenOptions={{headerShown: false,}}>
//                 <Stack.Screen name="Accueil" children={() => <UPNavigator routeNheaders={routeNheaders}/>}/>
//             </Stack.Navigator>
//     )}

const GraphesPoudre = ({navigation}) => {

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerLeft:()=>(
                <TouchableOpacity style={{width:80,margin:0,marginLeft:30,backgroundColor:'transparent',}} onPress={() => navigation.goBack()}>
                    <FontAwesome5 name='arrow-left' size={20} color='white'/>
                </TouchableOpacity>
            )
        })
    })

    return <View style={styles.graphes}>
                <ScrollView style={{height:'100%',width:'100%',minWidth:700,}}>
                    <View style={styles.graphes_parent}>
                    </View>
                </ScrollView>
        </View>
};


const styles=StyleSheet.create({
    graphes:{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:'auto',
        minWidth:1000
    },
    graphes_parent:{
                        marginTop:20,
                        minWidth:'100%',
                        padding:15,
                        flexDirection:'column',
                        alignItems:'flex-start',
                        justifyContent:'flex-start',
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        borderRadius:10,
                        backgroundColor:'rgba(255,255,255,0.7)',
    },
    moy:{
        position:'absolute',
        right:20,
        top:0.61*screenHeight,
        height:65,
        borderWidth:1,
        borderColor:'whitesmoke',
        paddingHorizontal:8,
        paddingVertical:8,
        borderRadius:10,
        backgroundColor:"rgba(155, 0, 0, 0.7)",
    },
    moy_text:{
            fontWeight:800,
            letterSpacing:-2,
            fontSize:16,
            color:"whitesmoke",
            paddingVertical:6,
            paddingHorizontal:2,
            borderBottomWidth:4,
            borderTopWidth:4,
            borderRadius:16,
            borderColor:'whitesmoke'
        },
    pdf:{
            position:'absolute',
            right:20,
            top:0.71*screenHeight,
            backgroundColor:'rgba(155,0,0,0.7)',
            padding:8,
            borderRadius:10,
        },
    container: {
        paddingHorizontal:5,
      },
      everageColumn:{flex:1/5,color:'black',paddingLeft:20,fontWeight:'bold',fontSize:11,color:"black",borderRightColor:'black',borderRightWidth:1},
      period:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginRight:6,
        padding:2,
        borderWidth:0.5,
        borderColor:'white',
        borderRadius:6,
      },
    chips: {
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
        maxWidth:'100%',
        width:'100%',
      },
    safeAreaView:{
        width:'100%',
      },
    periodText:{
        fontSize:12,
        backgroundColor:'rgba(250,250,250,0.5)',
        color:'black',
        paddingHorizontal:10,
        fontWeight:'bold',
    }
})