// CALLED PACKAGES
import { View, Text, TouchableOpacity,Pressable, StyleSheet, Platform } from 'react-native';
import { DrawerActions,useNavigation, useRoute } from '@react-navigation/native';
import {InputDatePickerPaper} from './dataPickers/datePickerPaper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {useDispatch,useSelector } from 'react-redux';
import {FontAwesome5} from '@expo/vector-icons';
import { Portal } from 'react-native-paper';
import { Image } from 'expo-image';
import {useState} from 'react';
// DATA STATEMENTS
import { setPowderType } from './store/reducers/powderAnalysesReducer';
import { changeCritery } from './store/reducers/criteryReducer';
import { PopupProvider, usePopup } from './wrappers/contexts';
import { setPeriod} from './store/reducers/periodReducer';
import { cloone } from './store/reducers/activedReducer';
import { connect } from './store/reducers/userReducer';
// CALLED COMPONENTS
import ChangePassword from './modaux.js/users/changePassWord';
import { Connection } from '../navigators/DrawerNavigator';
import { allowTo } from '../assets/functions';
import { clooner, Flex } from './accueil';
import Connect from './connexion/connect';
import Periode from './periode';
import Pop from './popup';
// UTILS
import { useDropCustomDrawer } from '../hooks/useConformite';
import { primaryColor } from '../assets/constantes';


export function Period(){
  const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
  return  {startedAt:startedAt,endedAt:endedAt};

}

export const Indix=({Type,clr})=>{
    return <Text style={{color:clr!==null?clr:'rgba(3, 83, 3, 0.3)',fontSize:8,}}>{Type!=='toClose'?'▲':'▼'}</Text>
}

const Tous=()=>{return <Text style={{backgroundColor:'rgb(181, 224, 181)',marginRight:30,paddingLeft:10,}}>Tous</Text>}
const Isoles=()=>{return <Text style={{backgroundColor:'rgba(255,0,0,0.2)',marginRight:30,paddingLeft:10,}}>Isolés</Text>}

export default function CustomDrawerContent({ navigation }) {
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    // const route=useRoute();
    // const nav=useNavigation();
    // const setRoute=(str)=>{
    //   const routeRoot=route.name.split('/')[0];
    //   navigation.setOptions({title:routeRoot+"/"+str})
    // };
    // const navigation=useNavigation();
    const [targeted,setTargeted]=useState("");
    const [hovered,setHovered]=useState("");
    const {period,powderType,clooned}= useSelector(state => {
      const period=state.period.targetPeriod;
      const powderType=state.powderAnalysed.powderType;
      const clooned=state.actived.clooned;
      return {period,powderType,clooned};
    });
    const {dropState,dropRubrique}=useDropCustomDrawer();
    const {poudres,liquides,matieresPremieres,parametres}=dropState;
    // const {key,startedAt,endedAt}=period;
    // const currentCritery= useSelector(state => state.critery.currentCritery);
    // const [multiusageOpen, setMultiusageOpen] = useState(false);
    // const [patesOpen, setPatesOpen] = useState(false);
    // const [cosmetiquesOpen, setCosmetiquesOpen] = useState(false);
    // const [causilicateOpen, setCausilicateOpen] = useState(false);
    // const [eauxOpen, setEauxOpen] = useState(false);
    // const [paramsOpen, setParamsOpen] = useState(false);
    const {connected,privileges,pseudo}=Connection();
    const [modaux,setModaux]=useState({visible:false,vizible:false,vigible:false})
    const dispatchedKey=(key)=>{
            return new Promise((resolve)=>{
              dispatch(setPowderType(key));
              setTimeout(()=>{
                resolve(powderType[0].name);
              },100);
          })}
    // const [critery,setCritery]=useState(currentCritery);
    // const handleUsersPress=()=>{setModaux({...modaux,visible:true})}
    const handleChangePwdPress=()=>{setModaux({...modaux,vigible:true})}
    const differentsPowderTypes={Extra:"Extra",Local:"Local",Get:"Get",Diam:"Diam",Auto:"Auto",Finies:"Poudres finies"};
    const differentsLiquidesTypes=["Liquides multiusage","Pates dentifrices", "Cosmétiques"];
    const diffrentesMatieresPremieres=["Caustique la soude","Silicate de sodium","Eaux"];
  return (
    <DrawerContentScrollView>

    <Periode navigation={navigation}/>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {dropRubrique('poudres'),dispatch(setPowderType(null)),navigation.navigate('Poudres')}}
      >
        <View style={{minHeight:25,/*30,*/width:'100%',/*,'80%'*/flexDirection:'row',gap:8,flexWrap:'nowrap',}}>
            <Image source={require('../assets/images/poudre.png')} style={{borderWidth:'white',backgroundColor:primaryColor,padding:5,borderRadius:'50%',width:25,height:25,}} contentFit='contain'/>
            <Text style={{...styles.label,size:12,/* 14*/color:'rgb(47, 47, 185)',}}
            >Poudres {poudres ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
        </View>

      </TouchableOpacity>
      {/* Sous-catégories affichées dynamiquement */}
      {poudres && (
        <View style={{...styles.subMenu,width:'95%',marginHorizontal:5,paddingVertical:15,marginVertical:10,marginTop:-5,}}>
          <TouchableOpacity onMouseEnter={() => setHovered("root")} style={[styles.subItem,styles.rootAddedStyle,hovered==="root" && styles.hoveredStyle,targeted==="root" && styles.targetedStyle]} onPress={() => {setTargeted("root");dispatch(setPowderType(null)),navigation.navigate('Poudres')}}>
            <ButtonText name="home" text="root"/>
          </TouchableOpacity>
          {Object.entries(differentsPowderTypes).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              onMouseEnter={() => setHovered(key)}
              style={[styles.subItem, hovered === key && styles.hoveredStyle, targeted === key && styles.targetedStyle]}
              onPress={() => {
                dispatch(setPowderType(key));
                setTargeted(key);
              }}
            >
              <ButtonText name="star" text={value} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* LIQUIDES */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => {dropRubrique('liquides'),navigation.navigate('Accueil')}}
      >
        <View style={{minHeight:25,/*30,*/width:'100%',/*,'80%'*/flexDirection:'row',gap:8,flexWrap:'nowrap',}}>
            {/* <FontAwesome5 name="cog" size={20} color="grey"/> */}
            <Image source={require('../assets/images/liquides.png')} style={{borderWidth:'white',backgroundColor:primaryColor,padding:5,borderRadius:'50%',width:25,height:25,}} contentFit='contain'/>
            <Text style={{...styles.label,size:12,/* 14*/color:'rgb(47, 47, 185)',}}
            >Liquides & Pates {liquides ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
        </View>
      </TouchableOpacity>
      

      {/* Sous-catégories affichées dynamiquement */}
      {liquides && (
        <View style={{...styles.subMenu,width:'95%',marginHorizontal:5,paddingVertical:15,marginVertical:10,marginTop:-5,}}>
          <TouchableOpacity style={[styles.item,styles.rootAddedStyle,targeted==="root" && styles.targetedStyle,hovered==="root" && styles.hoveredStyle]} onMouseEnter={() => setHovered('root')} onPress={() => {setTargeted('root');navigation.navigate('Liquides')}}>
            <ButtonText name="home" text="root"/>
          </TouchableOpacity>
          {differentsLiquidesTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.subItem, hovered === type && styles.hoveredStyle, targeted === type && styles.targetedStyle]}
              onPress={() => {setTargeted(type);navigation.navigate(type, { critery: null })}}
              onMouseEnter={() => setHovered(type)}
            >
              <ButtonText name="star" text={type} />
            </TouchableOpacity>
          ))}

        </View>
      )}

      <TouchableOpacity
        style={styles.item}
        onPress={() => {dropRubrique('matieresPremieres'),navigation.navigate('Accueil')}}
      >
        <View style={{minHeight:25,/*30,*/width:'100%',/*,'80%'*/flexDirection:'row',gap:8,flexWrap:'nowrap',}}>
            {/* <MenuAvecIcon name="boxes-stacked" size={20} color="grey"/> */}
            <Image source={require('../assets/images/matiere-premiere.png')} style={{borderWidth:1,backgroundColor:primaryColor,padding:5,borderRadius:'50%',width:25,height:25,}} contentFit='contain'/>
            <Text style={{...styles.label,size:12,/* 14*/color:'rgb(47, 47, 185)',}}
            >Matieres premieres {matieresPremieres ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
        </View>

      </TouchableOpacity>
      {/* Sous-catégories affichées dynamiquement */}
      {matieresPremieres && (
        <View style={{...styles.subMenu,width:'95%',marginHorizontal:5,paddingVertical:15,marginVertical:10,marginTop:-5,}}>
          <TouchableOpacity style={[styles.subItem,styles.rootAddedStyle,targeted==="root" && styles.targetedStyle,hovered==="root" && styles.hoveredStyle]} onMouseEnter={() => setHovered('root')} onPress={() => {setTargeted('root');navigation.navigate('Accueil')}}>
            <ButtonText name="home" text="root"/>
          </TouchableOpacity>
          {diffrentesMatieresPremieres.map((type) => (
            <TouchableOpacity style={[styles.subItem,hovered === type && styles.hoveredStyle,targeted === type && styles.targetedStyle]} onMouseEnter={() => setHovered(type)} onPress={() =>{setTargeted(type);navigation.navigate('Accueil')}}>
              <ButtonText name="star" text={type}/>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{marginTop:20,/*40 */...Flex('column','center','flex-start'),}}>

      {connected && <TouchableOpacity
        style={styles.item}
        onPress={() => dropRubrique('parametres')}
      >
        <View style={{minHeight:25,/*30,*/width:'100%',/*,'80%'*/flexDirection:'row',gap:8,flexWrap:'nowrap',}}>
            <FontAwesome5 name="cog" size={20} color="grey"/>
            <Text style={{...styles.label,size:12,/* 14*/color:'rgb(47, 47, 185)',}}
            >Paramètres {parametres ? <Indix Type="toOpen"/> : <Indix Type="toClose"/>}</Text>
        </View>

      </TouchableOpacity>}
      {/* Sous-catégories affichées dynamiquement */}
      {parametres && (
        <View style={{...styles.subMenu,width:'95%',marginHorizontal:5,paddingVertical:15,marginVertical:10,marginTop:-12,}}>
          {allowTo("consulter normes",privileges) && <>
            <TouchableOpacity style={styles.subItem} onPress={() => navigation.navigate('Normes physico-chimiques')}>
              <MenuAvecIcon name="cogs" text="Normes physico-chimiques"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.subItem} onPress={() =>navigation.navigate('Utilisateurs')}
              // handleUsersPress
              >
              <MenuAvecIcon name="users" text="Utilisateurs"/>
            </TouchableOpacity>
          </>}
          {/* {connected &&  */}
          <TouchableOpacity style={styles.subItem} onPress={handleChangePwdPress}>
            <MenuAvecIcon name="user-lock" text="Changer votre Mot de Passe"/>
          </TouchableOpacity>
          {/* } */}

          {allowTo("illimite",privileges) && <TouchableOpacity style={styles.subItem} onPress={() => dispatch(cloone(!clooned))}>
            <MenuAvecIcon name="cogs" text={clooned?clooner("Clooner"): "Clooner"}/>
          </TouchableOpacity>}
          
        </View>
      )}
      <ChangePassword visible={modaux.vigible} render={()=>setModaux({...modaux,vigible:false})}/>
      {/* <AddUser vizible={modaux.vizible} render={(z)=>setModaux({...modaux,vizible:false,visible:false})}/> */}
      {/* <Users visible={modaux.visible} rend={()=>
      {
        setModaux({...modaux,visible:false});
        setTimeout(()=>setModaux({...modaux,vizible:true}),500);
      }} 
      render={()=>setModaux({...modaux,visible:false})}

      /> */}
      <SeConnecter setPop={(ob)=>setPop(ob)}/>
      </View>
      {/* <Portal><PopupProvider><Pop/></PopupProvider></Portal> */}
    </DrawerContentScrollView>
  );
}

export const MenuAvecIcon=({name,text,color="blue",size=15})=>{
  return <View style={{gap:8,flexDirection:'row',flexWrap:'nowrap',}}>
          <FontAwesome5 name={name} size={size} color={color}/>
          <Text style={{color:color!=='blue' && color,}}>{text}</Text>
      </View>
}

export const ButtonText=({name,text,color="blue",size=10})=>{
  return <Text style={styles.label}><FontAwesome5 name={name} size={size} color={color}/>{" "+text}</Text>
}

export const SeConnecter=({setPop})=>{
    const {connected}=Connection();
    const dispatch = useDispatch();
    const [visible,setVisible]=useState(false);
    const handlePress=()=>{
        if(connected){dispatch(connect(null));
        }else{
            setVisible(true);
          }
        }
        
        return  <>
      <TouchableOpacity style={{...styles.subItem,marginHorizontal:20,backgroundColor:connected?'red':'blue',borderRadius:5,}} onPress={handlePress}>
        <Text style={{color:'white',fontWeight:'bold',paddingHorizontal:10,}}><MenuAvecIcon name={connected?"sign-out-alt":"sign-in-alt"} size={20} text={connected?'Déconnexion':'Se connecter'} color="white"/></Text>
      </TouchableOpacity>
      <Connect visible={visible} setPop={(ob)=>setPop(ob)} render={(toPop)=>setVisible(false)}/>
  </>
}

export const ChangePwd=()=>{
    const [visible,setVisible]=useState(false);
    const handlePress=()=>{setVisible(true);}
  return  <>
            <TouchableOpacity style={styles.subItem} onPress={handlePress}>
            <MenuAvecIcon name="user-lock" text="Changer votre Mot de Passe"/>
          </TouchableOpacity>
      </>
}

export const Utilisateurs=()=>{
    const [visible,setVisible]=useState(false);
    const handlePress=()=>{setVisible(true);}
  return  <>
          <TouchableOpacity style={styles.subItem} onPress={handlePress}>
            <MenuAvecIcon name="users" text="Utilisateurs enregistrés"/>
          </TouchableOpacity>
      </>
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
    color:'rgba(0,0,0,0.6)',
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
    // fontSize:12,
    fontSize:10,
    marginHorizontal:20,
    paddingLeft:15,
  },
  hoveredStyle:{borderWidth:1,borderRadius:5,borderColor:'rgba(0,0,255,0.2)'},
  targetedStyle:{backgroundColor:'rgba(0,0,255,0.1)',borderRadius:5},
  rootAddedStyle:{paddingLeft:20,marginLeft:-15,marginRight:20},
});
