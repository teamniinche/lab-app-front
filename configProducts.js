// ConfigProduits.js
const PhStrategy = require("./classes/phStrategy");
const DensiteStrategy = require("./DensiteStrategy");
const PourcentageCausticStrategy = require("./PourcentageCausticStrategy");
const NoneStrategy = require("./classes/noneStrategy");

module.exports = {
  "Produit A": {
    pH: new PhStrategy(),
    Densité: new DensiteStrategy(),
    "% Caustic": new NoneStrategy(), // Non applicable
    Viscosité: new NoneStrategy(),
    Alcalinité: new NoneStrategy(),
  },
  "Produit B": {
    pH: new NoneStrategy(),
    Densité: new DensiteStrategy(),
    "% Caustic": new PourcentageCausticStrategy(),
    Viscosité: new NoneStrategy(),
    Alcalinité: new NoneStrategy(),
  },
  "Produit C": {
    pH: new PhStrategy(),
    Densité: new NoneStrategy(),
    "% Caustic": new PourcentageCausticStrategy(),
    Viscosité: new NoneStrategy(),
    Alcalinité: new NoneStrategy(),
  },
  // "produit": new produitStrategy()
  // ainsi de suite pour chaque produit
};
