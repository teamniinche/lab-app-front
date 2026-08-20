import { forwardRef, useCallback, useMemo,useState} from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { Easing } from 'react-native-reanimated';
import BottomSheet, { 
	BottomSheetView,
	BottomSheetFooter,
	BottomSheetBackdrop,
	useBottomSheetSpringConfigs,
	// BottomSheetModal,
	// BottomSheetTextInput,
	// useBottomSheet,
	// useBottomSheetTimingConfigs,
	// animatedFooterPosition,
} from '@gorhom/bottom-sheet';
import { Everages } from './components/tables/table-full';
import IdNavigator from './navigators/idNavigator';

const CustomBottomSheet = forwardRef((props,ref) => {
const [initial,setInitial]=useState(false);
const snapPoints = useMemo(() => ['25%','50%', '75%','95%'], []);
const handleClosePress = () => ref.current?.close();
const handleSheetChanges = useCallback((index) =>{
	if(index<=0){//Pour retourner auto à la page 'Accueil' de IdNavigator
		handleClosePress();setInitial(true);}else{setInitial(false);}
  }, []);
const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={1}
				appearsOnIndex={2}
			/>
		),
		[]
	);
const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
	duration: 250,
    easing: Easing.elastic(1),//|| .exp,
  });
//   const animationConfigs = useBottomSheetTimingConfigs({
//     duration: 250,
//     easing: Easing.exp,
//   });
const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={4}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Votre identification permet une meilleure organisation et, par ailleurs, de mieux situer les responsabilités .</Text>
        </View>
      </BottomSheetFooter>
    ),
    []
  );
  return (
	  <BottomSheet index={-1} ref={ref} snapPoints={snapPoints}
		enablePanDownToClose={true}
		backdropComponent={renderBackdrop}
		keyboardBehavior='extend'
		onChange={handleSheetChanges}
		animateOnMount={true}
		topInset={70}
		bottomInset={1}
		// detached={true}
		animationConfigs={animationConfigs}
		footerComponent={renderFooter}
	  >
		<BottomSheetView style={styles.contentContainer}>
			<Everages/>
			{/* <IdNavigator navigation={props.navigation} initial={initial} data={props.data} render={handleClosePress}/> */}
		{props.children}
		</BottomSheetView>
	  </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
	flex: 1,
	padding:10,
	height:'100%',
	paddingVertical:0,
	alignItems: 'center',
  },
  footerContainer: {
    padding: 12,
    margin: 8,
    borderRadius: 12,
    backgroundColor: 'whitesmoke',
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.9)',
    fontWeight: '100',
  }
});

export default CustomBottomSheet;