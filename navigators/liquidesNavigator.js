import {StyleSheet} from 'react-native';
import MadarPh, {MadarVisco, MadarMa} from '../components/Input-ph'
import { Mera } from '../components/meraInputs';
import Mesures from '../components/mesures';
import OpNavigator from '../components/accueil'
import results from '../hooks/results';

const {madar}=results;
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const LiquidesStack = createNativeStackNavigator();

export default function LiquidesNavigator(){

  return (
      <LiquidesStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#6200ee',height:'100%'},
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold',},
            gestureEnabled: true, // Active les gestes de navigation (par ex. swipe pour revenir en arrière)
            headerShown:false
        }}
      >
      {/* <LiquidesStack.Group > */}
      <LiquidesStack.Screen
          name="Accueil"
          // component={Accueil}
          component={OpNavigator}
          options={{title: 'H&D Laboratoire | Liquides analysés'}}
        />

        {/*================RENZO MADAR=========================== */}
        <LiquidesStack.Screen 
          name="analyses/liquides/choisir_analyse/"
          children={({navigation,route}) => <Mesures navigation={navigation} route={route} machines={{machine1:"A",machine2:"B",machine3:"C"}} color={"green"} resultsOfAnalyse={madar} />}
         />
        <LiquidesStack.Screen 
          name="analyses/liquides/ph"
          children={({route}) => <MadarPh route={route} />}
        />
          {/* autres grandeurs de renzo madar ph ici MA, densite,Viscosite */}

        {/* ================== RENZO PLATINIUM ====================== */}
        <LiquidesStack.Screen 
          name="analyses/liquides/matiere_active"
          children={({route}) => <MadarMa route={route} />}
          // children={({navigation,route}) => <Mesures navigation={navigation} route={route} machines={{machine1:"A",machine2:"B"}} color={"yellow"} resultsOfAnalyse={platinium} />}
         />

         <LiquidesStack.Screen 
          name="analyses/liquides/viscosite"
          children={({route}) => <MadarVisco route={route}/>}
         />

        <LiquidesStack.Screen 
          name="analyses/liquides/mera"
          children={({route}) => <Mera route={route}/>}
         />
      </LiquidesStack.Navigator>

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
