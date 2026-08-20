import  {forwardRef, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomBottomSheet from '../../butomSheet';
const BottomSheet =forwardRef((props,ref) => {
  return (
    <GestureHandlerRootView style={styles.container}>
        {/* <TouchableOpacity  onPress={handleOpenPress} style={{ width:50,height:50,backgroundColor:'red',}} >
            <Text>Open</Text>
        </TouchableOpacity> */}
        {props.children}
        <CustomBottomSheet ref={ref}/>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // position:'absolute',
    // top:0,
    // left:0,
    height:'100%',
    width:'100%',
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'center',
    backgroundColor: 'transparent',
  },
})

export default BottomSheet;
