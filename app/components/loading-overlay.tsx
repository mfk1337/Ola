import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { Colors } from '../assets/styles/colors';

export const Loading = () => {
 
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000050'
      }}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
};