// import Colors from "./colors";
import { dbBaseRoot } from "./constantes";
import { productsImages } from "../iterables";


export function Flex(dir,jC,aI){
  return {
    flex:1,
    flexDirection:dir,
    justifyContent:jC,
    alignItems:aI,
  }
}
export function IsEmptyObject(objet){const keys=Object.keys(objet);return keys.length===0;}
export const Flexion=((dir,jC,aI,gap)=>{ return {flexDirection:dir,justifyContent:jC,alignItems:aI,gap:gap}})();

export const centrer=(()=>{return {flexDirection:'row',justifyContent:'center',alignItems:'center'}})();

const isConforme=(range,ma) => {
    const {min,max}=range;
    if(ma>=min && ma<=max){
      return true
    }else{
      return false
    }
  }
export const isAcceptable=(range,marges,ma)=>{
    const {min,max}=range;
    const {down,up}=marges;
    if(!isConforme(range,ma)){
    if((ma>=(min-down) && ma<min) || (ma>max && ma<=(max+up))){
      return "#cfaa04";
    }else{
      return "#EE0000";
    }
  }else{
    return "#008800";
  }

  }

  export const requete=(url,method,data)=>{
    fetch(url,{
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(data)
            })
  }

export const nameFromText=(text)=>{
  var nameFromText=text.replace('Renzo ','')
                          .replaceAll(' ','_')
                          .toLowerCase();
  return nameFromText;
}

export function numericDateTime() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function realKeyFromEntete(entete,item){
    var toReturn;
   switch(entete) {
    case 'Utilisateur':
      toReturn=item['Utilisateur']['pseudo']
      break;
    case 'createdAt':
      toReturn=item['createdAt'].split('T')[0]
      break;
    default:
      toReturn=item[entete];
  }
  return toReturn;
}

export const colorFromName=(text)=>{
  const textSplit=text.split(' ');
  const leng=textSplit.length;
  const txt=textSplit[leng-1];
  var couleur;
  switch (text) {
    case 'Lave vitre Madar':
      couleur='Bleu'
      break;
    case 'Lave vitre Noura':
      couleur='Bleu'
      break;
    case 'Renzo Madar':
      couleur='Citron'
      break;
    case 'Renzo Noura':
      couleur='Citron'
      break;
    case 'Lave bois':
      couleur='Marron'
      break;
    case undefined:
      couleur=undefined;
      break;
  
    default:
      couleur=txt.charAt(0).toUpperCase() + txt.slice(1);
  }
  // const clr=text.includes('Lave vitre')?'Bleu':textSplit[leng-1];
  return couleur;
}

export const meraResultsFormat=(results)=>{
    const {codor_normes,ph_normes,viscosite_normes,densite_normes,matiere_active_normes}=results;
    const {color,nom,parfum,categorie}=codor_normes;
    // alert(JSON.stringify(codor_normes))
  return {
    identification:{
        categorie:categorie,
        forme:"Pate || Liquide",
        nom: nom,
        couleur:{conforme:'OUI',codor:color},
        parfum:parfum,
    },
    grandeurs:{
      ph:{resultat:7.00,normes:ph_normes,validation:false},
      viscosite:{resultat:400,normes:viscosite_normes,validation:false},
      densite:{resultat:1.3029,normes:densite_normes,validation:false},
      matiere_active:{resultat:16.16,normes:matiere_active_normes,validation:false}
    }
  }
}

/* pour poudre*/ export const isFormule=(item)=>{
  const {name,parfum,nom,format}=item;
  const formats=typeof(format)==="string"?format:format?.reduce((a,acc)=>acc+" "+a);
  const estFormule=Object.keys(item).includes("format")
                        && Object.keys(item).includes("nom") 
                        && item?.nom!==null 
                        && item?.format!==null
                        && item?.nom!==undefined 
                        && item?.format!==undefined;
  return {estFormule,nameToDisplay:estFormule?(nom+" "+parfum+" "+formats):name};
}


export const cosmetiquesFormat=(results)=>{
  const newObj=Object.fromEntries(
    Object.entries(results).map(([key,value])=>[key,meraResultsFormat(value)])
  )
  return newObj;
}

// export function getCosmetiquesResults(){
//   fetch(dbBaseRoot+'normes/get-normes',
//     {
//       method: 'GET',
//       headers: {
//           'Content-Type': 'application/json',
//       }
//   }
//   )
//   .then(response=>response.json())
//   .then(data=>{
//     // alert(JSON.stringify(data.data.data));
//     return data.data.data;
//   })
// }



 export function productsAndCountsFormat(data){
  // .sort((a, b) => a.machine.localeCompare(b.machine))
        var productsAndCounts={};
        data.map(itm=>{
            if(!productsAndCounts[itm.name]){
                productsAndCounts[itm.name]=1;
            }else{
                productsAndCounts[itm.name]+=1;
            }
        })
        const names=Object.keys(productsAndCounts);
        const counts=Object.values(productsAndCounts);
        const productsAndCountsFormat=names.map((Itm,index)=>{return {name:Itm,count:counts[index],url:productsImages[Itm]}});
        return productsAndCountsFormat;
    }

export function powdersAndCountsFormat(data){
        var productsAndCounts={};
        data.map(itm=>{
          // alert(JSON.stringify(itm?.validation))
          const nameKey=itm.name?.replace(" ","_").toLowerCase();
            if(!productsAndCounts[nameKey]){
                productsAndCounts[nameKey]={name:itm?.name,totalCount:1,isolatedCount:itm?.validation?.ok?1:0};
            }else{
                productsAndCounts[nameKey]['totalCount']+=1;
                if(itm?.validation?.ok){productsAndCounts[nameKey]['isolatedCount']+=1};
            }
        })
        return Object.values(productsAndCounts);
    }

export function VALEURS(obj,valeurs){
  const vals = Object.entries(obj).map(([key,v],index) =>
                  v && typeof v === "object"?
                                            " -- " +(valeurs.includes(key)?(key+" = "):"")+ v.lName
                                            :
                                            v !== null?
                                                      (index===0?"   ":" -- ")+(valeurs.includes(key)?(key+" = "):"")+v:""
                )
                .join("");
  return vals
}

export function Chariots(items){
  const isArray=items[0]?.id || false;
  const ITEMS=isArray?items:Object.values(items);
  return ITEMS.map(item=>item.nChar);
}

export const isAlreadyAnalysed=(item)=>{
  const {matiere_active,humidite}=item;
  const ma_analysed=matiere_active!=="null" && matiere_active!==null && matiere_active!==undefined;
  const humidite_checked=humidite!=="null" && humidite!==null && humidite!==undefined;
  return ma_analysed && humidite_checked;
}

export function fullNameAndPseudo(user){const {fName,lName,pseudo}=user; return fName+" "+lName+"("+pseudo+")";}

export function allowTo(action,privs){
  const isAllow=(privs==="illimite" || privs==="tout"|| privs?.includes(action));
  return  isAllow;
}