import {StyleSheet,View,Text,ActivityIndicator} from 'react-native';
import { Flex } from '../assets/functions';
import ButtomSheet from '../components/modaux.js/bottomSheet';
export default PoudreNavigator = () => {

  return (
    <View style={{width:'100%',height:'100%',...Flex('row','center','center'),}}>
      {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      <ButtomSheet/>
    </View>
  );
};
