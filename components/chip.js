import {Badge,Avatar,Chip } from 'react-native-paper';
import { Pressable,Text } from 'react-native';
import { useDispatch,useSelector} from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../assets/colors';
import {colorFromName,isFormule } from '../assets/functions';
import { useChip } from './wrappers/contexts';
import { useState } from 'react';
import { clooner } from './accueil';
import { setPowderFiltred } from './store/reducers/powderAnalysesReducer';
export const MyChip=({product,clooned,render})=>{
  const {prdt,setPrdt}=useChip();
  const isSelf=prdt===product?.name;
//   const isTous=prdt===null;
  return <Chip
  selected={isSelf || prdt===null}
  // selectedColor={isSelf?null:'rgba(0,0,0,0.6)'}
  textStyle={{fontWeight:'bold',letterSpacing:-0.5,color:isSelf?'white':'rgba(0,0,0,0.6)'}}
  style={{backgroundColor:isSelf?'rgba(42, 21, 100, 1)':'whitesmoke',borderWidth:1,borderColor:'white',}}
  avatar={product && <Avatar.Image size={24} style={{backgroundColor:Colors[colorFromName(product.name)]}} source={product?.url}/>}//require('../assets/images/get-citron.png')
  mode="elevated" onPress={() =>{setPrdt(product?.name || null);render()}}>{product?(clooned?clooner(product.name):product.name)+'  ':'All'}{product && <Badge size={35} style={{backgroundColor:isSelf?null:'rgba(160, 3, 24, 1)',color:'white',}}>{product.count}</Badge>}</Chip>;
}

export const MyChipp=({product,clooned,render})=>{
  const dispatch=useDispatch();
  const {prdtP,setPrdtP}=useChip();
  const isSelf=prdtP===product?.name;
  const {estFormule,nameToDisplay}=product!==null?isFormule(product):{estFormule:false,nameToDisplay:''};
  const nme=estFormule?nameToDisplay:product?.name;

  const handlePressChipp=()=>{
    setPrdtP(product?.name || null);
    dispatch(setPowderFiltred(product?.name || null));
    render();
  }
  return <Chip
  selected={isSelf || prdtP===null}
  textStyle={{fontWeight:'bold',letterSpacing:-0.5,color:isSelf?'white':'rgba(0,0,0,0.6)'}}
  style={{backgroundColor:isSelf?'rgba(42, 21, 100, 1)':'whitesmoke',borderWidth:1,borderColor:'white',}}
  avatar={product && <Avatar.Image size={24} style={{backgroundColor:Colors[colorFromName(product.name)]}} source={product?.url}/>}//require('../assets/images/get-citron.png')
  mode="elevated"
  onPress={handlePressChipp}>
    {product?(clooned?clooner(nme):nme)+'  ':'All'}
    {product && <Badge size={35} style={{backgroundColor:isSelf?null:'rgba(160, 3, 24, 1)',color:'white',}}>{product.count}</Badge>}
  </Chip>;
}

export const Filter=({active,title,text,render})=>{

    const [style,setStyle]=useState({backColor:null,textColor:null}) 
    const isMe=text===title;
    const desactiveColor='rgba(200,200,200,0.2)';
    return <Pressable onPress={()=>active && render(title)} onHoverIn={()=>setStyle({backColor:'rgba(0,0,240,0.2)',textColor:'white'})} onHoverOut={()=>setStyle({backColor:null,textColor:null})}
              style={{cursor:active && 'pointer',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:active?(isMe?'white':style.backColor):desactiveColor,borderWidth:2,borderStyle:'dotted',borderColor:active?(isMe?'white':(style.textColor || 'grey')):desactiveColor,borderRadius:8,paddingVertical:2,paddingHorizontal:4,marginHorizontal:2,}}>
              <Text style={{textAlign:'center',color:active?(isMe?'black':(style.textColor ||'grey')):desactiveColor,letterSpacing:1,fontWeight:'bold',fontSize:10,}}><FontAwesome5 name="filter" size={12} color={active?(text===title?'black':'white'):desactiveColor}/>{title}</Text>
          </Pressable>
}