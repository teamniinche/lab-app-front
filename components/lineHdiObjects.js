import {useContext,useMemo} from 'react';
import { Button, PaperProvider } from 'react-native-paper';
import { View,Text,Pressable,useWindowDimensions} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { resetCurrent } from './store/reducers/userReducer';
import {AccueilContext, useMonoProducts } from './wrappers/contexts';
import InputRange from './ranges/phRange';
import { SimpleTable } from './tables/table-full';
import NewAnalysis from './newAnalysis';
import { Flex } from '../assets/functions';

const Hdi=({name,size,k,color})=>{
  const {sortedObj,setObj}=useContext(AccueilContext);
   const handleFilter=()=>{// Suppression de ligne
      const objFiltered=sortedObj.filter((elem,index)=>index!==k);
      setObj(objFiltered);
    }
  return <Pressable style={{width:16,}} onPress={handleFilter /*()=>render()*/}>
    <Text style={{width:'100%',textAlign:'right',}}><FontAwesome name={name} size={size} color={color}/></Text>
  </Pressable>
}
export function Line({prod,clef /*,render*/}){
  const {machine,reservoir,from,color}=prod;
  const colors=['white','grey','whitesmoke',"#0a9fc4","#088310",'#eb7413',"#b8ff05","#c76927",]
  return <View style={{...Flex('row','flex-start','flex-start'),backgroundColor:colors.includes(color)?'grey':'whitesmoke'/*,borderWidth:1,borderColor:'grey',borderStyle:'solid'*/,borderRadius:5,maxHeight:20,}}>
    <Text style={{fontSize:13,marginHorizontal:12,color:color}}>{machine+' '+reservoir}</Text>
    <Text style={{fontSize:13,marginHorizontal:12,color:color}}>{from}</Text>
    <Text><Hdi name="close" size={15} color="red" key={clef} k={clef}/></Text>
  </View>
}
const Phmetre=(({item,key})=>{
                    const {machine,reservoir,results}=item;
                    const {deleteItem}=useContext(AccueilContext);
                    return <InputRange
                        thumb="ph"
                        key={key}
                        results={results}
                        machine={machine}
                        reservoir={reservoir}
                        render={()=>deleteItem(machine,reservoir)}
                    />
              })
// const Objects=({navigation})=>{
//   const dispatch=useDispatch();
//   const {sortedObj,setObj,objLenIsNotNull}=useContext(AccueilContext);
//   const {width}=useWindowDimensions();const widthReitherThanMille=width>=1024;//{/*<SimpleTable/>*/}
//   useMemo(()=>{if(!objLenIsNotNull){dispatch(resetCurrent(null))}},[objLenIsNotNull]);// si plus produit selectionné on reset le currentUser

//   return !objLenIsNotNull?(widthReitherThanMille && <SimpleTable/>):<View style={{paddingTop:10,}}><View style={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',height:'100%',flexWrap:'nowrap',gap:6,}}>
//           {/*un autre wrapper ici qui sera children ou inputPh-ListRecente-update_record*/}
//           {sortedObj.map((prod,index)=>widthReitherThanMille?<NewAnalysis key={index}/>/*<Phmetre item={prod} key={index} />*/:<Line key={index} clef={index} prod={prod}/>)}
//           <View style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',}}>
//             <Button
//               icon={widthReitherThanMille?"close":"pencil"}
//               mode="contained"
//               onPress={() =>widthReitherThanMille?(()=>{setObj([]);dispatch(resetCurrent(null));})():navigation.navigate('analyses/liquides/ph', {data:sortedObj})}
//               style={{fontWeight:'bold',maxWidth:150,marginBottom:10,}}
//             >{widthReitherThanMille?'Purger':'Entrer pH'}</Button>
//           </View>
//         </View>
//       </View>
// }

const Objects=({navigation})=>{
  const dispatch=useDispatch();
  const {MonoProducts,setMonoProducts,monoProductsLenIsNotNull}=useMonoProducts();
  const {width}=useWindowDimensions();const widthReitherThanMille=width>=1024;
  useMemo(()=>{if(!monoProductsLenIsNotNull){dispatch(resetCurrent(null))}},[monoProductsLenIsNotNull]);// si plus produit selectionné on reset le currentUser

  return !monoProductsLenIsNotNull?(widthReitherThanMille && <SimpleTable/>):<PaperProvider><View style={{paddingTop:10,}}><View style={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',height:'100%',flexWrap:'nowrap',gap:6,}}>
          {/*un autre wrapper ici qui sera children ou inputPh-ListRecente-update_record*/}
          {MonoProducts.map((prod,index)=>widthReitherThanMille?<NewAnalysis product={prod} key={index}/>/*<Phmetre item={prod} key={index} />*/:<Line key={index} clef={index} prod={prod}/>)}
          <View style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',}}>
            <Button
              icon={widthReitherThanMille?"close":"pencil"}
              mode="contained"
              onPress={() =>widthReitherThanMille?(()=>{setMonoProducts([]);dispatch(resetCurrent(null));})():navigation.navigate('analyses/liquides/ph', {data:MonoProducts })}
              style={{fontWeight:'bold',maxWidth:150,marginBottom:10,}}
            >{widthReitherThanMille?'Purger':'Entrer pH'}</Button>
          </View>
        </View>
      </View></PaperProvider>
}

// MonoProducts,MonoProducts ,buildMonoproducts,monoProductsLenIsNotNull,



export default Objects;