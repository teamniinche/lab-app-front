import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

export default function Btn(props) {
  const {style,onPress,info,children,...restProps}=props;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      isVisible={showTooltip}
      content={<Text style={{backgroundColor:'rgba(0,0,0,0.8)',color:'white',height:40,padding:5,borderRadius:8,textAlign:'center',fontWeight:'bold',fontSize:12}}>{info}</Text>}
      placement="top"
      onClose={() => setShowTooltip(false)}
    >
      <Pressable 
        onPress={onPress}
        {...restProps}
        onHoverIn={() => setShowTooltip(true)}
        onHoverOut={() => setShowTooltip(false)}
        style={style}
      >
        {children}
      </Pressable>
    </Tooltip>
  );
}
