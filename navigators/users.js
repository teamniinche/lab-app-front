import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Users,{UsersActivities} from '../components/modaux.js/users/ListeUsers';
import AddUser from '../components/modaux.js/users/addUser';
const UserStack = createNativeStackNavigator();

export default function UsersNavigator(){
  return <>
      <UserStack.Navigator
        screenOptions={{
            headerShown:true,
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: 'bold',},
            gestureEnabled: true, // Active les gestes de navigation (par ex. swipe pour revenir en arrière)
        }}
      >
        <UserStack.Screen 
          name="Utilisateurs"
          children={({navigation}) => <Users navigation={navigation}/>}
          options={{title:'Utilisateurs enregistrés'}}

       />
        <UserStack.Screen 
          name="Ajouter nouveau utilisateur"
          children={({navigation,route}) => <AddUser navigation={navigation} route={route}/>}
          options={{title:'Ajouter un nouveau utilisateur'}}

         />
         <UserStack.Screen 
          name="Mise à jour utilisateur"
          children={({navigation,route}) => <AddUser navigation={navigation} route={route} />}
          options={{title:'Mise à jour utilisateur'}}

        />
        <UserStack.Screen 
          name="Activités utilisateurs"
          children={({navigation}) => <UsersActivities navigation={navigation}/>}
          options={{title:'Activités utilisateurs'}}
        
         />

      </UserStack.Navigator>
      </>
}
