// import { getCosmetiquesResults } from "../../assets/functions";
class cosmetiquesResults{
    constructor(){
        // async function fetchData() {
        //     const results = await getCosmetiquesResults();
        //     if (results) {return results;}
        //   };
        // this.liquidProducts=fetchData();//lp
    }

    Parfum(){
        throw new Error("Méthode 'Parfum' doit être implémentée");
    }
    Color(){
        throw new Error("Méthode 'Color' doit être implémentée");
    }

    Results(nom='Cosmetique'){
        return {
            codor_normes:{
                nom:nom,
            },
        }
    }
}

export default cosmetiquesResults;