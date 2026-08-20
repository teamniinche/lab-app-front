import {View,Text,StyleSheet,Pressable} from "react-native";
import { useNavigation } from "@react-navigation/native";
import WinDim from '../../assets/operatingData'
import UpdateLiquidesNavigator from "../../navigators/updateLiquidesNavigator";
const {isLarge,screenHeight}=WinDim;

export default function ModalMesures() {
const navigation=useNavigation();
  return (<View>
        <View style={{...styles.modalContainer,paddingTop:isLarge && 8,}}>
            <View style={{...styles.modalContent,borderWidth:4,borderColor:'grey',width:isLarge && '70%',padding:isLarge && 40,height:isLarge && (screenHeight*0.8),}}>
                <UpdateLiquidesNavigator />
                <Pressable style={{width:'100%',backgroundColor:'blue',borderRadius:5,height:50,justifyContent:'center',}} onPress={()=>navigation.goBack()/*render(false)*/}>
                    <Text style={{color:'white',fontWeight:'bold',textAlign:'center',}}>Quitter</Text>
                </Pressable>
            </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    overlay: { 
    flex: 1, 
    justifyContent: "flex-end", 
    // backgroundColor: "rgba(0,0,0,0.4)" 
  },

  card: {
    height: "60%", // moitié de l’écran
    width:"99%",
    backgroundColor: "#fff",
    borderWidth:1,
    marginHorizontal:"auto",
    marginBottom:-15,
    borderColor:'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  modalContainer: {
    //regle les padding du fond gris ainsi  les height et width en quelque sorte du modal content
    // flex: 1,
    flexDirection:'column',
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical:'20%',//'2%'
    paddingHorizontal:'auto',//'20%',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // minWidth:'90%',
    // height:'fit-content',
  },
  modalContent: {
    minWidth:400,
    minHeight:'85%',
    width:480,//'95%',
    height:(screenHeight*0.8),//'70vh'
    padding:50,
    // paddingHorizontal:20,
    // paddingVertical:50,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    // ...Flex('column','center','center'),
    // gap:'1rem',
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
  },
});
