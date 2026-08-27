import {useLayoutEffect} from 'react';
import { View, Text, StyleSheet,Pressable,Platform} from 'react-native';
import { useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import WinDim from '../assets/operatingData';
import {Time } from '../hooks/littleBiblio';
import Filters from '../kernel/classes/formatTablesAnalysesPoudre';
import {useCurrentProducted,usePopup} from './wrappers/contexts.js';
import {keyReduce,VALEURSPOUDRE,moy} from '../assets/functions.js';
const filter=new Filters();

const EnteteRow=({ntte,prodName,analysed})=>{
            const {setPop}=usePopup();
            const {startedAt,endedAt,clooned}= useSelector(state => {
                const {startedAt,endedAt}=state.period.targetPeriod;
                const clooned=state.actived.clooned;
                return {startedAt,endedAt,clooned};});
            const {entete}=useCurrentProducted();
            const analysedR=analysed.filter(a=>a.name===prodName);
            const dataByName=filter.product_mois_date(analysedR);//suivant produit
            function totalOccurrences(valeurRecherchee){
                return analysed.map(analyse=>entete==='Utilisateur'?analyse[entete]['pseudo']:analyse[entete]).filter(valeur =>valeur === valeurRecherchee).length;
            };
            const rest=['gg','humidite','matiere_active','alcanite','silicate','sel','densite'];


            const terminate=({key,object}) => {
                const valeurs=['nChar','humidite','matiere_active','alcanite','gg','silicate','sel','densite'];
                const [premier,...rest]=valeurs;
                const count=Object.values(object).length;
                return `<h3 class="key3">${key.toUpperCase()}<span style="display:inline-block;background-color:blue;font-weight:bold;font-size:14px;border-radius:50%;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:white;border:1px solid grey">${count}</span><h3>
                    
                    <h3 class="key3">${' Moyennes '+rest.map(r=>{
                    const moyR=moy(analysedR,r);
                    return `<span style="margin:15px;">${moyR!==""?(keyReduce(r)+': ' +moyR/*moy(Object.values(object),r)*/):""}</span>`})}<h3>
                    <div>
                        ${Object.entries(object).map(([k,item]) => {
                            var it= item[0] || item;
                            const {id,updatedAt,createdAt,identifier,type,categorie,taches,...rest} = it;
                            const vallues = VALEURSPOUDRE(rest,valeurs);
                            return `<p style="margin-left:5px;color:'grey';font-size:${Platform.OS!=='web'?'12px':'15px'};text-wrap:nowrap;text-overflow: ellipsis;letter-spacing:0.7px;border-bottom:${Platform.OS==='web' && `1px solid grey`};">
                                        ${Time(createdAt)}${vallues}
                                    </p>`;
                            }).join("")}
                    </div>`};

            const dateFr=(date)=>{
                    const months={Jan:"Janvier",Fev:"Fèvrier",Mar:"Mars",Apr:"Avril",May:"Mai",Jun:"Juin",Jul:"Juillet",Aug:"Aout",Sep:"Septembre",Oct:"Octobre",Nov:"Novembre",Dec:"Décembre"};
                    const splitDate=date.toString().split(" ");
                    const frDate=splitDate[2]+" "+months[splitDate[1]]+" "+splitDate[3];
                    return `<span style="font-size:18px;border:1px dotted blue;border-radius:5px;padding:5px;padding-left:15px;padding-right:15px;color:grey;font-weight:bold;">${frDate}</span>`;
                };
    const generatePDF = async () => {
         try {
            const {count,delth,items}=dataByName;
            const html =`
                <style>
                    html{margin:0px;padding:0px;}
                    body { font-family: Arial, sans-serif; font-size: 14px;padding:15px; }
                    h1 {text-align:center;margin:5px;margin-top: 15px; color: #07108fff;font-size:14; }
                    h2 { margin-top: 20px; color: #2c3e50; }
                    ul { width:100%;list-style-type: none; padding-left: 0; }
                    li {text-align:center; margin: 4px 15px; padding: 6px; border-bottom: 1px solid #ddd; }
                    .header{display:inline-block;width:6.5%;text-align:center;font-size:8px;color:rgba(0,0,0,0.5);margin:8px;}
                    h4 { margin-top: 20px; color: #2c3e50; }
                    .key1{font-size:16px;color:rgba(0,0,0,0.8);margin: 4px 15px;margin-left:2px;padding: 6px;border-bottom: 1px solid #444; }
                    .key2{font-size:14px;color:rgba(0,0,0,0.5);margin:8px;margin-left:6px;}
                    .key3{font-size:14px;color:rgba(0,0,0,0.2);margin:8px;margin-left:10px;}
                    .counts{display:inline-block;background-color:blue;font-weight:bold;font-size:14px;border-radius:50%;border:2px solid blue;width:auto;height:auto;padding:4px;margin-left:5px;margin-right:5px;color:white;}
                    .pCounts{color:rgba(0,0,0,0.4);padding-left:100px;}
                </style>
                <html>
                <body>
                    <h1>Rapport d'analyses du ${dateFr(startedAt)} au ${dateFr(endedAt)}</h1>
                    ${`<li>Nombre d'analyses enregistrées <span class="counts">${count}</span></li>`}
                    <div style="font-size:14px;">
                        ${items.map(object1 => {
                            const {count,...rest1}=object1;
                            const firstCount=count;
                            return `<div >${Object.entries(rest1).map(([key2,object2]) => {
                                const {count,...rest}=object2;
                                return `<h3 class="key1">👉 ${key2} <span class="counts" style="border:3px solid grey">${firstCount}</span></h3>
                                <div>
                                    ${Object.entries(rest).map(([key3,object3]) => {
                                        const {count,...rest3}=object3;
                                        return `<div>
                                            ${Object.entries(rest3).map(([key4,object4]) => {
                                                const {count,...rest4}=object4;
                                                const item4=Object.values(rest4)[0].name;
                                                // }
                                                var bool4=(item4!==null && item4!==undefined);
                                                return bool4?terminate({key:key4,object:rest4}):`<h3 class="key2">${key4}<h3>
                                                <div>
                                                    ${Object.entries(rest4).map(([key5,object5]) => {
                                                        const {count,...rest5}=object5;
                                                        const item5=Object.values(rest5)[0]?.name;
                                                        var bool5=(item5!==null && item5!==undefined);
                                                        return bool5?terminate({key:key5,object:rest5}):`<h3 class="key3">${key5}<span class="counts" style="border:1px solid grey">${count}</span><h3>
                                                            </div>
                                                                ${Object.entries(rest5).map(([key6,object6]) => {
                                                                    const {count,...rest6}=object6;
                                                                    const item6=Object.values(rest6)[0].name;
                                                                    var bool6=(item6!==null && item6!==undefined);
                                                                    return bool6?terminate({key:key6,object:rest6}):`<h3 class="key3">${key6}<span class="counts" style="border:1px solid grey">${count}</span><h3>
                                                                        </div>
                                                                            ${Object.entries(rest6).map(([key7,object7]) => {
                                                                                const {count,...rest7}=object7;
                                                                                const item7=Object.values(rest7)[0].name;//alert(item7);
                                                                                var bool7=(item7!==null && item7!==undefined);
                                                                                return bool7?terminate({key:key7,object:rest7}):`<h3 class="key3">${key7}<span class="counts" style="border:1px solid grey">${count}</span><h3>
                                                                                    </div>
                                                                                        ${Object.entries(rest7).map(([key8,object8]) => {
                                                                                            const {count,...rest8}=object8;
                                                                                            const item8=Object.values(rest8)[0].name;//alert(item7);
                                                                                            var bool8=(item8!==null && item8!==undefined);
                                                                                            return bool7?terminate({key:key8,object:rest8}):`<h3 class="key3">${key8+'  '+count}<h3>`
                                                                                        }).join("")}
                                                                                    </div>`
                                                                            }).join("")}
                                                                        </div>`
                                                                }).join("")}
                                                            </div>`
                                                    }).join("")}
                                                </div>`
                                            }).join("")}
                                        </div>`
                                    }).join("")}
                                <div>`
                            }).join("")}
                            <div>`
                        }).join("")}
                    </div>
                    ${Platform.OS==='web' && `<script>
                        window.onload=function(){
                            window.print();
                            window.close();
                        }
                    </script>`}
                </body>
            </html>`;
                if(Platform.OS!=='web'){
                    const { uri } = await Print.printToFileAsync({ html });
                    if(await Sharing.isAvailableAsync()){await Sharing.shareAsync(uri);}
                    return uri;
                }else{
                    const newWindow=window.open("","_blank");
                    newWindow.document.write(html);
                    newWindow.document.close();
                }
            } catch (error) {
                setPop({show:true,message:error.message,code:'#880000'});
                //(error);
            }
        };


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
                    <Pressable style={styles.icon} onPress={async () => {setTimeout(async () => {await generatePDF();},500);}}>
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