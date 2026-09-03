import React, { useState } from 'react';
import { Text, Pressable,StyleSheet } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

export default function Btn({style,bcgrndClr,textStyle,onPress,onHoverOut,onHoverIn,info,children,...props}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      isVisible={showTooltip}
      content={<Text style={textStyle}>{info}</Text>}
      placement="bottom"
      onClose={() => setShowTooltip(false)}
      contentStyle={[styles.tooltipContainer,{backgroundColor:bcgrndClr || 'whitesmoke'}]}
       // 👇 CES 3 LIGNES ENLÈVENT COMPLÈTEMENT L'OVERLAY
      backgroundColor="transparent" // Rend l'overlay invisible
      displayInsets={{ top: 0, bottom: 0, left: 0, right: 0 }} // Empêche l'overlay de bloquer l'écran
      allowChildInteraction={true} // Permet de cliquer sur le bouton même si la bulle est ouverte
    >
      <Pressable 
        onPress={onPress}
        onHoverIn={() => {setShowTooltip(true);onHoverIn && onHoverIn()}}
        onHoverOut={() => {setShowTooltip(false);onHoverOut && onHoverOut()}}
        // onHoverIn={() => setShowTooltip(true)}
        // onHoverOut={() => setShowTooltip(false)}
        onLongPress={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
        style={style}
        {...props}
      >
        {children}
      </Pressable>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    borderRadius: 8,
    padding: 2,
    paddingHorizontal:4,
    width:'auto',
  }
});
