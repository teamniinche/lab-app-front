// import liquidProducts from "../../assets/liquidesNormes";

// const dentifricesResults=liquidProducts.dentifrice;
class dentifriceResults{

    // class nouraNetRoseResults extends cosmetiquesResults{
            constructor(){

            }
        //     Color(){return this.mera_blanc.codor_normes.color.flamboise;}
        //     Parfum(){return this.mera_blanc.codor_normes.parfum.rouge;}
        //     Results(){
        //         return {
        //             ...this.mera_blanc,
        //             codor_normes:{
        //                 ...this.mera_blanc.codor_normes,
        //                 color:this.Color(),
        //                 parfum:this.Parfum(),
        //                 nom:'Mera Blanc '+this.Parfum()
        //             }
        //         }
        //     }
        // }

    Viscosite(){
        throw new Error("Méthode 'Viscosite de dentifrie' doit être implémentée");
    }
    Color(){
        throw new Error("Méthode 'Color de dentifrice' doit être implémentée");
    }
    /**
     * 
     * @param {string} nom 
     * @returns  object
     */
    Results(nom='Denttifrice'){
        return {
            // ...dentifrices_results,
            // codor_normes:{
            //     ...dentifrices_results.codor_normes,
            //     color:this.Color(),
            //     nom:nom && nom,
            //     categorie:'dentifrice',
            // },
            // viscosite_normes:this.Viscosite(),

        }
    }

}

export default dentifriceResults;