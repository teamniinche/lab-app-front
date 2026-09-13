import {View,ImageBackground /*,useWindowDimensions*/} from 'react-native';
import WinDim from '../../assets/operatingData'
const gif=require("../../assets/images/header-images/giphy.gif");
export default ViewOrImgBgWrapper=({children})=>{
        const {isLarge}=WinDim;
        const wrapperStyle={
                      paddingHorizontal:isLarge?10:'10%',
                      minWidth:isLarge?'54%':'95%',//initialement 40 a la place de 50
                      maxWidth:isLarge?'54%':'95%',
                      backgroundColor:'rgba(0,0,0,0.1)'/*,border:'1px solid grey'*/,
                      borderRadius:8,/*'8px',*/
                      margin:'auto'
                  }

    return   <> {isLarge?
                        <ImageBackground
                                source={{uri:'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3duaXA1Mm03Z3A0aWM5dzF5dnppMHFtbmQ1aGhkNW9xZDR6aTg4diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13Kguu4fbMbz1K/giphy.gif'}}// agitation soft et douce : favori
                                resizeMode="cover"
                                style={[wrapperStyle,{minHeight:'100%',}]}>
                               {children}
                        </ImageBackground>
                        :
                        <View style={wrapperStyle}>
                                {children}
                        </View>
                }
          </>
}

export const ViewOrImgBgPowderWrapper=(props)=>{
        const {isLarge}=WinDim;
        const wrapperStyle={
                      paddingHorizontal:0,
                      backgroundColor:'rgba(0,0,0,0.1)'/*,border:'1px solid grey'*/,
                      borderRadius:8,/*'8px',*/
                      margin:'auto',
                      marginHorizontal:0
                  }
                  const uri=props.uri;
    return   <> {isLarge?
                        <ImageBackground
                                source={{uri:uri}}
                                resizeMode="cover"
                                style={[wrapperStyle,{minHeight:600,/*'100%'*/}]}>
                               {props.children}
                        </ImageBackground>
                        :
                        <View style={wrapperStyle}>
                                {props.children}
                        </View>
                }
          </>
}