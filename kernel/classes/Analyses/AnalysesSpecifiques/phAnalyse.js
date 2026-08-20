// Stratégies Concrètes pour Chaque Grandeur
// PhStrategy.js 
const AnalyseStrategy = require("./analyseStrategy");

class PhStrategy extends AnalyseStrategy {
  // valider() et apprecier sont a la place des grandeurStrategies qui entrent lors de l'initialisation et remplaçables à la volée par un setSpecificAnalyse()
  valider(resultat, normes) { //utilisation interne only
    const { min, max } = normes;
    return resultat >= min && resultat <= max;
  }

  Analyse(resultat, normes) {
    if (this.valider(resultat, normes)) {
      return {resultat:resultat,normes:normes,validation:true};
    }
    return {resultat:resultat,normes:normes,validation:false};
  }
}

module.exports = PhStrategy;
