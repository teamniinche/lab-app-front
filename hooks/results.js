import {
  Caustic,
  Renzo_madar,
  Renzo_platinium,
  Renzo_premium,
  Renzo_noura,
  Noura_platinium,
  Noura_premium,
  Noura_2_citron,
  Get_citron,
  Get_platinium,
  Get_premium,
  Lave_Bois,
  Lave_Vitre_madar,
  Lave_Vitre_noura,
  Get_tol
} from '../kernel/classes/Products/analyseProducts';
import ProductStrategyContext from '../kernel/classes/Products/ProductStrategyContext';
import { dbBaseRoot } from '../assets/constantes';
// '../assets/classes/Products/ProductStrategyContext'
  
  // const CausticAnalyse=new Caustic();

  // export default results=(()=>{
  //       fetch(dbBaseRoot+"normes/get-normes", {
  //                   method: "GET",
  //                   headers: { 'Content-Type': 'application/json' }
  //               })
  //               .then(response=>response.json())
  //               .then(dt=>{
  //                 const data=dt.data.data;

  //   //                 dispatch(setNormes(dt.data.data));
  //   //                 alert(JSON.stringify(dt.data.data));
  //   //             })
  //   //             .catch(function(error){
  //   //                 alert(error.message)
  //   //             })
  //   // }
  // const renzo_madar= new ProductStrategyContext(new Renzo_madar(data));
  // const renzo_platinium= new ProductStrategyContext(new Renzo_platinium());
  // const renzo_premium= new ProductStrategyContext(new Renzo_premium());
  // const renzo_noura= new ProductStrategyContext(new Renzo_noura());
  // const get_citron= new ProductStrategyContext(new Get_citron());
  // const get_platinium= new ProductStrategyContext(new Get_platinium());
  // const lave_bois= new ProductStrategyContext(new Lave_Bois());
  // const lave_vitre_madar= new ProductStrategyContext(new Lave_Vitre_madar());
  // const lave_vitre_noura= new ProductStrategyContext(new Lave_Vitre_noura());


  // const resultsOfMadar=renzo_madar.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,viscosite:430,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfPlatinium=renzo_platinium.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,viscosite:430,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfPremium=renzo_premium.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,viscosite:430,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfGetCitron=get_citron.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,viscosite:430,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfGetPlatinium=get_platinium.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,viscosite:430,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfNoura=renzo_noura.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,viscosite:430,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfLVMadar=lave_vitre_madar.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfLVNoura=lave_vitre_noura.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500,matiere_active:16.01},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  // const resultsOfLaveBois=lave_bois.Results(
  //   // --------Client entries---------------------
  //   {ph:7,densite:500},
  //   {isColorConforme:true,isOdorConforme:true}
  //   // --------------------------------------------
  // );
  

  // return {
  //   madar:resultsOfMadar,
  //   platinium:resultsOfPlatinium,
  //   premium:resultsOfPremium,
  //   get_citron:resultsOfGetCitron,
  //   get_platinium:resultsOfGetPlatinium,
  //   noura:resultsOfNoura,
  //   lave_bois:resultsOfLaveBois,
  //   lave_vitre_madar:resultsOfLVMadar,
  //   lave_vitre_noura:resultsOfLVNoura
  // }
  //                })})()

// ================================================================================
                export default async function getResults() {
                  try {
                      const response =await fetch(dbBaseRoot + "normes/get-normes", {
                      method: "GET",
                      headers: { 'Content-Type': 'application/json' }
                    });
                    const dt =await response.json();
                    const data = dt.data.data;
                    const renzo_madar = new ProductStrategyContext(new Renzo_madar(data));
                    const renzo_platinium = new ProductStrategyContext(new Renzo_platinium(data));
                    const renzo_premium = new ProductStrategyContext(new Renzo_premium(data));
                    const renzo_noura = new ProductStrategyContext(new Renzo_noura(data));
                    const noura_2_citron = new ProductStrategyContext(new Noura_2_citron(data));
                    const noura_platinium = new ProductStrategyContext(new Noura_platinium(data));
                    const noura_premium = new ProductStrategyContext(new Noura_premium(data));
                    const get_citron = new ProductStrategyContext(new Get_citron(data));
                    const get_platinium = new ProductStrategyContext(new Get_platinium(data));
                    const get_premium = new ProductStrategyContext(new Get_premium(data));
                    const lave_bois = new ProductStrategyContext(new Lave_Bois(data));
                    const lave_vitre_madar = new ProductStrategyContext(new Lave_Vitre_madar(data));
                    const lave_vitre_noura = new ProductStrategyContext(new Lave_Vitre_noura(data));
                    const get_tol = new ProductStrategyContext(new Get_tol(data));
                
                    return {
                      madar: renzo_madar.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      platinium: renzo_platinium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      premium: renzo_premium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      get_citron: get_citron.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      get_platinium: get_platinium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      get_premium: get_premium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      noura: renzo_noura.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      noura_2_citron: noura_2_citron.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      noura_platinium: noura_platinium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      noura_premium: noura_premium.Results({ ph: 7, densite: 500, viscosite: 430, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      lave_bois: lave_bois.Results({ ph: 7, densite: 500 }, { isColorConforme: true, isOdorConforme: true }),
                      lave_vitre_madar: lave_vitre_madar.Results({ ph: 7, densite: 500, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      lave_vitre_noura: lave_vitre_noura.Results({ ph: 7, densite: 500, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true }),
                      get_tol: get_tol.Results({ ph: 7, densite: 500, matiere_active: 16.01 }, { isColorConforme: true, isOdorConforme: true })
                    };
                  } catch (error) {
                    alert("Erreur lors de la récupération des résultats : "+error.message);
                    return null;
                  }
                }
                