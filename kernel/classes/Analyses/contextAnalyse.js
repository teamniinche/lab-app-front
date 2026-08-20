// AnalyseContext.js
class AnalyseContext {

  /*=========================== productAnalyse ===================================================
            certaines données sont avant le .Analyse et d'autres encapsulées dans .Analyse
  ================================================================================================*/

    constructor(analyse /*=productAnalyse*/) { // S'initialise avec une strategie
      this.Analyse = analyse;
    }
  
    setStrategy(analyse/*=productAnalyse*/) { // pour pouvoir chAnger de strategie à tout moment = à la volée
      this.Analyse = analyse;
    }
  
    /* ============================== grAndeurAnalyse() ==================================================*/
    AnalyseResults(resultat, normes,bool){
    //   return this.Analyse.valider(resultat, normes);
      // try {
        return this.Analyse.Results(resultat, normes,bool);
      // } catch (error) {
      //   return error.message;
      // }
    }
  
  }
  
  module.exports = AnalyseContext;
  