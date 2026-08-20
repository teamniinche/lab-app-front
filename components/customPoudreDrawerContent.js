import {useMemo,useState,useLayoutEffect} from 'react';
import { View, Text, TouchableOpacity,Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { DrawerActions,useNavigation } from '@react-navigation/native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {useDispatch,useSelector } from 'react-redux';
// import { connect } from './store/reducers/userReducer';
import { Parfums,Formats,Lansas, newLansa } from '../iterables';
import { Connection } from '../navigators/DrawerNavigator';
// import Connect from './connexion/connect';
import Pop from './popup';
import { dbBaseRoot,primaryColor,couleurs} from '../assets/constantes';
import {allowTo} from '../assets/functions';
import {useCurrentProducted,NouvelleFormuleProvider,useFormules,usePopup } from './wrappers/contexts';
import { setCurrentProducted, storeFocusedListe } from './store/reducers/currentProducted';
import { setFormulesNormes, setNormes } from './store/reducers/normesPowder';
import ModalWrapper from './modaux.js/modalAsWrapper';
// import { setPeriod} from './store/reducers/periodReducer';
// import { changeCritery } from './store/reducers/criteryReducer';
// import Periode from './periode';
// import { Flex } from './accueil';

// import {InputDatePickerPaper} from './dataPickers/datePickerPaper';
// import ChangePassword from './modaux.js/users/changePassWord';
import {FontAwesome5} from '@expo/vector-icons';
import { Searchbar,Chip } from 'react-native-paper';
import { UpdateItems } from './jsonOfNormesPowder';
import {AnalysedListTour} from '../navigators/DrawerPoudre';
import LansaEdit from './editLansa';
import FormuleEdit from './EditFormule';
import WinDim from '../assets/operatingData';
const {isLarge}=WinDim;
// import { useNavigation } from '@react-navigation/native';
// import Users from './modaux.js/users/users';
// import AddUser from './modaux.js/users/addUser';
// import { dbBaseRoot } from '../assets/constantes';
// import { Portal } from 'react-native-paper';

// export function Period(){
//   const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
//   return  {startedAt:startedAt,endedAt:endedAt};

// }

export const Indix=({Type,clr})=>{
    return <Text style={{color:clr!==null?clr:'rgba(3, 83, 3, 0.2)',fontSize:8,}}>{Type!=='toClose'?'▲':'▼'}</Text>
}
// const Isoles=()=>{return <Text style={{backgroundColor:'rgba(255,0,0,0.2)',marginRight:30,paddingLeft:10,}}>Isolés</Text>}

export default function CustomPoudreDrawerContent() {
    const navigation=useNavigation();
    const {setCurrentProductedPro,ListOfFocusedAndLastNumber,registred}=useCurrentProducted();
    // Store & Contexts ----------------------------------------------
    const {focused,setFocused}=useFormules();
    const dispatch=useDispatch();
    const {targetUser,period,currentProducted,powderNormes,formulesNormes}= useSelector(state => {
      const period = state.period.targetPeriod;
      const currentProducted = state.currentProducted.currentProducted;
      const targetUser=state.user.targetUser;
      // const clooned= useSelector(state => state.actived.clooned);
      const {powderNormes,formulesNormes} = state.powderNormes;
      return {period,targetUser,currentProducted,powderNormes,formulesNormes};
    });
// alert(JSON.stringify(powderNormes))
    const tourAllowed=allowTo("TOUR",targetUser?.privileges) || targetUser?.depart_affecte==='Tour';// Si c'est un element de Tour
    
    // Accordions states --------------------------------------------
    const [multiusageOpen, setMultiusageOpen] = useState(false);
    const [patesOpen, setPatesOpen] = useState(false);
    const [cosmetiquesOpen, setCosmetiquesOpen] = useState(false);
    const [formatsOpen, setFormatsOpen] = useState(false);
    const [parfumsOpen, setParfumsOpen] = useState(false);
    const [searchBarInput, setSearchBarInput] = useState(null);
    const [finich,setFinish]=useState(false)

    // CallBacks -----------------------------------------------------
    const handleSearchBarChange=(text)=>setSearchBarInput(text);
    const searchBarResult=useMemo(() => {
    const searchDomain=[...Object.keys(Lansas),...Parfums,...Formats];
    const founds=searchBarInput===null?[]:searchDomain.filter(item => item.toLowerCase().includes(searchBarInput.toLowerCase()));
      if(founds.length>0){
        return <View style={{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:0,paddingVertical:10,width:'100%'}}>{
          founds.map((item,index)=>
          <Chip key={index} style={{backgroundColor:'rgba(0,0,0,0.1)',fontSize:10,margin:2}}>{item.split('_').join(' ')}</Chip>
        )}
        </View>;
      }
    return;
    }, [searchBarInput]);

    useMemo(() => {
      fetch(dbBaseRoot + "poudre/normes/get-lansasAndFormules", {
                              method: "GET",
                              headers: { 'Content-Type': 'application/json' }
                            })
                  .then(response=>response.json())
                  .then(dt/*={code,data}*/=>{
                    const {lansas,formules}=dt.data;
                    dispatch(setNormes(lansas));
                    dispatch(setFormulesNormes(formules));
                    setFinish(true)
                  // dispatch(setFormulesNormes(formules));
                });
              },[])

    const activeStyle=(key)=>{
      const style={backgroundColor:primaryColor,paddingVertical:4,paddingHorizontal:6,marginVertical:2,borderRadius:6};
      return IAmIn(key)?style:{};
    }

    const IAmIn=(key)=>Object.keys(currentProducted).find(k=>k===key);

    function handleLansaPress(formats,val){// pour les operations
      const KEY=val?.name.split(' ').join('_').toLowerCase();
      const key=formats!=="lansa"?("fini"+formats.replace(" ","_")+KEY):KEY;
      if(IAmIn(key)){
        const {[key]:undefined,...rest}=currentProducted;
        const restArray=Object.values(rest);
        const firstElem=restArray.length!==0?restArray[0]:{};
        const {list}=ListOfFocusedAndLastNumber(firstElem,registred);
        setCurrentProductedPro(rest);
        dispatch(setCurrentProducted(rest));
        dispatch(storeFocusedListe(list));
      }else{
        if(Object.keys(currentProducted).length===0){const {list}=ListOfFocusedAndLastNumber(val,registred);dispatch(storeFocusedListe(list));}
        setCurrentProductedPro({...currentProducted,[key]:val})
        dispatch(setCurrentProducted({...currentProducted,[key]:val}));
      }
    }
    // function handleFormulePress(val){
    //   const key=val.name.split(' ').join('_').toLowerCase();
    //   if(IAmIn(key)){
    //     const {[key]:undefined,...rest}=currentProducted;
    //     setCurrentProductedPro(rest);
    //     dispatch(setCurrentProducted(rest));
    //   }else{
    //     setCurrentProductedPro({...currentProducted,[key]:val})
    //     dispatch(setCurrentProducted({...currentProducted,[key]:val}));
    //   }
    // }
    // ----------------------------------------------------------------
  return (
    <DrawerContentScrollView>
      <Searchbar
        placeholder="Rechercher..."
        onChangeText={handleSearchBarChange}
        value={searchBarInput}
        style={{margin:0,backgroundColor:'rgba(255,255,255,0.9)'}}
      />
      {searchBarInput && searchBarResult}
      {/* Catégories - bouton principal */}
      {!tourAllowed && <TouchableOpacity
        style={[  styles.item,{marginTop:10}]}
        onPress={() =>{setMultiusageOpen(!multiusageOpen);setPatesOpen(false);setCosmetiquesOpen(false);}}
      >
        <Text style={styles.label}>📋 Basics {multiusageOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
      </TouchableOpacity>}

      {/* Sous-catégories affichées dynamiquement */}
      {multiusageOpen && (
        <View style={[styles.subMenu,{paddingVertical:25}]}>
          <TouchableOpacity style={styles.subItem} onPress={() => { setParfumsOpen(!parfumsOpen);setFormatsOpen(false)}}>
            <Text>❄️ Parfums {parfumsOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
          </TouchableOpacity>
          {parfumsOpen && <View style={{paddingLeft:40,marginBottom:5}}>
            <AddItem type="Parfums" libelle="Ajouter un parfum"/>
            {Parfums.map((item,i)=><RetirerItem key={i} type="Parfums" item={item}/>)}
          </View>}
          <TouchableOpacity style={styles.subItem} onPress={() => {setFormatsOpen(!formatsOpen);setParfumsOpen(false)}}>
            <Text>🔶 Formats {formatsOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
          </TouchableOpacity>
          {formatsOpen && <View style={{paddingLeft:40,marginBottom:5}}>
            <AddItem type="Formats" libelle="Ajouter un format"/>
            {Formats.map((item,i)=><RetirerItem key={i} type="Formats" item={item}/>)}
          </View>}

        </View>
      )}

      {/* Catégories - bouton principal */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => {setPatesOpen(!patesOpen);setMultiusageOpen(false);setCosmetiquesOpen(false)}}
      >
        <Text style={styles.label}>📋 Lansas {patesOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
      </TouchableOpacity>

      {/* Sous-catégories affichées dynamiquement */}
      {(patesOpen || tourAllowed) && (
        <View style={[styles.subMenu,{paddingHorizontal:10,paddingVertical:25}]}>
          <AddItem type="Lansas" libelle="Ajouter un lansa"/>
          {finich && Object.entries(powderNormes.data).map(([f,value],i)=>
            <Pressable key={i} onHoverIn={() =>setFocused(i)} onHoverOut={() =>setFocused(null)} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",gap:10}}>
            <TouchableOpacity style={[styles.subItem,activeStyle(f),{letterSpacing:2}]} onPress={()=>handleLansaPress("lansa",value)}>
              <Text key={i} style={{color:IAmIn(f)?'white':'rgba(0,0,0,0.7)',fontSize:11,fontWeight:'bold'}}>{"🔹 "+f.charAt(0).toUpperCase()+f.replace("avec","avc").replace("sans","ss").replace("export","exp").slice(1).split('_').join(' ')}</Text>
            </TouchableOpacity>
            {(focused===i || !isLarge) &&<FormuleActions type="Lansas" item={value}/>}
            </Pressable>
        )}
        </View>
      )}

    {/* Catégories - bouton principal */}
      {!tourAllowed && <TouchableOpacity
        style={styles.item}
        onPress={() => {setCosmetiquesOpen(!cosmetiquesOpen);setPatesOpen(false);setMultiusageOpen(false)}}
      >
        <Text style={styles.label}>📋 Formules {patesOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
      </TouchableOpacity>}

      {/* Sous-catégories affichées dynamiquement */}
      {cosmetiquesOpen && (
        <View style={[styles.subMenu,{width:"104%",paddingHorizontal:10,paddingVertical:25,paddingLeft:-15,marginLeft:-4}]}>
          <AddFormule type="Formules" libelle="Ajouter une nouvelle formule"/>
          {/* powderNormes */}
          {finich && formulesNormes.data.arr.map((value,i)=>{
            const {nom,name,format}=value;
            const f=name?.split(" ").join("_").toLowerCase();
            const formats=format.reduce((acc,k)=>acc+" "+k,"");
            // "🔹 "+f.charAt(0).toUpperCase()+f.slice(1).replace("sans","ss").replace("avec","av").replace("export","exp.").split('_').join(' ')
          return <Pressable key={i} onHoverIn={() =>setFocused(("fini"+i))} onHoverOut={() =>setFocused(null)} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",marginVertical:4,gap:10}}>
              <TouchableOpacity key={i} onPress={() => handleLansaPress(formats,value)} style={[styles.subItem,{flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start",paddingLeft:3,gap:0,...activeStyle(("fini"+f+formats.replace(" ","_")))}]}>
                  <Text key={i} style={{color:'rgba(0,0,0,0.7)',fontSize:11,fontWeight:'bold'}}>{"🔹 "+nom}</Text>
                  <Text style={{width:"100%",color:'rgba(0,0,0,0.5)',fontSize:8,fontWeight:'bold',textAlign:"left",paddingLeft:20}}>{formats}</Text>
              </TouchableOpacity>
              {(focused===("fini"+i )|| !isLarge) &&<FormuleActions type="Formules" item={value}/>}
          </Pressable>}
        )}
        </View>
      )}
      {!tourAllowed && <AnalysedListTour/>}
      <NouvelleFormuleProvider>
        <ModalWrapper type="lansa">
          <LansaEdit/>
        </ModalWrapper>
        <ModalWrapper title={<Title/>} type="any">
          <FormuleEdit/>
        </ModalWrapper>
      </NouvelleFormuleProvider>
    </DrawerContentScrollView>
  );
}

const AddItem=({type,libelle})=>{
  const {targetUser}=useSelector(state=>state.user);
  const {setPop}=usePopup();
  const addItemAllowed=allowTo("ajouter une norme|user",targetUser?.privileges);
  const KEY=addItemAllowed?"allowed":"notAllowed";
  const {EditLansaParams/*,setWrapperShow,setItemStored*/}=useFormules();
  const handleEditPress=()=>{
    if(!addItemAllowed){setPop({show:true,message:"Vous n'avez pas la permission d'ajouter une norme !",code:'#880000'});return;}
    EditLansaParams(newLansa.new);}
    // setItemStored(newLansa.new);setWrapperShow(true);
  return <TouchableOpacity
      disabled={!addItemAllowed}
      style={{padding:4,margin:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:3,mouse:"pointer"}}
      onPress={handleEditPress}
    ><FontAwesome5 name="plus-circle" size={15} color={couleurs[KEY][7]}/>
    <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10,padding:2,}}>{libelle}</Text>
    </TouchableOpacity>;
}

const AddFormule=({type,libelle})=>{
  const {targetUser}=useSelector(state=>state.user);
  const {setPop}=usePopup();
  const addFormuleAllowed=allowTo("ajouter une norme|user",targetUser?.privileges);
  const KEY=addFormuleAllowed?"allowed":"notAllowed";
   const {setFWrapperShow}=useFormules();
  const handleEditPress=()=>{
    if(!addFormuleAllowed){setPop({show:true,message:"Vous n'avez pas la permission d'ajouter une formule !",code:'#880000'});return;}
    setFWrapperShow(true);}
  return <TouchableOpacity
      disabled={!addFormuleAllowed} 
      style={{padding:4,margin:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:3,mouse:"pointer"}}
      onPress={handleEditPress}
    ><FontAwesome5 name="plus-circle" size={15} color={couleurs[KEY][7]}/>
    <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10,padding:2,}}>{libelle}</Text>
    </TouchableOpacity>;
}

const RetirerItem=({type,item})=>{
  const targetUser=useSelector(state=>state.user.targetUser);
  const {setPop}=usePopup();
  const handlePress=()=>{
    if(!allowTo("suprimer une norme|user",targetUser?.privileges)){
      setPop({show:true,message:"Vous n'avez pas la permission de supprimer cette donnée !",code:'#880000'});
      return;
    }
    if(confirm(`Êtes-vous sûr de vouloir supprimer ${item} des ${type} ?`)){

    }
  }
  return <View style={{width:"auto",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",gap:10,mouse:"pointer"}}>
    <Text style={{color:'rgba(0,0,0,0.5)',fontSize:12,padding:8,}}>{item}</Text>
    <TouchableOpacity
      disabled={!allowTo("suprimer une norme|user",targetUser?.privileges)}
      style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)",margin:15}}
      onPress={handlePress}
    ><FontAwesome5 name="minus" size={8} color="red"/></TouchableOpacity>
  </View>
}

const FormuleActions=({type,item})=>{
      const {EditLansaParams,setWrapperShow,setItemStored}=useFormules();
      const dispatch=useDispatch();
      const {setPop}=usePopup();
      const {user,powderNormes,formulesNormes}= useSelector(state => {
                                                        const user=state.user.targetUser;
                                                        const {powderNormes,formulesNormes}= state.powderNormes;
                                                        return {user,powderNormes,formulesNormes};
                                                      });
      const userIsAdmin=user?user.isAdmin:false;
      const deleteAllowed=allowTo("suprimer une norme|user",user?.privileges);
      const updateAllowed=allowTo("modifier une norme|user",user?.privileges);
      const isFormule=item.format!==undefined;
const handleDelete=()=>{
        if(confirm(`Êtes-vous sûr de vouloir supprimer ${item.name.toUpperCase()} des ${type} ?`)){
          if(isFormule){
            const formulesNormesToDispatch=formulesNormes.data.arr.filter(it=>it!==item);
            // dispatch(setFormulesNormes({...formulesNormes,data:{arr:formulesNormesToDispatch}}));
            UpdateItems({
                body:JSON.stringify({data:{arr:formulesNormesToDispatch},UtilisateurId:1}),
                url:"formules/normes/update-normes"
            })
            .then((updatedNormes)=>{dispatch(setFormulesNormes(updatedNormes.data));})
            .catch(function(){setPop({show:true,message:"Il y'a eu erreur a la mise a jour dee la formule !",code:'#880000'})})
          }else{
            const k=item.name.split(' ').join('_').toLowerCase();
            const {[k]:undefined,...rest}=powderNormes.data;
            // dispatch(setNormes({...powderNormes,data:rest}));
            UpdateItems({
                body:JSON.stringify({data:rest,UtilisateurId:1}),
                url:"poudre/normes/update-normes"
            })
            .then((updatedNormes)=>{dispatch(setNormes(updatedNormes.data));})
            .catch(function(){setPop({show:true,message:"Il y'a eu erreur a la mise a jour du lansa !",code:'#880000'})})
            // ici on ferait la suppression dans la base de données et ensuite dans le store
          }
          setPop({show:true,message:`${item.name.toUpperCase()} supprimé des ${type} avec succes`,code:'green'});
        }
      }

  const handleEditPress=()=>{
    // setItemStored(item);setWrapperShow(true);
    EditLansaParams(item);
  }
  return <View style={{width:"auto",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:12,}}>
    {/*userIsAdmin && */deleteAllowed && 
    <TouchableOpacity
      style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)"}}
      onPress={handleDelete}
    ><FontAwesome5 name="minus" size={8} color="red"/></TouchableOpacity>
    }
       <TouchableOpacity
      style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)"}}
      onPress={handleEditPress}
    ><FontAwesome5 name={/*userIsAdmin*/updateAllowed?"edit":"eye"} size={/*userIsAdmin*/updateAllowed?8:12} color={primaryColor}/></TouchableOpacity>
  </View>
}

const Title=()=>{
  const {itemStored}=useFormules();
  const itemName=itemStored?.name;
  return <View style={{width:"100%",flexDirection:'row',justifyContent:'center',borderBottomWidth:1,paddingBottom:20,borderColor:"lightgrey",alignItems:'flex-end',gap:4,marginBottom:-10,}}>
              <Text style={{width:"auto",textAlign:'center',color:"grey",alignSelf:'center',}}>{itemName!==undefined?"Specifications physico-chimiques de ":"Definir les specifications physico-chimiques de la " }</Text>
              <Text style={{width:"auto",textAlign:'center',fontSize:14,fontWeight:'bold',color:"blue",alignSelf:'center',}}> {itemName!==undefined?itemStored?.name:"NOUVELLE FORMULE"}</Text>
            </View>
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,//15
    paddingHorizontal:15,// 20,
  },
  label: {
    // fontSize: 16,//18
    fontSize: 13,//18
    letterSpacing:1.5,//2
    color:'rgba(0,0,0,0.8)',
},
  subMenu: {
    paddingLeft: 30,
    marginHorizontal:'10%',
    backgroundColor:'#f5f5f5',
    borderRadius:8,
  },
  subItem: {
    paddingVertical: 10,
    letterSpacing:3,
    maxHeight:30,
    fontSize:10,
  },
});






// import {useMemo,useState,useLayoutEffect} from 'react';
// import { View, Text, TouchableOpacity,Pressable, StyleSheet, Platform } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// // import { DrawerActions,useNavigation } from '@react-navigation/native';
// import { DrawerContentScrollView } from '@react-navigation/drawer';
// import {useDispatch,useSelector } from 'react-redux';
// // import { connect } from './store/reducers/userReducer';
// import { Parfums,Formats,Lansas, newLansa } from '../iterables';
// import { Connection } from '../navigators/DrawerNavigator';
// // import Connect from './connexion/connect';
// import Pop from './popup';
// import { dbBaseRoot,primaryColor,couleurs } from '../assets/constantes';
// import {allowTo} from '../assets/functions';
// import {useCurrentProducted,NouvelleFormuleProvider,useFormules,usePopup } from './wrappers/contexts';
// import { setCurrentProducted, storeFocusedListe } from './store/reducers/currentProducted';
// import { setFormulesNormes, setNormes } from './store/reducers/normesPowder';
// import ModalWrapper from './modaux.js/modalAsWrapper';
// // import { setPeriod} from './store/reducers/periodReducer';
// // import { changeCritery } from './store/reducers/criteryReducer';
// // import Periode from './periode';
// // import { Flex } from './accueil';

// // import {InputDatePickerPaper} from './dataPickers/datePickerPaper';
// // import ChangePassword from './modaux.js/users/changePassWord';
// import {FontAwesome5} from '@expo/vector-icons';
// import { Searchbar,Chip } from 'react-native-paper';
// import { UpdateItems } from './jsonOfNormesPowder';
// import LansaEdit from './editLansa';
// import FormuleEdit from './EditFormule';
// import WinDim from '../assets/operatingData';
// const {isLarge}=WinDim;
// // import { useNavigation } from '@react-navigation/native';
// // import Users from './modaux.js/users/users';
// // import AddUser from './modaux.js/users/addUser';
// // import { dbBaseRoot } from '../assets/constantes';
// // import { Portal } from 'react-native-paper';

// // export function Period(){
// //   const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
// //   return  {startedAt:startedAt,endedAt:endedAt};

// // }

// export const Indix=({Type,clr})=>{
//     return <Text style={{color:clr!==null?clr:'rgba(3, 83, 3, 0.2)',fontSize:8,}}>{Type!=='toClose'?'▲':'▼'}</Text>
// }
// // const Isoles=()=>{return <Text style={{backgroundColor:'rgba(255,0,0,0.2)',marginRight:30,paddingLeft:10,}}>Isolés</Text>}

// export default function CustomPoudreDrawerContent() {
//     const navigation=useNavigation();
//     const {setCurrentProductedPro,ListOfFocusedAndLastNumber,registred}=useCurrentProducted();
//     // Store & Contexts ----------------------------------------------
//     const {focused,setFocused}=useFormules();
//     const dispatch=useDispatch();
//     const {period,currentProducted,powderNormes,formulesNormes}= useSelector(state => {
//       const period = state.period.targetPeriod;
//       const currentProducted = state.currentProducted.currentProducted;
//       // const clooned= useSelector(state => state.actived.clooned);
//       const {powderNormes,formulesNormes} = state.powderNormes;
//       return {period,currentProducted,powderNormes,formulesNormes};
//     });
    
//     // Accordions states --------------------------------------------
//     const [multiusageOpen, setMultiusageOpen] = useState(false);
//     const [patesOpen, setPatesOpen] = useState(false);
//     const [cosmetiquesOpen, setCosmetiquesOpen] = useState(false);
//     const [formatsOpen, setFormatsOpen] = useState(false);
//     const [parfumsOpen, setParfumsOpen] = useState(false);
//     const [searchBarInput, setSearchBarInput] = useState(null);

//     // CallBacks -----------------------------------------------------
//     const handleSearchBarChange=(text)=>setSearchBarInput(text);
//     const searchBarResult=useMemo(() => {
//     const searchDomain=[...Object.keys(Lansas),...Parfums,...Formats];
//     const founds=searchBarInput===null?[]:searchDomain.filter(item => item.toLowerCase().includes(searchBarInput.toLowerCase()));
//       if(founds.length>0){
//         return <View style={{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:0,paddingVertical:10,width:'100%'}}>{
//           founds.map((item,index)=>
//           <Chip key={index} style={{backgroundColor:'rgba(0,0,0,0.1)',fontSize:10,margin:2}}>{item.split('_').join(' ')}</Chip>
//         )}
//         </View>;
//       }
//     return;
//     }, [searchBarInput]);

//     useLayoutEffect(() => {
//       fetch(dbBaseRoot + "poudre/normes/get-lansasAndFormules", {
//                               method: "GET",
//                               headers: { 'Content-Type': 'application/json' }
//                             })
//                   .then(response=>response.json())
//                   .then(dt/*={code,data}*/=>{
//                     const {lansas,formules}=dt.data;
//                     dispatch(setNormes(lansas));
//                     dispatch(setFormulesNormes(formules));
//                   // dispatch(setFormulesNormes(formules));
//                 });
//               },[])

//     const activeStyle=(key)=>{
//       const style={backgroundColor:primaryColor,paddingVertical:4,paddingHorizontal:6,marginVertical:2,borderRadius:6};
//       return IAmIn(key)?style:{};
//     }

//     const IAmIn=(key)=>Object.keys(currentProducted).find(k=>k===key);

//     function handleLansaPress(formats,val){// pour les operations
//       const KEY=val?.name.split(' ').join('_').toLowerCase();
//       const key=formats!=="lansa"?("fini"+formats.replace(" ","_")+KEY):KEY;
//       if(IAmIn(key)){
//         const {[key]:undefined,...rest}=currentProducted;
//         const restArray=Object.values(rest);
//         const firstElem=restArray.length!==0?restArray[0]:{};
//         const {list}=ListOfFocusedAndLastNumber(firstElem,registred);
//         setCurrentProductedPro(rest);
//         dispatch(setCurrentProducted(rest));
//         dispatch(storeFocusedListe(list));
//       }else{
//         if(Object.keys(currentProducted).length===0){const {list}=ListOfFocusedAndLastNumber(val,registred);dispatch(storeFocusedListe(list));}
//         setCurrentProductedPro({...currentProducted,[key]:val})
//         dispatch(setCurrentProducted({...currentProducted,[key]:val}));
//       }
//     }
//     // function handleFormulePress(val){
//     //   const key=val.name.split(' ').join('_').toLowerCase();
//     //   if(IAmIn(key)){
//     //     const {[key]:undefined,...rest}=currentProducted;
//     //     setCurrentProductedPro(rest);
//     //     dispatch(setCurrentProducted(rest));
//     //   }else{
//     //     setCurrentProductedPro({...currentProducted,[key]:val})
//     //     dispatch(setCurrentProducted({...currentProducted,[key]:val}));
//     //   }
//     // }
//     // ----------------------------------------------------------------
//   return (
//     <DrawerContentScrollView>
//       <Searchbar
//         placeholder="Rechercher..."
//         onChangeText={handleSearchBarChange}
//         value={searchBarInput}
//         style={{margin:0,backgroundColor:'rgba(255,255,255,0.9)'}}
//       />
//       {searchBarInput && searchBarResult}
//       {/* Catégories - bouton principal */}
//       <TouchableOpacity
//         style={[  styles.item,{marginTop:10}]}
//         onPress={() =>{setMultiusageOpen(!multiusageOpen);setPatesOpen(false);setCosmetiquesOpen(false);}}
//       >
//         <Text style={styles.label}>📋 Basics {multiusageOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
//       </TouchableOpacity>

//       {/* Sous-catégories affichées dynamiquement */}
//       {multiusageOpen && (
//         <View style={[styles.subMenu,{paddingVertical:25}]}>
//           <TouchableOpacity style={styles.subItem} onPress={() => { setParfumsOpen(!parfumsOpen);setFormatsOpen(false)}}>
//             <Text>❄️ Parfums {parfumsOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
//           </TouchableOpacity>
//           {parfumsOpen && <View style={{paddingLeft:40,marginBottom:5}}>
//             <AddItem type="Parfums" libelle="Ajouter un parfum"/>
//             {Parfums.map((item,i)=><RetirerItem key={i} type="Parfums" item={item}/>)}
//           </View>}
//           <TouchableOpacity style={styles.subItem} onPress={() => {setFormatsOpen(!formatsOpen);setParfumsOpen(false)}}>
//             <Text>🔶 Formats {formatsOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
//           </TouchableOpacity>
//           {formatsOpen && <View style={{paddingLeft:40,marginBottom:5}}>
//             <AddItem type="Formats" libelle="Ajouter un format"/>
//             {Formats.map((item,i)=><RetirerItem key={i} type="Formats" item={item}/>)}
//           </View>}

//         </View>
//       )}

//       {/* Catégories - bouton principal */}
//       <TouchableOpacity
//         style={styles.item}
//         onPress={() => {setPatesOpen(!patesOpen);setMultiusageOpen(false);setCosmetiquesOpen(false)}}
//       >
//         <Text style={styles.label}>📋 Lansas {patesOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
//       </TouchableOpacity>

//       {/* Sous-catégories affichées dynamiquement */}
//       {patesOpen && (
//         <View style={[styles.subMenu,{paddingHorizontal:10,paddingVertical:25}]}>
//           <AddItem type="Lansas" libelle="Ajouter un lansa"/>
//           {Object.entries(powderNormes.data).map(([f,value],i)=>
//             <Pressable key={i} onHoverIn={() =>setFocused(i)} onHoverOut={() =>setFocused(null)} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",gap:10}}>
//             <TouchableOpacity style={[styles.subItem,activeStyle(f),{letterSpacing:2}]} onPress={()=>handleLansaPress("lansa",value)}>
//               <Text key={i} style={{color:IAmIn(f)?'white':'rgba(0,0,0,0.7)',fontSize:11,fontWeight:'bold'}}>{"🔹 "+f.charAt(0).toUpperCase()+f.replace("avec","avc").replace("sans","ss").replace("export","exp").slice(1).split('_').join(' ')}</Text>
//             </TouchableOpacity>
//             {(focused===i || !isLarge) &&<FormuleActions type="Lansas" item={value}/>}
//             </Pressable>
//         )}
//         </View>
//       )}

//     {/* Catégories - bouton principal */}
//       <TouchableOpacity
//         style={styles.item}
//         onPress={() => {setCosmetiquesOpen(!cosmetiquesOpen);setPatesOpen(false);setMultiusageOpen(false)}}
//       >
//         <Text style={styles.label}>📋 Formules {patesOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
//       </TouchableOpacity>

//       {/* Sous-catégories affichées dynamiquement */}
//       {cosmetiquesOpen && (
//         <View style={[styles.subMenu,{width:"104%",paddingHorizontal:10,paddingVertical:25,paddingLeft:-15,marginLeft:-4}]}>
//           <AddFormule type="Formules" libelle="Ajouter une nouvelle formule"/>
//           {/* powderNormes */}
//           {formulesNormes.data.arr.map((value,i)=>{
//             const {nom,name,format}=value;
//             const f=name?.split(" ").join("_").toLowerCase();
//             const formats=format.reduce((acc,k)=>acc+" "+k,"");
//             // "🔹 "+f.charAt(0).toUpperCase()+f.slice(1).replace("sans","ss").replace("avec","av").replace("export","exp.").split('_').join(' ')
//           return <Pressable key={i} onHoverIn={() =>setFocused(("fini"+i))} onHoverOut={() =>setFocused(null)} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",marginVertical:4,gap:10}}>
//               <TouchableOpacity key={i} onPress={() => handleLansaPress(formats,value)} style={[styles.subItem,{flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start",paddingLeft:3,gap:0,...activeStyle(("fini"+f+formats.replace(" ","_")))}]}>
//                   <Text key={i} style={{color:'rgba(0,0,0,0.7)',fontSize:11,fontWeight:'bold'}}>{"🔹 "+nom}</Text>
//                   <Text style={{width:"100%",color:'rgba(0,0,0,0.5)',fontSize:8,fontWeight:'bold',textAlign:"left",paddingLeft:20}}>{formats}</Text>
//               </TouchableOpacity>
//               {(focused===("fini"+i )|| !isLarge) &&<FormuleActions type="Formules" item={value}/>}
//           </Pressable>}
//         )}
//         </View>
//       )}
//       <NouvelleFormuleProvider>
//         <ModalWrapper type="lansa">
//           <LansaEdit/>
//         </ModalWrapper>
//         <ModalWrapper title={<Title/>} type="any">
//           <FormuleEdit/>
//         </ModalWrapper>
//       </NouvelleFormuleProvider>
//     </DrawerContentScrollView>
//   );
// }

// const AddItem=({type,libelle})=>{
//   const {targetUser}=useSelector(state=>state.user);
//   const {setPop}=usePopup();
//   const addItemAllowed=allowTo("ajouter une norme|user",targetUser?.privileges);
//   const KEY=addItemAllowed?"allowed":"notAllowed";
//   const {EditLansaParams/*,setWrapperShow,setItemStored*/}=useFormules();
//   const handleEditPress=()=>{
//     if(!addItemAllowed){setPop({show:true,message:"Vous n'avez pas la permission d'ajouter une norme !",code:'#880000'});return;}
//     EditLansaParams(newLansa.new);}
//     // setItemStored(newLansa.new);setWrapperShow(true);
//   return <TouchableOpacity
//       disabled={!addItemAllowed}
//       style={{padding:4,margin:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:3,mouse:"pointer"}}
//       onPress={handleEditPress}
//     ><FontAwesome5 name="plus-circle" size={15} color={couleurs[KEY][7]}/>
//     <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10,padding:2,}}>{libelle}</Text>
//     </TouchableOpacity>;
// }

// const AddFormule=({type,libelle})=>{
//   const {targetUser}=useSelector(state=>state.user);
//   const {setPop}=usePopup();
//   const addFormuleAllowed=allowTo("ajouter une norme|user",targetUser?.privileges);
//   const KEY=addFormuleAllowed?"allowed":"notAllowed";
//    const {setFWrapperShow}=useFormules();
//   const handleEditPress=()=>{
//     if(!addFormuleAllowed){setPop({show:true,message:"Vous n'avez pas la permission d'ajouter une formule !",code:'#880000'});return;}
//     setFWrapperShow(true);}
//   return <TouchableOpacity
//       disabled={!addFormuleAllowed} 
//       style={{padding:4,margin:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:3,mouse:"pointer"}}
//       onPress={handleEditPress}
//     ><FontAwesome5 name="plus-circle" size={15} color={couleurs[KEY][7]}/>
//     <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10,padding:2,}}>{libelle}</Text>
//     </TouchableOpacity>;
// }

// const RetirerItem=({type,item})=>{
//   const targetUser=useSelector(state=>state.user.targetUser);
//   const {setPop}=usePopup();
//   const handlePress=()=>{
//     if(!allowTo("suprimer une norme|user",targetUser?.privileges)){
//       setPop({show:true,message:"Vous n'avez pas la permission de supprimer cette donnée !",code:'#880000'});
//       return;
//     }
//     if(confirm(`Êtes-vous sûr de vouloir supprimer ${item} des ${type} ?`)){

//     }
//   }
//   return <View style={{width:"auto",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",gap:10,mouse:"pointer"}}>
//     <Text style={{color:'rgba(0,0,0,0.5)',fontSize:12,padding:8,}}>{item}</Text>
//     <TouchableOpacity
//       disabled={!allowTo("suprimer une norme|user",targetUser?.privileges)}
//       style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)",margin:15}}
//       onPress={handlePress}
//     ><FontAwesome5 name="minus" size={8} color="red"/></TouchableOpacity>
//   </View>
// }

// const FormuleActions=({type,item})=>{
//       const {EditLansaParams,setWrapperShow,setItemStored}=useFormules();
//       const dispatch=useDispatch();
//       const {setPop}=usePopup();
//       const {user,powderNormes,formulesNormes}= useSelector(state => {
//                                                         const user=state.user.targetUser;
//                                                         const {powderNormes,formulesNormes}= state.powderNormes;
//                                                         return {user,powderNormes,formulesNormes};
//                                                       });
//       const userIsAdmin=user?user.isAdmin:false;
//       const deleteAllowed=allowTo("suprimer une norme|user",user?.privileges);
//       const updateAllowed=allowTo("modifier une norme|user",user?.privileges);
//       const isFormule=item.format!==undefined;
// const handleDelete=()=>{
//         if(confirm(`Êtes-vous sûr de vouloir supprimer ${item.name.toUpperCase()} des ${type} ?`)){
//           if(isFormule){
//             const formulesNormesToDispatch=formulesNormes.data.arr.filter(it=>it!==item);
//             // dispatch(setFormulesNormes({...formulesNormes,data:{arr:formulesNormesToDispatch}}));
//             UpdateItems({
//                 body:JSON.stringify({data:{arr:formulesNormesToDispatch},UtilisateurId:1}),
//                 url:"formules/normes/update-normes",
//                 token:user.token
//             })
//             .then((updatedNormes)=>{dispatch(setFormulesNormes(updatedNormes.data));})
//             .catch(function(){setPop({show:true,message:"Il y'a eu erreur a la mise a jour dee la formule !",code:'#880000'})})
//           }else{
//             const k=item.name.split(' ').join('_').toLowerCase();
//             const {[k]:undefined,...rest}=powderNormes.data;
//             // dispatch(setNormes({...powderNormes,data:rest}));
//             UpdateItems({
//                 body:JSON.stringify({data:rest,UtilisateurId:1}),
//                 url:"poudre/normes/update-normes",
//                 token:user.token
//             })
//             .then((updatedNormes)=>{dispatch(setNormes(updatedNormes.data));})
//             .catch(function(){setPop({show:true,message:"Il y'a eu erreur a la mise a jour du lansa !",code:'#880000'})})
//             // ici on ferait la suppression dans la base de données et ensuite dans le store
//           }
//           setPop({show:true,message:`${item.name.toUpperCase()} supprimé des ${type} avec succes`,code:'green'});
//         }
//       }

//   const handleEditPress=()=>{
//     // setItemStored(item);setWrapperShow(true);
//     EditLansaParams(item);
//   }
//   return <View style={{width:"auto",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:12,}}>
//     {/*userIsAdmin && */deleteAllowed && 
//     <TouchableOpacity
//       style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)"}}
//       onPress={handleDelete}
//     ><FontAwesome5 name="minus" size={8} color="red"/></TouchableOpacity>
//     }
//        <TouchableOpacity
//       style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)"}}
//       onPress={handleEditPress}
//     ><FontAwesome5 name={/*userIsAdmin*/updateAllowed?"edit":"eye"} size={/*userIsAdmin*/updateAllowed?8:12} color={primaryColor}/></TouchableOpacity>
//   </View>
// }

// const Title=()=>{
//   const {itemStored}=useFormules();
//   const itemName=itemStored?.name;
//   return <View style={{width:"100%",flexDirection:'row',justifyContent:'center',borderBottomWidth:1,paddingBottom:20,borderColor:"lightgrey",alignItems:'flex-end',gap:4,marginBottom:-10,}}>
//               <Text style={{width:"auto",textAlign:'center',color:"grey",alignSelf:'center',}}>{itemName!==undefined?"Specifications physico-chimiques de ":"Definir les specifications physico-chimiques de la " }</Text>
//               <Text style={{width:"auto",textAlign:'center',fontSize:14,fontWeight:'bold',color:"blue",alignSelf:'center',}}> {itemName!==undefined?itemStored?.name:"NOUVELLE FORMULE"}</Text>
//             </View>
// }

// const styles = StyleSheet.create({
//   item: {
//     paddingVertical: 10,//15
//     paddingHorizontal:15,// 20,
//   },
//   label: {
//     // fontSize: 16,//18
//     fontSize: 13,//18
//     letterSpacing:1.5,//2
//     color:'rgba(0,0,0,0.8)',
// },
//   subMenu: {
//     paddingLeft: 30,
//     marginHorizontal:'10%',
//     backgroundColor:'#f5f5f5',
//     borderRadius:8,
//   },
//   subItem: {
//     paddingVertical: 10,
//     letterSpacing:3,
//     maxHeight:30,
//     fontSize:10,
//   },
// });
