// ___________________ CALLED PACKAGES __________________________________________
import { View,Text,TouchableOpacity,Pressable,ScrollView/*,Alert*/,StyleSheet } from 'react-native';
import { useState,useEffect,useLayoutEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
// ___________________  DATA STATEMENTS _______________________________________
import { setCrntUsers,postUsers,postedUsers,unPostUsers } from '../../store/reducers/crntReducer';
import { CurrentUsersProvider,useCurrentUsers, usePopup } from '../../wrappers/contexts';
import { save } from '../../store/reducers/userToUpdateReducer';
import { setCurrent} from '../../store/reducers/userReducer';
// ___________________  IMPORTED COMPONENTS ___________________________________
import { dbBaseRoot, primaryColor,couleurs } from '../../../assets/constantes';
import { Connection } from '../../../navigators/DrawerNavigator';
import WinDim from '../../../assets/operatingData';
import {allowTo} from '../../../assets/functions';
import { Time} from '../../../hooks/littleBiblio';
import { ToggleUser } from '../../nivSlide';
import { Flex } from '../../accueil';
// import Pop from '../../popup';

const {isLarge,isWeb}=WinDim;
const CurrentUsersListe=()=>{
    const dispatch=useDispatch();
    // const {setSelectedId}=useCurrentUsers();// Legacy : responsabiliser automatiquement l'utilisateur connecté en tant que chef de quart
    const targetUser=useSelector(state=>state.user.targetUser);
    const crntUsers=useSelector(state=>state.crnt.crntUsers);
    const crntUsersLenght=crntUsers.length;
    useLayoutEffect(() => {
            dispatch(setCrntUsers([...crntUsers.filter(item=>item.id!=targetUser.id),targetUser]));
    }, []);

    var users= crntUsersLenght>0?crntUsers:[targetUser];

    return <>
                {
                    users.map((usr,index)=>
                            usr && <CurrentUser
                                key={index}
                                user={usr}
                            />
               )}

            </>}
const UsersListe=()=>{
    const postedUsers=useSelector(state=>state.crnt.postedUsers);
    const {usrs,setUsrs}=useCurrentUsers();
    const dispatch=useDispatch();

    useLayoutEffect(() => {
        !postedUsers?fetch(dbBaseRoot + "utilisateurs/", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data=>{
            const utilisateurs=data.filter(item=>item!==null);
            setUsrs(utilisateurs);
            dispatch(postUsers(utilisateurs));
        })
        .catch(function(error){ alert(error.message)})
        :setUsrs(postedUsers);
    }, []);

    return <>
                {
            usrs.map((user,index)=>
                        <User
                            key={index}
                            user={user}
                        />
                )}
            </>}

const CurrentUser = ({user}) => {
    const dispatch=useDispatch();
    const {currentUser,crntUsers}=useSelector(state=>{
        const currentUsr=state.user.currentUser;
        const crntUsrs=state.crnt.crntUsers;
        return {currentUser:currentUsr,crntUsers:crntUsrs};
    });
    const currentUserId=currentUser!==null?currentUser.id:null;
    const {id,pseudo}=user;
    const {selectedId,setSelectedId}=useCurrentUsers();
    // const iAmSelected=selectedId===id;
    const crntUsersLenght=crntUsers.length;
    const iAmSelected=crntUsersLenght===1 || currentUserId===id;
    const handleUserPress=()=>{setSelectedId(id);dispatch(setCurrent(user));}
    useLayoutEffect(() => {
        (crntUsersLenght<=0 && iAmSelected) && handleUserPress();
    }, [crntUsers]);
  return <TouchableOpacity
        style={
            {
                width:'auto',
                height:'100%',
                maxHeight:40,
                backgroundColor:iAmSelected?'white':'rgba(0,0,0,0.3)',
                borderRadius:10,
                padding:iAmSelected?10:6,
                flexDirection:'row',justifyContent:'center',alignItems:'center',
            }
        }

        onPress={handleUserPress}
    >
        <Text style={{color:iAmSelected?'grey':'white',fontWeight:iAmSelected && 'bold',letterSpacing:iAmSelected?1:-1,fontSize:iAmSelected?'18':'16',textAlign:'center',}}>
            {pseudo.toUpperCase()}
        </Text>
    </TouchableOpacity>
};
const User = ({user}) => {
    const dispatch=useDispatch();
    const crntUsers=useSelector(state=>state.crnt.crntUsers);
    const {id,pseudo}=user;
    const utilisateurs=crntUsers.filter(item=>item!==null);
    const iAmSelected=utilisateurs.findIndex(item=>item.id===id)!==-1;
    const userTargeted=() => {
        var cUsers;
        if(iAmSelected){cUsers=utilisateurs.filter(usr=>usr.id!==id);
        }else{cUsers=[...utilisateurs,user];};
        dispatch(setCrntUsers(cUsers));
    };
  return <TouchableOpacity
        style={
            {
                width:'auto',
                height:'100%',
                maxHeight:40,
                backgroundColor:iAmSelected?'white':'rgba(0,0,0,0.3)',
                borderRadius:10,
                padding:6,
                flexDirection:'row',justifyContent:'center',alignItems:'center',
            }
        }

        onPress={userTargeted}
    >
        <Text style={{color:iAmSelected?'grey':'white',/*fontWeight:iAmSelected && 'bold',*/letterSpacing:-1,fontSize:'16',textAlign:'center',}}>
            {pseudo.toUpperCase()}
        </Text>
    </TouchableOpacity>
};
export const CurrentUsers = ({render}) => {
    const {setPop}=usePopup();
    const {targetUser} = useSelector(state => state.user);
    const [show,setShow]=useState(false);
  return <CurrentUsersProvider>
	<View style={{height:'80%',flexDirection:'row-reverse',alignItems:'flex-start',justifyContent:'flex-start',gap:10,}}>
                            <Button
                                icon="dots-vertical"
                                onPress={()=>{
                                    if(!allowTo("définir l'équipe opérante",targetUser?.privileges)){
                                        setPop({show:true,message:"Vous n'êtes pas habileté à définir l'équipe opérante.\nVeuillez le rappeler à votre chef de quart !",code:'#880000'});
                                        return;
                                    }
                                    setShow(!show)}}
                                style={{flexDirection:'row',justifyContent:'center',backgroundColor:"whitesmoke",alignItems:'center',width:30,height:'100%',marginLeft:10,}}
                            >users</Button>
                            <CurrentUsersListe/>
                    </View>
                    {
                        show && <View
                        style={{
                            flexDirection:'row',
                            alignItems:'flex-start',
                            justifyContent:'flex-start',  
                            gap:10,padding:20,
                            zIndex:10,
                            borderBottomLeftRadius:10,
                            borderBottomRightRadius:10,
                            minWidth:220,
                            // minHeight:400,
                            backgroundColor:primaryColor,
                            position:'absolute',
                            top:35,
                            right:30,
                        }}>
                            <UsersListe/>
                        </View>
                    }
            </CurrentUsersProvider>
};

//=================================================================================================
const Users = ({/*visible,,rend,render*/navigation}) => {
    const [utilisateurs,setUtilisateurs]=useState([]);
    const dispatch=useDispatch();
    const {targetUser,postedUsers}=useSelector(state=>{
        const postedUsers=state.crnt.postedUsers;
        const targetUser=state.user.targetUser;
        return {targetUser,postedUsers};
    });
const addUserAllowed=allowTo("ajouter une norme|user",targetUser?.privileges)?'allowed':'notAllowed';
    useEffect(() => {
        !postedUsers?fetch(dbBaseRoot + "utilisateurs/", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data=>{dispatch(postUsers(data));setUtilisateurs(data)})
        .catch(function(error){ return})
        :setUtilisateurs(postedUsers);
    }, [postedUsers]);

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerLeft:()=>(
                <TouchableOpacity style={{width:80,margin:0,marginLeft:30,backgroundColor:'transparent',}} onPress={() => navigation.goBack()}>
                    <FontAwesome5 name='arrow-left' size={20} color='blue'/>
                </TouchableOpacity>
            )
        })
    })

    const handleAddUser=()=>{
        // setLoading(true);
        // const {fName,lName,tel,pseudo}=errors;
        // const email=user.email===""?user.fName+'_'+user.lName+'@gmail.com':user.email
        // if(!fName && !lName && !tel && !pseudo){
        //     fetch(dbBaseRoot+"utilisateurs/add",{
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body:JSON.stringify({...user,email:email,password:'123456',isAdmin:false})
        //     })
        //         .then((response) => response.json())
        //         .then((result) => {
        //             const {code}=result;
        //             if(code && code==='green'){
        //                 setLabel('✔ success');
        //                 dispatch(unPostUsers());
        //             }else{
        //                 alert(result.message)
        //                 setLabel('❌ failed')
        //             }
        //         })
        //         .catch((error) => alert(error.message))
        //         .finally(()=>{setLoading(false);})
        // }else{
        //     setLabel('❌ missing data');
        //     setLoading(false);
        // }
    }
//     var orderedUsers=utilisateurs.sort((a, b) => {
//     const numA = parseInt(a.niv.split('_')[1]); // Extraire le numéro de la chaîne a
//     const numB = parseInt(b.niv.split('_')[1]); // Extraire le numéro de la chaîne b
//     return numB - numA; // Tri décroissant (plus grand au plus petit)
// });
  return <View style={styles.container}>
                {/* <Pop/> */}
                {/* <Text style={{width:'100%',paddingVertical:20,fontSize: 18, fontWeight: 'bold',textAlign:'center',borderBottomWidth:2,borderBottomColor:'blue', }}>{utilisateurs.length} utilisateurs enregistrés</Text> */}
                <ScrollView style={{height:'100%',width:'100%',minWidth:700,}}>
                    <View 
                    style={{
                        marginTop:20,
                        minWidth:'100%',
                        padding:15,
                        flexDirection:'column',
                        alignItems:'flex-start',
                        justifyContent:'flex-start',
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        borderRadius:10,
                        backgroundColor:'rgba(255,255,255,0.7)',
                    }}>
                        <Pressable
                        disabled={!allowTo("ajouter une norme|user",targetUser?.privileges)}
                            style={
                                {
                                    paddingHorizontal:10,
                                    paddingVertical:10,
                                    marginVertical:15,
                                    marginHorizontal:20,
                                    borderRadius:10,
                                    backgroundColor:'rgba(0,0,0,0.2)',
                                }
                            }

                            onPress={()=>navigation.navigate("Ajouter nouveau utilisateur")}
                        >
                            <FontAwesome5 size={20} name="user-plus" color={couleurs[addUserAllowed][7]}/>
                        </Pressable>
                        {utilisateurs.map((user,index)=><UserRow
                            key={index}
                            users={utilisateurs}
                            user={user}
                            navigation={navigation}
                            // openForUpdate={()=>rend()}
                            rd={urs=>setUtilisateurs(urs)}
                            />
                        )}
                    </View>
                </ScrollView>
                {allowTo("illimite",targetUser?.privileges) && <Pressable
                        disabled={!allowTo("illimite",targetUser?.privileges)}
                            style={
                                {
                                    paddingHorizontal:10,
                                    paddingVertical:10,
                                    marginVertical:15,
                                    marginHorizontal:20,
                                    borderRadius:10,
                                    backgroundColor:'rgba(0,0,0,0.2)',
                                }
                            }

                            onPress={()=>navigation.navigate("Activités utilisateurs")}
                        >
                            {/* Activites utilisateurs */}
                            <FontAwesome5 size={5} name="project-diagram" color="blue"/>
                </Pressable>}
                {/* <Pressable style={styles.closeButton} onPress={() => {navigation.goBack() */}
                {/*render()*/ }
                {/*}}><Text style={styles.textButton}>Close</Text></Pressable> */}

            </View>
};

export const UsersActivities=()=>{
    const [actions,setActions]=useState([]);
    useEffect(() => {
        fetch(dbBaseRoot + "actions/", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data=>setActions(data.actions))
        .catch(function(error){ return})
    }, []);
            // const {Utilisateur,action,createdAt}=act;
    function stars(mx) {n=1;var str='';while (n<=mx) {if (true) {str=str+'🔹'; n++;}}
         return str;
        };

    return <View style={styles.activityContainer}>
        {actions.map((act,index)=><Text
            style={{fontSize:14,maxWidth:'100%',marginVertical:3,minWidth:'100%',backgroundColor:(index%2===0) && '#00000015',lineHeight:30,color:act.action.includes('supprim') ? 'red' : 'rgb(0,90,0)'}} key={act.createdAt}>
            <Text style={{flexDirection:'row',height:50,width:60,marginHorizontal:20,padding:3,borderRadius:"50%",fontWeight:'bold',textAlign:'center',backgroundColor:'#00000030'}}>{act.id}</Text>
            <Text style={{marginRight:40}}>{new Date(act.createdAt).toLocaleDateString()+"  "+Time(act.createdAt)} {"  "+act.Utilisateur.fName+" "+act.Utilisateur.lName} {act.action}</Text>
            <Text style={{position:'absolute',right:15,color:'#00000060'}}>{stars(parseInt(act.Utilisateur.niv.split("_")[1]))+" "+act.Utilisateur.pseudo}</Text>
            </Text>
        )}
    </View>
}

const UserRow=({user,users,rd,navigation,openForUpdate})=>{
    const {id,email,pseudo,url,niv,createdAt,isAdmin,...rest}=user;
    return <View style={{...styles.row,marginBottom:5,backgroundColor:'whitesmoke',}}>
                    {Object.values(rest).map((value, index) =>(
                        <Text key={index} style={[styles.cell,{textAlign:"left",letterSpacing:2,minWidth:140,maxWidth:140,paddingLeft:20}]}>{value}</Text>
                    ))}
                    <Text style={[styles.cell,{textAlign:"cneter",letterSpacing:2,minWidth:100,maxWidth:100,paddingLeft:20}]}>{niv!=="can_6" && niv}</Text>
                    <Actions user={user} users={users} navigation={navigation} openForUpdate={()=>openForUpdate()} render={urs=>rd(urs)}/>
                    <ToggleUser render={urs=>rd(urs)} user={user}/>
                </View>
}

const Actions=({user,users,navigation,render,openForUpdate})=>{
    const {setPop}=usePopup();
    const {id,fName,lName,tel,niv}=user;
    const niveg6=niv==="can_6";
    const isMNdr=(fName+" "+lName+" "+tel).toLowerCase()==="mamadou ndour 771528620";
    const dispatch=useDispatch();
    const targetUser=useSelector(state => state.user.targetUser);
    const updateAllowed=(allowTo("modifier une norme|user",targetUser?.privileges) && !niveg6 && !isMNdr)?'allowed':'notAllowed';
    const deleteAllowed=(allowTo("supprimer une norme|user",targetUser?.privileges) && !niveg6 && !isMNdr)?'allowed':'notAllowed';
    const isAdminConnected=Connection().isAdmin;
  const handleDelete=async ()=>{
        try{
        const response= await fetch(`${dbBaseRoot}utilisateurs/delete/${targetUser.id}/${id}`,{
          method:'DELETE',
          headers: {
              'Content-Type':'application/json',
              'Authorization': `Bearer ${targetUser.token}` 
          },});
          const data=await response.json();
            const itms=users.filter(item=>item.id!==id)
            render(itms);
            dispatch(postUsers(itms));
            setPop({show:true,message:'Utilisateur supprimé avec succes !',code:'green'});
        }catch(error){
          setPop({show:true,message:error.message,code:'#880000'});
        }
    }

    const confirmDelete=()=>{
        if(!allowTo("supprimer une norme|user",targetUser?.privileges)){
            setPop({show:true,message:"Vous n'êtes pas habileté à supprimer un utilisateur.\nVeuillez-vous rapprocher de votre responsable de departement !",code:'#880000'});
            return;
        }
        isWeb?
            (confirm("Etes-vous sur de  vouloir supprimer cet enregistrement ?")?handleDelete():null)
          :
          /*Alert.*/alert("Confirmation",
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
    if(!allowTo("modifier une norme|user",targetUser?.privileges)){
        setPop({show:true,message:"Vous n'êtes pas habileté à modifier un utilisateur.\nVeuillez-vous rapprocher de votre responsable de departement !",code:'#880000'});
      return;
    }
    dispatch(save(user));
    dispatch(unPostUsers());
    // openForUpdate();

    navigation.navigate("Mise à jour utilisateur",{user:user});
  }

  return <View style={{width:100,paddingVertical: 3, borderRadius: 8, backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
    {/* {isAdminConnected? */}
      <><Pressable style={{position:'absolute',marginRight:40,zIndex:1000,}} disabled={niveg6 && isMNdr} onPress={confirmDelete}>
            <FontAwesome5 size={14} name="trash" color={couleurs[deleteAllowed][8]}/>
        </Pressable>
        <Pressable style={{position:'absolute',marginLeft:40,zIndex:1000,}} disabled={niveg6 && isMNdr} onPress={handleUpdate}>
            <FontAwesome5 size={14} name="pencil-alt" color={couleurs[updateAllowed][7]}/>
        </Pressable></>
    {/* :<Text>...</Text>} */}
    </View>
}

export default Users;

const styles=StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:'auto',
        minWidth:1000
        // width:'100%',
        // height:'100%',
    },
    activityContainer:{
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal:100,
        paddingVertical:40,
        minWidth:1000,
        maxHeight:700,
        overflow:'scroll',
        // width:'100%',
        // height:'100%',
    },
    // modal:{
    //     zIndex:8,
    //     maxWidth:400,
    //     width:'100%',
    //     maxHeight:'70%',
    //     height:300,
    //     margin:'auto',
    //     marginTop:'20%',
    //     borderRadius:10,
    // },
    // viewParent:{
    //     gap:18,
    //     paddingVertical:'6%',
    //     paddingHorizontal:'2%',
    //     paddingTop:0,
    //     backgroundColor: 'rgba(255,255,255,0.7)',
    //     borderRadius:10,
    //     ...Flex('column','flex-start','flex-end'),
    // },
    // inputs:{
    //     // height:'fit-content',
    //     width:'100%',
    //     ...Flex('column','flex-start','center'),
    //     gap:12,
    // },
    cell: {
        flex: 1,
        paddingVertical: 5,
        textAlign: "center",
        fontSize:11,
        maxWidth:400,
        // overflow:'scoll',
    },
    row: {
        width:'100%',
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        justifyContent:'flex-end',
    },
    input:{
        backgroundColor:'rgb(80,80,80)',
        width:'90%',
        fontWeight:'bold',
        textAlign:'center',
        letterSpacing:4,
        borderRadius:8,
        color:'white',
        // maxHeight:'5rem',
        // height:'5rem',
        // padding:'1.5rem',
    },
    // buttons:{
    //     ...Flex('row','flex-end','center'),
    //     gap:24,
    //     maxHeight:48,
    //     height:48,
    //     width:'100%',
    // },
    // closeButton:{
    //     margin:30,
    //     padding:10,
    //     backgroundColor:'rgb(100,0,0)',
    //     borderRadius:10,
    //     alignSelf:'flex-end',
    //     maxWidth:200,
    //     width:150,
    // },
    // connectButton:{
    //     padding:10,
    //     backgroundColor:'green',
    //     width:'50%',
    //     // maxWidth:'5rem',
    //     borderRadius:10,
    // },
    textButton:{
        color:'white',
        width:'100%',
        textAlign:'center',
    },

})

