import {useState,useRef,useEffect,useContext,Fragment} from "react";
import { View, TextInput,Pressable,StyleSheet,Text,TouchableOpacity,TouchableWithoutFeedback,Image,ScrollView,Alert} from "react-native";
import { Badge } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';
import { useNavigation } from "@react-navigation/native";
import { useSelector,useDispatch} from 'react-redux';
import { useResult } from "../resultProvider";
import { useMonoProducts,usePopup} from "../wrappers/contexts";
import { AddComment } from "../buttons/save";
import { commentsFromObjectToArray, ReduceDateTime,Time } from "../../hooks/littleBiblio";
import Colors from "../../assets/colors";
// import socket from "../../assets/socket.IO-client";
import  socket from '../../assets/socketService.js'
import {requete,nameFromText,allowTo} from "../../assets/functions";
import WinDim from "../../assets/operatingData";
const {isWeb}=WinDim;
import { dbBaseRoot,couleurs } from "../../assets/constantes";
import { data,postAnalyses } from "../store/reducers/dataReducer";
import { idToUpdate } from "../store/reducers/idReducer";
import { clooner } from "../accueil";
const path="../../assets/images/users-images/";
const {Citron,Platinium,Premium,Bleu,Marron,Alerte,Rouge,Blanc}=Colors;
const colors={
  Renzo_Madar:Citron,
  Renzo_Platinium:Platinium,
  Renzo_Premium:Premium,
  Lave_bois:Marron,
  Renzo_Noura:Citron,
  Lave_vitre_Madar:Bleu,
  Lave_vitre_Noura:Bleu,
  Mera_bleu:Bleu,
  Mera_noir:'grey',
  Mera_rouge:Rouge,
  Mera_blanc:Blanc
}
function Flex(dir,jC,aI){
  return {
    display:'flex',
    flexDirection:dir,
    justifyContent:jC,
    alignItems:aI,
  }
}
export const ClickableRow=(
      {
        // navigation,
        // rend,
        styles,
        num,
        search,
        item,
        ky,
        items,
        modalShow,
        setK,k,
        render
      }
)=>{
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [comment,setComment]=useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);
  const {targetUser,clooned} = useSelector((state) => {
    const targetUser=state.user.targetUser
    const clooned=state.actived.clooned;
    return {targetUser,clooned};
  });
  const allowToComment=allowTo("commenter",targetUser?.privileges);
  const KEY=allowToComment?"allowed":"notAllowed";
  const targetPseudo=targetUser?.pseudo; //targetUser && 
  const scrollViewRef=useRef([]);
  const inputRef=useRef([]);
  const {setPop}=usePopup();
  const {id,createdAt,updatedAt,parfum,color,observations,commentaires,validation,categorie,Utilisateur,...rest}=item;
  const {name}=item;
  const validateur=validation?.Utilisateur.pseudo; validation //validation && 
  const validatedAt=validation?.updatedAt; //validation && 
  const chemist=Utilisateur.pseudo;
  const [commenteres,setCommenteres]=useState(commentaires);
  const [comments,setComments]=useState(commentsFromObjectToArray(commentaires));

  var isHovered=(k===id);
  var colorKey1=String(item.name).replaceAll(" ","_");
  var colorKey2=item.name.split(' ')[2];
  var colorKey3=item.name.split(' ')[1];
  const clr=colors[colorKey1] || Colors[colorKey2] || Colors[colorKey3];
  const itemColor=clr?clr:'whitesmoke';
    // useEffect(() => {
    //   socket.on('commentAdded', (data) => {
    //     const socketId=data.id;
    //     return socketId===id && setComments(commentsFromObjectToArray(data.commentaires));
    //   });
    //   return () => socket.disconnect();
    // }, []);
   const handleAddComment=()=>{
      if(!allowToComment){ setPop({show:true,message:"Vous n'êtes pas autorisé à commenter une analyse.",code:"#880000"});return;}
      if(comment){
        if(targetUser){
          const targetUserId=targetUser.id;
          const commentToAdd={text:comment,AnalyseId:id,Utilisateur:{id:1,fName:chemist,lName:chemist,isAdmin:false,id:null,pseudo:'ndour',url:'',createdAt:new Date()}}
          AddComment({text:comment,AnalyseId:id,UtilisateurId:targetUserId})
            .then((dt)=>{
            const {code}=dt;
            if(code==='green'){
              socket.emit('analyseCommented',{startedAt:startedAt,endedAt:endedAt,commentedId:id}/**{startedAt,endedAt,commentedId}=data; */)
             }
          })
          .catch(function(error){
            setPop({show:true,message:error.message,code:'#880000'})
          })
          // hot reload messenges =============================
          setCommenteres({...commenteres,commentToAdd})
          setComments(commentsFromObjectToArray({...commenteres,commentToAdd}))
          // ======================================================
          setComment('');
          // inputRef.current[key].value="";
          scrollViewRef.current[ky]?.scrollToEnd({animated:true});
        }else{
          modalShow(true);
        }
    }}

    const handleKeyPress=(e)=>{
      if(e.nativeEvent.key==='Enter'){
          handleAddComment();
      }
    }
    function Coloor(index){
      var style;
      if((index===3 && observations.includes('Ph '))||(index===4 && observations.includes('Ma '))||(index===5 && observations.includes('Visco '))){
        style={color:'red',fontWeight:'bold',};
      }else{style={}}
      return style;
    }
  return <TouchableOpacity 
            key={ky}
            onPress={() => {setFocusedIndex(id);setIsCollapsed(!isCollapsed)}} 
            style={{...styles.row1,zIndex:0}} 
            onPressIn={()=>setFocusedIndex(id)}
            onMouseEnter={()=>setK(id)}
            onMouseLeave={()=>setK(null)}
        >
      <View style={{...styles.row,borderBottomWidth:2,borderBottomColor:itemColor,marginBottom:5,backgroundColor:isHovered?'rgba(0,0,0,0.06)':'whitesmoke',height:isHovered && 36,}}>
        <Text style={styles.cell}>{Time(updatedAt)}</Text>
        {Object.values(rest).map((value, index) =>{
          return <Fragment key={index}>{(index===1 && search) && <Badge style={{fontWeight:'bold',fontSize:14,width:30,height:30,borderRadius:"50%"}}>{num}</Badge>}<Text style={[styles.cell,Coloor(index),{minWidth:(index===1 && 160)}]}>
            {value && typeof value==="object"?value.lName:index===1?(clooned?clooner(value):value):value}
          </Text></Fragment>
        })}
       <InfoMessage pseudo={targetPseudo} message_not_read={comments.length}/>
        <Text style={styles.cell}>
          <Decision data={{validation:validation,decidor:targetUser && targetUser, AnalyseId:id,observations:observations}} render={bool=>modalShow(bool)} />
        </Text>
        <Text style={styles.cell}>{Utilisateur.pseudo}</Text>
        {isHovered && <Actions /*delete  & edit  navigation={navigation}  ic={Utilisateur.id}*/ machine={rest.machine} reservoir={rest.reservoir} id={id} user={targetUser} name={name} items={items} /*rend={()=>rend()} pour l'update */ render={iteems=>render(iteems)}/>}
      </View>

      {focusedIndex===id && <Collapsible collapsed={isCollapsed}>
        <View style={{maxWidth:'100%',minWidth:'100%',paddingHorizontal:12,paddingVertical:0,marginHorizontal:'auto',backgroundColor:'rgba(0,0,0,0.7)',...Flex('column','flex-start','center')}}>
            <View style={{height:40,width:'100%',padding:5,}}><Text style={{color:'rgb(180,180,180)',maxWidth:'90%',overflow:'wrap',}}>{"created : "+ReduceDateTime(createdAt)+"   updated : "+ReduceDateTime(updatedAt)+"  By:"+chemist+"  "+(validation?(" validated by: "+validateur+" on: "+ReduceDateTime(validatedAt)):"")}</Text></View>
            <View style={{width:'100%',padding:12,borderRadius:5,paddingTop:5,paddingBottom:24,/*minHeight:290,*//*maxHeight:300,height:290,overflowY:'scroll',*/backgroundColor:'rgb(180,180,180)',}}>
                <Text style={{color:'black',fontWeight:'bold',}}>{"Analyse "+id+" - "+categorie+"."+clooner(item.name)+" Observations : "}<Observations obs={observations}/> </Text>
                <ScrollView ref={scrollViewRef}>
                      <View style={{width:'100%',/*minHeight:290,*/paddingBottom:50,flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
                          {comments.map((cmnt,index)=><Comment key={index} targetPseudo={targetPseudo} color={itemColor} comnt={cmnt}/>)}
                      </View>
                </ScrollView>
            </View>
            <View style={{...Flex('row','center','center'),/*position:'absolute',*/zIndex:10,width:'100%',height:80,marginTop:-12,bottom:0,}}>
                <TouchableWithoutFeedback style={{width:'85%',height:'60%',}}>
                    <TextInput
                        style={{display:'block',backgroundColor:'white',width:'100%',padding:5,margin:5,borderRadius:5,paddingHorizontal:12,overflowX:'wrap',height:'60%',maxHeight:100,/* overflowY:'scroll',*/}}
                        placeholder="Your new comment here ..."
                        ref={inputRef}
                        onSubmitEditing={handleAddComment}
                        onChangeText={(value)=>setComment(value)}
                        onKeyPress={handleKeyPress}
                        value={comment}
                    />

                </TouchableWithoutFeedback>
                <TouchableOpacity
                  disabled={!allowToComment}
                  onPress={handleAddComment}
                  style={{maxWidth:48,width:'20%',height:'50%',paddingHorizontal:6,paddingVertical:4,margin:6,backgroundColor:couleurs[KEY][7],borderRadius:5,...Flex('column','center','center'),}}
                >
                <Text style={{color:'white',textAlign:'center',fontWeight:'bold',}}>
                  <Icon name="paper-plane" size={17} color="#fff"/>
                </Text>

                </TouchableOpacity>
            </View>
        </View>
      </Collapsible>}


  </TouchableOpacity>
}
//======================= PARTIE CONCERNANT LES COMMENTAIRES ===================
const Observations=({obs})=>{
  const obsArray=obs.split(' & ');
  const obsArrayFiltred=obsArray.filter(it=>(it!=="" && it!=="RAS" && it!==undefined && it!==null));
  return <View style={{flexDirection:'column',justifyContent:'flex-start',gap:5,fontSize:13,}}>
   {obsArrayFiltred.map((itm,index)=>{
    return <View key={index} style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start',gap:3,height:'fit-content',}}>
      <Text style={{display:'inline-block',padding:5,backgroundColor:'red',textAlign:'center',lineHeight:10,color:'white',fontWeight:'bold',borderRadius:25,}}>{index+1}</Text>
      <Text>{itm}</Text>
   </View>})}
  </View>
}

export const Comment=({comnt,targetPseudo,color})=>{
    const pseudo=comnt[5];
    const isMe=pseudo==="ndour";
    const image="default.jpg";
    return <View style={{
      minWidth:"100%",
      flexDirection:isMe?"row-reverse":"row",
      justifyContent:"flex-start",
      alignItems:"center",
      minHeight:25,
      maxHeight:45,
      padding:0,
      marginVertical:5,
      }}>
    <Image
        source={require(`${path}${image}`)}
        style={{
            width:30,
            height:30,
            display:'inline',
            marginHorizontal:5,
            borderRadius:25,//'50%'
            borderWidth:1.5,
            borderColor:color,//"blue",
            }}
    />
    <Text style={{color:'black',}}>{!isMe && <Text style={{fontWeight:'bold',fontSize:10,letterSpacing:1,position:'absolute',left:-18,bottom:-9,}}>{pseudo.toUpperCase()}</Text>}{'       '+comnt[0]}</Text>
    </View>
}
const Comments=({targetPseudo,itemColor})=>{
  // const {formatedComments,setFormatedComments}=useComments();
  return <View style={{width:'100%',minHeight:290,/*height:290,*/paddingBottom:50,/*30*/flexDirection:'column-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:2,}}>
          {/* {formatedComments.map((cmnt,index)=><Comment key={index} targetPseudo={targetPseudo} color={itemColor} comnt={cmnt}/>)} */}
      </View>
}
//==================================================================
const Decision=({data,/*validation,decidor,*/ render})=>{
  {/* {id,ok,validation,UtilisateurId,AnalyseId} */}
  const {setPop}=usePopup();
  const {validation,decidor,AnalyseId,observations}=data;
  const [d,setD]=useState(
    {
      isolate:{
        display:'inline-block',
        label:'Isolated',
      },
      pass:{
        display:'inline-block',
        label:'Past',
      }
    }
  );

  useEffect(()=>{
      if(validation){ // s'il ya lieu de validation
        const {ok}=validation;
        const v=validation.validation;
        if(ok){ // si dejà validé
          if(v==='Isolated'){
            setD({...d,pass:{display:'none',label:'Isolated'}});

          }else if(v==='Past'){
            setD({...d,isolate:{display:'none',label:'Past'}});
          }
          else{}
        }
    }
  },[])

  const handleDecide=(decision) =>{
    const allowToDecide=allowTo("valider une valeur incorrecte",decidor?.privileges);
    if(!allowToDecide){
      setPop({show:true,message:"Vous n'êtes pas habileté à prendre cette décision.\nVeuillez contacter votre chef de quart \nou votre responsable de departement !",code:"#880000"});
      return;
    }
      if(decidor){
        const url=dbBaseRoot+"validations/update";
        // if(!decidor.isAdmin){alert("Vous n'etes pas abileté à prendre cette décision.");return}
        // else{
          if(decision==='isolate'){
            setD({...d,pass:{display:'none',label:'Isolated'}});
            requete(url,'PUT',{id:validation.id,ok:true,validation:'Isolated',UtilisateurId:decidor.id});
          }else{
            setD({...d,isolate:{display:'none',label:'Past'}});
            requete(url,'PUT',{id:validation.id,ok:true,validation:'Past',UtilisateurId:decidor.id});
          }
        // }
      }else{
        render(true);
      }
  }

return <TouchableWithoutFeedback>
  <View style={{ position: "absolute", right: 30,paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, backgroundColor:'white',zIndex: 1000, ...Flex('row', 'center', 'center'), gap: 10, }}>
  {validation?
    <>
      <Pressable onPress={()=>handleDecide('isolate')}><Text style={{ color: "red",display:d.isolate.display, }}>{d.isolate.label}</Text></Pressable>

      <Pressable onPress={()=>handleDecide('pass')}><Text style={{ color: "green",display:d.pass.display,}}>{d.pass.label}</Text></Pressable>
    </>
    :
    <Text style={{color:'green',fontWeight:'bold',fontSize:14, }}>{'✔'}</Text>
  }
  </View>
</TouchableWithoutFeedback>}

const Actions=({machine,reservoir,id,user,name,items,render})=>{
  const targetUser = useSelector((state) => state.user.targetUser);
  const allowToDelete=allowTo("supprimer analyse",targetUser?.privileges);
  const allowToUpdate=allowTo("modifier analyse",targetUser?.privileges);
  const updateAllowed=allowToUpdate?'allowed':'notAllowed';
  const deleteAllowed=allowToDelete?'allowed':'notAllowed';

  const {result}=useResult();// from ResultProvider
  const {setPop}=usePopup();
  const dispatch=useDispatch();
  const navigation=useNavigation();
  const handleDelete=async ()=>{
        try{
          // Mise a jour coté bdd
          await fetch(`${dbBaseRoot}analyses/delete/${targetUser.id}/${id}`,{
            method:'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${targetUser.token}` 
            },});
          // Mise à jour coté UI
            const itms=await items.filter(item=>item.id!==id);
            await dispatch(postAnalyses([]));
            await render(itms);
        }catch(error){
          setPop({show:true,message:error.message,code:"#880000"});
        }
      }
      
  const confirmDelete=()=>{
    if(!allowToDelete){
      setPop({show:true,message:"Vous n'êtes pas habilté à supprimer une analyse.",code:"#880000"});
      return;
    }
    isWeb?
        (confirm("Etes-vous sur de  vouloir supprimer cet enregistrement ?")?handleDelete():null)
      :
      Alert.alert("Confirmation",
          "Etes-vous sur de  vouloir supprimer cet enregistrement ?",
          [
            {
              text:"Annuler",
              style:"cancel",
              onPress:()=>null
            },
            {
              text:"Continuer la suppression",
              onPress:()=>handleDelete()
            }
          ],
          {cancelable:true}
      )
  }

  const handleUpdate=async ()=>{
    if(!allowToUpdate){
      setPop({show:true,message:"Vous n'êtes pas habilté à modifier une analyse.",code:"#880000"});
      return;
    }
    var nom=nameFromText(name);
    result[nom].machine=machine;// on ajoute machine et reservoir pour l'update avant le dispatch & navigation
    result[nom].reservoir=reservoir;
    dispatch(data(result[nom]));
    prod=result[nom].identification.categorie==='dentifrice'?'mera':null;//not null only if dentifrice
    dispatch(idToUpdate({targetId:id,product:prod}));
    dispatch(postAnalyses([]));
    navigation.navigate("analyses/liquides/updateLiquides");
  }

  return <TouchableWithoutFeedback>
    <View
      style={{
        width:100,
        paddingVertical: 3,
        borderRadius: 8,
        backgroundColor:'white',
        ...Flex('row','center','center')
        }}
    >
    {/* {
      user && user.isAdmin? */}
      <>
        <Pressable disabled={!allowToDelete} style={{...stiles.actions,marginRight:45,}} onPress={confirmDelete}>
            <Icon size={14} name="trash" color={couleurs[deleteAllowed][8]}/>
        </Pressable>
        <Pressable disabled={!allowToUpdate} style={{...stiles.actions,marginLeft:50,}} onPress={handleUpdate}>
            <Icon size={14} name="pencil" color={couleurs[updateAllowed][7]}/>
        </Pressable>
      </>
      {/* :<Text>...</Text>
    } */}
    </View>
  </TouchableWithoutFeedback>
}

const InfoMessage=({pseudo,message_not_read})=>{
  return message_not_read!==0 && <View style={stiles.infoBulle}>
    <Text style={{height:'100%',width:'100%',textAlign:'center',fontSize:16,fontWeight:'bold',color:'white'}}>
      {message_not_read}
      {pseudo==='ndour' && '🏵️'}
      </Text>
  </View>
}
const stiles=StyleSheet.create({
  actions:{
    position:'absolute',
    zIndex:1000,
    height:'95%',
    // backgroundColor:'grey',
    width:35,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  infoBulle:{
    backgroundColor:'rgba(0,150,0,0.8)',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    borderBottomRightRadius:15,
    alignContent:'center',
    padding:2,
    paddingLeft:8,
    // paddingRight:2,
    minWidth:35,
    height:25,
    position:'absolute',
    right:240,
    top:-15
  }
})   