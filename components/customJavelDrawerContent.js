import {useMemo,useState} from 'react';
import { View, Text, TouchableOpacity,Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {useDispatch,useSelector } from 'react-redux';
import {FontAwesome5} from '@expo/vector-icons';
import { Searchbar,Chip } from 'react-native-paper';
import {Lansas,Parfums,Formats,FormatsJavel,typesJavel, newLansa } from '../iterables';
import { Connection } from '../navigators/DrawerNavigator';
import {useCurrentJavelProducted,NouvelleFormuleJavelProvider,useJavelFormules } from './wrappers/contexts';
import { setCurrentJavelProducted, storeJavelFocusedListe } from './store/reducers/currentJavelProducted';
import { setFormulesJavelNormes, setJavelNormes } from './store/reducers/javelNormes';
import JavelModalWrapper from './modaux.js/javelModalAsWrapper';
import { allowTo } from '../assets/functions';
import { primaryColor } from '../assets/constantes';
import {JavelEdit} from './editLansa';
// import FormuleEdit from './EditFormule';
import WinDim from '../assets/operatingData';
const {isLarge}=WinDim;

export const Indix=({Type,clr})=>{
    return <Text style={{color:clr!==null?clr:'rgba(3, 83, 3, 0.2)',fontSize:8,}}>{Type!=='toClose'?'▲':'▼'}</Text>
}

export default function CustomJavelDrawerContent() {
    const navigation=useNavigation();
    // Store & Contexts ----------------------------------------------
    const {setCurrentProductedPro,ListOfFocusedAndLastNumber,registred}=useCurrentJavelProducted();
    const {javelFocused,setJavelFocused}=useJavelFormules();
    const dispatch=useDispatch();
    const {period,currentJavelProducted,javelNormes,formulesJavelNormes}= useSelector(state => {
      const period = state.period.targetPeriod;
      const currentJavelProducted = state.currentJavelProducted.currentJavelProducted;
      // const clooned= useSelector(state => state.actived.clooned);
      const {javelNormes,formulesJavelNormes} = state.javelNormes;
      return {period,currentJavelProducted,javelNormes,formulesJavelNormes};
    });
    
    // Accordions states --------------------------------------------
    const [multiusageOpen, setMultiusageOpen] = useState(false);
    const [patesOpen, setPatesOpen] = useState(false);
    const [cosmetiquesOpen, setCosmetiquesOpen] = useState(false);
    const [formatsOpen, setFormatsOpen] = useState(false);
    const [parfumsOpen, setParfumsOpen] = useState(false);
    const [searchBarInput, setSearchBarInput] = useState(null);

    // CallBacks -----------------------------------------------------
    const handleSearchBarChange=(text)=>setSearchBarInput(text);
    const searchBarResult=useMemo(() => {
    const searchDomain=[...Object.keys(typesJavel),...FormatsJavel];
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

    const activeStyle=(key)=>{
      const style={backgroundColor:primaryColor,paddingVertical:4,paddingHorizontal:6,marginVertical:2,borderRadius:6};
      return IAmIn(key)?style:{};
    }

    const IAmIn=(key)=>Object.keys(currentJavelProducted).find(k=>k===key);

    function handleLansaPress(formats,val){
      const key=val.name.split(' ').join('_').toLowerCase();
    //   const key=formats!=="lansa"?("fini"+formats.replace(" ","_")+KEY):KEY;
      if(IAmIn(key)){
        const {[key]:undefined,...rest}=currentJavelProducted;
        const restArray=Object.values(rest);
        const firstElem=restArray.length!==0?restArray[0]:{};
        const {list}=ListOfFocusedAndLastNumber(firstElem,registred);
        setCurrentProductedPro(rest);
        dispatch(setCurrentJavelProducted(rest));
        dispatch(storeJavelFocusedListe(list));
      }else{
        if(Object.keys(currentJavelProducted).length===0){const {list}=ListOfFocusedAndLastNumber(val,registred);dispatch(storeJavelFocusedListe(list));}
        setCurrentProductedPro({...currentJavelProducted,[key]:val});
        dispatch(setCurrentJavelProducted({...currentJavelProducted,[key]:val}));
      }
    }

    // function handleFormulePress(val){
    //   const key=val.name.split(' ').join('_').toLowerCase();
    //   if(IAmIn(key)){
    //     const {[key]:undefined,...rest}=currentJavelProducted;
    //     setCurrentProducedPro(rest);
    //     dispatch(setCurrentJavelProducted(rest));
    //   }else{
    //     setCurrentJavelProducedPro({...currentJavelProducted,[key]:val})
    //     dispatch(setCurrentJavelProducted({...currentJavelProducted,[key]:val}));
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
      <TouchableOpacity
        style={[  styles.item,{marginTop:10}]}
        onPress={() =>{setMultiusageOpen(!multiusageOpen);setPatesOpen(false);setCosmetiquesOpen(false);}}
      >
        <Text style={styles.label}>📋 Formats {multiusageOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
      </TouchableOpacity>

      {/* Sous-catégories affichées dynamiquement */}
      {multiusageOpen && (
            <View style={[styles.subMenu,{paddingVertical:25}]}>
                <AddItem type="Formats" libelle="Ajouter un format"/>
                {FormatsJavel.map((item,i)=><RetirerItem key={i} type="Formats" item={item}/>)}
          </View>
      )}

      {/* Catégories - bouton principal */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => {setPatesOpen(!patesOpen);setMultiusageOpen(false);setCosmetiquesOpen(false)}}
      >
        <Text style={styles.label}>📋 Types Javel {patesOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
      </TouchableOpacity>

      {/* Sous-catégories affichées dynamiquement */}
      {patesOpen && (
        <View style={[styles.subMenu,{paddingHorizontal:10,paddingVertical:25}]}>
          <AddItem type="Lansas" libelle="Ajouter un lansa"/>
          {Object.entries(typesJavel).map(([f,value],i)=>
            <Pressable key={i} onHoverIn={() =>setJavelFocused(i)} onHoverOut={() =>setJavelFocused(null)} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",gap:10}}>
            <TouchableOpacity style={[styles.subItem,activeStyle(f),{letterSpacing:2}]} onPress={()=>handleLansaPress("lansa",value)}>
              <Text key={i} style={{color:IAmIn(f)?'white':'rgba(0,0,0,0.7)',fontSize:11,fontWeight:'bold'}}>{"🔹 "+f.charAt(0).toUpperCase()+f.replace("avec","avc").replace("sans","ss").replace("export","exp").slice(1).split('_').join(' ')}</Text>
            </TouchableOpacity>
            {(javelFocused===i || !isLarge) &&<FormuleActions type="Lansas" item={value}/>}
            </Pressable>
        )}
        </View>
      )}

    {/* Catégories - bouton principal */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => {setCosmetiquesOpen(!cosmetiquesOpen);setPatesOpen(false);setMultiusageOpen(false)}}
      >
        <Text style={styles.label}>📋 Conditionnes {patesOpen ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
      </TouchableOpacity>

      {/* Sous-catégories affichées dynamiquement */}
      {cosmetiquesOpen && (
        <View style={[styles.subMenu,{width:"104%",paddingHorizontal:10,paddingVertical:25,paddingLeft:-15,marginLeft:-4}]}>
          <AddFormule type="Formules" libelle="Ajouter une nouvelle formule"/>
          {/* javelNormes */}
          {formulesJavelNormes.map((value,i)=>{
            const {nom,name,format}=value;
            const f=name?.split(" ").join("_").toLowerCase();
            const formats=format.reduce((acc,k)=>acc+" "+k,"");
            // "🔹 "+f.charAt(0).toUpperCase()+f.slice(1).replace("sans","ss").replace("avec","av").replace("export","exp.").split('_').join(' ')
          return <Pressable key={i} onHoverIn={() =>setFocused(("fini"+i))} onHoverOut={() =>setFocused(null)} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",marginVertical:4,gap:10}}>
              <TouchableOpacity key={i} onPress={() => handleLansaPress(formats,value)} style={[styles.subItem,{flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start",paddingLeft:3,gap:0,...activeStyle(("fini"+f+formats.replace(" ","_")))}]}>
                  <Text key={i} style={{color:'rgba(0,0,0,0.7)',fontSize:11,fontWeight:'bold'}}>{"🔹 "+nom}</Text>
                  <Text style={{width:"100%",color:'rgba(0,0,0,0.5)',fontSize:8,fontWeight:'bold',textAlign:"left",paddingLeft:20}}>{formats}</Text>
              </TouchableOpacity>
              {(javelFocused===("fini"+i )|| !isLarge) &&<FormuleActions type="Formules" item={value}/>}
          </Pressable>}
        )}
        </View>
      )}
      <NouvelleFormuleJavelProvider>
        <JavelModalWrapper type="any">
          <JavelEdit/>
        </JavelModalWrapper>
        {/* <JavelModalWrapper title={<Title/>} type="any">
          <FormuleEdit/>
        </JavelModalWrapper> */}
      </NouvelleFormuleJavelProvider>

    </DrawerContentScrollView>
  );
}

const AddItem=({type,libelle})=>{
  const targetUser=useSelector(state => state.user.targetUser);
   const {setWrapperShow,setItemStored}=useJavelFormules();
  const handlePress=()=>{
    return alert(type)
  }
  const handleEditPress=()=>{
    if(!allowTo("ajouter une norme",targetUser?.privileges)){
        alert("Vous n'êtes pas habileté à ajouter une norme.\nC'est du ressort exclusif de responsable de departement !");
        return;
    }
    setItemStored(newLansa.new);setWrapperShow(true);
  }
  return <TouchableOpacity
      style={{padding:4,margin:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:3,mouse:"pointer"}}
      onPress={handleEditPress}
    ><FontAwesome5 name="plus-circle" size={15} color={primaryColor}/>
    <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10,padding:2,}}>{libelle}</Text>
    </TouchableOpacity>;
}

const AddFormule=({type,libelle})=>{
  const targetUser=useSelector(state => state.user.targetUser);
   const {setFWrapperShow}=useJavelFormules();
  const handlePress=()=>{
    return alert(type)
  }
  const handleEditPress=()=>{
    if(!allowTo("ajouter une norme",targetUser?.privileges)){
        alert("Vous n'êtes pas habileté à ajouter une norme.\nC'est du ressort exclusif de responsable de departement !");
        return;
    }
    setFWrapperShow(true);
  }
  return <TouchableOpacity
      style={{padding:4,margin:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',gap:3,mouse:"pointer"}}
      onPress={handleEditPress}
    ><FontAwesome5 name="plus-circle" size={15} color={primaryColor}/>
    <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10,padding:2,}}>{libelle}</Text>
    </TouchableOpacity>;
}

const RetirerItem=({type,item})=>{
  const targetUser=useSelector(state => state.user.targetUser);
  const handlePress=()=>{
    if(!allowTo("supprimer une norme",targetUser?.privileges)){
        alert("Vous n'êtes pas habileté à supprimer une norme.\nC'est du ressort exclusif de responsable de departement !");
        return;
    }
  }
  return <View style={{width:"auto",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",gap:10,mouse:"pointer"}}>
    <Text style={{color:'rgba(0,0,0,0.5)',fontSize:12,padding:8,}}>{item}</Text>
    <TouchableOpacity
      style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)",margin:15}}
      onPress={handlePress}
    ><FontAwesome5 name="minus" size={8} color="red"/></TouchableOpacity>
  </View>
}

const FormuleActions=({type,item})=>{
      const {setWrapperShow,setItemStored}=useJavelFormules();
      const dispatch=useDispatch();
      const {user,javelNormes,formulesJavelNormes}= useSelector(state => {
                                                        const user=state.user.targetUser;
                                                        const {javelNormes,formulesJavelNormes}= state.javelNormes;
                                                        return {user,javelNormes,formulesJavelNormes};
                                                      });
      const userIsAdmin=user?user.isAdmin:false;
      const isFormule=item.format!==undefined;
      const handleDelete=()=>{
        if(!allowTo("supprimer une norme",user?.privileges)){
            alert("Vous n'êtes pas habileté à supprimer une norme.\nC'est du ressort exclusif de responsable de departement !");
            return;
        }
        if(confirm(`Êtes-vous sûr de vouloir supprimer ${item.name.toUpperCase()} des ${type} ?`)){
          if(isFormule){
            const formulesNormesToDispatch=formulesJavelNormes.filter(it=>it!==item);
            dispatch(setFormulesJavelNormes(formulesNormesToDispatch));
          }else{
            const k=item.name.split(' ').join('_').toLowerCase();
            const {[k]:undefined,...rest}=javelNormes;
            dispatch(setJavelNormes(rest));
            // ici on ferait la suppression dans la base de données et ensuite dans le store
          }
          alert(`${item.name.toUpperCase()} supprimé des ${type}`);
        }
      }

  const handleEditPress=()=>{
    setItemStored(item);setWrapperShow(true);
  }
  return <View style={{width:"auto",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:12,}}>
    {userIsAdmin && <TouchableOpacity
      style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)"}}
      onPress={handleDelete}
    ><FontAwesome5 name="minus" size={8} color="red"/></TouchableOpacity>}
       <TouchableOpacity
      style={{backgroundColor:"rgb(235,235,235)",borderRadius:6,paddingVertical:4,paddingHorizontal:6,borderColor:"rgba(0,0,0,0.6)"}}
      onPress={handleEditPress}
    ><FontAwesome5 name={userIsAdmin?"edit":"eye"} size={userIsAdmin?8:12} color={primaryColor}/></TouchableOpacity>
  </View>
}

const Title=()=>{
  const {itemStored}=useJavelFormules();
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
    fontSize: 16,//18
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
