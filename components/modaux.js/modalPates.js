// import React from "react";
import {View,Modal,TouchableOpacity,Text,StyleSheet} from "react-native";
import { Checkbox,Divider,Button, Dialog,Chip, Portal, Switch,Badge,PaperProvider, TextInput, TouchableRipple} from 'react-native-paper';

// import { AccueilContext } from "../accueil";
// import { Pates } from "../accueil";
import { Pates } from "../pates";
export default function ModalPates({/*navigation,*/bool,render}) {
  return (<View style={{...styles.container,maxWidth:300}}>
        <Modal animationType="slide" transparent={true}
        visible={bool}
        onRequestClose={() => render(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={{position:'absolute',margin:0,padding:0,top:-5,right:-5,}} onPress={()=>render(false)}>
          <Text style={{fontSize:14,}}>❌</Text>
        </TouchableOpacity>
          <Pates 
          /*navigation={navigation}*/ /*context={AccueilContext}*/
          render={(b) => render(b)}/>
          </View>
        </View>
      </Modal>
    </View>

    // <Portal>
    //       <Dialog style={{maxWidth:500,minWidth:400,marginHorizontal:"auto"}}
    //        visible={bool} onDismiss={()=>render(false)}>
    //         <Dialog.Title style={{fontSize:15,color:"black",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>Selectionner Pate</Dialog.Title>
    //         <Dialog.Content style={{maxWidth:900,minWidth:400,maxHeight:500,overflowX:"scroll",margin:"auto",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"flex-start",paddingHorizontal:40,height:"auto"}}>
    //             <TouchableOpacity style={{position:'absolute',margin:0,padding:0,top:-5,right:-5,}} onPress={()=>render(false)}>
    //               <Text style={{fontSize:14,}}>❌</Text>
    //             </TouchableOpacity>
    //             <Pates navigation={navigation} render={(b) => render(b)}/>
    //         </Dialog.Content>
    //       </Dialog>
    //     </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    flexDirection:"row",
    justifyContent: "center",
    alignItems: "center",
    // paddingVerical:"30%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width:'100%',
  },
  modalContent: {
    flexDirection:'row',
    width: 350,
    minHeight:300,
    paddingVertical:50,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    gap:50,
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
