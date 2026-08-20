import { View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Mesures=({/*parameters from screen by route to be got by : route.params."key" 
                  in materials
                  parameters dans screenComponent(=Mesures dans tous les cas) pour PH, MATIERE ACTIVE, DENSITE, VISCOSITE (dans navigators) à supprimer
                */
               route})=>{
    const navigation=useNavigation();
    const data=route.params?.data;
    return (<View style={styles.container}>
    {/* ===================== PH ( tous les ph passent par cette route avec parametres from screen) ===================== */}
        {/* <Text style={{marginBottom:50,...styles.buttonText,fontSize:20,color:'black',width:'100%',}}>Choisissez l'analyse à FAIRE .</Text> */}
    {/* ---------------------------------------------------------------------------------------------------- */}

        <TouchableOpacity style={styles.button}
                // -------------------une seule route pour tous les ph------------
                onPress={() =>navigation.navigate('analyses/liquides/ph', {data:data})}
        >
            <Text style={styles.buttonText}>PH</Text>
        </TouchableOpacity>

    {/* ===================== MATIERE ACTIVE ================== */}
        <TouchableOpacity 
            style={styles.button}
            title="liquides/matière_active"
            onPress={() =>
            /*la mere de MESURES passe la data à la route fille MadarMA(celle-ci).
             De ce dernier on va construire le data du component MadarMa en props*/
            navigation.navigate('analyses/liquides/matiere_active', {data:data})
            }
        >
            <Text style={styles.buttonText}>MATIERE ACTIVE</Text>
        </TouchableOpacity>

    {/* ===================== VISCOSITE ================== */}
        <TouchableOpacity 
            style={styles.button}
            title="liquides/viscosité"
            onPress={() =>
            navigation.navigate('analyses/liquides/viscosite', {data:data})
            }
        >
            <Text style={styles.buttonText}>VISCOSITE</Text>
        </TouchableOpacity>
    
    {/* ===================== DENSITE ================== */}
        <TouchableOpacity 
            style={styles.button}
            title="Renzo-Platinium/pH"
            onPress={() =>
            navigation.navigate('Analyses/Liquides/densite', {name: 'Renzo Platinium'})
            }
        >
            <Text style={styles.buttonText}>DENSITE</Text>
        </TouchableOpacity>
  </View>
)}

const styles=StyleSheet.create({// commentés constituent les derniers changements sur le style ici
    container:{
        // flex:1,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        gap:10,//20
        backgroundColor:'rgba(255,255,255,0.001)'
    },
    button:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:'80%',

        height:35,//50
        marginHorizontal:10,
        padding:6,// new
        borderRadius:8, //10
        backgroundColor:'rgba(49, 141, 247, 0.7)',

    },
    buttonText:{
        textAlign:'center',
        fontWeight:'bold',
        width:'70%',
        height:10,//20
        color:'white',
        letterSpacing:5,
        fontSize:10,//16
    },
})



export default Mesures;