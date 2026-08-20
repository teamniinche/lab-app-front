import React, { useState} from 'react';
import { View, Text,TouchableOpacity,TouchableWithoutFeedback,Keyboard,StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import {TextInput} from 'react-native-paper'
// import { useSelector } from 'react-redux';
import Pop from '../../popup';
import WinDim from '../../../assets/operatingData';
import Modal from 'react-native-modal';
import { Flex } from '../../accueil';
import { dbBaseRoot } from '../../../assets/constantes';
import { Connection } from '../../../navigators/DrawerNavigator';
import { usePopup } from '../../wrappers/contexts';
const {screenHeight}=WinDim;

const ChangePassword = ({visible,render}) => {
    // const token=useSeLector(state=>state.user.targetUser.token);
    const [user,setUser]=useState({old:"",newPassword:"",confirm:""})
    const [User,setUSer]=useState({});
    const [errors,setErrors]=useState({old:true,newPassword:true,confirm:true,confirmated:false})
    const [secures,setSecures]=useState({old:true,newP:true,confirm:true})
    const [label,setLabel]=useState('Submit')
    const [text,setText]=useState("");
    const {setPop}=usePopup();
    const {pseudo}=Connection();

    const [loading,setLoading]=useState(false);
    const [checking,setChecking]=useState(false);

    const handlePost=()=>{
        setLoading(true);
        const {old,newPassword,confirm,confirmated}=errors;
        const {id}=User;
        if(!old && !newPassword && !confirm){
            fetch(dbBaseRoot+"utilisateurs/changePwd",{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` 
                },
                body:JSON.stringify({...User,password:user.newPassword})
            })
                .then((response) => response.json())
                .then((result) => {
                    const {code}=result;
                    if(code && code==='green'){
                        setLabel('✔ success')
                        setPop({show:true,message:'Votre mot de passe est mis à jour avec succes.',code:'green'})
                    }else{
                        setLabel('❌ failed')
                        setPop({show:true,message:'Erreur lors de la mise à jur de votre mot de passe.'+error.message,code:'#880000'})
                    }
                })
                .catch((error) => setPop({show:true,message:'Erreur lors de la mise à jur de votre mot de passe.'+error.message,code:'#880000'}))
                .finally(()=>{setLoading(false);})
        }else{
            setLabel('❌ missing data');
            setLoading(false);
            setPop({show:true,message:'Des données obligatoires sont manquantes.',code:'#880000'});
        }
    }

        const handleBlur=()=>{
            setChecking(true);
            fetch(dbBaseRoot+"utilisateurs/login",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({pseudo:pseudo,password:user.old})
            })
                .then((response) => response.json())
                .then((result) => {
                    const {code,doesExist,data}=result;
                    if(code==='green' && doesExist){
                        setUSer(data);
                        setErrors({...errors,old:false})
                        setText('✔✔')
                    }else{
                        setText('❌ the old is invalid')
                        setErrors({...errors,old:true})
                    }
                })
                .catch((error) =>setPop({show:true,message:error.message,code:'#880000'}))
                .finally(()=>{setChecking(false);})
        }

    const handleChange=(obj)=>{
        const key=Object.keys(obj)[0];
        const value=Object.values(obj)[0];
        setUser({...user,...obj});
        if(key==='newPassword' || key==='confirm'){
            if((key==='confirm' && user.newPassword===value && value!=="") || (key==='newPassword' && user.confirm===value && value!=="")){
                setErrors({...errors,confirmated:true});
            }else{
                setErrors({...errors,confirmated:false});
            }

        }
        value!=="" && setErrors({...errors,[key]:false});
        setLabel('Submit');
    }
  return (
    <View style={styles.container}>
        <Modal pointerEvents="box-none" coverScreen={true} isVisible={visible} onBackdropPress={() => {setLabel('Submit');setUser({old:"",newPassword:"",confirm:""})}} style={styles.modal}>
            <TouchableWithoutFeedback>
                <View style={styles.viewParent}>
                <Text style={{ fontSize: 18, fontWeight: 'bold',textAlign:'center', }}>{pseudo+' : '}Changement de mot de passe.</Text>
                <View style={styles.inputs}>
                    <View style={{flexDirection:'column',justifyContent:'center',gap:12,alignItems:'flex-start',width:'100%',marginBottom:15,marginHorizontal:'auto',}}>
                        <TextInput
                                    value={user.old}
                                    maxLength={8}
                                    error={errors.old}
                                    secureTextEntry={secures.old}
                                    onChangeText={(value)=>handleChange({old:value})}
                                    onBlur={handleBlur}
                                    label="Old password *"
                                    style={{width:'90%',margin:'auto'}}
                                    right={<TextInput.Icon icon={secures.old?"eye":"eye-off"} onPress={()=>setSecures({...secures,old:!secures.old})} />}
                        />
                        {checking?<ActivityIndicator size="small" color='blue' />:<Text style={{ fontSize: 12, fontWeight: 'bold',textAlign:'left', }}>{text}</Text>}
                    </View>

                    <TextInput
                                value={user.newPassword}
                                maxLength={8}
                                error={errors.newPassword}
                                secureTextEntry={secures.newP}
                                onChangeText={(value)=>handleChange({newPassword:value})}
                                label="New password *"
                                style={{width:'90%',}}
                                right={<TextInput.Icon icon={secures.newP?"eye":"eye-off"} onPress={()=>setSecures({...secures,newP:!secures.newP})} />}
                    />
                    <TextInput
                                value={user.confirm}
                                // keyboardType='phone_pad'
                                maxLength={8}
                                error={errors.confirm}
                                secureTextEntry={secures.confirm}
                                onChangeText={(value)=>handleChange({confirm:value})}
                                label="Confirm th new password *"
                                style={{width:'90%',}}
                                right={<TextInput.Icon icon={secures.confirm?"eye":"eye-off"} onPress={()=>setSecures({...secures,confirm:!secures.confirm})} />}
                    />
                </View>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.connectButton}
                            onPress={handlePost}
                            disabled={loading}
                        >
                        {loading?<ActivityIndicator size="small" color='white' />:<Text style={styles.textButton}>{label}</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() =>{setLabel('Submit');setUser({old:"",newPassword:"",confirm:""});render(false)}}><Text style={styles.textButton}>Cancel</Text></TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    </View>
  );
};

export default ChangePassword;

const styles=StyleSheet.create({
    container:{
        flex: 1,
        height:screenHeight,
        // width:'100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding:'auto',
    },
    modal:{
        maxWidth:400,
        width:'90%',
        maxHeight:500,
        height:300,
        borderRadius:10,
        margin:'auto',
        // marginTop:'40%',

    },
    viewParent:{
        padding:'5%',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius:10,
        ...Flex('column','center','center'),
        // gap:18,
        // flexDirection:'column',
        // justifyContent:'center',
        // alignItems:'center',
        // height:'100%',
    },
    inputs:{
        width:'100%',
        ...Flex('column','center','center'),
        gap:12,
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
    buttons:{
        ...Flex('row','flex-end','center'),
        gap:24,
        maxHeight:48,
        height:48,
        width:'100%',
    },
    closeButton:{
        padding:10,
        backgroundColor:'rgb(100,0,0)',
        borderRadius:10,
    },
    connectButton:{
        padding:10,
        backgroundColor:'green',
        width:'50%',
        borderRadius:10,
        // maxWidth:'5rem',
    },
    textButton:{
        color:'white',
        width:'100%',
        textAlign:'center',
    },

})

