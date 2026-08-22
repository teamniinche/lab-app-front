class Filters{

    /*const {id,updatedAt,parfum,color,observations,commentaires,categorie,
                createdAt,validation,Utilisateur,
                ...rest} = item;
        const {machine,name}=rest;
        const validateur = validation?.Utilisateur?.pseudo || "";
        const chemist = Utilisateur?.pseudo || "";*/

   /* =============== SANS DERANGER L ORDRE TEMPOREL =============
            Periode({api_url,startedAt,endedAt})   : startedAt - endedAt:response = fetch(`${api_url}?page=1&limit=10000&startedAt=${startedAt}&endedAt=${endedAt}`);
            Mois      : toDisplay(),
            Date(jour):GroupByDateItems
    =============== DERANGER L ORDRE TEMPOREL =============
            Nom_product-- : value.sort((a, b) =>a.name.localeCompare(b.name)).map(item => {
            departement,Machine-- 
            Operateur & validator-- 
            isValidated-- 
    ===================== 16 COMBINEES (lire -> "output du filtre precedent passé à filtre suivant") =======================================
    filtres de base/periode definie : (Mois,Date(jour)),Departement,Machine,isValidated,operator,Product
    {(Mois -> Date)===Date} = ordre par defaut i.e pas de filtre pour c'est auto

    PERIODE ==============  16 periode > mois > dep > date > machine :  (A,B,C,D,E,F,G,H) 10🌸 en vrai - niv dep serait suffisant
    if sup mois (startedAt - endedAt)----------------------------------------------------------------------------------------------------4
        departement -> Machines ->( Mois -> Date)   mois > date > dep > machine              ✅a)🌸 |mois_date_dep_(engine())
        isValidated-unique -> (Mois -> date)        isValidated > mois > date                ✅b)🌸 |dep_isValidated_mois_date()
        departement -> Products-multiple            dep > mois > date (> product)            ✅c)🌸 |dep_mois_date_product()
        operateur & validator -> (Mois -> Date)     chemist > mois > date                    ✅d)🌸
    if Mois------------------------------------------------------------------------------------------------------------------------------4
        departement -> Machine -> (Date)            date > dep > machine                     ✅a')🌸|date_dep_(engine())
        isValidated -> (Date)                       isValidated > date                       ✅b)   |dep_isValidated_mois_date()
        departement -> Products                     dep > date > product                     ✅c)   |dep_mois_date_product()
        operateur & validator -> (Date)             chemist > date                           ✅d)   |chemist_mois_date()
    if Date (jour)-----------------------------------------------------------------------------------------------------------------------4
        departement -> Machine                      dep > machine                            ✅a")🌸|vdep_date_(engine())
        isValidated                                 isValidated                              ✅b)   |dep_isValidated_mois_date()
        departement -> Product                      dep > product                            ✅c)   |dep_mois_date_product()
        operateur & validator                       chemist                                  ✅d)   |chemist_mois_date()
    departement,Machine------------------------------------------------------------------------------------------------------------------2
        (Mois -> Date) -> product                   dep > machine > mois > date > product    ✅e)🌸|dep_engine_mois_date_product()
        (Mois -> Date) -> isValidated               dep > machine > mois > date > isValidated✅f)🌸|dep_engine_mois_date_isValidated()
    Product------------------------------------------------------------------------------------------------------------------------------2
        (Mois -> Date)                              product > mois > date                    ✅g)🌸|product_mois_date()
        (Mois -> Date)-> isValidated                product > isValidated                    ✅h)🌸|product_isValidated()


    ========================================================================================================================================*/
    _months=['Janvier','Fèvrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
    _engines=[['A','B','C'],['D','D1','D2'],['E'],['F'],['Mera']];
    _departements=['Liquide1-Samba','Liquide2-Ibrahima','Cosmetique1-Zachria','Cosmetique2-Fred','Mera'];
    _deptEngines={'Liquide1-Samba':['A','B','C'],'Liquide2-Ibrahima':['D1','D2'],'Cosmetique1-Zachria':['E'],'Cosmetique2-Fred':['F'],'Mera':['1']};
    // _analyses={};
    constructor(){/*{API_URL,startedAt,endedAt,product}*/
        // this.api_url=API_URL;
        // this.startedAt=startedAt;
        // this.endedAt=endedAt;
        // // this.data =null;
        // this.product =product;
        // // this._analyses=
        // this._init();//{API_URL,startedAt,endedAt,product}
        // this.analyses=this._init();//{API_URL,startedAt,endedAt,product}
        
    }
async _init(){try{//{API_URL,startedAt,endedAt,product}
    var response=await fetch(`${this.api_url}?page=1&limit=10000&startedAt=${this.startedAt}&endedAt=${this.endedAt}`);
    this.data= await response.json();
    // this._analyses=this.product?this.data.analyses.filter(item=>item.name.includes(this.product)):this.data.analyses;
    // console.log(
    // //     // this.filterByDep(this.data.analyses)           //ok
    // //     // this.filterByDate(this.data.analyses)          //ok
    // //     // this.groupedByMonth(this.data.analyses)        //ok
    // //     // this.filterByEngine(this.data.analyses)        //ok
    // //     // this.findNotConformes(this.data.analyses)      //ok
    // //     // this.filterByName(this.data.analyses)          //ok
    // //     // this.groupedByChemist(this.data.analyses)      //ok
    //     this.dep_date_engine()//ok
    // //     // this.mois_date_dep_engine()                       //ok
    // );
    // return this._analyses;
    }catch(error){setPop({show:true,message:error.message,code:"#880000"});}
}

// periode -> departement -> Machine
// ====================== FILTRES FINAUX ====================================================dep_engine_mois_date
dep_date_engine(elements){//dep_date_engine/periode est plus pertinent
    // var elements=this._analyses;
    // console.log(JSON.stringify(elements));
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:3,items:Object.entries(this.filterByDep(elements)).map(([key,value])=>{
        const count=Object.values(value).length;
        return {
            count:count,
            [key]:Object.entries(this.filterByDate(value)).map(([k,val])=>{
                const count=Object.values(val).length;
                return {count:count,[k]:val/*this.filterByEngine(val)*/}
            })
        }
    })}
    // promise.then(response=>response.json()).then(data=>{return data;});
    return combinatedResult;
}
date_dep_engine(elements){//dep_date_engine/periode est plus pertinent
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:3,items:Object.entries(this.filterByDate(elements)).map(([key,value])=>{
        const count=Object.values(value).length;
        return {
            count:count,
            [key]:Object.entries(this.filterByDep(value)).map(([k,val])=>{
                const count=Object.values(val).length;
                return {count:count,[k]:val/*this.filterByEngine(val)*/}
            })
        }
    })}
    return combinatedResult;
}
mois_date_dep_engine(elements){//dep_date_engine/periode est plus pertinent
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:4,items:Object.entries(this.groupedByMonth(elements)).map(([K,V])=>{
        const count=Object.values(V).length;
        return {
            count:count,
            [K]:Object.entries(this.filterByDep(V)).map(([key,value])=>{
                const count=Object.values(value).length;
                return {
                    count:count,
                    [key]:Object.entries(this.filterByDate(value)).map(([k,val])=>{
                        const count=Object.values(value).length;
                        return {count:count,[k]:val/*this.filterByEngine(val)*/}
                    })
                }
    })}})}
    return combinatedResult;
}
dep_isValidated_mois_date(elements){// b) dep_isValidated_mois_date
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:3,items:Object.entries(this.filterByDep(elements)).map(([K,V])=>{
        const count=Object.values(V).length;
        return {count:count,[K]:Object.entries(this.findNotConformes(V)).map(([key,value])=>{
                const count=Object.values(value).length;
                return {
                    count:count,
                    [key]:Object.entries(this.groupedByMonth(value)).map(([k,val])=>{
                        const count=Object.values(value).length;
                        return {count:count,[k]:this.filterByDate(val)}
                    })
                }
    })}})}
    return combinatedResult;
}
dep_mois_date_product(elements){// b) dep_mois_date_product
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:4,items:Object.entries(this.filterByDep(elements)).map(([K,V])=>{
        const count=Object.values(V).length;
        return {count:count,depth:4,[K]:Object.entries(this.groupedByMonth(V)).map(([key,value])=>{
                const count=Object.values(value).length;
                return {
                    count:count,
                    [key]:Object.entries(this.filterByDate(value)).map(([k,val])=>{
                        const count=Object.values(val).length;
                        return {count:count,[k]:this.filterByName(val)}
                    })
                }
    })}})}
    return combinatedResult;
}
chemist_mois_date(elements){//chemist_mois_date
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:3,items:Object.entries(this.groupedByChemist(elements)).map(([key,value])=>{
        const count=Object.values(value).length;
        return {
            count:count,
            [key]:Object.entries(this.groupedByMonth(value)).map(([k,val])=>{
                const count=Object.values(val).length;
                return {count:count,[k]:this.filterByDate(val)}
            })
        }
    })}
    return combinatedResult;
}
dep_engine_mois_date_product(elements){//dep_engine_mois_date_product/periode est plus pertinent
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:5,items:Object.entries(this.filterByDep(elements)).map(([K,V])=>{
        const count=Object.values(V).length;
        // return {
        //     [K]:Object.entries(this.filterByEngine(V)).map(([key,value])=>{
                return {
                    count:count,
                    [K/*key*/]:Object.entries(this.groupedByMonth(V/*value*/)).map(([k,val])=>{
                        const count=Object.values(val).length;
                        return {count:count,[k]:Object.entries(this.filterByDate(val)).map(([ky,vl])=>{
                                    const count=Object.values(vl).length;
                                    return {count:count,[ky]:this.filterByName(vl)}
                                })}
                    })
                }
    // })}
})}
    return combinatedResult;
}
dep_engine_mois_date_isValidated(elements){//dep_engine_mois_date_isValidated/periode est plus pertinent
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:5,items:Object.entries(this.filterByDep(elements)).map(([K,V])=>{
        const count=Object.values(V).length;
        // return {
        //     [K]:Object.entries(this.filterByEngine(V)).map(([key,value])=>{
                return {
                    count:count,
                    [K/*key*/]:Object.entries(this.groupedByMonth(V/*value*/)).map(([k,val])=>{
                        const count=Object.values(val).length;
                        return {count:count,[k]:Object.entries(this.filterByDate(val)).map(([ky,vl])=>{
                                    const count=Object.values(vl).length;
                                    return {count:count,[ky]:this.findNotConformes(vl)}
                                })}
                    })
                }
    // })}
})}
    return combinatedResult;
}
product_mois_date(elements){//chemist_mois_date
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:3,items:Object.entries(this.filterByName(elements)).map(([key,value])=>{
        const count=Object.values(value).length;
        return {
            count:count,
            [key]:Object.entries(this.groupedByMonth(value)).map(([k,val])=>{
                const count=Object.values(val).length;
                return {count:count,[k]:this.filterByDate(val)}
            })
        }
    })}
    return combinatedResult;
}
product_isValidated(elements){//chemist_mois_date
    // const elements=this.analyses;
    const count=Object.values(elements).length;
    const combinatedResult={count:count,depth:2,items:Object.entries(this.filterByName(elements)).map(([key,value])=>{
        const count=Object.values(value).length;
        return {
            count:count,
            [key]:this.findNotConformes(value)
        }
    })}
    return combinatedResult;
}
// ====================== FONCTIONS UTILITAIRES ==============================================
    _formatElements(elements){
        // const elmnts=typeof(elements)==='object'?Object.entries(elements):elements;
        return Object.entries(elements);
    }
    _DateString=(dateTimeString)=>{
        const dateSplit=dateTimeString.split('T');
        const T=dateSplit[0];
        return T;
    }
    _findDep(machine){
        var dep=""
        this._engines.map((engine,index)=>{
            if(engine.includes(machine)){dep=this._departements[index];};
        });
        return dep;
    }

// ===================== FILTRES DE BASE =================================================
    filterByDate(elements){
        var KEYS=[];
        var  groupedItems={};

        this._formatElements(elements).map(([key,item])=>{
            const {createdAt}=item;
            const dat=this._DateString(createdAt);
            if(KEYS.includes(dat)){
                groupedItems[dat]=[...groupedItems[dat],item];
            }else{
                groupedItems[dat]=[item];
                KEYS.push(dat);
            }
    
        })
        return groupedItems;
    }
    filterByName(elements){
        var PRODUCTS=[];
        var  groupedItems={};
        Object.values(elements).sort((a, b) =>a.name.localeCompare(b.name)).map(item=>{
            const {name}=item;
            if(PRODUCTS.includes(name)){
                groupedItems[name]=[...groupedItems[name],item];
            }else{
                groupedItems[name]=[item];
                PRODUCTS.push(name);
            }
    
        })
        return groupedItems;
    }
    findNotConformes(elements){
        const notConformes=this._formatElements(elements).filter(([key,item])=>item.validation!==null);
        return notConformes;
    }
    filterByDep(elements){
        var DEPS=[];
        var  groupedByDep={};

        this._formatElements(elements).map(([key,item])=>{
            const {machine}=item;
            var dep=this._findDep(machine);
            if(DEPS.includes(dep)){
                groupedByDep[dep]=[...groupedByDep[dep],item];
            }else{
                groupedByDep[dep]=[item];
                DEPS.push(dep);
            }
    
        })
        return groupedByDep;
    }
    filterByEngine(elements){
        var ENGINES=[];
        var  groupedByEngine={};

        this._formatElements(elements).map(([key,item])=>{
            const {machine}=item;
            if(ENGINES.includes(machine)){
                groupedByEngine[machine]=[...groupedByEngine[machine],item];
            }else{
                groupedByEngine[machine]=[item];
                ENGINES.push(machine);
            }
    
        })
        return groupedByEngine;
    }
    groupedByMonth(elements){
        var MOIS=[];
        var  groupedByMonth={};

        this._formatElements(elements).filter(([key,item])=>{
            var it=item || item[0];
            const {createdAt}=it;
            const dateArray=createdAt.split('-');//const annee=dateArray[0];
            var month=dateArray[1];
            const mth=this._months[month-1];
            if(MOIS.includes(mth)){
                groupedByMonth[mth]=[...groupedByMonth[mth],item];
            }else{
                groupedByMonth[mth]=[item];
                MOIS.push(mth);
            }
    
        })
        return groupedByMonth;
        }
    groupedByChemist(elements){
    var CHEMIST=[];
    var  grouped={};

    this._formatElements(elements).filter(([key,item])=>{
        const {validation,Utilisateur}=item;
        const validateur = validation?.Utilisateur?.pseudo || "";
        const chemist = Utilisateur?.pseudo || "";
        if(CHEMIST.includes(chemist)){
            grouped[chemist]=[...grouped[chemist],item];
        }else{
            grouped[chemist]=[item];
            CHEMIST.push(chemist);
        };
        if(CHEMIST.includes(validateur)){
            grouped[validateur]=[...grouped[validateur],item];
        }else{
            grouped[validateur]=[item];
            CHEMIST.push(validateur);
        }

    })
    return grouped;
    }

 }

//  exports={
//                                  dep_date_engine,
//                                  date_dep_engine,
//                                  mois_date_dep_engine,
//                                  dep_isValidated_mois_date,
//                                  dep_mois_date_product,
//                                  chemist_mois_date,
//                                  dep_engine_mois_date_product,
//                                  dep_engine_mois_date_isValidated,
//                                  product_mois_date,
//                                  product_isValidated
//                              };
 export default Filters;