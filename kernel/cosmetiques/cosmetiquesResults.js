import cosmetiquesContext from './cosmetiquesContext';
import { dbBaseRoot } from '../../assets/constantes';
import {lmMadarResults,lmNouraResults,superMoreResults,nouraNetResults,matizResults} from "./specifiquesCosmetiques";

export default async function cosmetiquesResults(){
      try {
        const response =await fetch(dbBaseRoot + "normes/get-normes", {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });
      const dt =await response.json();
      const data = dt.data.data;
      const {
            noura_net,
            lave_main_madar,
            lave_main_noura,
            matiz_savon_liquide,
            supermore
        }=data
      // const renzo_madar=data.renzo_madar;
// ======================  MADAR  ===============================
const {rouge,marron,blanc,orange,jaune}=lmMadarResults;
const madarRouge=new rouge(lave_main_madar);  const madarMarron=new marron(lave_main_madar);
const madarBlanc=new blanc(lave_main_madar);
const madarOrange=new orange(lave_main_madar);
const madarJaune=new jaune(lave_main_madar);
const Rouge=new cosmetiquesContext(madarRouge);
const Marron=new cosmetiquesContext(madarMarron);
const Blanc=new cosmetiquesContext(madarBlanc);
const Orange=new cosmetiquesContext(madarOrange);
const Jaune=new cosmetiquesContext(madarJaune);
// export 

              // // lm madar
              // rouge:'Fruit',
              // marron:'Vanille',
              // blanc:'Marseille',
              // orange:'Passion',
              // jaune:'Citron'
const co_madarResults={
        lm_madar_marseille:Blanc.Cosmetique.Results('Madar'),
        lm_madar_vanille:Marron.Cosmetique.Results('Madar'),
        lm_madar_passion:Orange.Cosmetique.Results('Madar'),
        lm_madar_citron:Jaune.Cosmetique.Results('Madar'),
        lm_madar_fruit:Jaune.Cosmetique.Results('Madar'),
      };

      // ======================  NOURA  ===============================
      const {rose,violet,vert,nrBlanc}=lmNouraResults;
      const nouraRose=new rose(lave_main_noura);
      const nouraBlanc=new nrBlanc(lave_main_noura);
const nouraVert=new vert(lave_main_noura);
const nouraViolet=new violet(lave_main_noura);
const Rose=new cosmetiquesContext(nouraRose);
const Violet=new cosmetiquesContext(nouraViolet);
const Vert=new cosmetiquesContext(nouraVert);
const NrBlanc=new cosmetiquesContext(nouraBlanc);
// export 
// jaune:'Citron',
// rose:'Rose',
// rouge:'Fraise',
// violet:'Lavander',
// vert:'Pomme',
// blanc:'Marseille'
const co_nouraResults={
  lm_noura_rose:Rose.Cosmetique.Results('Noura'),
  lm_noura_lavander:Violet.Cosmetique.Results('Noura'),
  lm_noura_pomme:Vert.Cosmetique.Results('Noura'),
  lm_noura_marseille:NrBlanc.Cosmetique.Results('Noura')
}

// ======================  NOURA NET  ===============================
const {nRose,nViolet,nVert,flamboise,nJaune}=nouraNetResults;
const netRose=new nRose(noura_net);
const netViolet=new nViolet(noura_net);
const netVert=new nVert(noura_net);
const netFlamboise=new flamboise(noura_net);
const netJaune=new nJaune(noura_net);
const nnRose=new cosmetiquesContext(netRose);
const nnViolet=new cosmetiquesContext(netViolet);
const nnVert=new cosmetiquesContext(netVert);
const nnFlamboise=new cosmetiquesContext(netFlamboise);
const nnJaune=new cosmetiquesContext(netJaune);
// export 
              // // lm nouraNet
              // jaune:'Citron',
              // rose:'Rose',
              // rouge:'Fraise',
              // violet:'Lavander',
              // vert:'Pomme',
              // blanc:'Marseille'
const co_nouraNetResults={
  noura_net_rose:nnRose.Cosmetique.Results('Noura Net'),
  noura_net_lavander:nnViolet.Cosmetique.Results('Noura Net'),
  noura_net_pomme:nnVert.Cosmetique.Results('Noura Net'),
  noura_net_citron:nnJaune.Cosmetique.Results('Noura Net'),
  noura_net_flamboise:nnFlamboise.Cosmetique.Results('Noura Net')
}

// / ======================  SUPER MORE  ===============================
const {infini,presioso,tropical,colombien}=superMoreResults;
const Infini=new infini(supermore);
const Presioso=new presioso(supermore);
const Tropical=new tropical(supermore);
const Colombien=new colombien(supermore);
const smInfini=new cosmetiquesContext(Infini);
const smPresioso=new cosmetiquesContext(Presioso);
const smTropical=new cosmetiquesContext(Tropical);
const smColombien=new cosmetiquesContext(Colombien);
// export 
// sm
// colombien:'Peche',
// presioso:'Pastheque',
// infini:'Cantaloup',
// tropical:'Ananas'
const sm_superMoreResults={
  super_more_cantaloup:smInfini.Cosmetique.Results('Super More'),
  super_more_pastheque:smPresioso.Cosmetique.Results('Super More'),
  super_more_ananas:smTropical.Cosmetique.Results('Super More'),
  super_more_peche:smColombien.Cosmetique.Results('Super More')
}

// / ======================  MATIZ LAVE MAINS  ===============================
const {mtzRose,mtzVert}=matizResults;
const matizRose=new mtzRose(matiz_savon_liquide);
const matizVert=new mtzVert(matiz_savon_liquide);
const matiz_rose=new cosmetiquesContext(matizRose);
const matiz_vert=new cosmetiquesContext(matizVert);
// export 
              // // matiz
              // rose:'Fraise',
              // vert:'Pomme'
const matiz_lmResults={
  matiz_fraise:matiz_rose.Cosmetique.Results('Matiz'),
  matiz_pomme:matiz_vert.Cosmetique.Results('Matiz')
}

return {
  co_madarResults,
  co_nouraResults,
  co_nouraNetResults,
  sm_superMoreResults,
  matiz_lmResults
}
} catch (error) {
  alert("Erreur lors de la récupération des résultats : "+error.message);
  return null;
}
    };

// export const {
//   co_madarResults,
//   co_nouraResults,
//   co_nouraNetResults,
//   sm_superMoreResults,
//   matiz_lmResults}=cosmetiquesResults;
const exemple={
            codor_normes:{hasColor:true,color:true,parfum:'Citron'},
            ph_normes:{min:7.6,max:8.2},
            matiere_active_normes:{min:15,max:16.5},
            viscosite_normes:{min:4000,max:8000},
            densite_normes:{min:1.025,max:1.03},
         }
export const defaultCosmetiquesResults={
  co_madarResults:{
    lm_madar_marseille:exemple,
    lm_madar_vanille:exemple,
    lm_madar_passion:exemple,
    lm_madar_citron:exemple,
    lm_madar_fruit:exemple
  },
  co_nouraResults:{
    lm_noura_rose:exemple,
    lm_noura_lavander:exemple,
    lm_noura_pomme:exemple,
    lm_noura_marseille:exemple
  },
  co_nouraNetResults:{
    noura_net_rose:exemple,
    noura_net_lavander:exemple,
    noura_net_pomme:exemple,
    noura_net_citron:exemple
  },
  sm_superMoreResults:{
    super_more_cantaloup:exemple,
    super_more_pastheque:exemple,
    super_more_ananas:exemple,
    super_more_peche:exemple
  },
  matiz_lmResults:{
    matiz_fraise:exemple,
    matiz_pomme:exemple
  },
}


export const imagesMadar={
  lm_madar_marseille:require('../../assets/images/cosmetiques/marseille.png'),
  lm_madar_vanille:require('../../assets/images/cosmetiques/vanille.png'),
  lm_madar_passion:require('../../assets/images/cosmetiques/gold.png'),
  lm_madar_citron:require('../../assets/images/cosmetiques/citron.png'),
  lm_madar_fruit:require('../../assets/images/cosmetiques/fruit-rouge.png'),
  mVert:require('../../assets/images/cosmetiques/pousse-mousse.png')
}
export const imagesNoura={
  lm_noura_rose:require('../../assets/images/cosmetiques/lave-mains-noura-citron.png'),
  lm_noura_lavander:require('../../assets/images/cosmetiques/lave-mains-noura-lavander.png'),
  lm_noura_pomme:require('../../assets/images/cosmetiques/lave-mains-noura-fraise.png'),
  lm_noura_marseille:require('../../assets/images/cosmetiques/lave-mains-noura-marseille.png'),
}
export const imagesNouraNet={
  noura_net_rose:require('../../assets/images/cosmetiques/noura-net-fruitRouge.png'),
  noura_net_lavander:require('../../assets/images/cosmetiques/noura-net-lavander.png'),
  noura_net_pomme:require('../../assets/images/cosmetiques/noura-net-citron.png'),
  noura_net_citron:require('../../assets/images/cosmetiques/noura-net-fleurs.png')

}
export const imagesSm={
  super_more_cantaloup:require('../../assets/images/cosmetiques/supermore-infini.png'),
  super_more_pastheque:require('../../assets/images/cosmetiques/supermore-presioso.png'),
  super_more_ananas:require('../../assets/images/cosmetiques/supermore-colombien.png'),
  super_more_peche:require('../../assets/images/cosmetiques/supermore-tropical.png')
}
export const imagesMatiz={
  matiz_fraise:require('../../assets/images/cosmetiques/matiz-rose-sauvage.png'),
  matiz_pomme:require('../../assets/images/cosmetiques/matiz-nature.png')
}
export const varianceImgs={...imagesMadar,...imagesNoura,...imagesNouraNet,...imagesMatiz,...imagesSm};