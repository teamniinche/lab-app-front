// Stratégie pour les Grandeurs "NONE"
// NoneStrategy.js
import AnalyseStrategy from "./Analyses/analyseStrategy";

class NoneStrategy extends AnalyseStrategy {
  valider() {
    return new Error("N/A");
  }
}

export default NoneStrategy;
