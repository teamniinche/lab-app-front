import Colors from "./assets/colors";
  // import { dentifricesResults } from "../assets/dentifrices/dentifricesResults";
// import {dentifricesResults} from "./kernel/dentifrices/dentifricesResults";
import dentifricesResults from "./kernel/dentifrices/dentifricesResults";
import { imagesMadar,imagesMatiz,imagesNoura,imagesNouraNet,imagesSm } from "./kernel/cosmetiques/cosmetiquesResults";
import { dbBaseRoot } from "./assets/constantes";
  // const Colors=require("./assets/colors");
  // const dentifricesResults=require("./assets/dentifrices/dentifricesResults");


const analyses = [
    // retour de AnalyseStrategy() apres productAnalyse() et grandeurAnalyse() passées
    {
      identifiant: {
        /* caracteristiques physiques*/
          //// constants
            forme: "Liquide",
            nom: "Produit A",
          // à controler
            couleur: {color:Colors.Bleu,validation:false},
            parfum: {odor:"Lavande",validation:false}
      },
      grandeurs: {
        /* caracteristiques chimiques*/
        Ph: { resultat: 7.2, normes: { min: 6.5, max: 8.5 }, validation: true }, //new grandeurAnalyse() returner par grandeurAnalyse() ici phAnalyse()
        Densité: { resultat: 1.03, normes: { min: 0.95, max: 1.05 }, validation: true },// returner par grandeurAnalyse() ici densitéAnalyse()
        "% Caustic": { resultat: null, normes: null, validation: false },// returner par grandeurAnalyse() ici prctageAnalyse()
        Viscosité: { resultat: null, normes: null, validation: false },
        Alcalinité: { resultat: null, normes: null, validation: false },
      },
    }
  ];
export const headersTour=["nChar","name","D.Av","D.Ap"];
export const limit=10;
export const routesAndHeaders={
    full:{
      api_url:`${dbBaseRoot}analyses`,
      headers:[
        "Heure",
        "machine",
        "name",
        "reservoir",
        "ph",
        // "color",
        // "parfum",
        "matiere_active",
        "viscosite",
        "densite",
        // "caustique",
        // "silicate",
        // "durete",
        // "tds",
        "observations",
        "Chimiste",
        "Actions"
    ],
    },
    multiusages:{
      // ["id","machine","name","reservoir","ph","color","parfum",
      //   "matiere_active","viscosite","observations","updatedAt","createdAt"]
      api_url:`${dbBaseRoot}analyses/multiusages`,
      headers:[
        "Heure",
        "machine",
        "name",
        "reservoir",
        "ph",
        // "color",
        // "parfum",
        "matiere_active",
        "viscosite",
        "observations",
        "Chimiste",
        "Actions"
    ],
    products:['Renzo Madar','Renzo Premium','Renzo Platinium','Renzo Noura','Get Citron','Get Platinium']
  },
  cosmetiques:{
    // ["id","machine","name","reservoir","ph","color","parfum","alcool","sapo","emuls",
    //   "matiere_active","viscosite","observations","updatedAt","createdAt"]
      api_url:`${dbBaseRoot}analyses/cosmetiques?limit=${limit}`,
      headers:[
        "Heure",
        "machine",
        "name",
        "reservoir",
        "ph",
        // "color",
        // "parfum",
        "alcool",
        "sapo",
        "emuls",
        "matiere_active",
        "viscosite",
        "observations",
        "Chimiste",
        "Actions"
    ],
  },
  pates:{
    // ["id","name","ph","viscosite","densite","caustique","observations","updatedAt","createdAt"]
      api_url:`${dbBaseRoot}analyses/pates?limit=${limit}`,
      headers:[
        "Heure",
        "name",
        "ph",
        "viscosite",
        "densite",
        // "caustique",
        "observations",
        "Chimiste",
        "Actions"
    ],
  },
  eaux:{
    // ["id","name","durete","tds","observations","updatedAt","createdAt"],
      api_url:`${dbBaseRoot}analyses/eaux?limit=${limit}`,
      headers:[
        "Heure",
        "name",
        "durete",
        "tds",
        "observations",
        "Chimiste",
        "Actions"
    ],
  },
  causilicate:{
    // ["id","heure","name","masse","volume","caustique","ratio",
    //   "silicate","observations","updatedAt","createdAt"]
      api_url:`${dbBaseRoot}analyses/causilicate?limit=${limit}`,
      headers:[
        "Heure",
        "heure",
        "name",
        "masse",
        "volume",
        "caustique",
        "silicate",
        "ratio",
        "observations",
        "Chimiste",
        "Actions"
    ],
}
}
// const defaultLansa=[{"name":"Local 2 sacs","couleur":"white","taches":"blue-red","densite":null,"gg":"1","humidite":"1","matiere_active":"17","alcanite":"10","silicate":"18","sel":"9"}];

export const routesAndHeadersPowder={
    full:{
      api_url:`${dbBaseRoot}powerAnalyses`,
      headers:["N° Ch.","name","gg","humidite","matiere_active","alcanite","silicate","sel"]//"couleur","taches",
    }}

// from  results  color(inclu dans results) urlImage
export default dentifricesObject=async ()=>{
const {mera_blanc,mera_bleu,mera_rouge,mera_noir}=await dentifricesResults();

return {
  blanc:{
    from:'D-blanche',
    results:mera_blanc,
    image:'d-mera-blanc.png',
  },
  noir:{
    from:'D-noire',
    results:mera_noir,
    image:'d-mera-noir.png',
  },
  bleu:{
    from:'D-bleue',
    results:mera_bleu,
    image:'d-mera-bleu.png',
  },
  rouge:{
    from:'D-rouge',
    results:mera_rouge,
    image:'d-mera-rouge.png',
  }
}
}

export const productsImages={
  renzo_madar:require('./assets/images/renzo-citron.png'),
  renzo_premium:require('./assets/images/renzo-premium.png'),
  renzo_platinium:require('./assets/images/renzo-platinium.png'),
  renzo_noura:require('./assets/images/renzo-noura.png'),
  get_citron:require('./assets/images/get-citron.png'),
  get_platinium:require('./assets/images/get-platinium.png'),
  lave_vitre_noura:require('./assets/images/noura-lave-vitre.png'),
  lave_vitre_madar:require('./assets/images/madar-lave-vitre.png'),
  ...imagesMadar,
  ...imagesMatiz,
  ...imagesNoura,
  ...imagesNouraNet,
  ...imagesSm
}
export const newLansa={new:{
                        name:"",
                        couleur:"",
                        taches:"",
                        max_gg:0,
                        densite:{min:0,max:0},
                        max_humidite:0,
                        matiere_active:{min:0,max:0},
                        alcanite:{min:0,max:0},
                        silicate:{min:0,max:0},
                        sel:{min:0,max:0},
                      }
                    };
function isNumeric(valeur) {return !isNaN(parseFloat(valeur)) && isFinite(valeur);}
export function paramsAreValid(lansa){
  const {name,nom,max_gg,max_humidite,densite,matiere_active,alcanite,silicate,sel}=lansa;
  if(
    name?.length>=3 && (nom===undefined || nom.length>=3) && isNumeric(max_gg.normes) && isNumeric(max_humidite.normes) &&
    isNumeric(densite.normes.min) && isNumeric(densite.normes.max) &&
    isNumeric(matiere_active.normes.min) && isNumeric(matiere_active.normes.max) &&
    isNumeric(alcanite.normes.min) && isNumeric(alcanite.normes.max) &&
    isNumeric(silicate.normes.min) && isNumeric(silicate.normes.max) &&
    isNumeric(sel.normes.min) && isNumeric(sel.normes.max)
  ){
    return true;
  }else{return false;}
}
export const Lansas={
                      local_1:{
                        name:'Local 1',
                        couleur:"white",
                        taches:"red",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:270,max:320},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:22.4,max:24.4},required:true},
                        alcanite:{normes:{min:10.20,max:12.20},required:true},
                        silicate:{normes:{min:15.8,max:17.8},required:false},
                        sel:{normes:{min:8,max:9},required:false},
                      },
                      local_2_sacs:{
                        name:'Local 2 sacs',
                        couleur:"white",
                        taches:"blue-red",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:230,max:360},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:17,max:19},required:true},
                        alcanite:{normes:{min:9,max:11},required:true},
                        silicate:{normes:{min:16,max:18},required:false},
                        sel:{normes:{min:8,max:9},required:false},
                      },
                      local_2_machine:{name:'Local 2 machine',
                        couleur:"white",
                        taches:"blue-red",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:280,max:300},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:17,max:19},required:true},
                        alcanite:{normes:{min:9,max:11},required:true},
                        silicate:{normes:{min:16,max:18},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      extra_1_sans_sel:{name:'Extra 1 sans sel',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:230,max:260},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:14.5,max:16.5},required:true},
                        alcanite:{normes:{min:8.8,max:10.8},required:true},
                        silicate:{normes:{min:19,max:21},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      extra_1_avec_sel:{name:'Extra 1 avec sel',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:230,max:260},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:14.5,max:16.5},required:true},
                        alcanite:{normes:{min:9,max:11},required:true},
                        silicate:{normes:{min:16,max:18},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      extra_1_sans_sel_export:{name:'Extra 1 sans sel export',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:280,max:300},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:14.5,max:16.5},required:true},
                        alcanite:{normes:{min:8.8,max:10.8},required:true},
                        silicate:{normes:{min:19,max:21},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      extra_1_avec_sel_export:{name:'Extra 1 avec sel export',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:280,max:300},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:14.5,max:16.5},required:true},
                        alcanite:{normes:{min:9,max:11},required:true},
                        silicate:{normes:{min:16,max:18},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      platinium_local:{name:'Platinium Local',
                        couleur:"white",
                        taches:null,
                        max_gg:{normes:1,required:true},
                        densite:{normes:{min:260,max:320},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:19,max:21},required:true},
                        alcanite:{normes:{min:9.5,max:11.5},required:true},
                        silicate:{normes:{min:17,max:19},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      get_1:{name:'Get 1',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:230,max:270},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:12.9,max:14.9},required:true},
                        alcanite:{normes:{min:10.1,max:12.1},required:true},
                        silicate:{normes:{min:15,max:17},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      get_1_export:{name:'Get 1 export',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:280,max:300},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:12.9,max:14.9},required:true},
                        alcanite:{normes:{min:10.1,max:12.1},required:true},
                        silicate:{normes:{min:15,max:17},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      get_2:{name:'Get 2',
                        couleur:"white",
                        taches:"red",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:230,max:260},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:12.2,max:14.2},required:true},
                        alcanite:{normes:{min:8,max:10},required:true},
                        silicate:{normes:{min:13,max:15},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      auto:{name:'Auto',
                        couleur:"white",
                        taches:null,
                        max_gg:{normes:null,required:false},
                        densite:{normes:{min:300,max:350},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:10,max:12},required:true},
                        alcanite:{normes:{min:10,max:12},required:true},
                        silicate:{normes:{min:11.8,max:13.8},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      lansa_40:{name:'Lansa 40',
                        couleur:"white",
                        taches:null,
                        max_gg:{normes:null,required:false},
                        densite:{normes:{min:250,max:320},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:38.2,max:40.2},required:true},
                        alcanite:{normes:{min:4.5,max:6.5},required:true},
                        silicate:{normes:{min:11,max:13},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      diam:{name:'Diam',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:230,max:260},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:11.2,max:13.2},required:true},
                        alcanite:{normes:{min:8.7,max:10.7},required:true},
                        silicate:{normes:{min:15,max:17},required:false},
                        sel:{normes:{min:8,max:9},required:false},},
                      diam_export:{name:'Diam export',
                        couleur:"white",
                        taches:"blue",
                        max_gg:{normes:3,required:true},
                        densite:{normes:{min:280,max:300},required:true},
                        max_humidite:{normes:3,required:true},
                        matiere_active:{normes:{min:11.2,max:13.2},required:true},
                        alcanite:{normes:{min:8.7,max:10.7},required:true},
                        silicate:{normes:{min:15,max:17},required:false},
                        sel:{normes:{min:8,max:9},required:false},}
                    };

export const Formats=["2.5g","15g","25g","60g","80g","150g","160g","400g","800g","850g","900g","3kg","5kg","10kg","11kg"];
export const FormatsJavel=["4.5L","900mL","750mL","250mL","25mL","special"];
export const typesJavel={
  madar_local:{
    name:"Madar local",
    quantite:{required:true,normes:{min:1000,max:5000}},
    Vthio:{required:true,normes:{min:7.15,max:7.55}},
    Chl:{required:true,normes:{min:8,max:8.40}},
    eau:{required:false,normes:{min:10,max:1200}}
  },
  madar_platinium:{
    name:"Madar platinium",
    quantite:{required:true,normes:{min:1000,max:5000}},
    Vthio:{required:true,normes:{min:6.87,max:7.30}},
    Chl:{required:true,normes:{min:7.7,max:8.18}},
    eau:{required:false,normes:{min:10,max:1200}}
  },
  noura_local:{
    name:"Noura local",
    quantite:{required:true,normes:{min:1000,max:5000}},
    Vthio:{required:true,normes:{min:5.56,max:5.71}},
    Chl:{required:true,normes:{min:6,max:6.40}},
    eau:{required:false,normes:{min:10,max:1200}}
  },
  noura_export:{
    name:"Noura export",
    quantite:{required:true,normes:{min:1000,max:5000}},
    Vthio:{required:true,normes:{min:3.58,max:3.92}},
    Chl:{required:true,normes:{min:4,max:4.40}},
    eau:{required:false,normes:{min:10,max:1200}}
  }
};
// (this.VolumeThio!==null && this.ConcentrationThio!==null)?(this.VolumeThio*this.ConcentrationThio).toFixed(2):null
export const Parfums=["Top66","Top55","brillant","Floral","Citron","Platinium","Prime shine","Amour","Lavande","Oxygene","Metal","Super star"];

const urlPoudreGif="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDM5MW5yYnZlcGE0Mm80YjlncTR5cG41cG5rNWhua2N2enBudXk2YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SnwifA7bOFDhe/giphy.gif";

export const defaultFormules=[{"name":"Local 2 sacs","couleur":"white","taches":"blue-red","max_gg":{"normes":3,"required":true},"densite":{"normes":{"min":230,"max":360},"required":true},"max_humidite":{"normes":3,"required":true},"matiere_active":{"normes":{"min":17,"max":19},"required":true},"alcanite":{"normes":{"min":9,"max":11},"required":true},"silicate":{"normes":{"min":16,"max":18},"required":true},"sel":{"normes":{"min":8,"max":9},"required":true},"parfum":"Top55","format":["5kg","10kg","11kg"],"compression":false,"percarbonate":false,"mousses":false},{"name":"Extra 1 avec sel export","couleur":"white","taches":"blue","max_gg":{"normes":3,"required":true},"densite":{"normes":{"min":280,"max":300},"required":true},"max_humidite":{"normes":3,"required":true},"matiere_active":{"normes":{"min":14.5,"max":16.5},"required":true},"alcanite":{"normes":{"min":9,"max":11},"required":true},"silicate":{"normes":{"min":16,"max":18},"required":true},"sel":{"normes":{"min":8,"max":9},"required":true},"parfum":"Citron","format":["5kg","10kg","11kg"],"compression":false,"percarbonate":false,"mousses":false},{"name":"Extra 1 avec sel export","couleur":"white","taches":"blue","max_gg":{"normes":3,"required":true},"densite":{"normes":{"min":280,"max":300},"required":true},"max_humidite":{"normes":3,"required":true},"matiere_active":{"normes":{"min":14.5,"max":16.5},"required":true},"alcanite":{"normes":{"min":9,"max":11},"required":true},"silicate":{"normes":{"min":16,"max":18},"required":true},"sel":{"normes":{"min":8,"max":9},"required":true},"parfum":"brillant","format":["5kg","10kg"],"compression":{"min":0,"max":300},"percarbonate":false,"mousses":false},{"name":"Get 1","couleur":"white","taches":"blue","max_gg":{"normes":3,"required":true},"densite":{"normes":{"min":230,"max":270},"required":true},"max_humidite":{"normes":3,"required":true},"matiere_active":{"normes":{"min":12.9,"max":14.9},"required":true},"alcanite":{"normes":{"min":10.1,"max":12.1},"required":true},"silicate":{"normes":{"min":15,"max":17},"required":true},"sel":{"normes":{"min":8,"max":9},"required":true},"parfum":"Top66","format":["10kg"],"compression":{"min":0,"max":300},"percarbonate":false,"mousses":false},{"name":"Get 1","couleur":"white","taches":"blue","max_gg":{"normes":3,"required":true},"densite":{"normes":{"min":230,"max":270},"required":true},"max_humidite":{"normes":3,"required":true},"matiere_active":{"normes":{"min":12.9,"max":14.9},"required":true},"alcanite":{"normes":{"min":10.1,"max":12.1},"required":true},"silicate":{"normes":{"min":15,"max":17},"required":true},"sel":{"normes":{"min":8,"max":9},"required":true},"parfum":"Top66","format":["10kg","11kg"],"compression":{"min":0,"max":300},"percarbonate":false,"mousses":false},{"name":"Get 1 export","couleur":"white","taches":"blue","max_gg":{"normes":3,"required":true},"densite":{"normes":{"min":280,"max":300},"required":true},"max_humidite":{"normes":3,"required":true},"matiere_active":{"normes":{"min":12.9,"max":14.9},"required":true},"alcanite":{"normes":{"min":10.1,"max":12.1},"required":true},"silicate":{"normes":{"min":15,"max":17},"required":true},"sel":{"normes":{"min":8,"max":9},"required":true},"parfum":"Floral","format":["10kg"],"compression":{"min":0,"max":300},"percarbonate":false,"mousses":false}];
