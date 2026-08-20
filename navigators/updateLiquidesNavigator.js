import MadarPh, {MadarVisco, MadarMa} from '../components/Input-ph'
import Mesures from '../components/mesures';
import results from '../hooks/results';

const {madar}=results;
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const LiquidesStack = createNativeStackNavigator();

export default function UpdateLiquidesNavigator(){
  return (
      <LiquidesStack.Navigator
        screenOptions={{
            mode:'modal',
            headerShown: false,
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold',},
            gestureEnabled: true, // Active les gestes de navigation (par ex. swipe pour revenir en arrière)
            contentStyle: { maxHeight:600,padding:20,borderWidth:4,borderColor:'rgba(0,0,0,0.12)',borderRadius:5,},
        }}
      >
        {/*================RENZO MADAR=========================== */}
        <LiquidesStack.Screen 
          name="analyses/liquides/choisir_analyse/"
          children={({route}) => <Mesures route={route}  />}
         />
        <LiquidesStack.Screen 
          name="analyses/liquides/ph"
          children={({route}) => <MadarPh route={route} />}
        />
        {/* ================== RENZO PLATINIUM ====================== */}
        <LiquidesStack.Screen 
          name="analyses/liquides/matiere_active"
          children={({route}) => <MadarMa route={route} />}/>

         <LiquidesStack.Screen 
          name="analyses/liquides/viscosite"
          children={({route}) => <MadarVisco route={route} />}
         />

      </LiquidesStack.Navigator>

  );
}
