// CALLED PACKAGES
import { View, Text, FlatList, StyleSheet, Button,ActivityIndicator,TouchableOpacity, TextInput,Platform } from "react-native";
import { Badge, Dialog, PaperProvider,Portal, Searchbar } from "react-native-paper";
import { useState, useEffect,useContext,useMemo } from "react";
import { useSelector,useDispatch } from "react-redux";
// DATA STATEMENTS
import { CurrentProductsContext,useMonoProducts,useCurrentProducted,usePopup} from "../wrappers/contexts";
import { postAnalyses } from "../store/reducers/dataReducer";
import { ResultProvider} from "../resultProvider";
import Pop from "../popup";
// COMPONENTS
import HideStatusBarOnFocus from "../wrappers/wrapperHideStatusBar";
import { ClickableRow } from "./chat-for-table";
import Connect from "../connexion/connect";
import { Periodes } from "../periode";
// UTILS
import Entete from '../customHeader.js';
import { primaryColor,departements} from "../../assets/constantes";
import { colorFromName,centrer,realKeyFromEntete } from "../../assets/functions";
import {pA,currentElemnts } from "../../hooks/littleBiblio";
import WinDim from '../../assets/operatingData'
import Colors from "../../assets/colors";

const {isWeb}=WinDim;
const Table = ({current,rend,product,API_URL, headers }) => {
  const {startedAt,endedAt,postedAnalyses}=useSelector(state=>{
    const {startedAt,endedAt}=state.period.targetPeriod;
    const postedAnalyses=state.data.postedAnalyses;
    return {startedAt:startedAt,endedAt:endedAt,postedAnalyses:postedAnalyses};
  });
  const postedAnalysesToString = JSON.stringify(
    postedAnalyses.map(item => ({ id: item.id, item: item}))
  );
  const dispatch=useDispatch();
  const {setPop}=usePopup();
  const {aujourdhui,demain}=Periodes();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const {buildCurrentProducts}=useContext(CurrentProductsContext);
  const {entete}=useCurrentProducted();
  const titleHeaders=['heure','name','machine','chimiste'];
// ================ POUR LA PAGINATION ===================================
    const [totalPages, setTotalPages] = useState(1);
    const [totalAnalyses, setTotalAnalyses] = useState(1);
    const [visible, setVisible] = useState(false);
    const [k,setK]=useState(null);
    const [limit,setLimit]=useState(20);
    const handleLimitChange=(val)=>{setLimit(val)}
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const [interDate,setInterDate]=useState({minDate:"",maxDate:""});
    const [dialogShow,setDialogShow]=useState(false);
// =======================================================================

async function paginatePostedAnalyses(analys){
                  // const fullAnalyses=postedAnalyses;
                  
                  const totalPages = Math.ceil(analys.length / limit);
                  const totalAnalyses = analys.length;
                  const analysesPerPage = analys.slice(startIndex, endIndex);// EXPLICATION: slice(startIndex, endIndex) prend une portion du tableau analys allant de l'index startIndex à l'index endIndex (non inclus), ce qui correspond aux analyses à afficher pour la page courante en fonction de la limite d'analyses par page. Par exemple, si currentPage est 2 et limit est 10, startIndex sera 10 et endIndex sera 20, donc slice(10, 20) retournera les analyses de l'index 10 à 19 du tableau analys, qui sont les analyses à afficher pour la page 2.
                  return {fullAnalyses:analys,analyses:analysesPerPage,analysesPerPage:analysesPerPage,totalPages:totalPages,totalAnalyses:totalAnalyses};
                };
/*⭐*/useEffect(() =>{// Pour fetcher les données de la bdd si postedAnalyses est vide, et pour paginer les données de postedAnalyses si postedAnalyses n'est pas vide, et aussi pour mettre à jour les données affichées dans le tableau en fonction des données de postedAnalyses qui sont mises à jour après chaque enregistrement d'une analyse, et aussi pour mettre à jour les données affichées dans le tableau en fonction des données de postedAnalyses qui sont mises à jour après chaque suppression d'une analyse, et aussi pour mettre à jour les données affichées dans le tableau en fonction des données de postedAnalyses qui sont mises à jour après chaque mise à jour d'une analyse
              const Fetch=async (page)=> {
                  setLoading(true);
                  try {
                    // const response = await fetch(`${API_URL}?page=${page}&limit=${limit}&startedAt=${aujourdhui}&endedAt=${demain}`); // Subtituer par la pagination locale
                    const fullResponse = await fetch(`${API_URL}?limit=2000&startedAt=${aujourdhui}&endedAt=${demain}`);
                    // const data = await response.json();
                    const fullData = await fullResponse.json();
                    const data=await paginatePostedAnalyses(fullData.analyses);
                    setLoading(false);
                    return data;
                  } catch (error) {
                    setLoading(false);return null;
                  }
                  
                }

              const fetchAnalyses = async () => {
                    const data=postedAnalyses.length!==0?await paginatePostedAnalyses(postedAnalyses):await Fetch(currentPage); // data from: Local || bdd
                    setAnalyses(data.analyses);
                    setTotalPages(data.totalPages);
                    setTotalAnalyses(data.totalAnalyses);
                    await buildCurrentProducts(data.fullAnalyses);
                    dispatch(postAnalyses(data.fullAnalyses));
                };

                current && fetchAnalyses();// les données viennent de la bdd

                }, [currentPage,postedAnalyses.length,postedAnalysesToString,limit]);

/*⭐*/useEffect(() =>{
                  const fetchAnalyses = async (page) => {
                  setLoading(true);
                  try {
                    const response = await fetch(`${API_URL}?page=${page}&limit=${product?2000:limit}&startedAt=${startedAt}&endedAt=${endedAt}`);
                    const data = await response.json();
                    const ANALYSES=product?data.analyses.filter(item=>item.name.includes(product)):data.analyses;
                    setAnalyses(ANALYSES);
                    setTotalPages(data.totalPages);
                    setTotalAnalyses(data.totalAnalyses);
                    !current && buildCurrentProducts(data.analyses);
                  } catch (error) {
                    setPop({show:true,message:"Erreur de chargement : "+error.message,code:'#880000'});
                  }
                  setLoading(false);
                };

                !current && fetchAnalyses(currentPage);// les données viennent de la bdd

                }, [currentPage,product,limit]);

    const analysesAndCounts = async () => {
      try {
        const response = await fetch(`${API_URL}?limit=2000&startedAt=${startedAt}&endedAt=${endedAt}`);
        const data = await response.json();
        rend(data.analyses);
        dispatch(postAnalyses(data.analyses));
      } catch (error) {
        rend({});
      };
    }

    useMemo(()=>{// just for updating totalPages
            setCurrentPage(totalPages);
      },[totalPages])

    useMemo(()=>{ /*✅ for updating analysesAndCounts 
      & ✅ consequently postedAnalyses in the store, 
      ✅ and not only analyses in the component state, 
      because ✅postedAnalyses is used for filtering in the searchbar 
      ✅ and for rendering the dialogue list of products, 
      ✅ and also for building the currentProducts in the context

      postedAnalyses is also used for paginating the data if we want to paginate
        the data coming from the store
        and not the one coming from the bdd,
      postedAnalyses: how to use it for hot update of the data in the table if we want to paginate the data coming from the store and not the one coming from the bdd? 
      response: we can create a function that paginates the postedAnalyses and call it in this useMemo, 
      and not call the fetchAnalyses function in the useEffect for pagination, 
      but only call it in the useEffect for the initial fetch of the data when the component is mounted, 
      and then call the paginatePostedAnalyses function in the useMemo that depends on currentPage and limit, 
      and not call it in the useEffect that depends on currentPage and limit, 
      because we want to paginate the data coming from the store and not the one coming from the bdd
      */
      analysesAndCounts();
      },[startedAt,endedAt])
// ===============================================================================================
  const colorIfProduct=product && '#dfdfdf';
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchQueryChange= async (query)=>{
      const deps=Object.keys(departements);
      setSearchQuery(query);
      const filteredAnalyses =query===""?postedAnalyses:postedAnalyses.filter((item) =>
        deps.includes(query)?
          departements[query].includes(item.machine)
          :
          item.name.toLowerCase().includes(query.toLowerCase())
      );
      setAnalyses(filteredAnalyses);
  };

  const handleNamePress=(it)=>{
    handleSearchQueryChange(it);
    setDialogShow(false);
  }

  const entetesAlreadyIn=[];
  function enteteIsIn(ent){if(!entetesAlreadyIn.includes(ent)){entetesAlreadyIn.push(ent);return false;}else{return true;}};
  

  const currentStyle={justifyContent: "flex-start",gap:"6%",};
return (<HideStatusBarOnFocus>
    <PaperProvider><View style={styles.container}>
      <View style={[{ flexDirection: "row", justifyContent: "space-between",margin: 10 },current && currentStyle]}>
        <Button title={"Précédent "} disabled={currentPage <= 1} style={centrer}
            onPress={() => setCurrentPage((prev) => Math.min(prev - 1,totalPages))}
        />
        <Text style={{fontWeight:'bold',fontSize:12,height:45,textAlign:'center',
          flexDirection:'row',alignContent:'center',
          alignItems:'center',paddingHorizontal:10,
          borderWidth:1,borderRadius:5,borderColor:'rgba(0,0,0,0.07)',backgroundColor:'rgba(0,0,0,0.05)',color:'#141212'
          }}> {currentElemnts(totalAnalyses,totalPages,currentPage,limit)+" "+pA(totalPages,"analyse")+" sur "+totalAnalyses+"     "} Page {currentPage} / {totalPages}</Text>
          {(isWeb && !current) && <View style={{display:"flex",flexDirection:"row",width:100,justifyContent:'center',alignItems:'center',}}>
                <TextInput 
                    value={limit} 
                    onChangeText={handleLimitChange}
                    style={{width:50,height:30,color:colorIfProduct,backgroundColor:colorIfProduct,borderWidth:!product && 2,borderRadius:5,borderColor:product?'grey':'blue',textAlign:'center',}}
                    disabled={product}
                />
                <Text style={{color:'grey',fontWeight:8,}}>items/Page </Text>
            </View>
          }
        {current && <Searchbar
            placeholder="Selectionner produit"
            maxLength={20}
            onChangeText={handleSearchQueryChange}
            value={searchQuery}
            autoCorrect={false}
            onFocus={()=>setDialogShow(true)}
            icon={searchQuery? "close-circle":"magnify"}
            onIconPress={()=>handleSearchQueryChange("")}
            iconColor={primaryColor}
            right={()=><Badge size={20} style={{backgroundColor:primaryColor,color:'white',position:'absolute',top:12,right:5}}>{analyses.length}</Badge>}
            style={{backgroundColor:'rgba(0,0,0,0.1)',borderWidth:1,borderColor:primaryColor,borderRadius:5,width:250,height:45}}
         />}
        <Button style={{backgroundColor:primaryColor,color:'white'}} title={"Suivant"} disabled={currentPage >= totalPages} style={centrer}
            onPress={() => setCurrentPage((prev) => Math.min(prev+1, totalPages))}
        />
      </View>
      <View style={styles.row}>
        {headers.map((header, index) => (
          <Text  key={index} style={[styles.cell,styles.header,{minWidth:index===2 && 160,backgroundColor:'none',color:'rgba(0,0,0,0.8)',}]}>
            {/* {header.toUpperCase()} */}
            <Entete donnees={analyses} headers={headers} thisEntete={header.toLowerCase()} render={(anlyss)=>setAnalyses(anlyss)}/>
          </Text>
        ))}
      </View>
      {loading ? (<ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ResultProvider>
              <FlatList
                data={analyses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item,index}) =>{
                  if(interDate.minDate===""){
                    // ()=>setInterDate({...interDate,minDate:ReduceDateTime(createdAt)}); // A VOIR A REVOIR  A VOIR A REVOIR
                  }
                  const realKey=realKeyFromEntete(entete,item);
                return <>
                      {realKey!==undefined && !enteteIsIn(realKey) && <EnteteRow ntte={realKey} prodName={item?.name} analysed={analyses}/>}
                      <ClickableRow
                          key={index}
                          num={index+1}
                          search={searchQuery}
                          ky={index}
                          k={k}
                          styles={styles}
                          item={item}
                          items={analyses}
                          modalShow={(bool)=>setVisible(bool)}
                          render={itms=>setAnalyses(itms)}
                          setK={(idx)=>setK(idx)}

                        />
                        </>
                }
                }
              />
              </ResultProvider>
            )
      }
            
            <Connect visible={visible} render={bool=>setVisible(bool)}/>
    </View>
    {/* <Pop/> */}
    <Dialogue handleNamePress={(it)=>handleNamePress(it)} dialogShow={dialogShow} render={bool=>setDialogShow(bool)} analyses={postedAnalyses}/>
    </PaperProvider></HideStatusBarOnFocus>
  ); 
};

const Dialogue = ({handleNamePress,dialogShow,render,analyses}) => {
    const {targetedBadge}=useMonoProducts();
    const names=[];
    useMemo(()=>handleNamePress(targetedBadge),[targetedBadge])// pour que le calcul de names ne se fasse qu'une seule fois à l'ouverture du dialogue, et pas à chaque render du composant, parce que le composant se rerender à chaque frappe dans la searchbar, et on n'a pas besoin de recalculer names à chaque frappe dans la searchbar, parce que names ne dépend pas de la searchQuery, mais seulement de postedAnalyses qui ne change pas à chaque frappe dans la searchbar, mais seulement à chaque enregistrement d'une analyse ou suppression ou mise à jour d'une analyse, et dans ce cas là on veut que names soit recalculé pour prendre en compte les nouvelles analyses enregistrées ou supprimées ou mises à jour
    analyses.forEach(element => {names.includes(element.name) || names.push(element.name);});
  return <Portal>
          <Dialog style={{maxWidth:500,minWidth:400,position:"absolute",left:"20%",top:75,marginHorizontal:"auto"}}
           visible={dialogShow} onDismiss={()=>render(false)}>
            <Dialog.Title style={{fontSize:15,color:"grey",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>Selectionner nom produit</Dialog.Title>
            <Dialog.Content style={{maxWidth:900,minWidth:400,maxHeight:500,overflowX:"scroll",margin:"auto",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"flex-start",paddingHorizontal:40,height:"auto"}}>
               <View style={{width:"100%",maxHeight:60,borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)",marginBottom:10,paddingBottom:10,flexDirection:"row",justifyContent:"center",gap:5}}>
                {Object.keys(departements).map((item,  index) => {
                    return <TouchableOpacity onPress={()=>handleNamePress(item)} key={index} style={{padding:8,backgroundColor:primaryColor,borderWidth:1,borderColor:"grey",borderRadius:5,margin:1}}>
                            <Text style={{color:"whitesmoke",letterSpacing:0,fontWeight:"bold",fontSize:12}}>{item}</Text>
                        </TouchableOpacity>
                    })
                }
               </View>
               {
                names.map((item,  index) => {
                    const color=Colors[colorFromName(item)] || 'grey';
                    return <TouchableOpacity onPress={()=>handleNamePress(item)} key={index} style={{padding:10,backgroundColor:"rgba(0,0,0,0.05)",borderWidth:1,borderColor:color,borderRadius:5,margin:5}}>
                            <Text style={{color:"grey",letterSpacing:0,fontWeight:"bold",fontSize:14}}>{item}</Text>
                        </TouchableOpacity>
                    })
                }
            </Dialog.Content>
          </Dialog>
        </Portal>
}
export const PowderHeaders=({donnees,headers,render})=>{
    const firstHeadStyle={borderTopWidth:2,borderLeftWidth:2,borderColor:"green",borderTopLeftRadius:5};
    const lastHeadStyle={borderTopWidth:2,borderRightWidth:2,borderColor:"green",borderTopRightRadius:5};
    const headersLen=headers.length;
  return <View style={[styles.row,{width:"100%"}]}>
        {headers.map((header, index) => (
              <Text  key={index} style={[styles.cell,{fontWeight: "bold",minWidth:index===1 && 100,fontSize:8,backgroundColor:'none',color:'rgba(0,0,0,0.4)',maxWidth:index===0 && 30,width:index===0 && 20},index===0 && firstHeadStyle,index===headersLen-1 && lastHeadStyle]}>
                {/* {header.toUpperCase()} */}
                <Entete donnees={donnees} headers={headers} thisEntete={header.toLowerCase()} render={(anlyss)=>render(anlyss)}/>

              </Text>
            ))
        }
      </View>
}


export const styles = StyleSheet.create({
  container: {
    minWidth:"100%",
    maxWidth:"100%",
    maxHeight:800,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflowY:"scroll",// "hidden",
    overFlowX:"hidden",

    margin: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row1: {
    width:"99%",
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    paddingVertical: 5,
    textAlign: "center",
    fontSize:11,
    // maxWidth:400,
    // overflow:'scoll',
  },
  header: {
    fontWeight: "bold",
    paddingVertical:10,
    textAlign:'center',
    backgroundColor: "#f0f0f0",
  },
});

export default Table;


