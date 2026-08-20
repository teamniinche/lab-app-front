import { View, Text,Pressable, StyleSheet,} from 'react-native';
import { DrawerActions,useNavigation } from '@react-navigation/native';
import {useDispatch,useSelector } from 'react-redux';
import WinDim from '../assets/operatingData'
import { setPeriod} from './store/reducers/periodReducer';
import {InputDatePickerPaper} from './dataPickers/datePickerPaper';
const {isLarge,isWeb}=WinDim;
export const AdjentDay=(D,n)=>{
  const dayInMiliseconds=(n)*86400000;
  const adjacentDateMs=new Date(D).getTime()+dayInMiliseconds;
  const adjacentDayInString=new Date(adjacentDateMs);
  return adjacentDayInString;
}
export const AdjentDayInMs=(D,n)=>{
  const dayInMiliseconds=(n)*86400000;
  const adjacentDateMs=new Date(D).getTime()+dayInMiliseconds;
  return adjacentDateMs;
}
export const Periodes=()=>{
      const maintenant=new Date();
      const J=maintenant.getDate();
      const hour=maintenant.getHours();
      const isMinuitToSept=(hour>=0 && hour<=6);
      const M=maintenant.getMonth()+1;
      const Y=maintenant.getFullYear();
      const janvier1ier=new Date(Y+'-01-01');
      const ceMois=new Date(Y+'-'+M+'-01');
      // const hier=isMinuitToSept?new Date(Y+'-'+M+'-'+(J-2)):new Date(Y+'-'+M+'-'+(J-1));
      const hier=isMinuitToSept?AdjentDay(maintenant,-2):AdjentDay(maintenant,-1);
      // const aujourdhui=isMinuitToSept?new Date(Y+'-'+M+'-'+(J-1)):new Date(Y+'-'+M+'-'+J);
      const aujourdhui=isMinuitToSept?AdjentDay(maintenant,-1):new Date(Y+'-'+M+'-'+J);
      // const demain=isMinuitToSept?new Date(Y+'-'+M+'-'+J):new Date(Y+'-'+(M+1)+'-01');
      const demain=isMinuitToSept?new Date(Y+'-'+M+'-'+J):AdjentDay(maintenant,1);
      return {Y,janvier1ier,ceMois,hier,aujourdhui,demain};
    }
export function Period(){
  const {startedAt,endedAt}= useSelector(state => state.period.targetPeriod);
  return  {startedAt:startedAt,endedAt:endedAt};
}
export default function Periode({ navigation }) {
    const dispatch=useDispatch();
    const period= useSelector(state => state.period.targetPeriod);
    const {key,startedAt,endedAt}=period;
    const {Y,janvier1ier,ceMois, hier,aujourdhui,demain}=Periodes();
  return (
    <View style={{padding:6,paddingBottom:12,paddingHorizontal:isLarge?4:14,//a la place de 14(padding) :dernier
    borderRadius:10,backgroundColor:'rgba(0,0,50,0.2)',margin:0,marginBottom:25,}}>
        <Text style={{...styles.label,marginBottom:10,}}> Période</Text>
        <InputDatePickerPaper
            render={(d)=>{
                  dispatch(setPeriod({...period,key:'default',startedAt:d.toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
            defaultDate={new Date(startedAt)}
            whithDate='Started at'

        />
        <InputDatePickerPaper
            render={(d)=>{
                  dispatch(setPeriod({...period,key:'default',endedAt:d.toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
            defaultDate={new Date(endedAt)}
            whithDate='Ended at'
        />
        <View style={styles.datesSpec}>
          <Pressable
            style={{...styles.datesSpecPress,backgroundColor:key==='annuel'?'white':'rgba(0,0,100,0.10)',}}
            onPress={()=>{
                  dispatch(setPeriod({key:'annuel',startedAt:janvier1ier.toDateString(),endedAt:demain.toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
          ><Text style={styles.datesSpecText}>{Y.toString()}</Text></Pressable>
          <Pressable
            style={{...styles.datesSpecPress,backgroundColor:key==='mensuel'?'white':'rgba(0,0,100,0.10)',}}
            onPress={()=>{
                  dispatch(setPeriod({key:'mensuel',startedAt:ceMois.toDateString(),endedAt:demain.toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
          ><Text style={styles.datesSpecText}>Ce mois</Text></Pressable>
          <Pressable
            style={{...styles.datesSpecPress,backgroundColor:key==='hier'?'white':'rgba(0,0,100,0.10)',}}
            onPress={()=>{
                  dispatch(setPeriod({key:'hier',startedAt:hier.toDateString(),endedAt:aujourdhui.toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
          ><Text style={styles.datesSpecText}>Hier</Text></Pressable>
          <Pressable
            style={{...styles.datesSpecPress,backgroundColor:key==='aujourdHui'?'white':'rgba(0,0,100,0.10)',}}
            onPress={()=>{
                  dispatch(setPeriod({key:'aujourdHui',startedAt:aujourdhui.toDateString(),endedAt:demain.toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
          ><Text style={styles.datesSpecText}>{isLarge?"Auj.":"Aujourd'hui"}</Text></Pressable>

        </View>
        
        <InputDatePickerPaper
            render={(d)=>{
                  dispatch(setPeriod({...period,key:'default',startedAt:d.toDateString(),endedAt:AdjentDay(d,1).toDateString()}));
                  navigation.dispatch(DrawerActions.closeDrawer())
              }}
            defaultDate={new Date(startedAt)}
            whithDate='Select a specific date'

        />
    </View>
    
)}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    letterSpacing:2,
    color:'rgba(0,0,0,0.6)',
},
  datesSpec:{
    flexDirection:'row',
    justifyContent:'flex-start',
    gap:15,
    alignItems:'center',
    marginHorizontal:isWeb && 'auto',// isWeb=(isWeb || isMacos || isWindow)
    marginTop:10,
    paddingTop:10,
    height:50,
    borderTopWidth:1,
    borderColor:'rgba(255,255,255,0.5)',
  },
  datesSpecPress:{
    padding:6,
    // padding:8,
    paddingVertical:2,
    marginHorizontal:-4,// pensé cote  grand ecran seulement
    // backgroundColor:'rgba(0,0,100,0.10)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.4)',
    borderRadius:5,
    flexDirection:'row',
    // justifyContent:'center',
    alignItems:'center',
  },
  datesSpecText:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    fontSize:10,
    // fontSize:12,
    fontWeight:'bold',
    color:'rgba(0,0,100,0.9)',
    letterSpacing:0.5,
  }
});
