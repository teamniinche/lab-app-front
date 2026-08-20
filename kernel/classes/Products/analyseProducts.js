// analyseProducts.js
// import NoneStrategy from "../noneStrategy.js";
import ProductStrategy from "./productStrategy";
import Colors from "../../../assets/colors.js";

export class Caustic extends ProductStrategy {
    Pourcentage_caustic(resultat, normes) {
        return this.response(resultat, normes);
    }
/*

    caustic:{
      prctageCaustic::{min:'',max:''},
      codor:{color:false,parfum:'N/A'},
    }

*/
    Results(resultat,normes,bool){
      return     {
            identification: {
              /* caracteristiques physiques*/
                // constants
                  categorie:'causilicate',
                  forme: "Liquide",
                  nom: "% Caustic",
                // à controler
                  couleur:this.codor(false),
                  parfum:this.codor(false)
            },
            grandeurs: {
              "prctageCaustic": this.Pourcentage_caustic(resultat, normes),// returner par grandeurAnalyse() ici prctageAnalyse()
            },
          }
    }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
}
export class Silicate extends ProductStrategy {
  Silicate(resultat, normes) {
      return this.response(resultat, normes);
  }

  /*

    silicate:{
      prctageSilicate:{min:'',max:''},
      codor:{color:false,parfum:'N/A'},
    }

*/

  Results(resultat,normes,bool){
    return     {
          identification: {
            /* caracteristiques physiques*/
              // constants
                categorie:'causilicate',
                forme: "Liquide",
                nom: "% Caustic",
              // à controler
                couleur:this.codor(false),
                parfum:this.codor(false)
          },
          grandeurs: {
            "prctageCaustic": this.Pourcentage_caustic(resultat, normes),// returner par grandeurAnalyse() ici prctageAnalyse()
          },
        }
  }
// autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
}
export class Renzo_madar extends ProductStrategy {

  ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.renzo_madar.ph_normes;
    this.matiere_active_normes=data.renzo_madar.matiere_active_normes;
    this.viscosite_normes=data.renzo_madar.viscosite_normes;
    this.densite_normes=data.renzo_madar.densite_normes;
    this.hasColor=data.renzo_madar.codor_normes.hasColor;
  }

//   // ph_normes=liquidProducts.renzo_madar.ph_normes;
//   // matiere_active_normes=liquidProducts.renzo_madar.matiere_active_normes;
//   // viscosite_normes=liquidProducts.renzo_madar.viscosite_normes;
//   // densite_normes=liquidProducts.renzo_madar.densite_normes;
//   // hasColor=liquidProducts.renzo_madar.codor_normes.hasColor;

//   /*

//     renzo_madar:{
//       codor_normes:{
//         hasColor:true,
//         color:'vert',
//         parfum:'Citron'
//       },
//       ph_normes:{min:7.6,max:8.2},
//       matiere_active_normes:{min:15,max:16.5},
//       viscosite_normes:{min:4000,max:8000},
//       densite_normes:{min:1.025,max:1.03}
//     }

// */
      Ph(resultats, normes) {
        return this.response(resultats,normes);
      }
    
      Densite(resultats, normes) {
        return this.response(resultats,normes);
      }

      Viscosite(resultats, normes) {
        return this.response(resultats,normes);
      }

      Matiere_active(resultats, normes) {
        return this.response(resultats,normes);
      }

      Results(client_entries,isConforme){
        /* ==========  CLIENT ENTRIES  ===================
        viscosite et densite doivent etre isolés chacun sur sa page
        ================================================ */

        const {ph,densite,viscosite,matiere_active}=client_entries;
        const {isColorConforme,isOdorConforme}=isConforme;

        return     {
              identification: {
                /* caracteristiques physiques*/
                  // constants
                    categorie:'liquides vaisselle',
                    forme: "Liquide",
                    nom: "Renzo Madar",
                  // à controler
                    couleur:this.codor(this.hasColor,isColorConforme,Colors.Citron),
                    parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
              },
              grandeurs: {
                ph:this.Ph(ph, this.ph_normes),
                viscosite:this.Viscosite(viscosite, this.viscosite_normes),
                matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
                densite:this.Densite(densite, this.densite_normes)

              },
            }
      }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
}
export class Renzo_noura extends ProductStrategy {
    // grandeurs analysées only

    /*

    renzo_noura:{
      codor:{color:true,parfum:Colors.Citron},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Results(resultat,normes,bool){
    //   return     {
    //         identification: {
    //           /* caracteristiques physiques*/
    //             // constants
    //               forme: "Liquide",
    //               nom: "% Caustic",
    //             // à controler
    //               couleur:this.codor(true,bool,Colors.Citron),
    //               parfum:this.codor(true,bool,'Citron')
    //         },
    //         grandeurs: {
    //           "ph":this.Ph(resultat, normes),
    //           "alcanite":this.Alcanite(resultat, normes),
    //           "matiere_active":this.Matiere_active(resultat, normes),
    //         },
    //       }
    // }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
 ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
 constructor(data){
   super();
   this.ph_normes=data.renzo_noura.ph_normes;
   this.matiere_active_normes=data.renzo_noura.matiere_active_normes;
   this.viscosite_normes=data.renzo_noura.viscosite_normes;
   this.densite_normes=data.renzo_noura.densite_normes;
   this.hasColor=data.renzo_noura.codor_normes.hasColor;
 }
//  ph_normes=liquidProducts.renzo_noura.ph_normes;
//  matiere_active_normes=liquidProducts.renzo_noura.matiere_active_normes;
//  viscosite_normes=liquidProducts.renzo_noura.viscosite_normes;
//  densite_normes=liquidProducts.renzo_noura.densite_normes;
//  hasColor=liquidProducts.renzo_noura.codor_normes.hasColor;


 /*

 renzo_noura:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Renzo Noura",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Citron),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies

    }
export class Noura_platinium extends ProductStrategy {
    // grandeurs analysées only

    /*

    renzo_noura:{
      codor:{color:true,parfum:Colors.Citron},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Results(resultat,normes,bool){
    //   return     {
    //         identification: {
    //           /* caracteristiques physiques*/
    //             // constants
    //               forme: "Liquide",
    //               nom: "% Caustic",
    //             // à controler
    //               couleur:this.codor(true,bool,Colors.Citron),
    //               parfum:this.codor(true,bool,'Citron')
    //         },
    //         grandeurs: {
    //           "ph":this.Ph(resultat, normes),
    //           "alcanite":this.Alcanite(resultat, normes),
    //           "matiere_active":this.Matiere_active(resultat, normes),
    //         },
    //       }
    // }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
 ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
 constructor(data){
   super();
   this.ph_normes=data.noura_platinium.ph_normes;
   this.matiere_active_normes=data.noura_platinium.matiere_active_normes;
   this.viscosite_normes=data.noura_platinium.viscosite_normes;
   this.densite_normes=data.noura_platinium.densite_normes;
   this.hasColor=data.noura_platinium.codor_normes.hasColor;
 }
//  ph_normes=liquidProducts.renzo_noura.ph_normes;
//  matiere_active_normes=liquidProducts.renzo_noura.matiere_active_normes;
//  viscosite_normes=liquidProducts.renzo_noura.viscosite_normes;
//  densite_normes=liquidProducts.renzo_noura.densite_normes;
//  hasColor=liquidProducts.renzo_noura.codor_normes.hasColor;


 /*

 renzo_noura:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Noura Platinium",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Platinium),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Platinium')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies

    }
export class Noura_premium extends ProductStrategy {
    // grandeurs analysées only

    /*

    renzo_noura:{
      codor:{color:true,parfum:Colors.Citron},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Results(resultat,normes,bool){
    //   return     {
    //         identification: {
    //           /* caracteristiques physiques*/
    //             // constants
    //               forme: "Liquide",
    //               nom: "% Caustic",
    //             // à controler
    //               couleur:this.codor(true,bool,Colors.Citron),
    //               parfum:this.codor(true,bool,'Citron')
    //         },
    //         grandeurs: {
    //           "ph":this.Ph(resultat, normes),
    //           "alcanite":this.Alcanite(resultat, normes),
    //           "matiere_active":this.Matiere_active(resultat, normes),
    //         },
    //       }
    // }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
 ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
 constructor(data){
   super();
   this.ph_normes=data.noura_premium.ph_normes;
   this.matiere_active_normes=data.noura_premium.matiere_active_normes;
   this.viscosite_normes=data.noura_premium.viscosite_normes;
   this.densite_normes=data.noura_premium.densite_normes;
   this.hasColor=data.noura_premium.codor_normes.hasColor;
 }
//  ph_normes=liquidProducts.renzo_noura.ph_normes;
//  matiere_active_normes=liquidProducts.renzo_noura.matiere_active_normes;
//  viscosite_normes=liquidProducts.renzo_noura.viscosite_normes;
//  densite_normes=liquidProducts.renzo_noura.densite_normes;
//  hasColor=liquidProducts.renzo_noura.codor_normes.hasColor;


 /*

 renzo_noura:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Noura Premium",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Premium),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Premium')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies

    }
export class Noura_2_citron extends ProductStrategy {
    // grandeurs analysées only

    /*

    renzo_noura:{
      codor:{color:true,parfum:Colors.Citron},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   return this.response(resultat,normes);
    // }

    // Results(resultat,normes,bool){
    //   return     {
    //         identification: {
    //           /* caracteristiques physiques*/
    //             // constants
    //               forme: "Liquide",
    //               nom: "% Caustic",
    //             // à controler
    //               couleur:this.codor(true,bool,Colors.Citron),
    //               parfum:this.codor(true,bool,'Citron')
    //         },
    //         grandeurs: {
    //           "ph":this.Ph(resultat, normes),
    //           "alcanite":this.Alcanite(resultat, normes),
    //           "matiere_active":this.Matiere_active(resultat, normes),
    //         },
    //       }
    // }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
 ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
 constructor(data){
   super();
   this.ph_normes=data.noura_2_citron.ph_normes;
   this.matiere_active_normes=data.noura_2_citron.matiere_active_normes;
   this.viscosite_normes=data.noura_2_citron.viscosite_normes;
   this.densite_normes=data.noura_2_citron.densite_normes;
   this.hasColor=data.noura_2_citron.codor_normes.hasColor;
 }
//  ph_normes=liquidProducts.renzo_noura.ph_normes;
//  matiere_active_normes=liquidProducts.renzo_noura.matiere_active_normes;
//  viscosite_normes=liquidProducts.renzo_noura.viscosite_normes;
//  densite_normes=liquidProducts.renzo_noura.densite_normes;
//  hasColor=liquidProducts.renzo_noura.codor_normes.hasColor;


 /*

 renzo_noura:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Noura 2 Citron",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Citron),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies

    }
export class Renzo_platinium extends ProductStrategy {
    //// grandeurs analysées only
    // ph_normes=liquidProducts.renzo_platinium.ph_normes;
    // matiere_active_normes=liquidProducts.renzo_platinium.matiere_active_normes;
    // viscosite_normes=liquidProducts.renzo_platinium.viscosite_normes;
    // densite_normes=liquidProducts.renzo_platinium.densite_normes;
    // hasColor=liquidProducts.renzo_platinium.codor_normes.hasColor;
    ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.renzo_platinium.ph_normes;
    this.matiere_active_normes=data.renzo_platinium.matiere_active_normes;
    this.viscosite_normes=data.renzo_platinium.viscosite_normes;
    this.densite_normes=data.renzo_platinium.densite_normes;
    this.hasColor=data.renzo_platinium.codor_normes.hasColor;
  }


    /*

    renzo_platinium:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
      Ph(resultat, normes) {
        return this.response(resultat,normes);
      }

      Densite(resultats, normes) {
        return this.response(resultats,normes);
      }
    
      Viscosite(resultat, normes) {
        return this.response(resultat,normes);
      }

      Matiere_active(resultat, normes) {
        return this.response(resultat,normes);
      }

      Results(client_entries,isConforme){
        /* ==========  CLIENT ENTRIES  ===================
        viscosite et densite doivent etre isolés chacun sur sa page
        ================================================ */

        const {ph,densite,viscosite,matiere_active}=client_entries;
        const {isColorConforme,isOdorConforme}=isConforme;

        return     {
              identification: {
                /* caracteristiques physiques*/
                  // constants
                    categorie:'liquides vaisselle',
                    forme: "Liquide",
                    nom: "Renzo Platinium",
                  // à controler
                    couleur:this.codor(this.hasColor,isColorConforme,Colors.Platinium),
                    parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
              },
              grandeurs: {
                ph:this.Ph(ph, this.ph_normes),
                viscosite:this.Viscosite(viscosite, this.viscosite_normes),
                matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
                densite:this.Densite(densite, this.densite_normes)

              },
            }
      }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
}
export class Renzo_premium extends ProductStrategy {
  // grandeurs analysées only

  /*

    renzo_premium:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   this.response(resultat,normes);
    // }
   // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
//  ph_normes=liquidProducts.renzo_premium.ph_normes;
//  matiere_active_normes=liquidProducts.renzo_premium.matiere_active_normes;
//  viscosite_normes=liquidProducts.renzo_premium.viscosite_normes;
//  densite_normes=liquidProducts.renzo_premium.densite_normes;
//  hasColor=liquidProducts.renzo_premium.codor_normes.hasColor;

ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.renzo_premium.ph_normes;
    this.matiere_active_normes=data.renzo_premium.matiere_active_normes;
    this.viscosite_normes=data.renzo_premium.viscosite_normes;
    this.densite_normes=data.renzo_premium.densite_normes;
    this.hasColor=data.renzo_premium.codor_normes.hasColor;
  }

 /*

 renzo_premium:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Renzo Premium",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Premium),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Violet')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
  }
export class Get_platinium extends ProductStrategy {
  // grandeurs analysées only

  /*

    get_platinium:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   this.response(resultat,normes);
    // }
   // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
//  ph_normes=liquidProducts.get_platinium.ph_normes;
//  matiere_active_normes=liquidProducts.get_platinium.matiere_active_normes;
//  viscosite_normes=liquidProducts.get_platinium.viscosite_normes;
//  densite_normes=liquidProducts.get_platinium.densite_normes;
//  hasColor=liquidProducts.get_platinium.codor_normes.hasColor;

ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.get_platinium.ph_normes;
    this.matiere_active_normes=data.get_platinium.matiere_active_normes;
    this.viscosite_normes=data.get_platinium.viscosite_normes;
    this.densite_normes=data.get_platinium.densite_normes;
    this.hasColor=data.get_platinium.codor_normes.hasColor;
  }


 /*

 get_platinium:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Get Platinium",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Platinium),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Orange')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
  }
export class Get_premium extends ProductStrategy {
  // grandeurs analysées only

  /*

    get_platinium:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   this.response(resultat,normes);
    // }
   // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
//  ph_normes=liquidProducts.get_platinium.ph_normes;
//  matiere_active_normes=liquidProducts.get_platinium.matiere_active_normes;
//  viscosite_normes=liquidProducts.get_platinium.viscosite_normes;
//  densite_normes=liquidProducts.get_platinium.densite_normes;
//  hasColor=liquidProducts.get_platinium.codor_normes.hasColor;

ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.get_premium.ph_normes;
    this.matiere_active_normes=data.get_premium.matiere_active_normes;
    this.viscosite_normes=data.get_premium.viscosite_normes;
    this.densite_normes=data.get_premium.densite_normes;
    this.hasColor=data.get_premium.codor_normes.hasColor;
  }


 /*

 get_platinium:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Get Premium",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Premium),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Orange')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
  }
export class Get_citron extends ProductStrategy {
  // grandeurs analysées only

  /*

    get_citron:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
    // Ph(resultat, normes) {
    //   return this.response(resultat,normes);
    // }
  
    // Alcanite(resultat, normes) {
    //   this.response(resultat,normes);
    // }

    // Matiere_active(resultat, normes) {
    //   this.response(resultat,normes);
    // }
   // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
 // grandeurs analysées only
//  ph_normes=liquidProducts.get_citron.ph_normes;
//  matiere_active_normes=liquidProducts.get_citron.matiere_active_normes;
//  viscosite_normes=liquidProducts.get_citron.viscosite_normes;
//  densite_normes=liquidProducts.get_citron.densite_normes;
//  hasColor=liquidProducts.get_citron.codor_normes.hasColor;

ph_normes;matiere_active_normes;viscosite_normes;hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.get_citron.ph_normes;
    this.matiere_active_normes=data.get_citron.matiere_active_normes;
    this.viscosite_normes=data.get_citron.viscosite_normes;
    this.densite_normes=data.get_citron.densite_normes;
    this.hasColor=data.get_citron.codor_normes.hasColor;
  }


 /*

 get_citron:{
   codor:{color:true,parfum:''},
   ph:{min:'',max:''},
   alcanite:{min:'',max:''},
   matiere_active:{min:'',max:''},
 }

*/
   Ph(resultat, normes) {
     return this.response(resultat,normes);
   }

   Densite(resultats, normes) {
     return this.response(resultats,normes);
   }
 
   Viscosite(resultat, normes) {
     return this.response(resultat,normes);
   }

   Matiere_active(resultat, normes) {
     return this.response(resultat,normes);
   }

   Results(client_entries,isConforme){
     /* ==========  CLIENT ENTRIES  ===================
     viscosite et densite doivent etre isolés chacun sur sa page
     ================================================ */

     const {ph,densite,viscosite,matiere_active}=client_entries;
     const {isColorConforme,isOdorConforme}=isConforme;

     return     {
           identification: {
             /* caracteristiques physiques*/
               // constants
                 categorie:'liquides vaisselle',
                 forme: "Liquide",
                 nom: "Get Citron",
               // à controler
                 couleur:this.codor(this.hasColor,isColorConforme,Colors.Citron),
                 parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
           },
           grandeurs: {
             ph:this.Ph(ph, this.ph_normes),
             viscosite:this.Viscosite(viscosite, this.viscosite_normes),
             matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
             densite:this.Densite(densite, this.densite_normes)

           },
         }
   }
  // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
}
export class Lave_Bois extends ProductStrategy {
    // grandeurs analysées only
// ph_normes=liquidProducts.lave_bois.ph_normes;
// densite_normes=liquidProducts.lave_bois.densite_normes;
// hasColor=liquidProducts.lave_bois.codor_normes.hasColor;

ph_normes;
densite_normes;
// matiere_active_normes;
// viscosite_normes;
hasColor;
  constructor(data){
    super();
    this.ph_normes=data.lave_bois.ph_normes;
    // this.matiere_active_normes=data.renzo_madar.matiere_active_normes;
    // this.viscosite_normes=data.renzo_madar.viscosite_normes;
    this.densite_normes=data.lave_bois.densite_normes;
    this.hasColor=data.lave_bois.codor_normes.hasColor;
  }
    /*

    lave_bois:{
      codor:{color:true,parfum:''},
      ph:{min:7,max:8},
      alcanite:{min:7,max:8},
      matiere_active:{min:0.9,max:1},
    }

*/
Ph(resultats, normes) {
  return this.response(resultats,normes);
}

Densite(resultats, normes) {
  return this.response(resultats,normes);
}

Results(client_entries,isConforme){
  /* ==========  CLIENT ENTRIES  ===================
  viscosite et densite doivent etre isolés chacun sur sa page
  ================================================ */

  const {ph,densite}=client_entries;
  const {isColorConforme,isOdorConforme}=isConforme;

  return     {
        identification: {
          /* caracteristiques physiques*/
            // constants
              categorie:'cosmetique',
              forme: "Liquide",
              nom: "Lave bois",
            // à controler
              couleur:this.codor(this.hasColor,isColorConforme,Colors.Marron),
              parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
        },
        grandeurs: {
          ph:this.Ph(ph, this.ph_normes),
          densite:this.Densite(densite, this.densite_normes)
        },
      }
}


}
export class Lave_Vitre_madar extends ProductStrategy {
    // grandeurs analysées only
    // ph_normes=liquidProducts.madar_lave_vitre.ph_normes;
    // matiere_active_normes=liquidProducts.madar_lave_vitre.matiere_active_normes;
    // densite_normes=liquidProducts.madar_lave_vitre.densite_normes;
    // hasColor=liquidProducts.madar_lave_vitre.codor_normes.hasColor;

    ph_normes;matiere_active_normes;
    // viscosite_normes;
    hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.madar_lave_vitre.ph_normes;
    this.matiere_active_normes=data.madar_lave_vitre.matiere_active_normes;
    // this.viscosite_normes=data.renzo_madar.viscosite_normes;
    this.densite_normes=data.madar_lave_vitre.densite_normes;
    this.hasColor=data.madar_lave_vitre.codor_normes.hasColor;
  }
    /*

    lave_vitre:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      alcanite:{min:'',max:''},
      matiere_active:{min:'',max:''},
    }

*/
Ph(resultat, normes) {
  return this.response(resultat,normes);
}

Densite(resultats, normes) {
  return this.response(resultats,normes);
}

Matiere_active(resultats, normes) {
  return this.response(resultats,normes);
}

Results(client_entries,isConforme){
  /* ==========  CLIENT ENTRIES  ===================
  viscosite et densite doivent etre isolés chacun sur sa page
  ================================================ */

  const {ph,densite,matiere_active}=client_entries;
  const {isColorConforme,isOdorConforme}=isConforme;

  return     {
        identification: {
          /* caracteristiques physiques*/
            // constants
              categorie:'cosmetique',
              forme: "Liquide",
              nom: "Lave vitre Madar",
            // à controler
              couleur:this.codor(this.hasColor,isColorConforme,Colors.Bleu),
              parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
        },
        grandeurs: {
          ph:this.Ph(ph, this.ph_normes),
          densite:this.Densite(densite, this.densite_normes),
          matiere_active:this.Matiere_active(matiere_active,this.matiere_active_normes)
        },
      }
}

}
export class Lave_Vitre_noura extends ProductStrategy {
  // grandeurs analysées only
  // ph_normes=liquidProducts.noura_lave_vitre.ph_normes;
  // matiere_active_normes=liquidProducts.noura_lave_vitre.matiere_active_normes;
  // densite_normes=liquidProducts.noura_lave_vitre.densite_normes;
  // hasColor=liquidProducts.noura_lave_vitre.codor_normes.hasColor;

  ph_normes;matiere_active_normes;
  // viscosite_normes;
  hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.noura_lave_vitre.ph_normes;
    this.matiere_active_normes=data.noura_lave_vitre.matiere_active_normes;
    // this.viscosite_normes=data.renzo_madar.viscosite_normes;
    this.densite_normes=data.noura_lave_vitre.densite_normes;
    this.hasColor=data.noura_lave_vitre.codor_normes.hasColor;
  }
  /*

  lave_vitre:{
    codor:{color:true,parfum:''},
    ph:{min:'',max:''},
    alcanite:{min:'',max:''},
    matiere_active:{min:'',max:''},
  }

*/
Ph(resultat, normes) {
return this.response(resultat,normes);
}

Densite(resultats, normes) {
return this.response(resultats,normes);
}

Matiere_active(resultats, normes) {
return this.response(resultats,normes);
}

Results(client_entries,isConforme){
/* ==========  CLIENT ENTRIES  ===================
viscosite et densite doivent etre isolés chacun sur sa page
================================================ */

const {ph,densite,matiere_active}=client_entries;
const {isColorConforme,isOdorConforme}=isConforme;

return     {
      identification: {
        /* caracteristiques physiques*/
          // constants
            categorie:'cosmetique',
            forme: "Liquide",
            nom: "Lave vitre Noura",
          // à controler
            couleur:this.codor(this.hasColor,isColorConforme,Colors.Bleu),
            parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
      },
      grandeurs: {
        ph:this.Ph(ph, this.ph_normes),
        densite:this.Densite(densite, this.densite_normes),
        matiere_active:this.Matiere_active(matiere_active,this.matiere_active_normes)
      },
    }
}

}
export class Get_tol extends ProductStrategy {
  // grandeurs analysées only
  // ph_normes=liquidProducts.noura_lave_vitre.ph_normes;
  // matiere_active_normes=liquidProducts.noura_lave_vitre.matiere_active_normes;
  // densite_normes=liquidProducts.noura_lave_vitre.densite_normes;
  // hasColor=liquidProducts.noura_lave_vitre.codor_normes.hasColor;

  ph_normes;matiere_active_normes;
  // viscosite_normes;
  hasColor;densite_normes;
  constructor(data){
    super();
    this.ph_normes=data.get_tol.ph_normes;
    // this.matiere_active_normes=data.get_tol.matiere_active_normes;
    // // this.viscosite_normes=data.renzo_madar.viscosite_normes;
    // this.densite_normes=data.get_tol.densite_normes;
    this.hasColor=data.get_tol.codor_normes.hasColor;
  }
  /*

  lave_vitre:{
    codor:{color:true,parfum:''},
    ph:{min:'',max:''},
    alcanite:{min:'',max:''},
    matiere_active:{min:'',max:''},
  }

*/
Ph(resultat, normes) {
return this.response(resultat,normes);
}

// Densite(resultats, normes) {
// return this.response(resultats,normes);
// }

// Matiere_active(resultats, normes) {
// return this.response(resultats,normes);
// }

Results(client_entries,isConforme){
/* ==========  CLIENT ENTRIES  ===================
viscosite et densite doivent etre isolés chacun sur sa page
================================================ */

const {ph,densite,matiere_active}=client_entries;
const {isColorConforme,isOdorConforme}=isConforme;

return     {
      identification: {
        /* caracteristiques physiques*/
          // constants
            categorie:'cosmetique',
            forme: "Liquide",
            nom: "Get tol",
          // à controler
            couleur:this.codor(this.hasColor,isColorConforme,Colors.Gettol),
            parfum:this.codor(this.hasColor,isOdorConforme,undefined)
      },
      grandeurs: {
        ph:this.Ph(ph, this.ph_normes),
        // densite:this.Densite(densite, this.densite_normes),
        // matiere_active:this.Matiere_active(matiere_active,this.matiere_active_normes)
      },
    }
}

}
export class Dentifrice extends ProductStrategy {
     //  // grandeurs analysées only
    //  ph_normes=liquidProducts.dentifrice.ph_normes;
    //  viscosite_normes=liquidProducts.dentifrice.viscosite_normes;
    //  densite_normes=liquidProducts.dentifrice.densite_normes;
    //  hasColor=liquidProducts.dentifrice.codor_normes.hasColor;

     ph_normes;densite_normes;
    //  matiere_active_normes;
     viscosite_normes;hasColor;
  constructor(data){
    super();
    this.ph_normes=data.dentifrice.ph_normes;
    // this.matiere_active_normes=data.renzo_madar.matiere_active_normes;
    this.viscosite_normes=data.dentifrice.viscosite_normes;
    this.densite_normes=data.dentifrice.densite_normes;
    this.hasColor=data.dentifrice.codor_normes.hasColor;
  }

    /*

    dentifrice:{
      codor:{color:true,parfum:''},
      ph:{min:'',max:''},
      viscosite:{min:'',max:''},
      densite:{min:'',max:''},
    }

*/
      Ph(resultat, normes) {
        return this.response(resultat,normes);
      }

      Densite(resultats, normes) {
        return this.response(resultats,normes);
      }
    
      Viscosite(resultat, normes) {
        return this.response(resultat,normes);
      }

      Matiere_active(resultat, normes) {
        return this.response(resultat,normes);
      }

      Results(client_entries,isConforme){
        /* ==========  CLIENT ENTRIES  ===================
        viscosite et densite doivent etre isolés chacun sur sa page
        ================================================ */

        const {ph,densite,viscosite,matiere_active}=client_entries;
        const {isColorConforme,isOdorConforme}=isConforme;

        return     {
              identification: {
                /* caracteristiques physiques*/
                  // constants
                    categorie:'dentifrice',
                    forme: "Liquide",
                    nom: "Renzo Platinium",
                  // à controler
                    couleur:this.codor(this.hasColor,isColorConforme,Colors.Platinium),
                    parfum:this.codor(this.hasColor,isOdorConforme,'Citron')
              },
              grandeurs: {
                ph:this.Ph(ph, this.ph_normes),
                viscosite:this.Viscosite(viscosite, this.viscosite_normes),
                matiere_active:this.Matiere_active(matiere_active, this.matiere_active_normes),
                densite:this.Densite(densite, this.densite_normes)

              },
            }
      }
     // autres grandeurs sont gerées dans AnalyseProducts.js (mère) comme noneStrategies
}
