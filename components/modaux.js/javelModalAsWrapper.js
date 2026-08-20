import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNFormulesJavel,useJavelFormules } from "../wrappers/contexts";
import { FontAwesome5 } from "@expo/vector-icons";

export default function JavelModalWrapper({children,title,type}) {
  const {fWrapperShow,setFWrapperShow,wrapperShow,setWrapperShow,itemStored}=useJavelFormules();
  const {dialogShow}=useNFormulesJavel();
  const itemName=itemStored?.name || "Madar";
  const show=type==="any"?fWrapperShow:wrapperShow;
  const setShow=type==="any"?setFWrapperShow:setWrapperShow;

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true}
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        <View pointerEvents={dialogShow?"none":"auto"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {title?title:
            <View style={{width:"100%",flexDirection:'row',justifyContent:'center',borderBottomWidth:1,paddingBottom:20,borderColor:"lightgrey",alignItems:'flex-end',gap:4,marginBottom:-10,}}>
              <Text style={{width:"auto",textAlign:'center',color:"grey",alignSelf:'center',}}>{itemName!==""?"Specifications physico-chimiques de ":"Definir les specifications physico-chimiques du " }</Text>
              <Text style={{width:"auto",textAlign:'center',fontSize:14,fontWeight:'bold',color:"blue",alignSelf:'center',}}> {itemName!==""?itemStored?.name:"NOUVEAU LANSA"}</Text>
            </View>
            }
            {children}
            
            {false &&<View style={styles.buttons}>
              <TouchableOpacity
                style={{...styles.button,backgroundColor:"blue"}}
                onPress={() => setWrapperShow(false)}
              >
                <Text style={styles.buttonText}>Terminer</Text>
              </TouchableOpacity>
            </View>}
            <TouchableOpacity
                style={{position:'absolute',top:-25,right:-5,width:50,height:50,padding:40}}
                onPress={() => setShow(false)}
              >
                <FontAwesome5 name="times" size={15} color="red" />
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
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
    minHeight:600,
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

