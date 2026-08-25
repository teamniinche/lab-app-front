
import {useRef,useLayoutEffect,useEffect,useState} from 'react';
import {View,Text,useWindowDimensions,ScrollView,Pressable,RefreshControl,TouchableOpacity,KeyboardAvoidingView,Platform,Button,StyleSheet} from 'react-native';
import { useSelector,useDispatch} from 'react-redux';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DrawerActions} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {CurrentProductsProvider,ChipProvider,CurrentProductedProvider,ItemToSaveProvider,usePopup,useEverages,usePowderEverages} from '../wrappers/contexts';
import { AnalysedListe } from '../../navigators/DrawerPoudre';
import WinDim from '../../assets/operatingData';
import { MyChipp,Filter } from '../chip';
import Filters from '../../kernel/classes/formatTablesAnalysesPoudre';
import { productsAndCountsFormat,Flex, isFormule } from '../../assets/functions';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomSheet from '../modaux.js/bottomSheet';
// import getNormesLansas from '../../hooks/fetchNormes/normesLansas';
import { dbBaseRoot } from '../../assets/constantes';
const Stack=createNativeStackNavigator();
const {isLarge,screenHeight}=WinDim;

export default PoudreFull=({navigation/*,route*/,routeNheaders})=>{
    const viewRef=useRef();
    const safeAreaRef=useRef();
    // const {buildAnalytics}=useEverages();
    const {api_url,headers}=routeNheaders;
    // const [modalShow,setModalShow]=useState(false);
    const {startedAt,endedAt,postedAnalyses,clooned}= useSelector(state => {
        const {startedAt,endedAt}=state.period.targetPeriod;
        const postedAnalyses=state.data.postedAnalyses;
        const clooned=state.actived.clooned;
        return {startedAt,endedAt,postedAnalyses,clooned};});
    
    const {buildAnalytics}=useEverages();
    const {buildPowderAnalytics}=usePowderEverages();
    const [productsAndCounts,setProductsAndCounts]=useState(null);
    // const [analysesCount,setAnalysesCount]=useState(null)
    const [product,setProduct]=useState(null);
    const [toPrint,setToPrint]=useState({});
    const [toDisplayPrint, setToDisplayPrint] = useState([]);
    const [titre,setTitre]=useState('');
    const [refreshing,setRefreshing]=useState(false);
    const [isDrop,setIsDrop]=useState(false);
    const {setPop}=usePopup();
    // {product_mois_date,mois_date_product,isValidated_mois_date_product}
    const filter=new Filters();
    const dataFilters=[
        {name:'NoC',data:filter.isValidated_mois_date_product(toPrint),active:true},//suivant Non conforme par produit
        {name:'Per',data:filter.mois_date_product(toPrint),active:true},// sur une periode donnée
        {name:'Pro',data:filter.product_mois_date(toPrint),active:true},//suivant produit

        // {name:'/Mois',data:filter.date_dep_engine(toPrint),active:true},//suivant melanges par date/mois
        // {name:'Dep.',data:filter.dep_date_engine(toPrint),active:true},// suivant departement
        // {name:'DANC',data:filter.dep_isValidated_mois_date(toPrint),active:false},//suivant Non conforme par departement
        // {name:'Mel./L',data:filter.mois_date_dep_engine(toPrint),active:true},//suivant melangeurs/longue periode
        // {name:'Mel.',data:filter.dep_engine_mois_date_isValidated(toPrint),active:true},// melanges non conformes par melangeur/longue periode
        // {name:'P.F.',data:filter.dep_mois_date_product(toPrint),active:true},//melanges avec name filtrer/longue periode
        // {name:'Op.',data:filter.chemist_mois_date(toPrint),active:false}//suivant Operateur
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
                const count=Object.values(object).length;
                return `<h3 class="key3">${key}<span style="display:inline-block;background-color:blue;font-weight:bold;font-size:14px;border-radius:50%;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:white;border:1px solid grey">${count}</span><h3>
                    </div>
                        ${Object.entries(object).map(([k,item]) => {
                            var it=item || item[0];
                            const {id,updatedAt, createdAt,...rest} = it;
                            return `<p style="margin-left:5px;color:${clr};font-size:${Platform.OS!=='web'?'14px':'15px'};letter-spacing:0.7px;border-bottom:${Platform.OS==='web' && `1px solid grey`};">
                                        ${Time(createdAt)}
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
        // const months=['Janvier','Fèvrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
        try {
            // //(toDisplayPrint)
            const {count,delth,items}=toDisplayPrint;
            // var titre=product?("Mélanges de "+ `<span style="font-size:18px;font-weight:bold;text-decoration:underline;color:${Colors[colorFromName(product)]};">${product.toUpperCase()}</span>`+" sur cette période choisie"):"Tous sur cette période choisie";
            const html =`
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
                    .pCounts{color:rgba(0,0,0,0.4);padding-left:100px;}
                </style>
                <html>
                <body>
                    <h1>Rapport d'analyses du ${dateFr(startedAt)} au ${dateFr(endedAt)}</h1>
                    ${`<li>Nombre d'analyses enregistrées <span class="counts">${count}</span></li>`}
                    <div style="font-size:14px;">
                        
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
                // alert("Erreur de chargement : "+error.message);
                //(error);
            }
        };

   

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => { bottomSheetRef.current?.snapToPosition('100%')}//snapToIndex(2);}//.snapToPosition('50%'):bloque le handle;// || '25%' || '50%' || '75%'
    
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

    <TouchableOpacity  onPress={handleOpenPress} style={{position:'absolute',right:20,top:0.61*screenHeight,height:65,borderWidth:1,borderColor:'whitesmoke',paddingHorizontal:8,paddingVertical:8,borderRadius:10,backgroundColor:"rgba(155, 0, 0, 0.7)",}} >
                <Text style={{fontWeight:800,letterSpacing:-2,fontSize:16,color:"whitesmoke",paddingVertical:6,paddingHorizontal:2,borderBottomWidth:4,borderTopWidth:4,borderRadius:16,borderColor:'whitesmoke'}}>MOY</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{position:'absolute',right:20,top:0.71*screenHeight,backgroundColor:'rgba(155,0,0,0.7)',padding:8,borderRadius:10,}}
            onPress={async () => {setTimeout(async () => {
                                await generatePDF();
                            },500);
                        }}
            >
                <Text ><FontAwesome5 name="file-pdf" size={50} color="white"/></Text>
            </TouchableOpacity>

    </BottomSheet>
}


export const UPNavigator=({routeNheaders})=>{
    return (<CurrentProductedProvider>
            <ItemToSaveProvider>
                    <Stack.Navigator screenOptions={{headerShown: false,}}>
                        <Stack.Screen name="Accueil" children={() => <PoudreFull routeNheaders={routeNheaders}/>}/>
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