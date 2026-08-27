import { View, Text, StyleSheet,Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useCurrentProducted} from './wrappers/contexts.js';
import {keyReduce,moy} from '../assets/functions.js';
const EnteteRow=({ntte,prodName,analysed})=>{
            const {entete}=useCurrentProducted();
            const analysedR=analysed.filter(a=>a.name===prodName);
            function totalOccurrences(valeurRecherchee){
                return analysed.map(analyse=>entete==='Utilisateur'?analyse[entete]['pseudo']:analyse[entete]).filter(valeur =>valeur === valeurRecherchee).length;
            };
            const rest=['gg','humidite','matiere_active','alcanite','silicate','sel','densite'];

            const handlePrint=()=>{
                alert(entete);
            }
            return <View style={styles.main}>
                <Text style={styles.main_text}>
                    {ntte+' : '}
                    <Text style={styles.main_text_text}>
                        {totalOccurrences(ntte)}
                    </Text>
                </Text>
                {entete==='name' && 
                    <View style={styles.second}>
                        {
                            rest.map(r=>{
                                const moyR=moy(analysedR,r);
                                return <Text style={styles.second_text}>
                                {moyR!=="" && <>
                                        <Text style={{color:"rgba(255,255,255,0.5)"}}>{keyReduce(r)+': '}</Text>
                                        <Text style={{color:"white"}}>{moyR}</Text>
                                    </>
                                }
                            </Text>})
                        }
                    </View>
                }
                <View style={styles.icons}>
                    <Pressable style={styles.icon} onPress={handlePrint}>
                        <Icon size={14} name="print" color='white'/>
                    </Pressable>
                </View>
                
            </View>
        }


export default EnteteRow;

const styles=StyleSheet.create({
    icons:{
        position:'absolute',
        right:5,
        width:'auto',
        height:'100%',
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    icon:{
        padding:5,
        marginHorizontal:8,
        height:'100%',
        width:40
    },
    main: {
        width:'100%',
        height:25,
        paddingVertical:5,
        backgroundColor:'rgba(0,0,0,0.6)',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingLeft:10
    },
    main_text:{
        width:'auto',
        height:'100%',
        color:'white',
        fontSize:13,
        fontWeight:'bold',
        textAlign:'left'
    },
    main_text_text:{
        backgroundColor:'rgba(255,255,255,0.5)',
        width:'auto',
        maxWidth:27,
        height:18,
        minWidth:17,
        padding:3,
        borderRadius:10,
        textAlign:'center',
        fontWeight:'bold',
        fontSize:'14',
        color:'black'
    },
    second:{
        width:'auto',
        height:'100%',
        marginHorizontal:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    second_text:{
        margin:15,
        color:"white",
        fontSize:12,
        fontWeight:'bold'
    }

})