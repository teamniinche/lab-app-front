import { useState,useEffect } from "react";
import { View,Text,TouchableOpacity,StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { primaryColor } from "../assets/constantes";
import { Checkbox,Divider,Button, Dialog,Chip, Portal, Switch,Badge,PaperProvider, TextInput, TouchableRipple} from 'react-native-paper';
import { clooner } from "./accueil";
import nombers from "../hooks/littleBiblio";
import { useMonoProducts,useReservs,usePopup} from "./wrappers/contexts";
import { Bouton } from "./buttons/save";
// import { tanks } from "../assets/constantes";
import DensiteRange from "./ranges/densiteRanges";
import ViscoRange from "./ranges/viscositeRange";
import Colors from "../assets/colors";
const NewAnalysis=({product,index})=>{
    return <AnalysisRow product={product} index={index}/>;
}

const AnalysisRow=({product,index})=>{
    // {from:title,results:results,machines:machines,reservoirs:reservoirs,color:color,variance:variance}
    const {currentUser,clooned} = useSelector((state) => {
        const currentUser=state.user.currentUser;
        const clooned=state.actived.clooned;
        return {currentUser,clooned};
      });
    const currentUserId=currentUser?.id;
    const {deleteItem}=useMonoProducts();
    const {reservs}=useReservs();
    const {title,results,machines,reservoirs,color,variance}=product;
    const machinesLength=machines?.length;// pour preselectionner l unique si length egal 1:operationaliser dans PickerMultiple
    const {identification,grandeurs}=results;
    const {ph}=grandeurs;
    const {nom,couleur,parfum,categorie}=identification;const {codor}=couleur;
    const propsForMera={title:title,codor:codor,clooned:clooned,deleteItem:deleteItem,product:product};
    
    const {min,max,moy}=nombers(ph.normes);
    function valeurs_recurentes(){
        var vRecurentes=[];var itm=min-0.20;// initialement 0.05
        while (itm<=(max+0.20)) {
        vRecurentes.push(itm.toFixed(2));
        itm+=0.05;
        }
        return vRecurentes;
    }

    const [buttonParams,setButtonParams]=useState({color:'blue',text:'Save',able:true,});
    //   const {isCodorConforme,isColor,isOdor}=useConformite();
  
    const [dor,setDor]=useState(true);
    const [lor,setLor]=useState(true);
  
    const [dialogShow,setDialogShow]=useState(false);
    const [selected,setSelected]=useState([]);                          //| Value of the targeted Picker

    const [label,setLabel]=useState("");                                //|
    const [options,setOptions]=useState([]);
    const [reducedReservoirs,setReducedReservoirs]=useState(null);                           //| change if targeted Picker change

    const [productProps,setProductProps]=useState({Machine:[],Reservoir:[],ph:[moy],parfum:dor?'C':'NC',color:lor?'C':'NC'});   //| global value for the product
    const registrable=(productProps.Machine.length!==0 && productProps.Reservoir.length!==0 && productProps.ph.length!==0);
    // const toUpdate=(txt)=>{return txt==="✔️✔️✔️" || txt==="✔️✔️" || txt.includes("Update") };
  

    function APPRECIATIONS(){
      const lPh=productProps.ph[0]<min?'Ph Low':"";
      const hPh=productProps.ph[0]>max?'Ph High':"";
      const c=!lor?' & Couleur non conforme':"";
      const o=!dor?' & Parfum non conforme':"";
      const appreciations=lPh+hPh+c+o;
      return appreciations===""?"RAS":appreciations;
    }
    const commentaires=(APPRECIATIONS()==="RAS" || APPRECIATIONS()==="")?[]:APPRECIATIONS().split(" & ");
    const thereIsCommentaires=commentaires?.length!==0;
    const toggleItem=(ob)=>{
        const {type,value}=ob;
        if(type==="Machine"){setReducedReservoirs(reservs[value])};
        setButtonParams({color:'blue',text:'Save',able:true,});
        if(productProps[type].includes(value)){
            const withoutItem=productProps[type].filter(it=>it!==value);
            setProductProps({...productProps,[type]:withoutItem});
        }else{
            const intermedaireValue=[...productProps[type],value];
            setProductProps({...productProps,[type]:intermedaireValue});
        }
    }

    const reccurentValues=valeurs_recurentes();
    return title.includes("Mera")?<MeraRow othersProps={propsForMera} item={product}/>:<><View style={{height:"auto",width:"100%",flexDirection:"row",justifyContent:"center"}}><View style={[styles.analysisRowStyle,{flex:commentaires!==[]?6/7:1}]}>
        <TouchableOpacity style={{position:"absolute",left:-7,top:-6,flexDirection:"row",alignItems:"center",justifyContent:"center"}} onPress={()=>deleteItem(product)}><Text style={{textAlign:"center",width:"100%"}}>❌</Text></TouchableOpacity>
        <Text style={[styles.nameStyle,{borderBottomWidth:1,borderColor:"whitesmoke",position:"absolute",maxHeight:30,left:10,top:2,minWidth:130,maxWidth:130,color:codor}]}>{clooned?clooner(title):title}</Text>
        <PickerMultiple label="Machine" machinesLength={machinesLength || [1]} machines={machines || [1]} toggleItem={(ob)=>toggleItem(ob)} render={()=>{setOptions(machines);setLabel("Machine");setSelected(productProps.Machine);setDialogShow(true)}} selected={productProps.Machine}/>
        <PickerMultiple label="Reservoir" toggleItem={(ob)=>toggleItem(ob)} render={()=>{setOptions(()=>(reducedReservoirs || reservoirs));setSelected(productProps.Reservoir);setLabel("Reservoir");setDialogShow(true)}} selected={productProps.Reservoir}/>
        <PickerMultiple label="ph" toggleItem={(ob)=>toggleItem(ob)} render={()=>{setOptions(reccurentValues);setSelected(productProps.ph);setLabel("ph");setDialogShow(true)}} selected={productProps.ph} />
        <CustomSwitch label="Parfum" render={(bool)=>setDor(bool)}/>
        <CustomSwitch label="Color" render={(bool)=>setLor(bool)}/>   
        {(currentUserId) && <Bouton reqBody={{
                            machine:productProps.Machine[0],
                            categorie:categorie,
                            name:nom,
                            reservoir:productProps.Reservoir[0],
                            ph:Number(productProps.ph[0]),
                            parfum:dor?'C':'NC',
                            color:lor?'C':'NC',
                            observations:APPRECIATIONS(),
                            UtilisateurId:currentUserId
                            }}
                            registrable={registrable}
                            render={(o)=>setButtonParams(o)}
                            buttonParams={buttonParams}
                        />
        }
    </View>
    {thereIsCommentaires && <View style={styles.commentairesStyle}>
                {commentaires.map(item=>
                    item!=="" && <Text style={{color:"rgb(100,0,0)",fontSize:9,textAlign:"left"}}>{"🚨 "+item}</Text>
                )}
    </View>}
    </View>
    <Dialogue 
        toggleItem={(ob)=>toggleItem(ob)}
        render={(b)=>setDialogShow(b)}
        nom={nom}
        label={label}
        color={codor}
        dialogShow={dialogShow}
        selected={selected}
        Formats={options}
    />
    </>
}

const CustomSwitch = ({label,render}) => {
    const [isSwitchOn, setIsSwitchOn] = useState(true);
    const onToggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn);
        render(!isSwitchOn);
    };
return <View style={{width:"auto",minHeight:40,backgroundColor:"rgb(233, 233, 237)",borderRadius:10,flexDirection:"column",gap:0,zIndex:-1,paddingHorizontal:0,minWidth:80,marginHorizontal:5,maxHeight:40,borderWidth:1,borderColor:"grey",flex:1/4,justifyContent:"center",alignItems:"center",}}>
        <Text>{label}</Text>
        <Switch value={isSwitchOn} color={primaryColor} onValueChange={onToggleSwitch} />
    </View>
}

const PickerMultiple=({label,machinesLength,machines,toggleItem,render,selected})=>{
    const {setPop}=usePopup();
    const isOneMachine=(label==="Machine" && machinesLength && machinesLength===1);
    const items=isOneMachine?machines:selected;// selectionner l unique machine sil yen a qu une !
    const currentUser= useSelector((state) => state.user.currentUser);
    const currentUserId=currentUser?.id;

    useEffect(()=>{
        isOneMachine && toggleItem({type:label,value:items[0]});
    },[])
    return <View style={[styles.picker,{backgroundColor:"rgb(233, 233, 237)",paddingHorizontal:0,minWidth:80,marginHorizontal:5,maxHeight:40,borderWidth:1,borderColor:"grey",flex:1/4,flexDirection:"row",borderRadius:10,justifyContent:"flex-start",alignItems:"center",gap:5}]} >
            {items.map((value,  index) => <Chip key={index}
                style={styles.chip}
                onClose={()=>toggleItem({type:label,value:value})}
                >{value}</Chip>)}
           {items.length===0 && <Button style={{maxWidth:300,maxHeight:20,margin:0,padding:0}} onPress={()=>currentUserId?render():setPop({show:true,message:"⚠️ Identifiez-vous d'abord ❗",code:"#880000"})}>{label}</Button>}
        </View>
}

const Dialogue = ({toggleItem,nom,color,label,render,dialogShow,selected,Formats}) => {
    
  return <Portal>
          <Dialog style={{maxWidth:500,minWidth:400,marginHorizontal:"auto"}}
           visible={dialogShow} onDismiss={()=>render(false)}>
            <Dialog.Title style={{fontSize:15,color:color,textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>Selectionner {label}</Dialog.Title>
            <Dialog.Content style={{maxWidth:900,minWidth:400,maxHeight:500,overflowX:"scroll",margin:"auto",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"flex-start",paddingHorizontal:40,height:"auto"}}>
               {
                Formats.map((item,  index) => {
                    const rsrv=item[2];
                    const n=item[3];
                    const name=item[0];
                    const reserv=(rsrv!==undefined && label==="Reservoir")?rsrv:item;
                    const color=item[1];
                    const disable=(label==="Reservoir" && name!==nom && n!==0)
                    return <TouchableRipple onPress={()=>{!disable && (()=>{toggleItem({type:label,value:reserv});render(false)})()}}>
                            <Checkbox.Item
                                key={index}
                                label={reserv.toString()} 
                                style={{maxWidth:70,minWidth:70,padding:15,backgroundColor:n>3 && color,borderWidth:(label==="Reservoir" && n>0)?2:0,borderColor:color,flex:1,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}
                                status={selected.includes(reserv)?"checked":"unchecked"}
                                disabled={disable}
                                onPress={()=>{toggleItem({type:label,value:reserv});render(false)}}
                            >
                            <Badge>{n}</Badge>
                            </Checkbox.Item>
                        </TouchableRipple>
                    })
                }
            </Dialog.Content>
            {/* <Dialog.Actions>
              <Button onPress={()=>setDialogShow(false)}>Fermer</Button>
            </Dialog.Actions> */}
          </Dialog>
        </Portal>
}

const MeraRow=({othersProps,item})=>{
   const {title,codor,deleteItem,product,clooned}=othersProps;
   return <><View style={{height:"auto",width:"100%",flexDirection:"row",justifyContent:"center"}}>
    <View style={{...styles.analysisRowStyle,maxHeight:850,height:"auto",padding:10,flex:"commentaires"===[]?6/7:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start"}}>
        <TouchableOpacity style={{position:"absolute",left:-7,top:-6,flexDirection:"row",alignItems:"center",justifyContent:"center"}} onPress={()=>deleteItem(product)}>
            <Text style={{textAlign:"center",width:"100%"}}>❌</Text>
        </TouchableOpacity>
        <Text style={[styles.nameStyle,{borderBottomWidth:1,borderColor:"whitesmoke",position:"absolute",maxHeight:30,left:10,top:2,minWidth:130,maxWidth:130,color:codor}]}>{clooned?clooner(title):title}</Text>
        <DensiteRange item={item}/>
        <ViscoRange item={item}/>
        {/* {(registrable && currentUserId) && <Bouton reqBody={{
                            machine:productProps.Machine[0],
                            categorie:categorie,
                            name:nom,
                            reservoir:productProps.Reservoir[0],
                            ph:Number(productProps.ph[0]),
                            parfum:dor?'C':'NC',
                            color:lor?'C':'NC',
                            observations:APPRECIATIONS(),
                            UtilisateurId:currentUserId
                            }}
                            render={(o)=>setButtonParams(o)}
                            buttonParams={buttonParams}
                        />
        } */}
    </View>
    {/* {thereIsCommentaires && <View style={styles.commentairesStyle}>
                {commentaires.map(item=>
                    item!=="" && <Text style={{color:"rgb(100,0,0)",fontSize:9,textAlign:"left"}}>{"🚨 "+item}</Text>
                )}
    </View>} */}
    </View>
    </>
}
export default NewAnalysis;

const styles=StyleSheet.create({
    newAnalysisRow:{
        width:"100%",
        height:"auto",
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"flex-start"
    },
    analysisRowStyle:{
        // flex:5/6,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"flex-end",
        maxHeight:90,
        minHeight:90,
        padding:10,
        margin:5,
        borderColor:"grey",
        backgroundColor:"rgba(0,0,0,0.3)",
        borderRadius:8
    },
     commentairesStyle:{
        flex:1/7,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"flex-start",
        maxHeight:90,
        minHeight:90,
        padding:10,
        margin:5,
        borderColor:"grey",
        backgroundColor:"rgba(255,255,255,0.5)",
        borderRadius:8
    },
    picker:{
        width:"40%",
        height:"auto",
        paddingVertical:20,
        paddingHorizontal:20,
        textAlign:"center",
    },
    chip:{
        width:"auto",
        height:"auto",
        backgroundColor:"white"
    },
    nameStyle:{
        color:"grey",
        fontSize:14,
        fontWeight:"bold",
        padding:8,
        marginHorizontal:10,
        // borderWidth:1,
        borderRadius:8,
        textAlign:"center",
    }
})