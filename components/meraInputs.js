import {useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import ViscoRange from "./ranges/viscositeRange";
import InputRange from "./ranges/phRange.js";
import { meraResultsFormat } from "../assets/functions";
import { GoContext } from "./Input-ph";
export const Mera=({route})=>{
    
    const [objet,setObjet]=useState({});
    // {machine:machine,nom:nom,rerservoir:reservoir,ph:moy,parfum:'C',color:'C'}
    const setObje=(updatedObj)=>{
        ()=>setObjet(updatedObj);
      }

    //route.params est pour le route et donnees est pour le via modal(pour l'edit); donnees est pour les autres produits
    const donnees = useSelector((state) => state.data.targetData);

    const data=donnees!==null?(donnees):(/*route.params && */route.params?.data); //   const data=route.params.data;)
      const {results}=data;

      const SetData = (obj) => {
        /*{
             from:'D-blanche',
             results:dentifricesResults.blanc,
             image:'d-mera-blanc.png',
           }*/

        const resultats=meraResultsFormat(obj);
        const {identification,grandeurs}=resultats;
        const {nom,color,parfum}=identification;
        const {viscosite,densite}=grandeurs;
        return [
            {nom:nom,parfum:parfum,couleur:color,grandeur:viscosite,resultsFils:resultats},
            {nom:nom,parfum:parfum,couleur:color,grandeur:densite,resultsFils:resultats}
            // {nom:nom,parfum:parfum,couleur:couleur,grandeur:ph,resultsFils:obj}
        ];
      };
      const ob=results || data;//results?results:data; //results est pour le route et data=donnees est pour le via modal(pour l'edit)
    const dataFille=SetData(ob/*results*/);
    // const {results,from}=route.params;
    return <GoContext.Provider value={{objet:objet,setObjet:setObje}}>
        <View>
            <View>
                {/* {dataFille.map((item,key)=>{ */}
                    {/* const {machine,reservoir,resultsFils,nom}=item; */}
                    {/* return <> */}
                        <InputRange /*key={key} */ results={meraResultsFormat(ob)/*results*/} machine={'Mera'} reservoir={1} />
                        <ViscoRange /*key={key} */ item={dataFille[0]} />
                        {/* <MARange item={dataFille[1]}/>*/}
                    {/* </> */}
                    {/* }) */}
                {/* } */}
            </View>
        </View>
    </GoContext.Provider>
}