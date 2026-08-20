// CALLED PACKAGES
import {View,Text,useWindowDimensions,ScrollView,Pressable,RefreshControl,
    TouchableOpacity,KeyboardAvoidingView /*,findNodeHandle*/,Platform,Button,StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useRef,useLayoutEffect,useEffect,useState} from 'react';
import { DrawerActions} from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import {useDispatch,useSelector} from 'react-redux';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
// COMPONENTS
import ModalMesures from '../modaux.js/modalMesures';
import BottomSheet from '../modaux.js/bottomSheet';
import { Indix } from '../CustomDrawerContent';
import { MyChip,Filter } from '../chip';
import { Periodes } from '../periode';
import { clooner } from '../accueil';
import Table from './componentTable'
import Pop from '../popup';
// DATA STATEMENTS && UTILS
import { ChipProvider,CurrentProductsProvider,useEverages,usePopup,usePowderEverages,useReservs } from '../wrappers/contexts';
import {colorFromName,VALEURS,productsAndCountsFormat,Flex } from '../../assets/functions' ;
import Filters from '../../kernel/classes/formatTablesAnalyses';
import { setPeriod} from '../store/reducers/periodReducer';
import { primaryColor,dbBaseRoot } from '../../assets/constantes';
import WinDim from '../../assets/operatingData';
import {Time } from '../../hooks/littleBiblio';// remplacer GroupItems par des filtres dynamiques demain Incha Allah
import Colors from '../../assets/colors';

const Stack=createNativeStackNavigator();
const {isLarge,screenHeight}=WinDim;
const {aujourdhui,demain}=Periodes();

export default TableFull=({navigation/*,route*/,routeNheaders})=>{
    const viewRef=useRef();
    const safeAreaRef=useRef();
    const {setPop}=usePopup();
    const {buildAnalytics}=useEverages();
    const {api_url,headers}=routeNheaders;
    const {startedAt,endedAt,powderAnalysed,clooned}= useSelector(state => {
        const {startedAt,endedAt}=state.period.targetPeriod;
        const powderAnalysed=state.powderAnalysed.powderAnalysed;
        const clooned=state.actived.clooned;
        return {startedAt,endedAt,powderAnalysed,clooned};});
    const {buildPowderAnalytics}=usePowderEverages();
    const [modalShow,setModalShow]=useState(false);
    const [productsAndCounts,setProductsAndCounts]=useState(null);
    const [product,setProduct]=useState(null)
    const [refreshing,setRefreshing]=useState(false);
    const [isDrop,setIsDrop]=useState(false);
    const [toPrint, setToPrint] = useState({});
    const [toDisplayPrint, setToDisplayPrint] = useState([]);
    const [titre,setTitre]=useState('');
    const filter=new Filters();
    const dataFilters=[
        {name:'/Mois',data:filter.date_dep_engine(toPrint),active:true},//suivant melanges par date/mois
        {name:'Dep.',data:filter.dep_date_engine(toPrint),active:true},// suivant departement
        // {name:'DANC',data:filter.dep_isValidated_mois_date(toPrint),active:false},//suivant Non conforme par departement
        {name:'Mel./L',data:filter.mois_date_dep_engine(toPrint),active:true},//suivant melangeurs/longue periode
        {name:'Mel.',data:filter.dep_engine_mois_date_isValidated(toPrint),active:true},// melanges non conformes par melangeur/longue periode
        {name:'P/D',data:filter.dep_engine_mois_date_product(toPrint),active:false},// suivant Produits par departement
        {name:'P',data:filter.product_mois_date(toPrint),active:true},//suivant produit/longue periode
        {name:'P.F.',data:filter.dep_mois_date_product(toPrint),active:true},//melanges avec name filtrer/longue periode
        {name:'A.NC/P',data:filter.product_isValidated(toPrint),active:false},//suivant Non conforme par produit
        {name:'Op.',data:filter.chemist_mois_date(toPrint),active:false}//suivant Operateur
    ];

    // ============== POUR L'IMPRESSION SEULEMENT ============
    useLayoutEffect(()=>{
          fetch(`${api_url}?page=1&limit=10000&startedAt=${startedAt}&endedAt=${endedAt}`)
        .then(response=>response.json())
        .then(data=>{const toPrintAnalyses=product?data.analyses.filter(item=>item.name.includes(product)):data.analyses;
          buildAnalytics(data.analyses);buildPowderAnalytics(powderAnalysed);
        // const toPrintAnal=JSON.stringify(filter.dep_date_engine(toPrintAnalyses));
        const toPrintAnal=filter.dep_date_engine(toPrintAnalyses);
        setToDisplayPrint(toPrintAnal);////(toPrintAnal);
        setToPrint(toPrintAnalyses);
    
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
                            const {id,updatedAt,parfum,color,observations,commentaires,categorie,
                                    createdAt,validation,Utilisateur,
                                    ...rest} = it;
                            const validateur = validation?.Utilisateur?.pseudo || "";
                            const chemist = Utilisateur?.pseudo || "";
                            const valeurs=['ph','matiere_active','viscosite','densite','silicate','caustique','durete'];
                            const vallues = VALEURS(rest,valeurs);
                            const clr=Colors[colorFromName(it.name)]==='white'?'grey':Colors[colorFromName(it.name)];
                            return `<p style="margin-left:5px;color:${clr};font-size:${Platform.OS!=='web'?'14px':'15px'};letter-spacing:0.7px;border-bottom:${Platform.OS==='web' && `1px solid ${Colors[colorFromName(it.name)]}`};">
                                        ${Time(createdAt)}${vallues} -- ${chemist}${
                                        validation?" -- ✔ ":""}${validation?' -- '+validateur:""}
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
                    <ul>
                        ${headers.map((header, index) => (index<=10?
                            `<span class="header"  key=${index}>
                            ${header.toUpperCase()}
                            </span>`:""
                        )).join("")}
                    </ul>
                    <div style="font-size:14px;">
                        ${items.map(object1 => {
                            const {count,...rest1}=object1;
                            const firstCount=count;
                            return `<div >${Object.entries(rest1).map(([key2,object2]) => {
                                // const count2=Object.values(object2).length;
                                // const count2=object2.count;
                                const {count,...rest}=object2;
                                return `<h3 class="key1">👉 ${key2} <span class="counts" style="border:3px solid grey">${firstCount}</span></h3>
                                <div>
                                    ${Object.entries(rest).map(([key3,object3]) => {
                                        const {count,...rest3}=object3;
                                        return `<div>
                                            ${Object.entries(rest3).map(([key4,object4]) => {
                                                // var count4;var item4; var ob;
                                                // if(!object4.name){
                                                //     count4=object4.length;
                                                //     item4=object4.name;
                                                // }else{

                                                // const count4=Object.values(object4).length;
                                                const {count,...rest4}=object4;
                                                const item4=Object.values(rest4)[0].name;
                                                // }
                                                var bool4=(item4!==null && item4!==undefined);
                                                return bool4?terminate({key:key4,object:rest4}):`<h3 class="key2">${key4}<h3>
                                                <div>
                                                    ${Object.entries(rest4).map(([key5,object5]) => {
                                                        // const count5=Object.values(object5).length;
                                                        // const count5=object5.count;
                                                        const {count,...rest5}=object5;
                                                        const item5=Object.values(rest5)[0]?.name;
                                                        var bool5=(item5!==null && item5!==undefined);
                                                        return bool5?terminate({key:key5,object:rest5}):`<h3 class="key3">${key5}<span class="counts" style="border:1px solid grey">${count}</span><h3>
                                                            </div>
                                                                ${Object.entries(rest5).map(([key6,object6]) => {
                                                                    // const count6=Object.values(object6).length;
                                                                    // const count6=object6.count;
                                                                    const {count,...rest6}=object6;
                                                                    const item6=Object.values(rest6)[0].name;
                                                                    var bool6=(item6!==null && item6!==undefined);
                                                                    return bool6?terminate({key:key6,object:rest6}):`<h3 class="key3">${key6}<span class="counts" style="border:1px solid grey">${count}</span><h3>
                                                                        </div>
                                                                            ${Object.entries(rest6).map(([key7,object7]) => {
                                                                                // const count7=Object.values(object7).length;
                                                                                // const count7=object7.count;
                                                                                const {count,...rest7}=object7;
                                                                                const item7=Object.values(rest7)[0].name;//alert(item7);
                                                                                var bool7=(item7!==null && item7!==undefined);
                                                                                return bool7?terminate({key:key7,object:rest7}):`<h3 class="key3">${key7}<span class="counts" style="border:1px solid grey">${count}</span><h3>
                                                                                    </div>
                                                                                        ${Object.entries(rest7).map(([key8,object8]) => {
                                                                                            // const count8=Object.values(object8).length;
                                                                                            // const count8=object8.count;
                                                                                            const {count,...rest8}=object8;
                                                                                            const item8=Object.values(rest8)[0].name;//alert(item7);
                                                                                            var bool8=(item8!==null && item8!==undefined);
                                                                                            return bool7?terminate({key:key8,object:rest8}):`<h3 class="key3">${key8+'  '+count}<h3>`
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
                // alert("Erreur de chargement : "+error.message);
                //(error);
            }
        };

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

    // //(Analytics)
    const bottomSheetRef = useRef(null);
    // const handleClosePress = () => bottomSheetRef.current?.close();
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
                    <MyChip product={null} clooned={clooned} render={()=>setProduct(null)} />
                    
                    {dataFilters.map((o,index)=>{
                        const {name,data,active}=o;
                        return <Filter key={index} active={active} title={name} text={titre} render={(txt)=>{setToDisplayPrint(data);setTitre(txt)}} />
                    })}
                    
                </View>
                
                {isDrop && <View style={{fontSize:10,gap:5,minWidth:'100%',flexDirection:'row',flexWrap:'wrap',paddingHorizontal:10,backgroundColor:'black',marginTop:-5,borderRadius:5,}}>
                {productsAndCounts && productsAndCounts.map((item,index)=><MyChip key={index} clooned={clooned} product={item} render={()=>setProduct(item.name)} />)}
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
               
        <ScrollView horizontal={true} style={styles.table}
            // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
        >
            <SafeAreaProvider ref={safeAreaRef} style={{...styles.safeAreaView,maxWidth:'100%',minWidth:isLarge?1190:1000,}}>
                <CurrentProductsProvider>
                    <Table current={false} product={product} navigation={navigation} rend={(data)=>{refresh();setProductsAndCounts(productsAndCountsFormat(data))}} render={()=>setModalShow(true)} API_URL={api_url} headers={headers}/>
                </CurrentProductsProvider>
            </SafeAreaProvider>
        </ScrollView>

        {/* <ModalMesures  */}
        {/* navigation={navigation} route={route}  */}
        {/* bool={modalShow} render={()=>setModalShow(false)}  */}

        {/* /> */}
    </ScrollView>
        <TouchableOpacity  onPress={handleOpenPress} style={{position:'absolute',right:20,top:0.61*screenHeight,height:65,borderWidth:1,borderColor:'whitesmoke',paddingHorizontal:8,paddingVertical:8,borderRadius:10,backgroundColor:"rgba(155, 0, 0, 0.7)",}} >
            <Text style={{fontWeight:800,letterSpacing:-2,fontSize:16,color:"whitesmoke",paddingVertical:6,paddingHorizontal:2,borderBottomWidth:4,borderTopWidth:4,borderRadius:16,borderColor:'whitesmoke'}}>MOY</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={{position:'absolute',right:20,top:0.71*screenHeight,backgroundColor:'rgba(155,0,0,0.7)',padding:8,borderRadius:10,}}
        onPress={async () => {setTimeout(async () => {
                            await generatePDF();
                        }, 500);
                    }}
        >
    
            {/* <Button
                icon="file-pdf"
                mode="contained"
                onPress={async () => {
                    // if (Platform.OS !== 'web' && viewRef.current) {
                        setTimeout(async () => {
                            await generatePDF();
                        }, 500);
                    }}
                style={{fontWeight:'bold',color:'white',}}
                  title='générer le PDF'
            /> */}
            <Text ><FontAwesome5 name="file-pdf" size={50} color="white"/></Text>
        </TouchableOpacity>
        {/* <Pop/> */}
    </BottomSheet>
}

export const Everages=()=>{
    const {Analytics,analyticsLen}=useEverages();
    const {powderAnalytics,powderAnalyticsLen}=usePowderEverages();
    const {startedAt,endedAt,clooned}= useSelector(state => {
        const {startedAt,endedAt}=state.period.targetPeriod;
        const clooned=state.actived.clooned;
        // const powderFiltred=state.actived.powderFiltred;
        return {startedAt,endedAt,clooned};
    });
    const count=analyticsLen;
    const powderCount=powderAnalyticsLen;
    const dateFr=(date)=>{
            const months={Jan:"Janvier",Fev:"Fèvrier",Mar:"Mars",Apr:"Avril",May:"Mai",Jun:"Juin",Jul:"Juillet",Aug:"Aout",Sep:"Septembre",Oct:"Octobre",Nov:"Novembre",Dec:"Décembre"};
            const splitDate=date.toString().split(" ");
            const frDate=splitDate[2]+" "+months[splitDate[1]]+" "+splitDate[3];
            return `<span style="font-size:18px;border:1px dotted blue;border-radius:5px;padding:5px;padding-left:15px;padding-right:15px;color:grey;font-weight:bold;">${frDate}</span>`;
        }
    const dateFrRN=(date)=>{
            const months={Jan:"Janvier",Fev:"Fèvrier",Mar:"Mars",Apr:"Avril",May:"Mai",Jun:"Juin",Jul:"Juillet",Aug:"Aout",Sep:"Septembre",Oct:"Octobre",Nov:"Novembre",Dec:"Décembre"};
            const splitDate=date.toString().split(" ");
            const frDate=splitDate[2]+" "+months[splitDate[1]]+" "+splitDate[3];
            return frDate;
        }
    const generatePDF = async () => {
        try {
            const html =`
                <style>
                    html{margin:0px;padding:0px;}
                    body { font-family: Arial, sans-serif; font-size: 14px;padding:15px; }
                    h1 { margin:5px;margin-top: 15px; color: #07108fff; }
                    h2 { margin-top: 20px; color: #2c3e50; }
                    ul{display:flex;width:94%;height:auto;border:1px solid black;padding-top:10px;padding-bottom:10px;border-radius:1px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;}
                    h4 { margin-top: 20px; color: #2c3e50; }
                    .everageColumn{width:13%;padding-left:20px;font-weight:bold;font-size:11px;color:black;border-right:1px solid black;}
                    .everagePowderColumn{width:14%;padding-left:20px;font-weight:bold;font-size:11px;color:black;border-right:1px solid black;}
                    .counts{display:inline-block;background-color:blue;font-weight:bold;font-size:14px;border-radius:50%;border:2px solid blue;width:auto;height:auto;padding:10;margin-left:5px;margin-right:5px;color:white;}
                    .pCounts{color:rgba(0,0,0,0.4);padding-left:100px;}
                </style>
                <html>
                <body>
                    <h1 style="text-align:center;font-size:14;padding-bottom:30px;border-bottom:1px solid rgba(0,0,0,0.15);">Rapport d'analyses du ${dateFr(startedAt)} au ${dateFr(endedAt)}</h1>
                    <h2>👉 Analyses poudres</h2>
                    <p class="pCounts">
                    <span>ANALYSES DE </span>
                    <span class="counts">${powderCount}</span>
                    <span>MELANGES POUDRES</span>
                    </p>

                    <ul style="margin-bottom:0px">
                            <span class="everagePowderColumn" style="width:15%;">NChar.isoles</span>
                            <span class="everagePowderColumn" style="width:15%;">NChar.</span>
                            <span class="everagePowderColumn">Produit</span>
                            <span class="everagePowderColumn">Moy. Humidite</span>
                            <span class="everagePowderColumn">Moy. Gros grains</span>
                            <span class="everagePowderColumn">Moy. Matière active</span>
                            <span class="everagePowderColumn">Moy. Alcanite</span>
                    </ul>
                    <div style="font-size:14px;">
                    ${powderAnalytics && powderAnalytics.map((product,index)=>{return `<ul key=${index} style="border-color:rgba(0,0,0,0.2);border-top-width:0px;margin:0px">

                        <span class="everagePowderColumn" style="width:15%;color:grey;text-align:center">${product.isolated}</span>
                        <span class="everagePowderColumn" style="width:15%;color:grey;text-align:center">${product.count}</span>
                        <span class="everagePowderColumn" style="color:grey">${clooned?clooner(product.name):product.name}</span>
                        <span class="everagePowderColumn" style="color:grey">${product.gg}</span>
                        <span class="everagePowderColumn" style="color:grey">${product.humidite}</span>
                        <span class="everagePowderColumn" style="color:grey">${product.matiere_active}</span>
                        <span class="everagePowderColumn" style="border-right-width:0;color:grey">${product.alcanite}</span>

                    </ul>`}).join("")}

                    </div>
                    <h2>👉 Productions liquides & cosmetiques</h2>
                    <p class="pCounts">
                    <span>ANALYSES DE </span>
                    <span class="counts">${count}</span>
                    <span> MELANGES LIQUIDES & COSMETIQUES</span>
                    </p>

                    <ul style="margin-bottom:0px">
                            <span class="everageColumn" style="width:15%;padding-left:0;">Departement</span>
                            <span class="everageColumn" style="width:15%;padding-left:0;text-align:center;">Nbr. mél/Dep.</span>
                            <div style="width:70%;margin:0;display:flex;flex-direction:row;justify-content:flex-start;">
                                <span class="everageColumn">Nombre</span>
                                <span class="everageColumn" style="width:46%;">Produit</span>
                                <span class="everageColumn">Moy. pH</span>
                                <span class="everageColumn">Moy. Matière active</span>
                                <span class="everageColumn">Moy. Viscosité</span>
                            </div>
                    </ul>
                    <div style="font-size:14px;">
                    ${Analytics && Object.entries(Analytics).map(([key,item],index)=>{return key.split("_c_")[0]!=="0" && `<ul key=${index} style="border-color:rgba(0,0,0,0.2);border-top-width:0px;margin:0px;border-right-width:0">
                        <span class="everageColumn" style="width:15%;padding-left:0;">${key.split("_c_")[1]}</span>
                        <span class="everageColumn" style="width:15%;padding-left:0;text-align:center;">${key.split("_c_")[0]}</span>
                        <div class="everageColumn" style="width:70%;margin-left:0;display:flex;flex-direction:column;">${item.map((subitem,indx)=>{
                            const nom=subitem.name.split("_")[0];
                            const clr=Colors[colorFromName(nom)]==='white'?'grey':Colors[colorFromName(nom)];
                            return `<div style="margin:0;display:flex;width:100%;height:20px;border:1px solid black;border-right:none;border-color:${clr};border-top:none;padding:4px;padding-right:0;padding-left:0;border-radius:2px;flex-direction:row;align-items:center;justify-content:flex-start;">
                                <span class="everageColumn">${subitem.count}</span>
                                <span class="everageColumn" style="width:46%;">${clooned?clooner(nom):nom}</span>
                                <span class="everageColumn">${subitem.ph}</span>
                                <span class="everageColumn">${subitem.matiere_active !== undefined ? subitem.matiere_active : ''}</span>
                                <span class="everageColumn">${subitem.viscosite !== undefined ? subitem.viscosite : ''}</span>
                                </div>`
                        })}
                    </div>
                    </ul>`}).join("")}

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
        
    return  <>
        <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderColor:"rgba(0,0,0,0.1)",marginBottom:10,paddingVertical:10,paddingTop:0,paddingHorizontal:"15%",height:"auto"}}>
            <Text style={{fontSize:13,fontWeight:"bold",color:"grey"}}>Rapport d'analyses du
            <Text style={{width:"auto",marginHorizontal:10,fontSize:14,borderWidth:1,borderStyle:"dotted",borderColor:"blue",borderRadius:5,padding:5,paddingLeft:15,paddingRight:15,color:primaryColor,fontWeight:"bold"}}>{dateFrRN(startedAt)}</Text> au
            <Text style={{width:"auto",marginHorizontal:10,fontSize:14,borderWidth:1,borderStyle:"dotted",borderColor:"blue",borderRadius:5,padding:5,paddingLeft:15,paddingRight:15,color:primaryColor,fontWeight:"bold"}}>{dateFrRN(endedAt)}</Text>
            </Text>
            <TouchableOpacity
                    style={{alignSelf:'flex-end',backgroundColor:'rgba(0,0,0,0.6)',padding:8,borderRadius:10,}}
                    onPress={async () => {setTimeout(async () => {
                                        await generatePDF();
                                    }, 500);
                                }}
                >
                <Text ><FontAwesome5 name="file-pdf" size={25} color="white"/></Text>
            </TouchableOpacity>
        </View>
        <Text style={{paddingLeft:50,letterSpacing:2,fontSize:16,fontWeight:"bold",marginTop:20,textAlign:'left',width:"100%"}}>👉 Analyses poudres</Text>
            <Text style={{fontSize:10,fontWeight:"bold",color:"grey"}}>{"ANALYSES DE "+powderCount+" MELANGES POUDRES"}</Text>

        <View style={{fontSize:10,gap:1,minWidth:'100%',flexDirection:'row',flexWrap:'wrap',paddingVertical:15,paddingHorizontal:10,marginTop:-5,borderRadius:5,}}>
                    <View style={{width:"100%",height:30,borderWidth:1,borderColor:"black",paddingLeft:40,paddingVertical:4,borderRadius:1,marginRight:6,flexDirection:'row',alignItems:'center',gap:4,justifyContent:'center'}}>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>NChar.isoles</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>NChar.</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>Produit</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>Moy. Humidite</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>Moy. Gros grains</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>Moy. Matière active</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,borderRightWidth:0}]}>Moy. Alcanite</Text>
                    </View>
                    {powderAnalytics && powderAnalytics.map((item,index)=><BadgePowderEverage key={index} clooned={clooned} product={item}/>)}
                </View>


        <Text style={{paddingLeft:50,letterSpacing:2,fontSize:16,fontWeight:"bold",marginTop:20,textAlign:'left',width:"100%"}}>👉 Productions liquides & cosmetiques</Text>
            <Text style={{fontSize:10,fontWeight:"bold",color:"grey"}}>{"ANALYSES DE "+count+" MELANGES LIQUIDES & COSMETIQUES"}</Text>

        <View style={{fontSize:10,gap:1,minWidth:'100%',flexDirection:'row',flexWrap:'wrap',paddingVertical:15,paddingHorizontal:10,marginTop:-5,borderRadius:5,}}>
                    <View style={{width:"100%",height:30,borderWidth:1,borderColor:"black",paddingLeft:40,paddingVertical:4,borderRadius:1,marginRight:6,flexDirection:'row',alignItems:'center',gap:4,justifyContent:'center'}}>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>Departement</Text>
                        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0}]}>Nbr. mél/Dep.</Text>
                        <View style={{flex:5/7,flexDirection:"row"}}>
                            <Text style={styles.everageColumn}>Produit</Text>
                            <Text style={styles.everageColumn}>Nombre</Text>
                            <Text style={styles.everageColumn}>Moy. pH</Text>
                            <Text style={styles.everageColumn}>Moy. Matière active</Text>
                            <Text style={[styles.everageColumn,{borderRightWidth:0}]}>Moy. Viscosité</Text>
                        </View>
                    </View>
                    {Analytics && Object.entries(Analytics).map(([key,item],index)=>key.split("_c_")[0]!=="0" && <View key={index} style={{width:"100%",height:"auto",paddingLeft:40,flexDirection:"row",borderWidth:0.7,borderColor:"rgba(0,0,0,0.3)",borderTopWidth:0}}>
                    <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,alignContent:'center',textAlign:'center'}]}>{key.split("_c_")[1]}</Text>
                    <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,alignContent:'center',textAlign:'center'}]}>{key.split("_c_")[0]}</Text>
                    <View style={{flex:5/7,flexDirection:"column"}}>{item.map((subitem,indx)=><BadgeEverage key={indx} clooned={clooned} product={subitem}/>)}</View>
                    </View>)}
                </View>
                
                </>
}

const BadgeEverage=({product,clooned})=>{
    const nom=product.name.split("_")[0];
    const clr=Colors[colorFromName(nom)]==='white'?'grey':Colors[colorFromName(nom)];
        
    return <View style={{width:"100%",height:20,borderWidth:1,borderLeftWidth:0,borderRightWidth:0,borderColor:clr,borderTop:"none",paddingVertical:4,borderRadius:4,marginRight:6,flexDirection:'row',alignItems:'center',gap:4,justifyContent:'center'}}>
        <Text style={[styles.everageColumn,{color:"grey"}]}>{clooned?clooner(nom):nom}</Text>
        <Text style={[styles.everageColumn,{color:"grey"}]}>{product.count}</Text>
        <Text style={[styles.everageColumn,{color:"grey"}]}>{product.ph}</Text>
        <Text style={[styles.everageColumn,{color:"grey"}]}>{product.matiere_active}</Text>
        <Text style={[styles.everageColumn,{color:"grey",borderRightWidth:0}]}>{product.viscosite}</Text>
        </View>
}

const BadgePowderEverage=({product,clooned})=>{
    // const nom=product.name.split("_")[0];
    // const clr=Colors[colorFromName(nom)]==='white'?'grey':Colors[colorFromName(nom)];
        
    return <View style={{width:"100%",height:30,borderWidth:0.7,borderTopWidth:0,borderColor:"rgba(0,0,0,0.15)",paddingLeft:40,paddingVertical:4,borderRadius:1,marginRight:6,flexDirection:'row',alignItems:'center',gap:4,justifyContent:'center'}}>

    {/* <View style={{width:"100%",height:20,borderWidth:1,borderLeftWidth:0,borderRightWidth:0,borderColor:"grey",borderTop:"none",paddingVertical:4,borderRadius:4,marginRight:6,flexDirection:'row',alignItems:'center',gap:4,justifyContent:'center'}}> */}
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,color:"grey",textAlign:'center'}]}>{product.isolated}</Text>
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,color:"grey",textAlign:'center'}]}>{product.count}</Text>
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,color:"grey"}]}>{clooned?clooner(product.name):product.name}</Text>
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,color:"grey"}]}>{product.gg}</Text>
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,color:"grey"}]}>{product.humidite}</Text>
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,color:"grey"}]}>{product.matiere_active}</Text>
        <Text style={[styles.everageColumn,{flex:1/7,paddingLeft:0,borderRightWidth:0,color:"grey"}]}>{product.alcanite}</Text>
        </View>
}

export const ULNavigator=({route,routeNheaders})=>{
    return (<Stack.Navigator
        screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Liquides" children={({navigation}) => <TableFull navigation={navigation} route={route} routeNheaders={routeNheaders}/>}/>
        <Stack.Screen name="analyses/liquides/updateLiquides" children={({navigation,route}) => <ModalMesures navigation={navigation} route={route}/>} options={{presentation:'transparentModal'}}/>
    </Stack.Navigator>
    )}

export const SimpleTable=()=>{
    const dispatch=useDispatch();
    const {api_url,headers}={
                                api_url:`${dbBaseRoot}analyses`,
                                headers:[
                                    "Heure",
                                    "machine",
                                    "name",
                                    "reservoir",
                                    "ph",
                                    "matiere_active",
                                    "viscosite",
                                    // "densite",
                                    // "caustique",
                                    // "silicate",
                                    // "durete",
                                    // "tds",
                                    // "observations",
                                    // "Chimiste",
                                    "Actions"
                                ],
                            }
    const {buildReservs}=useReservs();

    useLayoutEffect(()=>{
        dispatch(setPeriod({key:'aujourdHui',startedAt:aujourdhui.toDateString(),endedAt:demain.toDateString()}));
    })
return <ScrollView horizontal={true} style={styles.table}>
        <SafeAreaProvider style={{maxWidth:2000,minWidth:"122%" /*660*/}}>
            <Table current={true} product={null} navigation={null}  rend={(dt)=>buildReservs(dt)} API_URL={api_url} headers={headers}/>
        </SafeAreaProvider>
    </ScrollView>}


const styles=StyleSheet.create({
    container: {
        paddingHorizontal:5,
        // flex:1,
        // maxHeight:screenHeight*0.8, //0.6

        // ...Flex('column','flex-start','flex-start'),
      },
      everageColumn:{flex:1/5,color:'black',paddingLeft:20,fontWeight:'bold',fontSize:11,color:"black",borderColor:"rgba(0,0,0,0.08)",borderRightColor:'black',borderRightWidth:1},
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
        // overflowY:'scroll',
        // maxHeight:200,
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
