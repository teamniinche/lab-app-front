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
    filtres de base/periode definie : temps:(Mois,Date(jour)),isIsolated,Product,isFinished
    {(Mois -> Date)===Date} = ordre par defaut i.e pas de filtre pour c'est auto

    departement,machine,operator	de moins
===================== 16 COMBINEES (lire -> "output du filtre precedent passé à filtre suivant") =======================================
    filtres de base/periode definie : (Mois,Date(jour)),Departement,Machine,isValidated,operator,Product
    {(Mois -> Date)===Date} = ordre par defaut i.e pas de filtre pour c'est auto

    PERIODE ==============  13 periode > mois > date :  (A,B,C,D,E,F,G,H) 10🌸 en vrai - niv dep serait suffisant
    if sup mois (startedAt - endedAt)----------------------------------------------------------------------------------------------------4
        ( Mois -> Date)-> product        mois > date > product                             ✅a)🌸 |mois_date_dep_(engine()) RP  dep_mois_date_product()🍸
        isValidated-unique -> (Mois -> date)           isValidated > mois > date                ✅b)🌸 |dep_isValidated_mois_date() RP isValidated_mois_date_product()📌
        Products-multiple                              mois > date (> product)            ✅c)🌸 |dep_mois_date_product() RP product_mois_date()🌷
        Formules -> mois -> date                               mois > date            ✅d)🌸 |dep_mois_date_product()  RP product_mois_date()🌷 avec formules a la place product
    if Mois------------------------------------------------------------------------------------------------------------------------------4
        isValidated -> (Date)                          isValidated > date                      ✅b)   |dep_isValidated_mois_date() RP isValidated_mois_date_product()📌
        Formules -> date                               date                                    ✅d)🌸 |dep_mois_date_product() RP product_mois_date()🌷 avec formules a la place product
    if Date (jour)-----------------------------------------------------------------------------------------------------------------------4
        isValidated                                    isValidated > product                             ✅b)   |dep_isValidated_mois_date() RP isValidated_product()📌
    Product------------------------------------------------------------------------------------------------------------------------------2
        (Mois -> Date)                              product > mois > date                    ✅g)🌸|product_mois_date()🌷
        (Mois -> Date)-> isValidated                product > isValidated                    ✅h)🌸|isValidated_mois_date()📌

        
    Total filtres reduit à 3 :
        mois_date_product()🍸 de dep_mois_date_product()
        product_mois_date()🌷 de  dep_product_mois_date()
        isValidated_mois_date_product()📌 de dep_isValidated_mois_date() auquel on a retiré dep et appendé product
    
    ========================================================================================================================================*/
    _months=['Janvier','Fèvrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
    _engines=[['A','B','C'],['D','D1','D2'],['E'],['F'],['Mera']];
    _departements=['Liquide1-Samba','Liquide2-Ibrahima','Cosmetique1-Zachria','Cosmetique2-Fred','Mera'];
    _deptEngines={'Liquide1-Samba':['A','B','C'],'Liquide2-Ibrahima':['D1','D2'],'Cosmetique1-Zachria':['E'],'Cosmetique2-Fred':['F'],'Mera':['1']};
    constructor(){}
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
    }catch(error){alert(error.message);}
}

// periode -> departement -> Machine
// ====================== FILTRES FINAUX ====================================================dep_engine_mois_date
isValidated_mois_date_product(elements){// b) dep_isValidated_mois_date
    const count=this._formatElements(this.findNotConformes(elements)).length;
        const combinatedResult = {count:count,items:this._formatElements(this.groupedByMonth(this._formatElements(this.findNotConformes(elements)))).map(([k,val])=>{
                        const count=this._formatElements(val).length;
                        return {count:count,[k]:this._formatElements(this.filterByDate(val)).map(([N,nal])=>{
                            const count=this._formatElements(nal).length;
                            return {count:count,[N]:this.filterByName(nal)}
                        })}
                    })
                }
    console.log(combinatedResult);
    return combinatedResult;
}
mois_date_product(elements){
    const count=this._formatElements(elements).length;
        const combinatedResult = {count:count,depth:4,items:this._formatElements(this.groupedByMonth(elements)).map(([key,value])=>{
                const count=this._formatElements(value).length;
                return {
                    count:count,
                    [key]:this._formatElements(this.filterByDate(value)).map(([k,val])=>{
                        const count=this._formatElements(val).length;
                        return {count:count,[k]:this.filterByName(val)}
                    })
                }
    })}
    console.log(combinatedResult);
    return combinatedResult;
}

product_mois_date(elements){
    const count=this._formatElements(elements).length;
    const combinatedResult={count:count,depth:3,items:this._formatElements(this.filterByName(elements)).map(([key,value])=>{
        const count=this._formatElements(value).length;
        return {
            count:count,
            [key]:this._formatElements(this.groupedByMonth(value)).map(([k,val])=>{
                const count=this._formatElements(val).length;
                return {count:count,[k]:this.filterByDate(val)}
            })
        }
    })}
    console.log(combinatedResult);
    return combinatedResult;
}

// ====================== FONCTIONS UTILITAIRES ==============================================
    _formatElements(elements){
        if (!elements){alert('null or undefined'); return []};
        return Array.isArray(elements)?elements:Object.entries(elements);
    }
    _DateString=(dateTimeString)=>{
        const dateSplit=dateTimeString.split('T');
        const T=dateSplit[0];
        return T;
    }
// ===================== FILTRES DE BASE =================================================
    filterByDate(elements){
        var KEYS=[];
        var  groupedItems={};

        this._formatElements(elements).map(item=>{
            const {createdAt}=item[0] || item;
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
        this._formatElements(elements).sort((a, b) =>a.name.localeCompare(b.name)).map(item=>{
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
        const notConformes=this._formatElements(elements).filter(item=>item.validation!==null);
        return notConformes;
    }
    groupedByMonth(elements){
        var MOIS=[];
        var  groupedByMonth={};
        this._formatElements(elements).filter(item=>{
            var it=item[0] || item;
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


 }

 export default Filters;
/* 
    {
        product_mois_date,
        mois_date_product,
        isValidated_mois_date_product
    } 
*/;