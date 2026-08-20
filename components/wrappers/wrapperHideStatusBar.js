import React,{useCallback} from 'react';
import {StatusBar} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default HideStatusBarOnFocus=({children})=>{
    useFocusEffect(
        useCallback(()=>{
            StatusBar.setHidden(true);
        },[])
    );
    return children;
}