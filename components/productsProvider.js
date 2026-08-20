import {createContext,useState,useContext,useLayoutEffect} from 'react';
import { StyleSheet } from 'react-native';
import liquidProducts from '../assets/obsolete-liquidesNormes';
import getResults from '../hooks/results';
import cosmetiquesResults from '../kernel/cosmetiques/cosmetiquesResults';
import Colors from '../assets/colors';
import { Flex } from '../assets/functions';
import { defaultCosmetiquesResults } from '../kernel/cosmetiques/cosmetiquesResults';
import { imagesMadar,imagesNoura,imagesMatiz,imagesNouraNet,imagesSm} from '../kernel/cosmetiques/cosmetiquesResults';

const ProductsContext = createContext();
export const ProductsProvider=({children})=>{
    const [results,setResults]=useState(liquidProducts)// regle le probleme de async et l'autre cote sync tout ajout de produit sur prods en prod doit  etre reproduit sur liquidProducts
    const [splitResults,setSplitResults]=useState(defaultCosmetiquesResults)// regle le probleme de async et l'autre cote sync tout ajout de produit sur prods en prod doit  etre reproduit sur liquidProducts
    const [globalCosmetiquesResults,setGlobalCosmetiquesResults]=useState({});
    var {madar,platinium,premium,get_citron,get_platinium,get_premium,noura_2_citron,noura,noura_platinium,noura_premium,get_tol,lave_bois,lave_vitre_madar,lave_vitre_noura}=results;
    var { co_madarResults,co_nouraNetResults,co_nouraResults,sm_superMoreResults,matiz_lmResults }=splitResults;
   const reservoirsABC=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,18,20,21,22,23,24];
    const products=[
        {
            title:'Renzo Madar',
            results:madar,
            machines:['A','B','C','E'],
            reservoirs:[...reservoirsABC,40,41,42,43],
            color:Colors.Citron,
            variance:false,
            url:require('../assets/images/renzo-madar.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Madar'
    
        },
        {
            title:'Renzo Platinium',
            results:platinium,
            machines:['A','B','C','E'],
            reservoirs:[...reservoirsABC,40,41,42,43],
            color:Colors.Platinium,
            variance:false,
            url:require('../assets/images/renzo-platinium.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Platinium'
    
        },
        {
            title:'Renzo Premium',
            results:premium,
            machines:['E'],
            reservoirs:[40,41,42,43],
            color:Colors.Premium,
            variance:false,
            url:require('../assets/images/renzo-premium.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Premium'
    
        },
        {
            title:'Renzo Noura',
            results:noura,
            machines:['D','D1','D2'],
            reservoirs:[29,30,31,32,33,34,35,36,37,38,39],
            color:Colors.Citron,
            variance:false,
            url:require('../assets/images/renzo-noura.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Nra Citron'
    
        },
        {
            title:'Noura Platinium',
            results:noura_platinium,
            machines:['D','D1','D2'],
            reservoirs:[29,30,31,32,33,34,35,36,37,38,39],
            color:Colors.Platinium,
            variance:false,
            url:require('../assets/images/renzo-noura.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Nra Platinium'
    
        },
        {
            title:'Noura Premium',
            results:noura_premium,
            machines:['D','D1','D2'],
            reservoirs:[29,30,31,32,33,34,35,36,37,38,39],
            color:Colors.Premium,
            variance:false,
            url:require('../assets/images/renzo-noura.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Nra Premium'
    
        },
        {
            title:'Noura 2 Citron',
            results:noura_2_citron,
            machines:['E','D1','D2'],
            reservoirs:[29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],
            color:Colors.Citron,
            variance:false,
            url:require('../assets/images/noura-2.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Nra 2 Citron'
    
        },
        {
            title:'Get Citron',
            results:get_citron,
            machines:['A','B','C','D','D1','D2'],
            reservoirs:[...reservoirsABC,29,30,31,32,33,34,35,36,37,38,39],
            color:Colors.Citron,
            variance:false,
            url:require('../assets/images/get-citron.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Get'
    
        },
        {
            title:'Get Platinium',
            results:get_platinium,
            machines:['A','B','C','D','D1','D2'],
            reservoirs:[...reservoirsABC,29,30,31,32,33,34,35,36,37,38,39],
            color:Colors.Platinium,
            variance:false,
            url:require('../assets/images/get-platinium.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Get Plat'
    
        },
        {
            title:'Get Premium',
            results:get_premium,
            machines:['A','B','C','D','D1','D2'],
            reservoirs:[...reservoirsABC,29,30,31,32,33,34,35,36,37,38,39],
            color:Colors.Premium,
            variance:false,
            url:require('../assets/images/get-platinium.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Get Prem'
    
        },
        {
            title:'Lave vitre Madar',
            results:lave_vitre_madar,
            machines:['F'],
            reservoirs:[44,45,46,47,48],
            color:Colors.Bleu,
            variance:false,
            url:require('../assets/images/madar-lave-vitre.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'LV Madar'
        },
        {
            title:'Lave vitre Noura',
            results:lave_vitre_noura,
            machines:['F'],
            reservoirs:[44,45,46,47,48],
            color:Colors.Bleu,
            variance:false,
            url:require('../assets/images/noura-lave-vitre.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'LV Noura'
    
        },
        {
            title:'Lave bois',
            results:lave_bois,
            machines:['F'],
            reservoirs:[44,45,46,47,48],
            color:Colors.Platinium,
            variance:false,
            url:require('../assets/images/desodorisant-platinium.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Lave Bois'
    
        },
        {
            title:'Lave main',
            results:null,
            machines:['F'],
            reservoirs:[44,45,46,47,48],
            color:null,
            variance:true,
            variancesObject:co_madarResults,
            images:imagesMadar,
            url:require('../assets/images/cosmetiques/lm_madar.png'),
            imgStyle:{...styles.image_group1,marginTop:-16,},
            textStyle:{...styles.title,marginTop:-20,},
            text:'LM Madar'
        },
        {
            title:'Noura Net',
            results:null,
            machines:['E'],
            reservoirs:[40,41,42,43],
            color:null,
            variance:true,
            variancesObject:co_nouraNetResults,
            images:imagesNouraNet,
            url:require('../assets/images/cosmetiques/noura-net.png'),
            imgStyle:{...styles.image_group,marginTop:-16,},
            textStyle:{...styles.title,marginTop:-20,},
            text:'LV Madar'
    
        },
        {
            title:'Lave-main Matiz',
            results:null,
            machines:['E'],
            reservoirs:[40,41,42,43],
            color:null,
            variance:true,
            variancesObject:matiz_lmResults,
            images:imagesMatiz,
            url:require('../assets/images/cosmetiques/matiz.png'),
            imgStyle:{...styles.image_group,marginTop:-14,},
            textStyle:{...styles.title,marginTop:-20,},
            text:'LM Matiz'
    
        },
        {
            title:'Lave main',
            results:null,
            machines:['E'],
            reservoirs:[40,41,42,43],
            color:null,
            variance:true,
            variancesObject:co_nouraResults,
            images:imagesNoura,
            url:require('../assets/images/cosmetiques/lm_noura.png'),
            imgStyle:{...styles.image_group1,marginTop:-18,},
            textStyle:{...styles.title,marginTop:-20,},
            text:'LM Noura'
    
        },
        {
            title:'Desodorisant super more',
            results:null,
            machines:['E'],
            reservoirs:[40,41,42,43],
            color:null,
            variance:true,
            variancesObject:sm_superMoreResults,
            images:imagesSm,
            url:require('../assets/images/cosmetiques/desodorisant-supermores.png'),
            imgStyle:{...styles.image_group,marginTop:-12,},
            textStyle:{...styles.title,marginTop:-20,},
            text:'Déso Super More'
    
        },
        {
            title:'D-mera',
            results:null,
            machines:[],
            reservoirs:[],
            color:null,
            variance:true,
            variancesObject:null,
            images:null,
            url:require('../assets/images/cosmetiques/meras.png'),
            imgStyle:{...styles.image_group1,marginTop:-22,},
            textStyle:{...styles.title,marginTop:-24,},
            text:'Mera'
    
        },
        {
            title:'Get tol',
            results:get_tol, // results Get-Tol à implementer
            machines:['F'],
            reservoirs:[44,45,46,47,48],
            color:Colors.Gettol,
            variance:false,
            url:require('../assets/images/get-tol.png'),
            imgStyle:styles.image,
            textStyle:styles.title,
            text:'Get-Tol'
            
        }
        // ,
        // {
        //     title:'Eau Javel',
        //     results:lave_vitre_madar, // results Javel à implementer
        //     machines:['J'],
        //     reservoirs:[1,2,3],
        //     color:'grey',
        //     variance:false,
        //     url:require('../assets/images/madar-javel.png'),
        //     imgStyle:styles.image,
        //     textStyle:styles.title,
        //     text:'Eau de Javel'
        // },
        // {
        //     title:'Noura Flash',
        //     results:lave_bois, // results flash à implementer
        //     machines:['F'],
        //     reservoirs:[1],
        //     color:Colors.Jaune,
        //     variance:false,
        //     url:require('../assets/images/noura-flash.png'),
        //     imgStyle:styles.image,
        //     textStyle:styles.title,
        //     text:'Noura Flash'
    
        // }
    ]

   useLayoutEffect(()=>{// les asynchrones il faut qu'elles passent par le hokk useEffect || useLayoutEffect car elles sont en retard en synchrone
         async function fetchCosmetiquesResults() {
            const co_results = await cosmetiquesResults();
            const {co_madarResults,co_nouraResults,co_nouraNetResults,sm_superMoreResults,matiz_lmResults}=co_results;

            const globalCosmetiquesResults={...co_madarResults,...co_nouraResults,...co_nouraNetResults,...sm_superMoreResults,...matiz_lmResults};
           if (co_results) {setSplitResults(co_results);setGlobalCosmetiquesResults(globalCosmetiquesResults);}
         }
         async function fetchData() {
             const results = await getResults();
             if (results) {setResults(results);}
         }
         fetchData();
         fetchCosmetiquesResults();
   
       },[])
   
    return <ProductsContext.Provider value={{products,globalCosmetiquesResults}}>
       {children}
    </ProductsContext.Provider>
}

export const useProducts=()=>useContext(ProductsContext);

const styles=StyleSheet.create({
    splitButton:{
        minWidth:70,
        maxWidth:70,
        minHeight:70,
        maxHeight:200,
        // width:'25vw',
        // height:'25vw',
        marginHorizontal:10,
        borderWidth: 4,
        borderRadius: 10,
        // backgroundColor:'rgba(49, 141, 247, 0.7)',
        ...Flex('row','flex-start','center'),
    },
    infos:{
        textAlign:'center',
        fontWeight:'bold',
        width:'80%',
        height:145,
        color:'white',
        letterSpacing:2,
        ...Flex('column','flex-start','flex-end'),
        paddingVertical:4,
        padding:12,
    },
    title:{
      letterSpacing:-1.2,
      textAlign:'center',
      width:'90%',
      height:'15%',
      fontSize:14,
      color:'grey',
      fontWeight:'bold',
      // marginTop:-10,
      // transform:[{rotate:'-90deg'}],
    },
    mach_component:{
      ...Flex('column','center','center'),
      fontWeight:'bold',
      fontSize:13,
      color:'black',
    },
    machines:{
      ...Flex('row','center','center'),
      maxHeight:'70%',
      height:'70%',
      width:'100%',
      padding:'0px',
      margin:'0px',
    },
    reservoirs:{
      height:'80%',
      maxWidth:'50%',
      width:'100%',
      ...Flex('column','center','flex-end'),
      flexWrap:'wrap',
      padding:12,

    },
    image:{
        // width:'30%',
        height:'75%',//150,
        // marginLeft:-14,
    },
    image_group:{
        width:'70%',
        height:130, //400
        // marginLeft:-14,
    },
    image_group1:{
        width:'80%',
        height:130,//400
        // marginLeft:-14,//'-1.3rem',
    },
    image_group2:{
        width:'70%',
        height:130,//250
        // marginLeft:-14,
    },
})