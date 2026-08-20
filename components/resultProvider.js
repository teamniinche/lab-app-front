import {createContext,useState,useContext,useLayoutEffect} from 'react';
import {cosmetiquesFormat,meraResultsFormat} from "../assets/functions";
import getResults from "../hooks/results";
import cosmetiquesResults from "../kernel/cosmetiques/cosmetiquesResults";
import getMeraResults from "../kernel/dentifrices/dentifricesResults";
const ResultContext = createContext();
export const ResultProvider=({children})=>{
    const [result,setResult]=useState({})// regle le probleme de async et l'autre cote sync tout ajout de produit sur prods en prod doit  etre reproduit sur liquidProducts

     useLayoutEffect(()=>{
       (async function fetchData() {
         const results = await getResults();
         const cosmeResults = await cosmetiquesResults();
         if (results && cosmeResults && getMeraResults){
           const {
               co_madarResults,
               co_nouraResults,
               co_nouraNetResults,
               sm_superMoreResults,
               matiz_lmResults}=cosmeResults;
             const {mera_blanc,mera_bleu,mera_rouge,mera_noir}=await getMeraResults();
           const RESULTS={
             ...results,
             mera_blanc:meraResultsFormat(mera_blanc),
             mera_bleu:meraResultsFormat(mera_bleu),
             mera_rouge:meraResultsFormat(mera_rouge),
             mera_noir:meraResultsFormat(mera_noir),
             ...cosmetiquesFormat(co_madarResults),
             ...cosmetiquesFormat(co_nouraResults),
             ...cosmetiquesFormat(co_nouraNetResults),
             ...cosmetiquesFormat(sm_superMoreResults),
             ...cosmetiquesFormat(matiz_lmResults),
           }
           setResult(RESULTS);
         }
       })();
     },[])
   
    return <ResultContext.Provider value={{result}}>
       {children}
    </ResultContext.Provider>
}

export const useResult=()=>useContext(ResultContext);

