import React, { useState,useLayoutEffect} from 'react';
import { View, Text,TouchableOpacity,TouchableWithoutFeedback,Keyboard,StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector,useDispatch } from 'react-redux';
import {TextInput} from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { postUsers } from '../../store/reducers/crntReducer';
import { usePopup } from '../../wrappers/contexts';
import { Flex } from '../../accueil';
import { dbBaseRoot } from '../../../assets/constantes';
import { ThereIsUser } from '../../../navigators/DrawerNavigator';
// import Pop from '../../popup';
const AddUser = ({navigation,route/*vizible,render*/}) => {
    // const userToUpdate=ThereIsUser;
    const USER=route.params?.user;
    const isToUpdate=USER?true:false;
    const dispatch=useDispatch();
    const {setPop}=usePopup();
    const {targetUser}=useSelector(state=>state.user)
    // const {fName,lName,tel,email,pseudo}=userToUpdate?userToUpdate:{fName:"",lName:"",tel:"",email:"",pseudo:""};
    const {fName,lName,tel,email,pseudo,depart_affecte}=isToUpdate?USER:{fName:"",lName:"",tel:"",email:"",pseudo:"",depart_affecte:""};
    const [user,setUser]=useState({fName:fName,lName:lName,tel:tel,email:email,pseudo:pseudo,depart_affecte:depart_affecte})
    const [errors,setErrors]=useState({fName:!isToUpdate,lName:!isToUpdate,tel:!isToUpdate,pseudo:!isToUpdate,depart_affecte:!depart_affecte})
    const [label,setLabel]=useState('Submit')

    const [loading,setLoading]=useState(false);
    
    useLayoutEffect(()=>{
            navigation.setOptions({
                headerLeft:()=>(
                    <TouchableOpacity style={{width:80,margin:0,marginLeft:30,backgroundColor:'transparent',}} onPress={() => navigation.goBack()}>
                        <FontAwesome5 name='arrow-left' size={20} color='blue'/>
                    </TouchableOpacity>
                )
            })
        })

    const handlePost=()=>{
        setLoading(true);
        // console.log({...USER,fName:user.fName,lName:user.lName,tel:user.tel,email:user.email,pseudo:user.pseudo,userId:targetUser.id})
        const {fName,lName,tel,pseudo}=errors;
        const email=(user.email===undefined || user.email=== null || user.email==="")?user.fName.replace(" ","")+'_'+user.lName.replace(" ","")+'@gmail.com':user.email
        if(!fName && !lName && !tel && !pseudo){
            const url=isToUpdate?"utilisateurs/update/"+USER.id:"utilisateurs/add";
            const method=isToUpdate?'PUT':'POST';
            const body=isToUpdate?{...USER,fName:user.fName,lName:user.lName,tel:user.tel,email:user.email,pseudo:user.pseudo,depart_affecte:user.depart_affecte,userId:targetUser.id}:{...user,email:email,niv:"can_0",password:'123456',isAdmin:false,userId:targetUser.id};
            const feedback=isToUpdate?'Utilisateur mis à jour avec succes.':'Utilisateur ajouté avec succes.';
            fetch(dbBaseRoot+url,{
                method:method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${targetUser.token}`, // Ajoute du token
                },
                body:JSON.stringify(body)
            })
                .then((response) => response.json())
                .then((result) => {
                    const {code,message,users}=result;
                    if(code && code==='green'){
                        dispatch(postUsers(users));
                        setLabel('✔ success')
                        setPop({show:true,message:feedback,code:'green'});

                    }else{
                        setLabel('❌ failed')
                        setPop({show:true,message:result.message,code:'#880000'});

                    }
                })
                .catch((error) => setPop({show:true,message:error.message,code:'#880000'}))
                .finally(()=>{setLoading(false);})
        }else{
            setLabel('❌ missing data');
            setLoading(false);
            setPop({show:true,message:'Des données obligatoires sont manquantes.',code:'#880000'})
        }
    }

    const handleChange=(obj)=>{
        const key=Object.keys(obj)[0];
        setUser({...user,...obj});
        key!=='email' && setErrors({...errors,[key]:false});
        setLabel('Submit');
    }

    const laboratoires=['Laboratoire central','Tour','Mera','Javel bouteilles','Projet javel','Comptabilité'];
  return (<>
    {/* <View style={styles.container}>
        <Modal pointerEvents="box-none" coverScreen={true} isVisible={vizible}  onBackdropPress={() => null} style={styles.modal}> */}
            {/* <TouchableWithoutFeedback> */}
                <View style={styles.viewParent}>
                {/* <Text style={{ fontSize: 18, fontWeight: 'bold',textAlign:'center', }}>Formulaire d'ajout de chimiste.</Text> */}
                <View style={styles.inputs}>
                    <TextInput
                                value={user.fName}
                                maxLength={25}
                                error={errors.fName}
                                onChangeText={(value)=>handleChange({fName:value})}
                                label="First Name *"
                                style={{width:'90%',}}
                                right={<TextInput.Icon icon="account"/>}
                    />
                    <TextInput
                                value={user.lName}
                                maxLength={20}
                                error={errors.lName}
                                onChangeText={(value)=>handleChange({lName:value})}
                                label="Last Name *"
                                style={{width:'90%',}}
                    />
                    <TextInput
                                value={user.tel}
                                // keyboardType='phone_pad'
                                maxLength={15}
                                error={errors.tel}
                                onChangeText={(value)=>handleChange({tel:value})}
                                label="Phone *"
                                style={{width:'90%',}}
                                right={<TextInput.Icon icon="phone"/>}
                    />
                    <TextInput
                                value={user.email}
                                maxLength={30}
                                onChangeText={(value)=>handleChange({email:value})}
                                label="E-mail"
                                style={{width:'90%',}}
                                right={<TextInput.Icon icon="email"/>}
                    />
                    <TextInput
                                value={user.pseudo}
                                maxLength={20}
                                error={errors.pseudo}
                                onChangeText={(value)=>handleChange({pseudo:value})}
                                label="User name *"
                                style={{width:'90%',}}
                                left={<TextInput.Icon icon="account" mode="outlined"/>}
                    />
                    {/* <TextInput
                                value={user.depart_affecte}
                                maxLength={30}
                                error={errors.depart_affecte}
                                onChangeText={(value)=>handleChange({depart_affecte:value})}
                                label="Affected department *"
                                style={{width:'90%',}}
                                left={<TextInput.Icon icon="office-building" mode="outlined"/>}
                    /> */}
                    <Picker
                        selectedValue={user.depart_affecte}
                        mode="dropdown"
                        // onKeyPress={(e)=>handleKeyPress(e,0)} 
                        // ref={(el) => (inputRefs.current[0] = el)}
                        onValueChange={(value)=>handleChange({depart_affecte:value})}
                        left={<TextInput.Icon icon="office-building" mode="outlined"/>}
                        style={[styles.input,{color:'grey',paddingHorizontal:20}]}
                    >
                        <Picker.Item key={0} label="Affected department *" value={null} />
                        {laboratoires.map((labo, index) => {
                        return <Picker.Item style={{textAlign:'left',paddingHorizontal:20,color:'grey'}} key={index} label={labo} value={labo} />
                        })}
                    </Picker>
                 </View>
                {/* <View style={styles.buttons}> */}
                    <TouchableOpacity
                        style={styles.connectButton}
                        onPress={handlePost}
                        disabled={loading}
                    >
                    {loading?<ActivityIndicator size="small" color='white' />:<Text style={styles.textButton}>{label}</Text>}
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack() */}
                    {/*render(false)*/ }
                    {/* }><Text style={styles.textButton}>Close</Text></TouchableOpacity> */}
                {/* </View> */}
                {/* <Pop/> */}
                </View>
            {/* </TouchableWithoutFeedback> */}
        {/* </Modal>
    </View> */}
    </>
  );
};

export default AddUser;

const styles=StyleSheet.create({
    // container:{
    //     // width:'100%',
    //     // height:'100%',
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // modal:{
    //     maxWidth:400,
    //     width:'90%',
    //     maxHeight:500,
    //     height:300,
    //     marginTop:'40%',
    //     borderRadius:10,
    // },
    // input:{
    //     backgroundColor:'#e7e0ec',
    //     width:'90%',
    //     // maxHeight:'5rem',
    //     height:50,
    //     // padding:'1.5rem',
    //     fontWeight:'bold',
    //     textAlign:'center',
    //     letterSpacing:4,
    //     borderRadius:8,
    //     color:'white',
    // },
    viewParent:{
        // flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        gap:18,
        maxWidth:800,
        width:'100%',
        backgroundColor:'rgba(255,255,255,0.7)',
        paddingHorizontal:'5%',
        paddingVertical:15,
        marginHorizontal:'auto',
        marginVertical:8,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        borderRadius:10,
        height:'96%',
    },
    inputs:{
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        gap:12,
    },
    input:{
        backgroundColor:'#e7e0ec',
        width:'90%',
        minHeight:50,
        borderWidth:0,
        borderBottomWidth:1,
        // maxHeight:'5rem',
        // height:'5rem',
        // padding:'1.5rem',
        fontWeight:'bold',
        textAlign:'left',
        letterSpacing:4,
        borderRadius:8,
        color:'white',
    },
    // buttons:{
    //     ...Flex('row','flex-end','center'),
    //     gap:24,
    //     maxHeight:48,
    //     height:48,
    //     width:'100%',
    // },
    // closeButton:{
    //     padding:10,
    //     backgroundColor:'rgb(100,0,0)',
    //     borderRadius:10,
    // },
    connectButton:{
        padding:10,
        backgroundColor:'green',
        width:'50%',
        maxWidth:200,
        borderRadius:10,
        marginVertical:'5%',
    },
    textButton:{
        color:'white',
        width:'100%',
        textAlign:'center',
    },

})




// import React, { useState,useLayoutEffect} from 'react';
// import { View, Text,TouchableOpacity,TouchableWithoutFeedback,Keyboard,StyleSheet } from 'react-native';
// import { ActivityIndicator } from 'react-native';
// import { useSelector,useDispatch } from 'react-redux';
// import {TextInput} from 'react-native-paper'
// import { FontAwesome5 } from '@expo/vector-icons';
// import Modal from 'react-native-modal';
// import { postUsers } from '../../store/reducers/crntReducer';
// import { usePopup } from '../../wrappers/contexts';
// import { Flex } from '../../accueil';
// import { dbBaseRoot } from '../../../assets/constantes';
// import { ThereIsUser } from '../../../navigators/DrawerNavigator';
// import Pop from '../../popup';
// const AddUser = ({navigation,route/*vizible,render*/}) => {
//     // const userToUpdate=ThereIsUser;
//     const USER=route.params?.user;
//     const isToUpdate=USER?true:false;
//     const dispatch=useDispatch();
//     const {setPop}=usePopup();
//     const {targetUser}=useSelector(state=>state.user)
//     // const {fName,lName,tel,email,pseudo}=userToUpdate?userToUpdate:{fName:"",lName:"",tel:"",email:"",pseudo:""};
//     const {fName,lName,tel,email,pseudo}=isToUpdate?USER:{fName:"",lName:"",tel:"",email:"",pseudo:""};
//     const [user,setUser]=useState({fName:fName,lName:lName,tel:tel,email:email,pseudo:pseudo})
//     const [errors,setErrors]=useState({fName:!isToUpdate,lName:!isToUpdate,tel:!isToUpdate,pseudo:!isToUpdate})
//     const [label,setLabel]=useState('Submit')

//     const [loading,setLoading]=useState(false);
    
//     useLayoutEffect(()=>{
//             navigation.setOptions({
//                 headerLeft:()=>(
//                     <TouchableOpacity style={{width:80,margin:0,marginLeft:30,backgroundColor:'transparent',}} onPress={() => navigation.goBack()}>
//                         <FontAwesome5 name='arrow-left' size={20} color='blue'/>
//                     </TouchableOpacity>
//                 )
//             })
//         })
//     const handlePost=()=>{
//         setLoading(true);console.log({...USER,fName:user.fName,lName:user.lName,tel:user.tel,email:user.email,pseudo:user.pseudo,userId:targetUser.id})
//         const {fName,lName,tel,pseudo}=errors;
//         const email=(user.email===undefined || user.email=== null || user.email==="")?user.fName.replace(" ","")+'_'+user.lName.replace(" ","")+'@gmail.com':user.email
//         if(!fName && !lName && !tel && !pseudo){
//             const url=isToUpdate?"utilisateurs/update/"+USER.id:"utilisateurs/add";
//             const method=isToUpdate?'PUT':'POST';
//             const body=isToUpdate?{...USER,fName:user.fName,lName:user.lName,tel:user.tel,email:user.email,pseudo:user.pseudo,userId:targetUser.id}:{...user,email:email,niv:"can_0",password:'123456',isAdmin:false,userId:targetUser.id};
//             const feedback=isToUpdate?'Utilisateur mis à jour avec succes.':'Utilisateur ajouté avec succes.';
//             fetch(dbBaseRoot+url,{
//                 method:method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${targetUser.token}` 
//                 },
//                 body:JSON.stringify(body)
//             })
//                 .then((response) => response.json())
//                 .then((result) => {
//                     const {code,message,users}=result;
//                     if(code && code==='green'){
//                         dispatch(postUsers(users));
//                         setLabel('✔ success')
//                         setPop({show:true,message:feedback,code:'green'});

//                     }else{
//                         setLabel('❌ failed')
//                         setPop({show:true,message:result.message,code:'#880000'});

//                     }
//                 })
//                 .catch((error) => setPop({show:true,message:error.message,code:'#880000'}))
//                 .finally(()=>{setLoading(false);})
//         }else{
//             setLabel('❌ missing data');
//             setLoading(false);
//             setPop({show:true,message:'Des données obligatoires sont manquantes.',code:'#880000'})
//         }
//     }

//     const handleChange=(obj)=>{
//         const key=Object.keys(obj)[0];
//         setUser({...user,...obj});
//         key!=='email' && setErrors({...errors,[key]:false});
//         setLabel('Submit');
//     }
//   return (<>
//     {/* <View style={styles.container}>
//         <Modal pointerEvents="box-none" coverScreen={true} isVisible={vizible}  onBackdropPress={() => null} style={styles.modal}> */}
//             {/* <TouchableWithoutFeedback> */}
//                 <View style={styles.viewParent}>
//                 {/* <Text style={{ fontSize: 18, fontWeight: 'bold',textAlign:'center', }}>Formulaire d'ajout de chimiste.</Text> */}
//                 <View style={styles.inputs}>
//                     <TextInput
//                                 value={user.fName}
//                                 maxLength={25}
//                                 error={errors.fName}
//                                 onChangeText={(value)=>handleChange({fName:value})}
//                                 label="First Name *"
//                                 style={{width:'90%',}}
//                                	right={<TextInput.Icon icon="account"/>}
//                     />
//                     <TextInput
//                                 value={user.lName}
//                                 maxLength={20}
//                                 error={errors.lName}
//                                 onChangeText={(value)=>handleChange({lName:value})}
//                                 label="Last Name *"
//                                 style={{width:'90%',}}
//                     />
//                     <TextInput
//                                 value={user.tel}
//                                 // keyboardType='phone_pad'
//                                 maxLength={15}
//                                 error={errors.tel}
//                                 onChangeText={(value)=>handleChange({tel:value})}
//                                 label="Phone *"
//                                 style={{width:'90%',}}
//                                	right={<TextInput.Icon icon="phone"/>}
//                     />
//                     <TextInput
//                                 value={user.email}
//                                 maxLength={30}
//                                 onChangeText={(value)=>handleChange({email:value})}
//                                 label="E-mail"
//                                 style={{width:'90%',}}
//                                 right={<TextInput.Icon icon="email"/>}
//                     />
//                     <TextInput
//                                 value={user.pseudo}
//                                 maxLength={20}
//                                 error={errors.pseudo}
//                                 onChangeText={(value)=>handleChange({pseudo:value})}
//                                 label="User name *"
//                                 style={{width:'90%',}}
//                                 left={<TextInput.Icon icon="account" mode="outlined"/>}
//                     />
//                  </View>
//                 {/* <View style={styles.buttons}> */}
//                     <TouchableOpacity
//                         style={styles.connectButton}
//                         onPress={handlePost}
//                         disabled={loading}
//                     >
//                     {loading?<ActivityIndicator size="small" color='white' />:<Text style={styles.textButton}>{label}</Text>}
//                     </TouchableOpacity>
//                     {/* <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack() */}
//                     {/*render(false)*/ }
//                     {/* }><Text style={styles.textButton}>Close</Text></TouchableOpacity> */}
//                 {/* </View> */}
//                 <Pop/>
//                 </View>
//             {/* </TouchableWithoutFeedback> */}
//         {/* </Modal>
//     </View> */}
//     </>
//   );
// };

// export default AddUser;

// const styles=StyleSheet.create({
//     viewParent:{
//         flexDirection:'column',
//         justifyContent:'flex-start',
//         alignItems:'center',
//         gap:18,
//         maxWidth:800,
//         width:'100%',
//         backgroundColor:'rgba(255,255,255,0.7)',
//         paddingHorizontal:'5%',
//         paddingVertical:15,
//         marginHorizontal:'auto',
//         marginVertical:8,
//         borderWidth:1,
//         borderColor:'rgba(0,0,0,0.2)',
//         borderRadius:10,
//         height:'96%',
//     },
//     inputs:{
//         width:'100%',
//         flexDirection:'column',
//         justifyContent:'center',
//         alignItems:'center',
//         gap:12,
//     },
//     input:{
//         backgroundColor:'rgb(80,80,80)',
//         width:'90%',
//         fontWeight:'bold',
//         textAlign:'center',
//         letterSpacing:4,
//         borderRadius:8,
//         color:'white',
//     },
//     connectButton:{
//         padding:10,
//         backgroundColor:'green',
//         width:'50%',
//         maxWidth:200,
//         borderRadius:10,
//         marginVertical:'5%',
//     },
//     textButton:{
//         color:'white',
//         width:'100%',
//         textAlign:'center',
//     },

// })

