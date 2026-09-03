import React, { useState } from 'react';
import { Text, Pressable,StyleSheet } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

export default function Btn(props) {
  const {style,onPress,info,children,...restProps}=props;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      isVisible={showTooltip}
      content={<Text style={styles.tooltipText}>{info}</Text>}
      placement="bottom"
      onClose={() => setShowTooltip(false)}
      contentStyle={styles.tooltipContainer}
       // 👇 CES 3 LIGNES ENLÈVENT COMPLÈTEMENT L'OVERLAY
      backgroundColor="transparent" // Rend l'overlay invisible
      displayInsets={{ top: 0, bottom: 0, left: 0, right: 0 }} // Empêche l'overlay de bloquer l'écran
      allowChildInteraction={true} // Permet de cliquer sur le bouton même si la bulle est ouverte
    >
      <Pressable 
        onPress={onPress}
        onHoverIn={() => setShowTooltip(true)}
        onHoverOut={() => setShowTooltip(false)}
        onLongPress={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
        style={style}
        {...restProps}
      >
        {children}
      </Pressable>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    padding: 2,
    paddingHorizontal:4,
    width:'auto',
    // elevation: 3, // Ombre sur Android
    // shadowColor: '#000', // Ombre sur iOS/Web
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  tooltipText: {
    width:'auto',
    backgroundColor:'rgba(0,0,0,0.8)',
    color:'white',
    height:20,
    padding:2,
    borderRadius:2,
    textAlign:'center',
    letterSpacing:1.5,
    fontSize:12
  }
});
