import { useMemo, useState } from 'react'
import {Text,TouchableOpacity,ActivityIndicator} from 'react-native'
import { useSelector,useDispatch } from 'react-redux';
import {usePopup} from '../wrappers/contexts';
import socket from '../../assets/socketService';
import { dbBaseRoot } from '../../assets/constantes';
import { allowTo } from '../../assets/functions';
import { idToUpdate } from '../store/reducers/idReducer';
import { postAnalyses } from '../store/reducers/dataReducer';
import { Flex } from '../accueil';
const analysesRoot=dbBaseRoot+"analyses/";
const commentairesRoot=dbBaseRoot+"commentaires/";
const addCommentairesRoot=commentairesRoot+'add'; 
const addPoudreCommentairesRoot=dbBaseRoot+"poudre/commentaires/"+'add';
const addRoot=analysesRoot+'add';
const updateRoot=analysesRoot+'update/';
/**
 * @param {object} reqBody Body de la requete à soumettre
 * @param {string} url URL de soumission
 * @returns JSX react-native element
 */
export const Bouton=({reqBody,registrable,buttonParams,render})=>{
    // const {targetUser} = useSelector(state => state.user);
    const {setPop}=usePopup();
    const {targetUser,targetId,postedAnalyses,product} = useSelector((state) => {
        const {targetId,product}=state.id.targetId;
        const {postedAnalyses}=state.data;
        const targetUser=state.user.targetUser;
        return {targetUser,targetId,postedAnalyses,product};
    });
    // ===================================== ça sert lors du updating ==========================================
    const {ph,densite,viscosite,matiere_active}=reqBody;// et postedAnalyses
    const KEY=(ph && 'ph')|| (densite && 'densite') ||(viscosite && 'viscosite') || (matiere_active && 'matiere_active');// enregistre la mesure en question qui sera celle non vide
    // ================================================================================
    const dispatch=useDispatch();
    // const {targetId,product}=toUpdate;
    const [loading,setLoading]=useState(false);
    const [reponse,setReponse]=useState({id:null,color:'green'})
    const [idUpdate,setIdUpdate]=useState(null);

    useMemo(()=>{
        const idUp=targetId!==null?targetId:reponse.id;
        setIdUpdate(idUp);
    },[reponse])
    // pour la mise jour depuis edit (if targetId!==null?handleUpdatePress:handleAddPress;) A demain Incha Allah)
    const dispatchId=(id)=>{
        setIdUpdate(id)
        dispatch(idToUpdate({targetId:id,product:'mera',}));
    }

    const handleAddPress=async () => {
            if(!allowTo("enregistrer analyse",targetUser?.privileges)){
            setPop({show:true,message:"Vous n'êtes pas habileté à enregistrer une analyse.",code:"#880000"});
            return;
            }
            setLoading(true);
            fetch(addRoot, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${targetUser.token}` // Ajoute du token
                },
                body: JSON.stringify(reqBody)
              })
              .then(response=>response.json())
              .then(data=>{
                const {code,message,id}=data;
                  if(code!=='red'){
                    render({color:'#c5c5ef',text:'✔✔',able:false,});
                    product && dispatchId(data.id);// pour les autres gr  ndeurs de mera s'updatent au lieu d'efectuer un nouveau enregistrement
                    dispatch(postAnalyses([])); //IMPORTANT:c'etait pour forcer le prochain fetch des data de la bdd à se faire et pas de se baser sur les data du store qui ne sont pas encore mis à jour, mais comme on a une mise à jour du store dans le reducer qui traite la reponse de l'ajout, on n'en a plus besoin
                    setReponse(data);
                    setPop({show:true,message:message,code:code});

                  }else{
                    setPop({show:true,message:message,code:'#880000'});
                  }
                })
            .finally(()=>{
                render({
                    color:'#c5c5ef',
                    text:reponse.color!=='green'?'❌error':'✔✔',
                    able:false,
                })
                setLoading(false);
            })

    }

    const handleUpdatePress=async () => {
        if(!allowTo("modifier analyse",targetUser?.privileges)){
            setPop({show:true,message:"Vous n'êtes pas habileté modifier une analyse.",code:"#880000"});
            return;
        }
        setLoading(true);
        const id=idUpdate || targetId;//targetId pour quand il s'agit de mettre à jour mera
        // ========================================== Pour ne paa fetcher depuis la bdd =============
        const others=postedAnalyses.filter(el=>el.id!==id);
        const itemToUpdate=postedAnalyses.find(el=>el.id===id) || {};
        const updatedItem={...itemToUpdate,[KEY]:reqBody[KEY]};// on met à jour la mesure en question
        // ============================================================================================
        var code;
        fetch(updateRoot+id, {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${targetUser.token}`, // Ajoute du token
            },
            body: JSON.stringify(reqBody),
          })
          .then(response=>response.json())
          .then(data=>{
            code=data.code;
            render({...buttonParams,color:'#c5c5ef',text:'✔✔✔',able:false,});
            dispatch(postAnalyses([...others, updatedItem].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))); //IMPORTANT:c'etait pour forcer le prochain fetch des data de la bdd à se faire et pas de se baser sur les data du store qui ne sont pas encore mis à jour, mais comme on a une mise à jour du store dans le reducer qui traite la reponse de l'ajout, on n'en a plus besoin
            setReponse(data);
            // console.log('data update',[...others, updatedItem].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
            })
        .finally(()=>{
            render({
                ...buttonParams,
                color:'#c5c5ef',
                text:code!=='green'?'❌error':'✔✔✔',
                able:false,
            })
            setLoading(false);
        })

}
    return <TouchableOpacity 

            disabled={(loading || !buttonParams.able || !registrable)}
            style={buttonParams.btnStyle?buttonParams.btnStyle:{
                ...Flex('row','center','center'),
                height:'1.5rem',
                width:'5rem',
                backgroundColor:buttonParams.color,
                borderRadius:8,
                padding:5,
                position:'absolute',
                right:10,
                top:10,
            }}
            onPress={(idUpdate!==null || targetId)?handleUpdatePress:handleAddPress}
        >

        {loading?<ActivityIndicator size="small" color='white' />:<Text 
            style={{
                color:buttonParams.able?'white':'green',fontWeight:'bold',}}
        >{buttonParams.text}</Text>}


    </TouchableOpacity>
}

export const AddComment = (body) => {
  return new Promise((resolve, reject) => {
    fetch(addCommentairesRoot, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer VOTRE_TOKEN',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error.message || error); // 'error' est bien capturé ici
      });
  });
};

export const AddPoudreComment=async (body) => {
    fetch(addPoudreCommentairesRoot, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': 'Bearer VOTRE_TOKEN', // Ajoute un token si nécessaire
        },
        body: JSON.stringify(body),
      }) 
      .then(
        response=>response.json()
      )
      .then(data=> socket.emit('commentPoudreAdded', data))

}