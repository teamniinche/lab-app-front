import { dbBaseRoot } from "../assets/constantes";
export default nombers=(normes)=>{
    const {min,max}=normes;
    const moy=Number(((min+max)/2).toFixed(2));
    return {min:min,max:max,moy:moy}
}

/**
 * @def calculer la matière active en fonction du volume versé
 * @param {string} produit Switch sur le produit à analyser
 * @param {float} m masse de liquide pesée
 * @param {float} V Volume de titrant versé
 * @returns float
 */
export const calculateMaLiquide=(produit,coef,vlue /*,m*/,V)=>{
    const ma=(coef*V)/(Number(vlue) /*,m*/);
    // var ma;
    // switch (produit) {
    //     // case 'Madar':
    //     //     ma=(14.18*V)/(m);
    //     // break;
    //     case 'Get Platinium' || 'Get Citron':
    //         ma=(14.78*V)/(m);
    //     break;
    //     case 'Renzo Noura':
    //         ma=(14.70*V)/(m);
    //     break;
    
    //     default:
    //         ma=(14.18*V)/(m);
    // }

    return ma.toFixed(2);
}

/**
 * @def calcule l'alcanite de la poudre ou de la caustique
 * @param {float} m masse de poudre pesée en gramme
 * @param {float} N Normalite de HCL titrant 
 * @param {float} V volume d'HCL necessairement versé pour le titrage
 */
export const calculateAlcanite=(m,N,V)=>{
    // constante 3.1 ???
    var alca=(3.1*N*C)/m;

    return alca.toFixed(2);
}

/**
 * 
 * @param {string} dateTimeString  DateTime à split-er et reduire en *** AAAA-MM-JJ   HH:MM:SS ***
 * @returns {string} dateTime en  = AAAA-MM-JJ   HH:MM:SS =
 */
export const ReduceDateTime=(dateTimeString)=>{
    const dateSplit=dateTimeString.split('T');
    const d=dateSplit[0]; const t=dateSplit[1].split('.')[0];
    return d+" à "+t;
}

export const Time=(dateTimeString)=>{
    const dateSplit=dateTimeString.split('T');
    const t=dateSplit[1].split('.')[0];
    const tArray=t.split(":");
    const T=tArray[0]+":"+tArray[1];
    return T;
}

export const DateString=(dateTimeString)=>{
    const dateSplit=dateTimeString.split('T');
    const T=dateSplit[0];
    return T;
}

export const GroupItems=(elements)=>{
    const KEYS=[];
    var  groupedItems={};
    elements.map(item=>{
        const {createdAt,updatedAt}=item;
        if(KEYS.includes(DateString(createdAt))){
            groupedItems[DateString(createdAt)]=[...groupedItems[DateString(createdAt)],item];
        }else{
            groupedItems[DateString(createdAt)]=[item];
            KEYS.push(DateString(createdAt));
        }

    })
    return groupedItems;
}

/**
 * 
 * @param {Object} commentsObject Commentaires de la base de donnees sous forme d'object
 * @returns {Array} commentsArray = commentaires sous de tableau
 */
export const commentsFromObjectToArray=(commentsObject)=>{
    var commentsArray=[];
      Object.values(commentsObject).map(comment=>{
        const {fName,lName,url,pseudo,tel,isAdmin}=comment.Utilisateur;
        const {text}=comment;
        commentsArray=[[text,fName,lName,url,isAdmin,pseudo],...commentsArray]
      })
      return commentsArray;
}
export const utilisateurs = async () => {
    var utilisateurs;

    try {
        const response = await fetch(dbBaseRoot + "utilisateurs/", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        utilisateurs = result;

    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }

    return utilisateurs;
};

export const pA=(n,term)=>{
  const p=n>1?(term+"s"):term;
  return p
}
export const currentElemnts=(totalAnalyses,totalPages,currentPge,limit)=>{
  const mod=totalAnalyses % limit;
  const currentPrevNbre=currentPge!==0?((currentPge-1)*limit):0;
  const currentElemnts=(currentPge===totalPages && mod!==0)?(currentPrevNbre+mod):(currentPge*limit);
  return currentElemnts;
}
