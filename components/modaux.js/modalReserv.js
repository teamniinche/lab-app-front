import React,{useState,useContext,useMemo} from "react";
import {
  View,
  Text,
  Modal,
  // Button,
  // TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {useDispatch,useSelector} from 'react-redux';
import { data as reducerData } from "../store/reducers/dataReducer";
import { Checkbox } from '@futurejj/react-native-checkbox';
// import { Flex } from "../../assets/functions";
import { AccueilContext} from "../wrappers/contexts";
import { CheckReservBoxes,useGlobalChecked } from "../wrappers/contexts";
import { clooner } from "../accueil";
import IdNavigator from "../../navigators/idNavigator";
function Flex(dir,jC,aI){
  return {
    display:'flex',
    flexDirection:dir,
    justifyContent:jC,
    alignItems:aI,
  }
}
//  data à ModalRserv || CheckRBParent = Machine à Pot = reservoirs à Reserv_component
export function Reserv_component({check,data,machine,txt}){
    const {obj,setObj}=useContext(AccueilContext);
    const {globalChecked,setGlobalChecked,otherChecked,setOtherChecked}=useGlobalChecked();
    const {from,results,color}=data;

    function oneAlreadyCkecked(objet,F,M){ // Pour unChecker les reservoirs de la meme machine que celui checké et du meme produit
        const otherChecked=objet.filter(i=>i.machine===M);
        if(otherChecked.length!==0){
          setOtherChecked(otherChecked[0].machine+'_'+otherChecked[0].reservoir);
        }else{return}
    }

    const [checked,setChecked]=useState(false);
    const dispatch=useDispatch();
    const glblChecked=globalChecked.split('_')[0];
    const idChecked=(machine+'_'+txt);
    
    const handleCheckBoxPress=()=>{
      if(!checked){// si le reservoir est déjà *checké* avant ce clic
        oneAlreadyCkecked(obj,from,machine);
        const filtredOb=obj.filter(item=>(item.machine+item.from)!==(machine+from));// Rechercher et supprimer l'enregistrement de meme machine s'il y'en a
        filtredOb.push({from:from,machine:machine,reservoir:txt,results:results,color:color});// Ajouter le nouveau checké
        setObj(filtredOb);
        dispatch(reducerData(null));
        setGlobalChecked(idChecked);// Identifiant du dernier enregistrement à la liste
      }else{ // Si le reservoir est *non-checké* avant le clic
        const filtredOb=obj.filter(item=>item.machine!==machine);// une fois desChecké,à supprimer aussi de la liste de la selection
        setObj(filtredOb);
        setChecked(false);// apres suppression, désChecké
      }
        }

  useMemo(()=>{if(check){setChecked(!checked)}else{(otherChecked===(machine+'_'+txt) || glblChecked===machine) && setChecked(false);}},[check,otherChecked])


  return <View style={{...Flex('column','center','center'),}}>
    <Text style={{letterSpacing:-1,marginBottom:-10,}}>{txt}</Text>
    <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={handleCheckBoxPress}/>
  </View>
}
function Pot({machine,data}){
  const {globalChecked}=useGlobalChecked();
  const checkedMachine=globalChecked.split('_')[0];
  const {reservoirs,color}=data;
  const machnes=['A','B','C'];
  const rsvoirs=machnes.includes(machine)?[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]:reservoirs;

    return <View style={{height:24,/*'2rem',*/padding:6,/*'0.5rem',*/minWidth:'100%',...Flex('row','flex-start','center'),gap:4,/*'0.2rem',border:'1px solid grey',*/borderRadius:10,}}>
        <Text style={{fontWeight:'bold',color:color,fontSize:16,marginRight:12,}}>{machine}</Text>
        {rsvoirs.map((reservoir,index)=><Reserv_component key={index} data={data} machine={machine} check={globalChecked===(machine+'_'+reservoir) && (checkedMachine===machine)} txt={reservoir}/>)}
    </View>
}

export default function modalReserv({/*navigation,*/data,bool,render}) {
   const clooned= useSelector(state => state.actived.clooned);
  const {machines,color}=data;
  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true}
        visible={bool}
        onRequestClose={() => render(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight:'bold',color:color,alignSelf:'center',}}>{'Identification '+(clooned?clooner(data.from):data.from)}</Text>
            
            <ScrollView horizontal={true}  style={styles.reservoirs}>
            {/* <IdNavigator data={data} /> */}
            <CheckReservBoxes>
                <View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',width:'100%',height:'100%',paddingVertical:'5%',gap:22,}}>
                    {machines.map((machine,key)=> <Pot key={key} machine={machine} data={data}/> )}
                </View>
            </CheckReservBoxes>
            </ScrollView>
            
            <View style={styles.buttons}>
              <TouchableOpacity
                style={{...styles.button,backgroundColor:color}}
                onPress={() => render(false)}
              >
                <Text style={styles.buttonText}>Terminer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function CheckRBParent({route,data}) {
  const donnees=route?.params.data || data; //via les options de la route
  // console.log(route?.params.data.machines);
  // console.log(donnees);
  const {machines}=donnees; // via le modal
  return <CheckReservBoxes>
            <ScrollView horizontal={true}  style={styles.reservoirs}>

          <View style={{flexDirection:'column',justifyContent:'center',alignItems:'flex-start',width:'100%',maxHeight:400,paddingVertical:'5%',gap:22,/*'0.5rem',overflowY:'scroll'*/}}>
              {machines.map((machine,key)=> <Pot key={key} machine={machine} data={donnees/*data*/}/> )}
          </View>
            </ScrollView>

      </CheckReservBoxes>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth:350,
    width:350,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {//partie grise
    flex:1,
    justifyContent:"center",// "flex-start",
    alignItems: "center",
    paddingVertical:'20%',
    paddingHorizontal:'auto',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width:'100%',
    // height:'100%',
  },
  modalContent: {//partie blanche
    maxWidth:800,
    // maxHeight:800,
    // minHeight:500,
    // height:'70%',
    width:'90%',//'85vw',
    padding:20,
    backgroundColor: "white",
    flexDirection:'column',
    justifyContent:'center',
    borderRadius: 10,
    alignItems: "flex-start",
    gap:2,//'1rem',
    overflowX:'scroll',
  },
  reservoirs:{
    height:'100%',
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "blue",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
