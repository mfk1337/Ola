import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { Colors } from '../assets/styles/colors';

export const Loading = () => { 
  return (
    <View style={styles.overlayContainer}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
};

// Local stylesheet for this component
const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050'      
  },
});
