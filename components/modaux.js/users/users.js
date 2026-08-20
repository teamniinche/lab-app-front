import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UsersNavigator from '../../../navigators/users';
const UserStack = createNativeStackNavigator();

export const UsersNav=()=>{
    return (<UserStack.Navigator
        screenOptions={{headerShown:false,}}
    >
        <UserStack.Screen name="Users" children={({navigation}) => <UsersNavigator navigation={navigation}/>}
        />
    </UserStack.Navigator>
    )}