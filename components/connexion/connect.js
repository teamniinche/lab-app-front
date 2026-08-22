import { useState,useEffect,useRef } from 'react';
import { View, Text,TouchableOpacity,TouchableWithoutFeedback,Keyboard,StyleSheet } from 'react-native';
import {TextInput,Button,Portal,Dialog} from 'react-native-paper'
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';
import {useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import { Flex } from '../accueil';
import { connect } from '../store/reducers/userReducer';
import { dbBaseRoot,niveaux_privileges} from '../../assets/constantes';

const Connect = ({visible,setPop,render}) => {
    // const token=useSelector(state=>state.user.targetUser.token);
    const inputRefs = useRef([]);
    const [ids,setIds]=useState({pseudo:"",password:""});
    const [utilisateurs,setUtilisateurs]=useState([]);
    const [loading,setLoading]=useState(false);
    const [secure,setSecure]=useState(true);
    const dispatch = useDispatch();
    // const users=JSON.parse(utilisateurs);
    useEffect(() => {
        fetch(dbBaseRoot + "utilisateurs/", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data=>setUtilisateurs(data))
        .catch(function(error){ return})
    }, []);

    const handlePost=()=>{
        setLoading(true);
        fetch(dbBaseRoot+"utilisateurs/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // impossicle d'exiger un token a la connextion car il n'y a encore de connecté
            },
            body:JSON.stringify({pseudo:ids.pseudo,password:ids.password})
        })
            .then((response) => response.json())
            .then((result) => {
                const {code,doesExist,message,data,token}=result;
                if(doesExist){
                    const userAndPrivileges={...data,token:token,privileges:niveaux_privileges[data.niv]};
                    dispatch(connect(userAndPrivileges));
                    render(false);
                    setPop({show:true,message:'✅Vous etes connecté avec succes.',code:code});
                }else{
                    render(false);
                    setPop({show:true,message:'❌ Rejetée ! :'+message,code:'#880000'});
                }
            })
            .catch((error) => setPop({show:true,message:error.message,code:'#880000'}))
            .finally(()=>{setLoading(false);})
    }

    const onValueChange=(val)=>{
        setIds({...ids,pseudo:val})

        }

    const handlePseudoChange=(value)=>{
        setIds({...ids,pseudo:value})
    }
    const handlePasswordChange=(value)=>{
        setIds({...ids,password:value})
    }

    // function handleLenOverFive(val){if (val.length === 4) {const nextInput = inputRefs.current[index + 1];if (nextInput) {nextInput.focus();}}}
    const handleNext = (index) => {const nextInput = inputRefs.current[index + 1]; if (nextInput) {nextInput.focus();}};
    const handleKeyPress = (e,index) => {const { key } = e.nativeEvent;
        if (key === 'ArrowDown') {const nextInput = inputRefs.current[(index===3?0:(index + 1))];if (nextInput) nextInput.focus();}
        if (key === 'ArrowUp') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();}
        if (key === 'Enter') {const prevInput = inputRefs.current[index - 1];if (prevInput) prevInput.focus();handlePost}
    };
  return (
    <Portal>
          <Dialog style={{maxWidth:600,minWidth:500,marginHorizontal:"auto"}}
           visible={visible} onDismiss={()=>render(false)}>
            <Dialog.Title style={{fontSize:15,color:"grey",textAlign:"center",fontWeight:"bold",borderBottomWidth:1,borderBottomColor:"rgba(0,0,0,0.1)"}}>Veuillez entrer vos identifiants.</Dialog.Title>
            <Dialog.Content style={{maxWidth:800,minWidth:500,maxHeight:400,minHeight:250,margin:"auto",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"flex-start",paddingHorizontal:40,height:"auto"}}>
               {/* <TouchableWithoutFeedback> */}
                {/* <View style={styles.viewParent}> */}
                <View style={styles.inputs}>

                <Picker
                    selectedValue={ids.pseudo}
                    mode="dropdown"
                    // onSubmitEditing={handleNext}
                    onKeyPress={(e)=>handleKeyPress(e,0)} 
                    ref={(el) => (inputRefs.current[0] = el)}
                    onValueChange={(itemValue) => onValueChange(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item key={0} label="Pseudo" value={null} />
                    {utilisateurs.map((option, index) => {
                    return <Picker.Item style={{textAlign:'center',}} key={index} label={option.pseudo} value={option.pseudo} />
                    })}
                </Picker>
                    <TextInput
                            value={ids.password}
                            onKeyPress={(e)=>handleKeyPress(e,1)}
                            // onSubmitEditing={handleNext}
                            ref={(el) => (inputRefs.current[1] = el)}
                            onChangeText={(value)=>handlePasswordChange(value)}
                            label="Password"
                            secureTextEntry={secure}
                            style={{width:'90%',}}
                            right={<TextInput.Icon icon={secure?"eye":"eye-off"} onPress={()=>setSecure(!secure)} />}
                        />
                </View>
                {/* </View> */}
            {/* </TouchableWithoutFeedback> */}
            </Dialog.Content>
            <Dialog.Actions>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        ref={(el) => (inputRefs.current[2] = el)}
                        onKeyPress={(e)=>handleKeyPress(e,2)} 
                        style={styles.connectButton}
                        onPress={handlePost}
                        disabled={loading}
                    >
                    {loading?<ActivityIndicator size="small" color='white' />:<Text style={styles.textButton}>Connect</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity 
                    ref={(el) => (inputRefs.current[3] = el)}
                    onKeyPress={(e)=>handleKeyPress(e,3)} 
                    style={styles.closeButton} 
                    onPress={() => render(false)}><Text style={styles.textButton}>Close</Text></TouchableOpacity>
                </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
  );
};

export default Connect;

const styles=StyleSheet.create({
    container:{
        // width:'100%',
        // height:'100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal:{
        maxWidth:400,
        width:'90%',
        maxHeight:500,
        height:300,
        marginTop:'40%',
        borderRadius:10,
    },
    viewParent:{
        gap:18,
        padding:'5%',
        backgroundColor: 'white',
        ...Flex('column','center','center'),
    },
    inputs:{
        height:'100%',
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        gap:30
    },
    input:{
        backgroundColor:'rgb(80,80,80)',
        width:'90%',
        // maxHeight:'5rem',
        height:50,
        // padding:'1.5rem',
        fontWeight:'bold',
        textAlign:'center',
        letterSpacing:4,
        borderRadius:8,
        color:'white',
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
        // maxWidth:'5rem',
        borderRadius:10,
    },
    textButton:{
        color:'white',
        width:'100%',
        textAlign:'center',
    },

})

