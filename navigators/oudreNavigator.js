import { // Image,Text,View,
  StyleSheet} from 'react-native';
import MadarPh, {MadarVisco, MadarMa} from '../components/Input-ph'
import { Mera } from '../components/meraInputs';
import Mesures from '../components/mesures';
// import Accueil from '../components/accueil'
import OpNavigator from '../components/accueil'
import results from '../hooks/results';

const {madar}=results;
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const PoudreStack = createNativeStackNavigator();
 // BASICS FORMULES = dans un drawer :: 
export default function LiquidesNavigator(){

  return (
      <PoudreStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#6200ee',height:'100%',paddingVertical:15,},
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold',},
            gestureEnabled: true,// Active les gestes de navigation (par ex. swipe pour revenir en arrière)
            headerShown:false
        }}
      >
      {/* <PoudreStack.Group > */}
      <PoudreStack.Screen
          name="Accueil"
          // component={Accueil}
          component={OpNavigator}
          options={{title: 'H&D Laboratoire | Liquides analysés'}}
        />

        {/*================RENZO MADAR=========================== */}
        <PoudreStack.Screen 
          name="analyses/liquides/choisir_analyse/"
          children={({navigation,route}) => <Mesures navigation={navigation} route={route} machines={{machine1:"A",machine2:"B",machine3:"C"}} color={"green"} resultsOfAnalyse={madar} />}
         />  
        <PoudreStack.Screen 
          name="analyses/liquides/ph"
          children={({route}) => <MadarPh route={route} />}
        />
          {/* autres grandeurs de renzo madar ph ici MA, densite,Viscosite */}

        {/* ================== RENZO PLATINIUM ====================== */}
        <PoudreStack.Screen 
          name="analyses/liquides/matiere_active"
          children={({route}) => <MadarMa route={route} />}
          // children={({navigation,route}) => <Mesures navigation={navigation} route={route} machines={{machine1:"A",machine2:"B"}} color={"yellow"} resultsOfAnalyse={platinium} />}
         />

         <PoudreStack.Screen 
          name="analyses/liquides/viscosite"
          children={({route}) => <MadarVisco route={route}/>}
         />

        <PoudreStack.Screen 
          name="analyses/liquides/mera"
          children={({route}) => <Mera route={route}/>}
         />
      </PoudreStack.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#f23',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100px',
  },
});
