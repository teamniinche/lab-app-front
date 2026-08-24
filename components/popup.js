import {useEffect} from 'react';
import {Text} from 'react-native';
import { useSelector } from 'react-redux';
import {Snackbar } from 'react-native-paper';
import { usePopup } from './wrappers/contexts';
import * as Speech from 'expo-speech';
function Message(msg){
      const isAboutAnalyse=msg.includes('nalyse');
      const msgWithAttention=!isAboutAnalyse?msg:"Votre attention s'il vous plait ! "+msg;
      const MESSAGE=msgWithAttention
                    .replace('Vous etes connecté avec succes','connectéde')
                    .replace('🏢 avec succes','')
                    .replace('succes','succés')
                    .replace('🏢','')
                    .replace('Even-driver',"Le gestionnaire d'évenement")
                    .replace('connected',"connecté")
                    .replace('disconnected',"déconnecté")
                    .replace('❌','')
                    .replace('✅','')
                    .replace('COMPTABILITE','comptabilité')
                    .replace('⚠️','')
                    .replace('❗','')
                    .replace('*','')
                    
      return MESSAGE;
    }
const Pop = () => {
    const {pop,setPop}=usePopup();
    const {show,status,message,code}=pop;
    const durations={low:5000,middle:10000,high:1800000};
    useEffect(() => {
    // ================================= QUALITE DE LA VOIX ========================================================
    async function getPremiumFrenchVoice() {
      const voices = await Speech.getAvailableVoicesAsync();
        
        // Trouver une voix française de qualité supérieure ('enhanced' ou 'premium')
        const premiumFrenchVoice =await voices.find(
          (voice) => 
            voice.language.startsWith('fr') && 
            (voice.quality === Speech.VoiceQuality.Enhanced || voice.quality === 'premium')
        ) || await voices.find((voice) => voice.language.startsWith('fr'));
        return premiumFrenchVoice;
      }
    // ====================================================================================================
    Speech.stop();
    
    show && Speech.speak(Message(message), {
      language: 'fr', // Force la lecture en français
      voice: getPremiumFrenchVoice(),
      // volume: 1.0, // Force le volume au maximum système
      pitch: 1.0,     // Hauteur de la voix (0.5 à 2.0)
      rate: 0.9,      // Vitesse de lecture (0.5 à 2.0)
    });
  }, [show]);
  const onDismissSnackBar = () => setPop(false);

  return <Snackbar
        visible={show}
        onDismiss={onDismissSnackBar}
        duration={code==='green'?5000:10000}
        action={{
          label: 'ok',
          onPress:()=>setPop(false),
        }}
        style={{maxWidth:800,minWidth:400,bottom:100,width:'auto',height:60,padding:10,backgroundColor:code,margin:'auto'}}
        contentStyle={{color:code==='green'?'white':'black',fontSize:14,fontWeight:'bold',textAlign:'center'}}
        >
        {message}
      </Snackbar>
};


export const NewAnalysed = () => {
  const {targetUser}=useSelector(state=>state.user);
  const isTour=targetUser?.depart_affecte==='Tour';
  
  const {newAna,setNewAna}=usePopup();
  const {show,nChar,code}=newAna;

  const onDismissSnackBar = () => setNewAna({show:false,code:'green',id:1});

  return <Snackbar
        visible={show/* && isTour*/}
        onDismiss={onDismissSnackBar}
        action={{
          label:'❌',
          textColor: code === 'green' ? '#FFF' : '#000', 
          labelStyle: { fontSize: 20, fontWeight: 'bold',backgoundColor:'rgb(100,0,0)'},
          onPress:()=>setNewAna({show:false,code:'green',nChar:null}),
        }}
        duration={1800000}
        // style={{maxWidth:800,minWidth:400,bottom:100,width:'auto',height:60,padding:10,backgroundColor:code,margin:'auto'}}
       style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          width:580,
          height:500,
          borderRadius:'10%',
          bottom:70,
          paddingHorizontal:20,
          margin:'auto',
          backgroundColor:code==='green'?'rgba(0,200,0,0.7)':'rgba(200,0,0,0.7)'
        }}
        contentStyle={{color:'white',fontSize:14,fontWeight:'bold',textAlign:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}}
        >
        <Text style={{fontSize:140,fontWeight:'bold',height:'90%',width:'100%',textAlign:'center'}}>{nChar+"✅"}</Text>
      </Snackbar>
};

export default Pop;