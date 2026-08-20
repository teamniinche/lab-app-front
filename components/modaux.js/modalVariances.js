import { useLayoutEffect} from "react";
import {View,Modal,TouchableOpacity,Pressable,Platform,Text,StyleSheet} from "react-native";
import {GestureHandlerRootView,Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue,runOnJS, withSpring } from "react-native-reanimated";
import { screenHeight } from "../../App";
import Colors from "../../assets/colors";
import { Variances, VariancesNavigator } from "../variances";
export default function ModalVariances({machinesReservoirs,variancesObject,imagesVariances,bool,render}) {
    const translateY=useSharedValue(0);
    const MAX_TRANSLATE_Y=-screenHeight*(5/6);
    const context=useSharedValue({y:0});
    const gesture=Gesture.Pan()
    .onStart(()=>{
      context.value={y:translateY.value};
    })
    .onUpdate((event)=>{

      translateY.value=event.translationY+context.value.y;
    // runOnJS(alert)(JSON.stringify({y:context.value.y,tY:translateY.value,translation:event.translationY}))

      translateY.value=Math.max(translateY.value,MAX_TRANSLATE_Y);
    })
    .onEnd((event)=>{
      // Position "moitié écran"

  const MIDDLE_POSITION = -screenHeight/2;

  // Position "fermée en bas"
  const CLOSED_POSITION = 0;

  // Position "ouverte max en haut"
  const OPEN_POSITION = MAX_TRANSLATE_Y;

  if (translateY.value > (MIDDLE_POSITION/2)) {
    // runOnJS(alert)(JSON.stringify({scH:screenHeight/4,y:context.value.y,tY:translateY.value+MIDDLE_POSITION,translation:event.translationY,mP:MIDDLE_POSITION/2}))
    translateY.value = withSpring(-80/*CLOSED_POSITION*/, { damping: 50 }
    //   , (isFinished) => {
    //   if (isFinished) {
    //     runOnJS(render)(false); // ferme le modal
    //   }
    // }
  );
  } else if (translateY.value <= ((3*MIDDLE_POSITION)/2)) {
    translateY.value = withSpring(-80/*OPEN_POSITION*/, { damping: 50 });
  } else {
    translateY.value = withSpring(-80 /*MIDDLE_POSITION */, { damping: 50 });
  }
    });

    const rBottomSheetStyle=useAnimatedStyle(()=>{
      return {
        transform:[{translateY:translateY.value}]
      }
    });

    useLayoutEffect(()=>{
        translateY.value=0;

    },[])
     
  return (
    <View style={{...styles.container,maxWidth:300,}}>
    
      <Modal 
        animationType="slide"
        transparent={true}
        visible={bool}
        onRequestClose={() => render(false)}
      >
        {Platform.OS==='web'?<View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={{position:'absolute',margin:0,padding:0,top:-5,right:-5,}} onPress={()=>render(false)}>
                <Text style={{fontSize:14,}}>❌</Text>
            </TouchableOpacity>
              <Variances
                variancesObject={variancesObject}
                imagesVariances={imagesVariances}
                render={(b) => render(b)}
            ></Variances> 
          </View>
        </View>:
        <GestureHandlerRootView style={[styles.overlay]}>
        <GestureDetector gesture={gesture} >
                <Animated.View style={[styles.card,rBottomSheetStyle]}>
                    <Pressable style={{width:'60%',height:20,paddingVertical:20,marginLeft:-50,marginBottom:5,alignSelf:'center',justifyContent:'center',}} onPress={()=>render(false)}>
                        <Text style={{width:'25%',height:3,borderRadius:5,alignSelf:'center',backgroundColor:'grey',borderRadius:5,}}>⚠️
                        </Text>
                    </Pressable>
                        {/* <Variances
                            machinesReservoirs={machinesReservoirs}
                            variancesObject={variancesObject}
                            imagesVariances={imagesVariances}
                            render={(b) => render(b)}
                        /> */}
                        <VariancesNavigator
                            machinesReservoirs={machinesReservoirs}
                            variancesObject={variancesObject}
                            imagesVariances={imagesVariances}
                            render={(b) => render(b)}
                        />
                </Animated.View>
        </GestureDetector>
        </GestureHandlerRootView>
        }
      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({
   overlay: { 
    flex: 1, 
    justifyContent: "flex-end",
    alignItems:'center',
    backgroundColor: "rgba(60,0,0,0.1)" 
  },

  card: {
    // minHeight:screenHeight, // moitié de l’écran
    // height:screenHeight,
    width:"99.88%",
    backgroundColor: "#fff",
    borderWidth:1.5,
    borderTopWidth:10,
    marginHorizontal:"auto",
    paddingLeft:40,
    borderColor:Colors.rootColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position:'absolute',
    top:screenHeight,
  },
  bottomSheetContainer:{
    height:screenHeight,
    width:'100%',
    backgroundColor:'white',
    position:'absolute',
    top:screenHeight,

  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical:'30%',
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
