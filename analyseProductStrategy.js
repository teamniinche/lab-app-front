// AnalysePhysiqueStrategy.js
const AnalyseStrategy = require("./analyseStrategy");

class AnalysePhysiqueStrategy extends AnalyseStrategy {
  valider(resultat, normes) {
    const { min, max } = normes;
    return resultat >= min && resultat <= max;
  }

  apprecier(resultat, normes) {
    if (this.valider(resultat, normes)) {
      return "Résultat conforme aux normes physiques.";
    }
    return "Résultat hors normes physiques.";
  }
}

module.exports = AnalysePhysiqueStrategy;
