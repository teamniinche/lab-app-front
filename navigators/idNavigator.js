import { View} from 'react-native';
import { Chimistes } from '../components/chimistes';
import { CheckRBParent } from '../components/modaux.js/modalReserv';
import { Pates } from '../components/pates';
import { Variances } from '../components/variances';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const IdStack = createNativeStackNavigator();

const IdNavigator=({nav,initial,data,render})=>{
// alert(JSON.stringify(data))
  return (<View style={{width:'100%',height:'auto',minHeight:700,}}>
  <IdStack.Navigator
        screenOptions={{
          headerShown:true,
            headerStyle: { backgroundColor: 'white',},
            headerTintColor: '#6200ee',
            headerTitleStyle: { fontWeight: 'bold',},
            gestureEnabled: true, // Active les gestes de navigation (par ex. swipe pour revenir en arrière)
        }}
      >
      {/* <IdStack.Group > */}
      <IdStack.Screen
          name="Accueil"
          children={({navigation}) => <Chimistes navigation={navigation}/>}
          options={{title: "S'identifier"}}
        /> 

        {/*================RENZO MADAR=========================== */}
        <IdStack.Screen
          name="analyse/choix_des_reservoirs"
          children={({navigation}) =>  <SecondComponent navigation={navigation} initial={initial} data={data} render={render}/>}
          options={{title: "Selectionner le.s reservoir.s R/M"}}

         />
         <IdStack.Screen
          name="analyse/choix_des_varianceReservoirs"
          children={({route}) =>  <CheckRBParent route={route} />}
          options={{title: "Selectionner le.s reservoir.s R/M"}}

         />
      </IdStack.Navigator>
      </View>

  );
}

const SecondComponent=({navigation,initial,data,render})=>{
  const {item,modal,machinesReservoirs,variancesObject,imagesVariances}=data;
  // const onItemClick=()=>{navigation.navigate('Accueil');render}
  initial && (()=>navigation.popToTop())();
  if(!item.variance){
    return <CheckRBParent data={modal}/>
  }else if(item.title.includes('mera')){
    return <Pates render={render}/>
  }else{
    return <Variances machinesReservoirs={machinesReservoirs} variancesObject={variancesObject} imagesVariances={imagesVariances} render={render}/>
  }
}

export default IdNavigator;