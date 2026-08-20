import {Platform,Dimensions } from "react-native";
export default WinDim= (()=>{
    const { height: screenHeight,width:screenWidth} = Dimensions.get('window');
    const isLarge= screenWidth >= 1024;
    const isMobile=Platform.OS==='android' || Platform.OS==='ios';
    const isWeb=Platform.OS==='web' || 'macos' || 'window';
    
    return  {isLarge,isMobile,isWeb,screenHeight};

})()