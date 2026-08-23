import {createContext,useState,useContext,useMemo, useEffect} from 'react';
import { useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WinDim from '../../assets/operatingData';
const {isWeb}=WinDim;
import { commentsFromObjectToArray } from '../../hooks/littleBiblio';
import { Lansas,typesJavel } from '../../iterables';
import { engines,tanks,reservoirs } from '../../assets/constantes';
import { colorFromName } from '../../assets/functions';
import Colors from '../../assets/colors';
import {isFormule} from '../../assets/functions';
const AccueilContext = createContext();
const FormulesContext = createContext();
const JavelFormulesContext = createContext();
const MesureContext=createContext();
const ChipContext=createContext();
const CommentsContext=createContext();
const CheckBoxesContext=createContext();
const PhMesureContext=createContext();
const ReservBoxesContext=createContext();
const CurrentProductsContext=createContext();
const CurrentProductedContext=createContext();
const CurrentJavelProductedContext=createContext();
const ItemJavelToSaveContext=createContext();
const ItemToSaveContext=createContext();
const CurrentUsersContext=createContext();
const NFormulesContext=createContext();
const NFormulesJavelContext=createContext();
const EveragesContext=createContext();
const EveragesPowderContext=createContext();
const monoPageContext=createContext();
const modalContext=createContext();
const reservoirsContext=createContext();
const popupContext=createContext();
// =================================== POPUP =====================================================================
export const PopupProvider=({children})=>{
    const [pop,setPop]=useState({show:false,status:'low',message:'',code:'green'});
    const [newAna,setNewAna]=useState({show:false,code:'green',nChar:1});
    

    return <popupContext.Provider value={{pop,setPop,newAna,setNewAna}}>
       {children}
    </popupContext.Provider>
}
export const usePopup=()=>useContext(popupContext);
// ===============================================================================================================
export const ReservoirsProvider=({children})=>{
    const [reservs,setReservs]=useState([]);
    const reservsLenIsNotNull=reservs.length>0;
    // const deleteItem=(product)=>{const data=MonoProducts.filter(item=>item.identifiant!==product.identifiant);setMonoProducts(data);};
    const buildReservs=(data)=>{
        const buildReservsArray=[];
        const rsrvoirs=Object.values(data).map((item)=>{if(item.categorie==="liquides vaisselle"){return item.reservoir+"_"+item.name}});
        reservoirs.forEach(elemnt=>{
            var name=undefined;var color=undefined;
            const nbre=rsrvoirs.reduce((acc,el)=>{
                const elemntSplit=el.split("_");
                if(Number(elemntSplit[0])===elemnt){
                    name=elemntSplit[1];color=Colors[colorFromName(name)];
                    return acc+1;
                }else{return acc;}
            },0);
            const n=nbre===undefined?0:nbre;
            buildReservsArray.push([name,color,elemnt,n]);
        });
        // console.log(buildReservsArray)
        // const build=buildReservsArray.filter(element=>element[3]<4);
        var enginesObject={CQ:[],A:[],B:[],C:[],D:[],D1:[],D2:[],E:[],F:[]};
        buildReservsArray.forEach(elm=>{
           Object.entries(tanks).forEach(([key,value])=>{
                if(value.includes(Number(elm[2]))){
                enginesObject={...enginesObject,[key]:[...enginesObject[key],elm]};//.sort((a,b)=>a[3]-b[3])
                }}
            )
    });

        setReservs(enginesObject);
    }

    return <reservoirsContext.Provider value={{reservs,buildReservs,reservsLenIsNotNull}}>
       {children}
    </reservoirsContext.Provider>
}
export const useReservs=()=>useContext(reservoirsContext);
// ====================================================== LIQUIDES ==========================================================
export const MonoProductsProvider=({children})=>{
    const postedAnalyses=useSelector(state=>state.data.postedAnalyses);
    const [MonoProducts,setMonoProducts]=useState([]);
    const [pstedProducts,setPstedProducts]=useState(postedAnalyses);
    const [targetedBadge,setTargetedBadge]=useState("");
    const [badgeId,setBadgeId]=useState(null);
    const monoProductsLenIsNotNull=MonoProducts.length>0;
    const deleteItem=(product)=>{const data=MonoProducts.filter(item=>item.identifiant!==product.identifiant);setMonoProducts(data);};
    const buildMonoproducts=(product)=>{
        const prd={...product,identifiant:product.title.replace(" ","_")+MonoProducts.length};
        setMonoProducts([...MonoProducts,prd]);
    }

    return <monoPageContext.Provider value={{MonoProducts,pstedProducts,targetedBadge,badgeId,setBadgeId,setTargetedBadge,setPstedProducts,setMonoProducts,buildMonoproducts,monoProductsLenIsNotNull,deleteItem}}>
       {children}
    </monoPageContext.Provider>
}
export const useMonoProducts=()=>useContext(monoPageContext);
// ======================================================== POUDRE========================================================
export const FormulesProvider=({children})=>{// Formules ===lansas doit provenir de la bdd|du store alimente par la bdd
    const storage=isWeb?localStorage:AsyncStorage;
    var {powderNormes,formulesNormes}=useSelector(state=>{;
            const normesPowder=state.powderNormes.powderNormes;
            const formulesNormesPowder=state.powderNormes.formulesNormes;
            return {powderNormes:normesPowder,formulesNormes:formulesNormesPowder}
        });
    /* Definition: use powderNormes & formulesNormes */const SendItemStorage = (item) => {
        return new Promise((resolve, reject) => {
            if (item) {
                const format=item?.format;
                const KEY=item?.name.split(' ').join('_').toLowerCase();// KEY est pris de itemStored pris du mappage
                const itemFormule=format && formulesNormes.data.arr.filter(formul=>formul.nom===item?.nom)[0];
                const normesItem=KEY===""?item:(format!==undefined?itemFormule:powderNormes.data[KEY]);
                resolve(normesItem);
            } else {
                reject("Erreur : Les données sont vides.");
            }
        });
    };

    const [focused,setFocused]=useState(null);
    const [itemStored,setItemStored]=useState({});
    
    const [wrapperShow,setWrapperShow]=useState(false);
    const [fWrapperShow,setFWrapperShow]=useState(false);
    // ================ A sup potentiellement & ses utilitaires ============================================================
    const Formules=Object.keys(Lansas);
    const [formules,setFormules]=useState([]);const formulesLenIsNotNull=Formules.length>0;
    const deleteItem=(name)=>{const data=Formules.filter((item)=>item.name!==name);setFormules(data);}
    const addItem=(item)=>{setFormules([...formules,item]);}
    // =================================================================================================
    const EditLansaParams=(item)=>{
        // const {itemStored}=useFormules();
        // const format=itemStored?.format;
        // const KEY=itemStored?.name.split(' ').join('_').toLowerCase();// KEY est pris de itemStored pris du mappage
        // const itemFormule=format && formulesNormes.filter(formul=>formul.name===itemStored?.name)[0];
        // const normesItem=KEY===""?itemStored:(format!==undefined?itemFormule:powderNormes.data[KEY]);
    /* Utilisation*/ SendItemStorage(item).then(data=>{storage.setItem('initialData',JSON.stringify(data));setItemStored(item);})
        .then(()=>setWrapperShow(true));
        // setItemStored(item);
    }

    return <FormulesContext.Provider value={{EditLansaParams,fWrapperShow,setFWrapperShow,focused,setFocused,wrapperShow,setWrapperShow,itemStored,setItemStored,/*ce qui est devant correspond a A SUP & utilitaires*/Formules,setFormules,formulesLenIsNotNull,deleteItem,addItem}}>
       {children}
    </FormulesContext.Provider>
}
export const useFormules=()=>useContext(FormulesContext);
// ================================================ JAVEL ================================================================
export const JavelFormulesProvider=({children})=>{
    const JavelFormules=Object.keys(typesJavel);
    const [javelFocused,setJavelFocused]=useState(null);
    const [wrapperShow,setWrapperShow]=useState(false);
    const [fWrapperShow,setFWrapperShow]=useState(false);
    const [javelItemStored,setJavelItemStored]=useState({});
    const [javelFormules,setJavelFormules]=useState([]);
    const javelFormulesLenIsNotNull=JavelFormules.length>0;
    const javelDeleteItem=(name)=>{const data=JavelFormules.filter((item)=>item.name!==name);setJavelFormules(data);}
    const javelAddItem=(item)=>{setJavelFormules([...javelFormules,item]);}

    return <JavelFormulesContext.Provider value={{JavelFormules,setJavelFormules,fWrapperShow,setFWrapperShow,javelFocused,setJavelFocused,wrapperShow,setWrapperShow,javelItemStored,setJavelItemStored,javelFormules,setJavelFormules,javelFormulesLenIsNotNull,javelDeleteItem,javelAddItem}}>
       {children}
    </JavelFormulesContext.Provider>
}
export const useJavelFormules=()=>useContext(JavelFormulesContext);
// ================================================================JAVEL================================================

export const CurrentJavelProductedProvider=({children})=>{
    const {javelNormes,javelFocusedProduct,javelAnalysed,currentJavelProducted,javelFocusedListe}=useSelector(state=>{
        const javelAnalysed=state.javelAnalysed.javelAnalysed;
        const javelFocusedProduct=state.javelFocusedProduct.javelFocusedProduct;
        const javelNormes=state.javelNormes.javelNormes;
        const {currentJavelProducted,javelFocusedListe}=state.currentJavelProducted;
        return {javelNormes,javelFocusedProduct,javelAnalysed,currentJavelProducted,javelFocusedListe};
    });
    const [currentProductedPro,setCurrentProducted]=useState(currentJavelProducted);//{} liste object des produits elus a la production en cours
    const [focusedPro,setFocusedPro]=useState(javelFocusedProduct);// {} Normes du produit ayant le focus

    const [registred,setRegistred]=useState(javelAnalysed);//[] liste generale des analyes enregistrees
    const [focusedList,setFocusedList]=useState(javelFocusedListe);//[] liste des analyses du product ayant le focus

    const [currentProductedLen,setCurrentProductedLen]=useState(0); // Longeur du tableau des produits elus a la production
    const [toCreate,setToCreate]=useState(true);// Switcheur entre mode creteating || mode updating

    function UpdateFocusedProdByName(name){
        const itemKey=name.split(" ").join("_").toLowerCase();
        const itemNormes=javelNormes[itemKey];
        setFocusedPro(itemNormes);
    }
    // const currentsProductsNames=Object.entries(currentProducts).map(([key,value])=>key.split('_').join(' '));
    const setCurrentProductedPro=(products)=>{ 
      const productsArray=Object.values(products);
      const productsLen=productsArray.length;
      if(productsLen===1){setFocusedPro(productsArray[0])};
      setCurrentProductedLen(productsLen);
      setCurrentProducted(products);
    }

    const ItemKey=(item)=>{
        const {name,format}=item;
        const isFormule=format!==undefined;
        const formats=format?.reduce((a,acc)=>acc+" "+a);
        const itemKey=isFormule?("fini"+name+formats):name;
        return name!==undefined?itemKey:"vide";
    };

    function nextChariot(list,len){
        var i=1;var j=1;
        while((Number(list[len-i].chariot))%15!==0 && Number(list[len-i].chariot)>15){
            // i++;
            const gap=Number(list[len-i].chariot)-Number(list[(len-(i+1))].chariot);
            gap>15 && j++;i++;
        }
        // alert(list[len-i].chariot)
        return Number(list[len-i].chariot)+(j*15);
    }
    function ListOfFocusedAndLastNumber(item,items){
        const list=items.filter(itm=>ItemKey(itm)===ItemKey(item)).sort((firstItem, secondItem) => Number(firstItem.chariot) - Number(secondItem.chariot));
        const listLength=list.length;
        //alert(JSON.stringify(list))
        const freeChariot=listLength===0?
                                    1:listLength===1?15:nextChariot(list,listLength);
        return {list,freeChariot};
    }

    function Everages(items){
        var GG=0;var HUMIDITE=0;var MATIERE_ACTIVE=0;var ALCANITE=0;
        items.map(item=>{
            const {gg,humidite,matiere_active,alcanite}=item;
            GG+=gg!==undefined?Number(gg):0;
            HUMIDITE+=humidite!==undefined?Number(humidite):0;
            MATIERE_ACTIVE+=matiere_active!==undefined?Number(matiere_active):0;
            ALCANITE+=alcanite!==undefined?Number(alcanite):0;

        })

        return {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE};
    }

    function keysAndRequirements(){
        const {name,couleur,taches,densite,...rest}=focusedPro;
        const keysAndRequirements=Object.entries(rest).map(([ky,vl])=>[ky.replace("max_",""),vl.required]);
        return keysAndRequirements;
    }

    function setAction(pyload){if(pyload==="create"){setToCreate(true);}else{setToCreate(false);}}

    // useMemo(()=>{setFocusedPro(focusedProduct);},[focusedProduct]);
    useEffect(()=>{
        const productsArray=Object.values(currentJavelProducted);
        const productsLen=productsArray.length;
        // if(productsLen===1){setFocusedPro(productsArray[0])};
        setCurrentProductedLen(productsLen);
        setFocusedPro(javelFocusedProduct);//{}: normes du produit ayant le focus
        setAction("create");

    },[javelFocusedProduct]);
    // const currentProductedLen=Object.keys(currentProductedPro).length;

    return <CurrentJavelProductedContext.Provider value={{UpdateFocusedProdByName,Everages,setAction,toCreate,focusedList,setFocusedList,ListOfFocusedAndLastNumber,currentProductedLen,focusedPro,setFocusedPro,currentProductedPro,setCurrentProductedPro,keysAndRequirements,registred,setRegistred}}>
       {children}
    </CurrentJavelProductedContext.Provider>
}

export const useCurrentJavelProducted=()=>useContext(CurrentJavelProductedContext);
// ================================================================================================================
 export const EveragesProvider=({children})=>{
        const [Analytics,setAnalytics]=useState([]);
        const [analyticsLen,setAnalyticsLen]=useState(0);
        function objectSommes(items){
            var analtics={};
            items.map(itm=>{
                const elisible=true;
                if(elisible){
                    if(analtics[itm.name]===undefined){
                        var itemInit={cate:itm.categorie,name:itm.name,count:1,ph:{count:1,somme:itm.ph}};
                        const matiere_active=(itm.matiere_active && itm.matiere_active!==null)?{matiere_active:{somme:itm.matiere_active,count:1}}:{};
                        const viscosite=(itm.viscosite && itm.viscosite!==null)?{viscosite:{somme:itm.viscosite,count:1}}:{};
                        analtics[itm.name]={...itemInit,...matiere_active,...viscosite};
                    }else{
                        var itemUpdate=analtics[itm.name];
                        const {count,ph,matiere_active,viscosite}=itemUpdate;
                        const phUpdate={ph:{count:ph.count+1,somme:ph.somme+itm.ph}};
                        const ma=(itm.matiere_active && itm.matiere_active!==null)?{matiere_active:{somme:matiere_active!==undefined?matiere_active.somme+itm.matiere_active:itm.matiere_active,count:matiere_active!==undefined?matiere_active.count+1:1}}:{};
                        const visco=(itm.viscosite && itm.viscosite!==null)?{viscosite:{somme:viscosite!==undefined?viscosite.somme+itm.viscosite:itm.viscosite,count:viscosite!==undefined?viscosite.count+1:1}}:{};
                        analtics[itm.name]={...itemUpdate,count:count+1,...phUpdate,...ma,...visco};
                    };
                }
            });
            return analtics;
        }

        function objectDispatchByName(data){
            var dispatchedByName={};
            data.map(itm=>{
                if(Object.keys(dispatchedByName).includes(itm.name)){
                    dispatchedByName[itm.name]=[...dispatchedByName[itm.name],itm];
                }else{
                    dispatchedByName[itm.name]=[itm];
                }
            });
            return dispatchedByName;
        }
        function format(obj){// {name,count,ph,matiere_active,viscosite}
            const {name,count,ph,matiere_active,viscosite}=obj;
            const phAverage=(ph.somme/ph.count).toFixed(2);
            const maAverage=matiere_active!==undefined?(matiere_active.somme/matiere_active.count).toFixed(2):undefined;
            const viscoAverage=viscosite!==undefined?(viscosite.somme/viscosite.count).toFixed(0):undefined;
            return {name:name,count:count,ph:phAverage,matiere_active:maAverage,viscosite:viscoAverage};
            }
        const buildAnalytics=(data)=>{
            var analytics={};
            setAnalyticsLen(data.length);
            data.map(itm=>{
                // const elisible=(!itm.name.includes("net") && !itm.name.includes("era"));
                const elisible=true;
                if(elisible){
                    if(analytics[(itm.name+"_"+itm.machine)]===undefined){analytics[(itm.name+"_"+itm.machine)]=[itm];
                    }else{analytics[(itm.name+"_"+itm.machine)].push(itm);};
                }
            });
        
            var names=Object.keys(analytics);
            const values=Object.values(analytics);
            var analyticsDep={A_B_C:[],D_D1_D2:[],E:[],F:[],MR:[]};
            var depsCounts={A_B_C:0,D_D1_D2:0,E:0,F:0,MR:0};
            const deps=["Liquide_1","Liquide_2","Cosmetique_1","Cosmetique_2","Mera"];
            names.map((Itm,index)=>{
                                        const machine=Itm.split("_")[1].replace(/Mera/g,"MR");;
                                        // const formated=format(values[index]);
                                        const count=values[index].length;
                                        Object.entries(analyticsDep).map(([key,value])=>{
                                            // const {count}=item;
                                            // const key=Key.replace(/Mera/g,"MR");
                                            if(key.includes(machine)){depsCounts[key]+=count;analyticsDep[key]=[...analyticsDep[key],...values[index]];}
                                        });
                                        // return {name:Itm,...formated}});
                                        return ;
                                });
            Object.entries(analyticsDep).map(([key,value],index)=>{
                    analyticsDep[depsCounts[key]+"_c_"+deps[index]]=Object.values(objectDispatchByName(value)).map(itm=>format(Object.values(objectSommes(itm))[0]));
                });
            const {A_B_C:[],D_D1_D2:[],E:[],F:[],MR:[],...rest}=analyticsDep;
                setAnalytics(rest);
            }

        return <EveragesContext.Provider value={{Analytics,buildAnalytics,analyticsLen}}>
            {children}
        </EveragesContext.Provider>
    }

export const useEverages=()=>useContext(EveragesContext);
// ================================================================================================================
 export const EveragesPowderProvider=({children})=>{
        const [powderAnalytics,setPowderAnalytics]=useState([]);
        const [powderAnalyticsLen,setPowderAnalyticsLen]=useState(0);

        // name: "Local 1"

        // alcanite: "11"
        // gg: "1"
        // humidite: "2"
        // matiere_active: "23"

        function objectSommes(items){
            var analtics={};
            items.map(itm=>{
                const elisible=true;
                if(elisible){
                    if(analtics[itm.name]===undefined){
                        var itemInit={name:itm.name,count:1,matiere_active:{somme:Number(itm.matiere_active),count:1},alcanite:{somme:Number(itm.alcanite),count:1}};
                        const gg=(itm.gg && itm.gg!==null)?{gg:{somme:Number(itm.gg),count:1}}:{};
                        const humidite=(itm.humidite && itm.humidite!==null)?{humidite:{somme:Number(itm.humidite),count:1}}:{};
                        analtics[itm.name]={...itemInit,...gg,...humidite};
                    }else{
                        var itemUpdate=analtics[itm.name];
                        const {count,matiere_active,alcanite,gg,humidite}=itemUpdate;
                        const phUpdate={matiere_active:{count:matiere_active.count+1,somme:matiere_active.somme+Number(itm.matiere_active)},alcanite:{count:alcanite.count+1,somme:alcanite.somme+Number(itm.alcanite)}};
                        const g=(itm.gg && itm.gg!==null)?{gg:{somme:gg!==undefined?gg.somme+Number(itm.gg):Number(itm.gg),count:gg!==undefined?gg.count+1:1}}:{};
                        const humid=(itm.humidite && itm.humidite!==null)?{humidite:{somme:humidite!==undefined?humidite.somme+Number(itm.humidite):Number(itm.humidite),count:humidite!==undefined?humidite.count+1:1}}:{};
                        analtics[itm.name]={...itemUpdate,count:count+1,...phUpdate,...g,...humid};
                    };
                }
            });
            return analtics;
        }

        function format(obj){// {name,count,ph,matiere_active,viscosite}
            const {name,count,gg,matiere_active,alcanite,humidite}=obj;
            const ggAverage=(gg.somme/gg.count).toFixed(2);
            const maAverage=matiere_active!==undefined?(matiere_active.somme/matiere_active.count).toFixed(2):undefined;
            const alcaAverage=alcanite!==undefined?(alcanite.somme/alcanite.count).toFixed(2):undefined;
            const humidAverage=humidite!==undefined?(humidite.somme/humidite.count).toFixed(2):undefined;
            return {name:name,count:count,isolated:0,gg:ggAverage,matiere_active:maAverage,alcanite:alcaAverage,humidite:humidAverage};
            }
        const buildPowderAnalytics=(data)=>{
            setPowderAnalyticsLen(data.length);
            const buildAnalytics=Object.values(objectSommes(data)).map(itm=>format(itm));
            setPowderAnalytics(buildAnalytics);
            }

        return <EveragesPowderContext.Provider value={{powderAnalytics,buildPowderAnalytics,powderAnalyticsLen}}>
            {children}
        </EveragesPowderContext.Provider>
    }

export const usePowderEverages=()=>useContext(EveragesPowderContext);
// ================================================================================================================
export const NouvelleFormuleProvider=({children})=>{
    const Formules=Object.keys(Lansas);
    const defaultBuild={nom:"",lansa:"Selectionner",parfum:"Selectionner",format:[],compression:false,percarbonate:false,mousses:false};
    const [build,setBuild]=useState(defaultBuild);
    // const [modalShow,setModalShow]=useState(false);
    const [values,setValues]=useState([]);
    const [dialogShow,setDialogShow]=useState(false);
    const [selected,setSelected]=useState([]);
    const noValues=values.length===0;

    // ,modalShow,setModalShow
    const {nom,lansa,parfum,format}=build;
    const keyFormule=nom || ((lansa?.name || lansa)+'_'+parfum);
    const buildLenIsNull=Object.keys(build).length===0;
    var allRequiredDefined=nom!=="" && !format.length===0 && !parfum.includes("Selectionner") && lansa.includes("Selectionner");
    const [nFormules,setNFormules]=useState([]);
    const nFormulesLenIsNotNull=Formules.length>0;
    const nDeleteItem=(name)=>{const data=Formules.filter((item)=>item.name!==name);setNFormules(data);}
    const nAddItem=(item)=>{setNFormules([...nFormules,item]);}
    function toggleItem(item){
        if(selected.includes(item)){
            const updatedValues=selected.filter((i)=>i!==item);
            setSelected(updatedValues);
            setValues(updatedValues);
        }else{
            const updatedValues=[...selected,item];
            setSelected(updatedValues);
            setValues(updatedValues);
        }
    }

    return <NFormulesContext.Provider value={{defaultBuild,allRequiredDefined,buildLenIsNull,selected,setSelected,toggleItem,keyFormule,values,noValues,setValues,nFormules,setNFormules,dialogShow,setDialogShow,build,setBuild,nFormulesLenIsNotNull,nDeleteItem,nAddItem}}>
       {children}
    </NFormulesContext.Provider>
}

export const useNFormules=()=>useContext(NFormulesContext);
// ================================================================================================================
export const NouvelleFormuleJavelProvider=({children})=>{
    const Formules=Object.keys(typesJavel);
    const defaultBuild={nom:"",lansa:"Selectionner",parfum:"Selectionner",format:[],compression:false,percarbonate:false,mousses:false};
    const [build,setBuild]=useState(defaultBuild);
    // const [modalShow,setModalShow]=useState(false);
    const [values,setValues]=useState([]);
    const [dialogShow,setDialogShow]=useState(false);
    const [selected,setSelected]=useState([]);
    const noValues=values.length===0;
    // ,modalShow,setModalShow
    const {nom,lansa,parfum,format}=build;
    const buildLenIsNull=Object.keys(build).length===0;
    var allRequiredDefined=nom!=="" && !format.length===0 && !parfum.includes("Selectionner") && lansa.includes("Selectionner");
    const [nFormules,setNFormules]=useState([]);
    const nFormulesLenIsNotNull=Formules.length>0;
    const nDeleteItem=(name)=>{const data=Formules.filter((item)=>item.name!==name);setNFormules(data);}
    const nAddItem=(item)=>{setNFormules([...nFormules,item]);}
    function toggleItem(item){
        if(selected.includes(item)){
            const updatedValues=selected.filter((i)=>i!==item);
            setSelected(updatedValues);
            setValues(updatedValues);
        }else{
            const updatedValues=[...selected,item];
            setSelected(updatedValues);
            setValues(updatedValues);
        }
    }

    return <NFormulesJavelContext.Provider value={{defaultBuild,allRequiredDefined,buildLenIsNull,selected,setSelected,toggleItem,values,noValues,setValues,nFormules,setNFormules,dialogShow,setDialogShow,build,setBuild,nFormulesLenIsNotNull,nDeleteItem,nAddItem}}>
       {children}
    </NFormulesJavelContext.Provider>
}

export const useNFormulesJavel=()=>useContext(NFormulesJavelContext);
// ================================================================================================================
const AccueilProvider=({children})=>{
    const [obj,setObj]=useState([]);
    const objLenIsNotNull=obj.length>0;
    const deleteItem=(machine,reservoir)=>{
            const data=obj.filter((item)=>(item.machine+item.reservoir)!==(machine+reservoir));setObj(data);
            }
    const sortedObj=obj.sort((a,b)=>{return a.machine.localeCompare(b.machine);});
    
    return (<AccueilContext.Provider  value={{obj,sortedObj,setObj,deleteItem,objLenIsNotNull}}>
    {children}
</AccueilContext.Provider> )}

export {AccueilContext,AccueilProvider};
// ================================================================================================================
export const MesureProvider=({children})=>{
    
    const [objet,setObjet]=useState({});
    return <MesureContext.Provider value={{objet,setObjet}}>
       {children}
    </MesureContext.Provider>
}

export const useMesure=()=>useContext(MesureContext);
// ================================================================================================================
export const ChipProvider=({children})=>{
    
    const [prdt,setPrdt]=useState(null);
    const [prdtP,setPrdtP]=useState(null);
    return <ChipContext.Provider value={{prdt,setPrdt,prdtP,setPrdtP}}>
       {children}
    </ChipContext.Provider>
}

export const useChip=()=>useContext(ChipContext);

// ================================================================================================================
export const CurrentUsersProvider=({children})=>{
    // const [currentUsers,setCurrentUsers]=useState([]);//currentUsers,setCurrentUsers,
    // const targetUser=useSelector(state=>state.user.targetUser);
    const [usrs,setUsrs]=useState([]);
    const [selectedId,setSelectedId]=useState(null);
    // useMemo(()=>{if(usrs.length===0){setSelectedId(targetUser.id)}},[usrs]);
    return <CurrentUsersContext.Provider value={{usrs,setUsrs,selectedId,setSelectedId}}>
       {children}
    </CurrentUsersContext.Provider>
}

export const useCurrentUsers=()=>useContext(CurrentUsersContext);
// ================================================================LIQUIDES================================================

const CurrentProductsProvider=({children})=>{
    const [currentProducts,setCurrentProducts]=useState({});
    const currentsProductsNames=Object.entries(currentProducts).map(([key,value])=>key.split('_').join(' '));
    const currentProductsLength=Object.keys(currentProducts).length;
    const currentProductsLenIsNotNull=currentProductsLength>0;
    const buildCurrentProducts=(analyses)=>{ 
        var analsAndCounts={};var analsCounts=[];
        analyses.map(item=>{
          const itemName=item.name.split(' ').join('_');
          if(analsCounts.includes(itemName)){
            analsAndCounts[itemName]++;
          }else{
            analsCounts.push(itemName);
            analsAndCounts[itemName]=1;
          }
        })

      setCurrentProducts(analsAndCounts);
    // setCurrentProducts({Renzo_Madar:2,Renzo_Platinium:10});
    }
    return <CurrentProductsContext.Provider value={{currentProductsLength,currentProductsLenIsNotNull,currentProducts,currentsProductsNames,buildCurrentProducts}}>
       {children}
    </CurrentProductsContext.Provider>
}

export {CurrentProductsContext,CurrentProductsProvider};

// ================================================================POUDRE================================================

export const CurrentProductedProvider=({children})=>{
    // POUR INITIALISER LES MEMOIRES CORRESPONDANTES DANS LE CONTEXT *****************************************
    const {powderNormes,formulesNormes,focusedProduct,powderAnalysed,currentProducted,focusedListe}=useSelector(state=>{
        const powderAnalysed=state.powderAnalysed.powderAnalysed;// liste tous les analyses poudre sur la journee
        const focusedProduct=state.focusedProduct.focusedProduct;// les normes du produit sur lequel porte le cursor(en edition)
        const {powderNormes,formulesNormes}=state.powderNormes; // Normes des poudre lansas
        const {currentProducted,focusedListe}=state.currentProducted;// liste differents produits poudre en production(poudre yignu dawal ci journee bi) pris du store et la liste des analyses du produit qui porte le cursor
        return {powderNormes,formulesNormes,focusedProduct,powderAnalysed,currentProducted,focusedListe};
    });
    //************************************************************************************************************

    const [currentProductedPro,setCurrentProducted]=useState(currentProducted);//{} liste object des produits elus a la production en cours pris du Context
    const [focusedPro,setFocusedPro]=useState(focusedProduct);// {} Normes du produit ayant le focus

    const [registred,setRegistred]=useState(powderAnalysed);//[] liste generale des analyes enregistrees
    const [focusedList,setFocusedList]=useState(focusedListe);//[] liste des analyses du product ayant le focus

    const [currentProductedLen,setCurrentProductedLen]=useState(0); // Longeur du tableau des produits elus a la production
    const [toCreate,setToCreate]=useState(true);// Switcheur entre mode creteating || mode updating
    const [id2Update,setId2Update]=useState(null);

    const [entete,setEntete]=useState('');
    const [directionTri, setDirectionTri]=useState('asc');

    function UpdateFocusedProdByName(item){
        const {name,nom}=item;
        const {estFormule}=isFormule(item);
        const itemKey=name.split(" ").join("_").toLowerCase();
        const itemNormes=estFormule?formulesNormes.data.arr.filter(itm=>itm.nom===nom)[0]:powderNormes.data[itemKey];
        setFocusedPro(itemNormes);
    }
    // const currentsProductsNames=Object.entries(currentProducts).map(([key,value])=>key.split('_').join(' '));
    const setCurrentProductedPro=(products)=>{ 
      const productsArray=Object.values(products);
      const productsLen=productsArray.length;
      if(productsLen===1){setFocusedPro(productsArray[0])};
      setCurrentProductedLen(productsLen);
      setCurrentProducted(products);
    }

    const ItemKey=(item)=>{const {nameToDisplay}=isFormule(item);return item?.name!==undefined?nameToDisplay:"vide";
        // const {name,nom,format}=item;
        // const formats=typeof(format)==="string"?format:format?.reduce((a,acc)=>acc+" "+a);
        // const isFormule=(format!==undefined && format!==null);
        // gere les cas itm ou item: pour itm(type ==="string") et pour item(type===Array(object)) 
        // const itemKey=isFormule?(nom+" "+formats):name;
    };

    function nextChariot(list,len){
        var i=1;var j=1;
        while((Number(list[len-i].nChar))%15!==0 && Number(list[len-i].nChar)>15){
            // i++;
            const gap=Number(list[len-i].nChar)-Number(list[(len-(i+1))].nChar);
            gap>15 && j++;i++;
        }
        // alert(list[len-i].chariot)
        return Number(list[len-i].nChar)+(j*15);
    }
    function ListOfFocusedAndLastNumber(item,items){
        // const isFormule=(item?.format!==undefined && item?.format!==null);
        // alert(JSON.stringify(item))
        // alert(JSON.stringify(items))
        const {estFormule}=isFormule(item);
        const list=!item?items:items.filter(itm=>
                    ItemKey(itm)===ItemKey(item))
                    .sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar));
        const listLength=list.length;
        const lansaChariot=listLength===0?1:(listLength===1?15:nextChariot(list,listLength));
        const formuleChariot=listLength+1;
        const freeChariot=estFormule?formuleChariot:lansaChariot;
        return {list,freeChariot};
    }
    function ListOfFocusedAndLastNumberTour(item,items){
        // const isFormule=(item?.format!==undefined && item?.format!==null);
        // alert(JSON.stringify(item))
        // alert(JSON.stringify(items))
        const {estFormule}=isFormule(item);
        const list=!item?items:items.filter(itm=>
                    ItemKey(itm)===ItemKey(item))
                    .sort((firstItem, secondItem) => Number(firstItem.nChar) - Number(secondItem.nChar));
        const listLength=list.length;
        const freeChariot=listLength===0?1:listLength+1;
        // (listLength===1?15:nextChariot(list,listLength));
        // const formuleChariot=listLength+1;
        // const freeChariot=estFormule?formuleChariot:lansaChariot;
        return {list,freeChariot};
    }

    function Everages(items){
        var GG=0;var HUMIDITE=0;var MATIERE_ACTIVE=0;var ALCANITE=0;
        items.map(item=>{
            const {gg,humidite,matiere_active,alcanite}=item;
            GG+=gg!==undefined?Number(gg):0;
            HUMIDITE+=humidite!==undefined?Number(humidite):0;
            MATIERE_ACTIVE+=matiere_active!==undefined?Number(matiere_active):0;
            ALCANITE+=alcanite!==undefined?Number(alcanite):0;

        })

        return {GG,HUMIDITE,MATIERE_ACTIVE,ALCANITE};
    }

    function keysAndRequirements(){
        const {name,couleur,taches,densite,...rest}=focusedPro;
        const keysAndRequirements=Object.entries(rest).map(([ky,vl])=>[ky.replace("max_",""),vl.required]);
        return keysAndRequirements;
    }

    function setAction(pyload){
        if(pyload==="create"){setToCreate(true);}else if(pyload==="update"){setToCreate(false);}else{setToCreate('falsy'+pyload);}
    }
    useEffect(()=>{ setFocusedList(focusedListe);},[focusedListe])
    useEffect(()=>{
        const productsArray=Object.values(currentProducted);
        const productsLen=productsArray.length;
        // if(productsLen===1){setFocusedPro(productsArray[0])};
        setCurrentProductedLen(productsLen);
        setFocusedPro(focusedProduct);//{}: normes du produit ayant le focus
        setAction("create");

    },[focusedProduct]);
    // const currentProductedLen=Object.keys(currentProductedPro).length;

    return <CurrentProductedContext.Provider value={{id2Update,setId2Update,entete,setEntete,directionTri, setDirectionTri,UpdateFocusedProdByName,Everages,setAction,toCreate,focusedList,setFocusedList,ListOfFocusedAndLastNumberTour,ListOfFocusedAndLastNumber,currentProductedLen,focusedPro,setFocusedPro,currentProductedPro,setCurrentProductedPro,keysAndRequirements,registred,setRegistred}}>
       {children}
    </CurrentProductedContext.Provider>
}

export const useCurrentProducted=()=>useContext(CurrentProductedContext);
// ================================================================POUDRE================================================

export const ItemToSaveProvider=({children})=>{
    const [itemToSave,setItemToSave]=useState({});
    const [errorsObject,setErrorsObject]=useState({});
    const [errors,setErrors]=useState([]);
    const [INDEX,setINDEX]=useState(null);
    const Libelle=(K)=>{
        const k=K.replace("max_","").replace("gg","gros grains")
        const libelle=k.toUpperCase();
        return libelle;
    }
    const buildErrors=(msg)=>{
        const {value,key,message}=msg;
        const text=message.replace("Input",Libelle(key)+" value");
        const msgsOb={[key]:text,...errorsObject};
        if(message==="" || value===""){
            const msgInter=Object.entries(msgsOb).filter(it=>it[0]!==key);
            const msgInFine=msgInter.map(it=>it[1]);
            const {[key]:undefined,...rest}=msgsOb;
            setErrors(msgInFine);
            setErrorsObject(rest);
            // const ERRORS=msgInFine.filter(er=>!er.includes("SILICATE") && !er.includes("SEL"));
            // setErrors(ERRORS);

            setErrorsObject(rest);
        }else{
            const ers=Object.entries(msgsOb).map(([ky,vl])=>vl);
            setErrors(ers);
            setErrorsObject(msgsOb);
            // const ERRORS=ers.filter(er=>!er.includes("SILICATE") && !er.includes("SEL"));
            // setErrors(ERRORS);
        }
    }
    const pickItemToSave=(prop)=>{
        const {key,value,message}=prop;
        const keyFormat=key.replace("max_","");
        // const libelle=Libelle(key);
        // const msg=message.replace("Input",libelle+" value");
        // const ers=[...errors,msg];
        const item={...itemToSave,[keyFormat]:value};
        buildErrors({value,key,message});
        // setErrors(ers);
        setItemToSave(item);
    }

    function setIndex(num){
        setINDEX(num);
    }
    const noErrors=errors.length===0;

    return <ItemToSaveContext.Provider value={{setIndex,INDEX,itemToSave,setItemToSave,pickItemToSave,errors,noErrors}}>
       {children}
    </ItemToSaveContext.Provider>
}

export const useItemToSave=()=>useContext(ItemToSaveContext);
// ================================================================POUDRE================================================

export const ItemJavelToSaveProvider=({children})=>{
    const [itemToSave,setItemToSave]=useState({});
    const [errorsObject,setErrorsObject]=useState({});
    const [errors,setErrors]=useState([]);
    const [INDEX,setINDEX]=useState(null);
    const Libelle=(K)=>{
        const k=K.replace("max_","").replace("gg","gros grains")
        const libelle=k.toUpperCase();
        return libelle;
    }
    const buildErrors=(msg)=>{
        const {value,key,message}=msg;
        const text=message.replace("Input",Libelle(key)+" value");
        const msgsOb={[key]:text,...errorsObject};
        if(message==="" || value===""){
            const msgInter=Object.entries(msgsOb).filter(it=>it[0]!==key);
            const msgInFine=msgInter.map(it=>it[1]);
            const {[key]:undefined,...rest}=msgsOb;
            setErrors(msgInFine);
            setErrorsObject(rest);
            // const ERRORS=msgInFine.filter(er=>!er.includes("SILICATE") && !er.includes("SEL"));
            // setErrors(ERRORS);

            setErrorsObject(rest);
        }else{
            const ers=Object.entries(msgsOb).map(([ky,vl])=>vl);
            setErrors(ers);
            setErrorsObject(msgsOb);
            // const ERRORS=ers.filter(er=>!er.includes("SILICATE") && !er.includes("SEL"));
            // setErrors(ERRORS);
        }
    }
    const pickItemToSave=(prop)=>{
        const {key,value,message}=prop;
        const keyFormat=key.replace("max_","");
        // const libelle=Libelle(key);
        // const msg=message.replace("Input",libelle+" value");
        // const ers=[...errors,msg];
        const item={...itemToSave,[keyFormat]:value};
        buildErrors({value,key,message});
        // setErrors(ers);
        setItemToSave(item);
    }

    function setIndex(num){
        setINDEX(num);
    }
    const noErrors=errors.length===0;

    return <ItemJavelToSaveContext.Provider value={{setIndex,INDEX,itemToSave,setItemToSave,pickItemToSave,errors,noErrors}}>
       {children}
    </ItemJavelToSaveContext.Provider>
}

export const useItemJavelToSave=()=>useContext(ItemJavelToSaveContext);
// ================================================================================================================

export const CommentsProvider=({commentaires,children})=>{
    
    const [formatedComments,setFormatedComments]=useState(commentsFromObjectToArray(commentaires));
    return <CommentsContext.Provider value={{formatedComments,setFormatedComments}}>
       {children}
    </CommentsContext.Provider>
}

export const useComments=()=>useContext(CommentsContext);
// ================================================================================================================
export const CheckBoxes=({children,defaultValeur})=>{
    
    const [checkedParam,setCheckedParam]=useState({bool:false,val:defaultValeur});
    return <CheckBoxesContext.Provider value={{checkedParam,setCheckedParam}}>
       {children}
    </CheckBoxesContext.Provider>
}

export const useCheckBoxes=()=>useContext(CheckBoxesContext);
// ================================================================================================================
export const PhMesureProvider=({constantes,children})=>{
    const {machine,nom,reservoir,codor,min,max,moy,categorie}=constantes;
    // const [constantes,setConstantes]=useState({machine:machine,nom:nom,reservoir:1,min:4,max:12,moy:8,categorie:'Lave Vaisselle'});
    const [value,setValue]=useState(moy);
    const [buttonParams,setButtonParams]=useState({color:'blue',text:'Save',able:true,});
    const [dor,setDor]=useState(true);
    const [lor,setLor]=useState(true);
    const [ob,setOb]=useState({machine:machine,nom:nom,rerservoir:reservoir,ph:moy,parfum:'C',color:'C',categorie:categorie});


    const APPRECIATIONS=()=>{
    const lPh=value<constantes.min?'Ph Low':"";
    const hPh=value>constantes.max?'Ph High':"";
    const c=!lor?' & Couleur non conforme':"";
    const o=!dor?' & Parfum non conforme':"";
    const appreciations=lPh+hPh+c+o;
    return appreciations===""?"RAS":appreciations;
  }
    const {appreciations,setAppreciations}=useState(APPRECIATIONS);
    
    //   const {isCodorConforme,isColor,isOdor}=useConformite();
        
    return <PhMesureContext.Provider value={{ob,setOb,constantes /*,setConstantes*/,dor,setDor,lor,setLor,appreciations,setAppreciations,buttonParams,setButtonParams,value,setValue}}>
       {children}
    </PhMesureContext.Provider>
}
export const usePhMesure=()=>useContext(PhMesureContext);
// ================================================================================================================
export const CheckReservBoxes=({children})=>{
  const [globalChecked,setGlobalChecked]=useState('');
  const [otherChecked,setOtherChecked]=useState(null);
    
    return <ReservBoxesContext.Provider value={{globalChecked,setGlobalChecked,otherChecked,setOtherChecked}}>
       {children}
    </ReservBoxesContext.Provider>
}

export const useGlobalChecked=()=>useContext(ReservBoxesContext);
// ================================================================================================================