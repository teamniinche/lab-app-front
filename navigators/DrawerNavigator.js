import { createDrawerNavigator } from '@react-navigation/drawer';
import {Image,View,Text,useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
// mes components
import { ULNavigator } from '../components/tables/table-full';
import { UPNavigator } from '../components/tables/poudre-full';
import Normes from '../components/jsonOfNormes';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { routesAndHeaders } from '../iterables';
import {UsersNav} from '../components/modaux.js/users/users';
import WinDim from '../assets/operatingData';
import { primaryColor } from '../assets/constantes';
const {isLarge}=WinDim;
const Drawer = createDrawerNavigator();

export default function DrawerNavigator(){
const {full,cosmetiques,multiusages,eaux,pates,causilicate}=routesAndHeaders;
  return (
      <Drawer.Navigator initialRouteName="Accueil"
      screenOptions={{
            // drawerStyle: { backgroundColor: '#ddd'},
            // drawerType: 'slide',
            drawerType:isLarge?'permanent':'slide',
            drawerStyle:isLarge?{width:'21%'/*'23%'*/,backgroundColor: '#ddd',}:{backgroundColor: '#ddd'},
            overlayColor:isLarge && "transparent",
            headerLeft:isLarge?()=>null:undefined,
            switeEnabled:!isLarge,
            headerStyle: { backgroundColor: '#6200ee',height:40 },
            drawerPosition: 'left',
            headerShown: true,
            gestureEnabled:true,
            gestureDirection:'horizontal',
            headerTintColor: '#fff',
            headerTitleAlign: 'left',
            drawerLabelStyle: { fontSize: 18,letterSpacing:2, },
            headerRight:() => (<HeaderRight isLarge={isLarge} liq={true}/>)
        }}
        drawerContent={(props)=><CustomDrawerContent {...props}/>}
        >
        <Drawer.Screen name="Accueil" children={({navigation,route /*pour pouvoir les passer au ModalMesures */}) => <ULNavigator navigation={navigation} route={route} routeNheaders={full}/>}/>
        <Drawer.Screen name="Liquides multiusage" children={({navigation,route}) => <ULNavigator navigation={navigation} route={route}  routeNheaders={multiusages} />} />
        <Drawer.Screen name="Pates dentifrices" children={({navigation,route}) => <ULNavigator navigation={navigation} route={route}  routeNheaders={pates}/>}/>
        <Drawer.Screen name="Cosmétiques" children={({navigation,route}) => <ULNavigator navigation={navigation} route={route}  routeNheaders={cosmetiques}/>}/>
        <Drawer.Screen name="Caustique & Silicate" children={({navigation,route}) => <ULNavigator navigation={navigation} route={route}  routeNheaders={causilicate}/>}/>
        <Drawer.Screen name="Eaux" children={({navigation,route}) => <ULNavigator navigation={navigation} route={route}  routeNheaders={eaux}/>}/>
        <Drawer.Screen name="Utilisateurs" children={() => <UsersNav/>}/>
        <Drawer.Screen name="Poudres" children={() => <UPNavigator />}/>
        <Drawer.Screen name="Normes physico-chimiques" children={({/*navigation,route*/}) =><Normes/>}/>
        {/* <Drawer.Screen name="updateLiquides" children={({navigation,route}) => <UpdateLiquidesNavigator navigation={navigation} route={route}/>}/> */}
        {/* <Drawer.Screen name="test" children={({navigation,route}) =><Tests/>}/> */}
        
        </Drawer.Navigator>
    
  );

}

// const UpdateLiquidesNavigator=({routeNheaders})=>{
//     return (<Stack.Navigator
//         screenOptions={{headerShown: false,}}
//     >
//         <Stack.Screen name="Liquides" children={({navigation,route}) => <TableFull navigation={navigation} route={route} routeNheaders={routeNheaders}/>}/>
//         <Stack.Screen name="analyses/liquides/updateLiquides" children={({navigation,route}) => <ModalMesures navigation={navigation} route={route}/>}
//             options={{presentation:'transparentModal'}}
//         />
//     </Stack.Navigator>
//     )}

{/* <ConnexionState/> */}
export function Connection(){
    const targetUser = useSelector((state) => state.user.targetUser);
    const {fName,lName,pseudo,niv,privileges,isAdmin}=targetUser?targetUser:{fName:null,lName:null};
    const full_name=fName && fName+' '+lName;
    return {connected:fName !== null,name:lName,full_name:full_name,pseudo:pseudo,privileges:privileges,niv:niv,isAdmin:isAdmin}
}

export function ThereIsUser(){
    const userUpdate = useSelector((state) => state.userUpdate.userUpdate);
    const user=userUpdate?userUpdate:null;
    return user;
}
export const HeaderRight=({isLarge,liq})=>{
    const {connected,name,niv,pseudo}=Connection();
    return <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',gap:1,width:liq?'80%':70,height:'90%',paddingRight:'2%',}}>
        <View style={{flexDriection:isLarge?'row':'column',alignItems:'center',justifyContent:'center',}}>
            {connected && <FontAwesome5 name="user" color={liq?'white':primaryColor} size={15}/>}
            <Text style={{color:liq?'white':primaryColor,height:18,}}>{/*pseudo*/niv}</Text>
        </View>
        {!connected && <Image source={require("../assets/images/logo_madar.jpg")} style={{maxWidth:30,maxHeight:30,borderRadius:25,}}/>}
    </View>
}


