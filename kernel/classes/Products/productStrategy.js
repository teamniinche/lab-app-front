// productStrategy.js
// import Colors from "../../assets/colors"
import { dbBaseRoot } from "../../../assets/constantes";
class productStrategy {

    isOk(resultat, normes) {
      const { min, max } = normes;
      return resultat >= min && resultat <= max;
    }
    response(resultat,normes){
        if (this.isOk(resultat, normes)) {
          return {resultat:resultat,normes:normes,validation:true};
        }
        return {resultat:resultat,normes:normes,validation:false};
    }

    codor(b,resultat,codor){
      const result=resultat?resultat:false;
      const cdr=codor?codor:'';
      if(b){ 
        if(result){return {conforme:'OUI',codor:cdr}
        }else{return {conforme:'NON',codor:cdr}};
      }else{return {conforme:'none',codor:'N/A'};}
    }
    Results(resultat,bool){
      throw new Error("Méthode 'valider' doit être implémentée");
  }
//========================  GRANDEURS CHIMIQUES  ======================
    Densite(resultat, normes) {
      throw new Error("Méthode 'valider' doit être implémentée");
    }
  
    Fluore(resultat, normes) {
      throw new Error("Méthode 'apprecier' doit être implémentée");
    }
    valider(resultat, normes) {
        throw new Error("Méthode 'valider' doit être implémentée");
      }
    
      Germes_microbiologiques(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      Azurant_optique(resultat, normes) {
        throw new Error("Méthode 'valider' doit être implémentée");
      }
    
      Matiere_active(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      Alcanite(resultat, normes) {
        throw new Error("Méthode 'valider' doit être implémentée");
      }
    
      Permanganate(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      Mousse_ml(resultat, normes) {
        throw new Error("Méthode 'valider' doit être implémentée");
      }
    
      Densite(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      Compression(resultat, normes) {
        throw new Error("Méthode 'valider' doit être implémentée");
      }
    
      Pourcentage_caustic(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      Ph(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      Viscosite(resultat, normes) {
        throw new Error("Méthode 'validerVisco' doit être implémentée");
      }
    
      Chlore_libre(resultat, normes) {
        throw new Error("Méthode 'apprecier' doit être implémentée");
      }
      

//========================  GRANDEUS PHYSIQUES  ======================
        Color(resultat, normes) {
            throw new Error("Méthode 'valider' doit être implémentée");
        }

        Odor(resultat, normes) {
            throw new Error("Méthode 'apprecier' doit être implémentée");
        }

  }
  
 export default productStrategy;
  