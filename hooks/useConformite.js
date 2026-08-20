import { useState } from 'react';
const useConformite=(isConforme=false)=>{
  const [isCodorConforme,setIsCodorConforme]=useState(isConforme);
  const [color,setColor]=useState(false);
  const [odor,setOdor]=useState(false);

  const isColor=()=>{
    const bool=!color && odor;
    setIsCodorConforme(bool)
    setColor(!color)
  }
  const isOdor=()=>{
    const bool=!odor && color;
    setIsCodorConforme(bool)
    setOdor(!odor)

  }

  return {
    isCodorConforme:isCodorConforme,
    isColor:isColor,
    isOdor:isOdor
  }
}

export const useDropCustomDrawer=()=>{
  const initialState={poudres:false,liquides:false,matieresPremieres:false,parametres:false};
  const [dropState,setDropState]=useState(initialState);
  const dropRubrique=(rubrique)=>{
    const targetted=dropState[rubrique];
    setDropState({...initialState,[rubrique]:!targetted});
  }
  return {dropState,dropRubrique};
}

export default useConformite;