import {createContext,useEffect,useState} from "react";
import { useSelector } from "react-redux";
import InputRange from "./ranges/phRange.js";
import MARange from "./ranges/matiereativeRange.js";
import ViscoRange from "./ranges/viscositeRange.js";
import { View} from "react-native";
import { MesureProvider } from "./wrappers/contexts.js";
export const GoContext=createContext();

function SetData(obj){
    const {identification,grandeurs,machine,reservoir}=obj;
    const {forme,nom,parfum,couleur}=identification;
    const {ph}=grandeurs;
    return [{nom:nom,parfum:parfum,machine:machine,reservoir:reservoir,couleur:couleur,grandeur:ph,results:obj}];
};
export default MadarPh=({route,hotData})=>{
    // const [objet,setObjet]=useState({});
    // const setObje=(updatedObj)=>{()=>setObjet(updatedObj);}
    const [datas,setDatas]=useState([]);
    const donnees =useSelector((state) => state.data.targetData);

    // useFocusEffect(
    //         useCallback(()=>{
    //             refresh;
    //             return ()=>alert('unfocused');
    //         },[])
    //     )

    useEffect(()=>{
        const data=donnees!==null?(donnees):(hotData || route.params?.data);
        const ob=donnees!==null?SetData(donnees):data; //results est pour le route et data=donnees est pour le via modal(pour l'edit)
        setDatas(ob);
    },[donnees])
const handleDelete=(machine,reservoir)=>{
    const data=datas.filter((dt)=>(dt.machine+dt.reservoir)!==(machine+reservoir));
    setDatas(data);
}
    return <MesureProvider>
        {/* <GoContext.Provider value={{objet:objet,setObjet:setObje}}> */}

        <View>
            <View>
                {
                    datas.map((item,index)=>{
                    const {machine,reservoir,results}=item;
                    return <InputRange
                        thumb="ph"
                        key={index}
                        results={results}
                        machine={machine}
                        reservoir={reservoir}
                        render={()=>handleDelete(machine,reservoir)}
                    />
                    })
                }
            </View>
        </View>
    {/* </GoContext.Provider> */}
    </MesureProvider>
}

export const MadarMa=({route/*,donnees*/})=>{
    // const [objet,setObjet]=useState({});
    // {machine:machine,nom:nom,rerservoir:reservoir,ph:moy,parfum:'C',color:'C'}
    // const setObje=(updatedObj)=>{()=>setObjet(updatedObj);}
    const donnees = useSelector((state) => state.data.targetData);
    const data=donnees!==null?(donnees):(route.params && route.params.data);//route.params est pour le route et donnees est pour le via modal(pour l'edit)
    const {results}=data;
    const ob=results?results:data; //results est pour le route et data=donnees est pour le via modal(pour l'edit)
    const SetData = (obj) => {
        const {machine,reservoir,identification,grandeurs}=obj;
        const {forme,nom,parfum,couleur}=identification;
        const {matiere_active,viscosite,densite}=grandeurs;
        return [{nom:nom,parfum:parfum,machine:machine,reservoir:reservoir,couleur:couleur,grandeur:matiere_active,resultsFils:obj}];
    };
    const dataFille=SetData(ob/*results*/);
    // const {results,from}=route.params;
    return <MesureProvider>
        {/* <GoContext.Provider value={{objet:objet,setObjet:setObje}}> */}
        <View>
            <View>
                {dataFille.map((item,key)=>{
                    {/* const {machine,reservoir,resultsFils,nom}=item; */}
                    return <MARange key={key} item={item} /*results={resultsFils} from={nom} machine={machine} reservoir={reservoir}*/ />
                    })
                }
            </View>

        </View>
    {/* </GoContext.Provider> */}
    </MesureProvider>
}

export const MadarVisco=({route/*,donnees*/})=>{
    
    // const [objet,setObjet]=useState({});
    // {machine:machine,nom:nom,rerservoir:reservoir,ph:moy,parfum:'C',color:'C'}
    // const setObje=(updatedObj)=>{()=>setObjet(updatedObj);}
    const donnees = useSelector((state) => state.data.targetData);
    const data=donnees!==null?(donnees):(route.params && route.params.data);
      const {results}=data;
      const SetData = (obj) => {
        const {machine,reservoir,identification,grandeurs}=obj;
        const {forme,nom,parfum,couleur}=identification;
        const {matiere_active,viscosite,densite}=grandeurs;
        return [{nom:nom,parfum:parfum,machine:machine,reservoir:reservoir,couleur:couleur,grandeur:viscosite,resultsFils:obj}];
      };
    const ob=results?results:data; //results est pour le route et data=donnees est pour le via modal(pour l'edit)
    const dataFille=SetData(ob/*results*/);
    return <MesureProvider>
        {/* <GoContext.Provider value={{objet:objet,setObjet:setObje}}> */}
        <View>
            <View>
                {dataFille.map((item,key)=>{
                    {/* const {machine,reservoir,resultsFils,nom}=item; */}
                    return <ViscoRange key={key} item={item} /*results={resultsFils} from={nom} machine={machine} reservoir={reservoir}*/ />
                    })
                }
            </View>

        </View>
    {/* </GoContext.Provider> */}
    </MesureProvider>
}