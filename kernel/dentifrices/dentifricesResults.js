import DentifriceStrategyContext from './dentifriceStrategyContext';
import {dentifriceNoirResults,dentifriceBlancResults,dentifriceRougeResults,dentifriceBleuResults} from "./specifiquesDentifrices";
import { dbBaseRoot } from '../../assets/constantes';
// const blancDentifrice=new dentifriceBlancResults();
// const noirDentifrice=new dentifriceNoirResults();
// const bleuDentifrice=new dentifriceBleuResults();
// const rougeDentifrice=new dentifriceRougeResults();
// const blfrice=new DentifriceStrategyContext(blancDentifrice);
// const nofrice=new DentifriceStrategyContext(noirDentifrice);
// const blefrice=new DentifriceStrategyContext(bleuDentifrice);
// const roufrice=new DentifriceStrategyContext(rougeDentifrice);
// export const dentifricesResults={
//   blanc:blfrice.Dentifrice.Results('Mera blanc'),
//   noir:nofrice.Dentifrice.Results('Mera noir'),
//   bleu:blefrice.Dentifrice.Results('Mera bleu'),
//   rouge:roufrice.Dentifrice.Results('Mera rouge'),
// }

export default async function getMeraResults() {
                  try {
                    const response = await fetch(dbBaseRoot + "normes/get-normes", {
                      method: "GET",
                      headers: { 'Content-Type': 'application/json' }
                    });
                    const dt = await response.json();
                    const data = dt.data.data.dentifrice;
                    // alert(JSON.stringify(dentifrice))

                    const blancDentifrice=new dentifriceBlancResults(data);
                    const noirDentifrice=new dentifriceNoirResults(data);
                    const bleuDentifrice=new dentifriceBleuResults(data);
                    const rougeDentifrice=new dentifriceRougeResults(data);
                    const blfrice=new DentifriceStrategyContext(blancDentifrice);
                    const nofrice=new DentifriceStrategyContext(noirDentifrice);
                    const blefrice=new DentifriceStrategyContext(bleuDentifrice);
                    const roufrice=new DentifriceStrategyContext(rougeDentifrice);

                    // const renzo_madar = new ProductStrategyContext(new Renzo_madar(data));
                    // const renzo_platinium = new ProductStrategyContext(new Renzo_platinium(data));
                    // const renzo_premium = new ProductStrategyContext(new Renzo_premium(data));
                    // const renzo_noura = new ProductStrategyContext(new Renzo_noura(data));
                    // const get_citron = new ProductStrategyContext(new Get_citron(data));
                    // const get_platinium = new ProductStrategyContext(new Get_platinium(data));
                    // const lave_bois = new ProductStrategyContext(new Lave_Bois(data));
                    // const lave_vitre_madar = new ProductStrategyContext(new Lave_Vitre_madar(data));
                    // const lave_vitre_noura = new ProductStrategyContext(new Lave_Vitre_noura(data));
                    return {
                      // madar: renzo_madar.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // platinium: renzo_platinium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // premium: renzo_premium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // get_citron: get_citron.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // get_platinium: get_platinium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // noura: renzo_noura.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // lave_bois: lave_bois.Results({ ph: 7, densite: 500 }, { isColorConforme: true, isOdorConforme: true }),
                      // lave_vitre_madar: lave_vitre_madar.Results({ ph: 7, densite: 500, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      // lave_vitre_noura: lave_vitre_noura.Results({ ph: 7, densite: 500, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true })
                        mera_blanc:blfrice.Dentifrice.Results('Mera blanc'),
                        mera_noir:nofrice.Dentifrice.Results('Mera noir'),
                        mera_bleu:blefrice.Dentifrice.Results('Mera bleu'),
                        mera_rouge:roufrice.Dentifrice.Results('Mera rouge'),
                    };
                  } catch (error) {
                    alert("Erreur lors de la récupération des résultats :", error);
                    return null;
                  }
                }