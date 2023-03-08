/**
 * Fonts
 */
import { StyleSheet, Platform } from 'react-native';

export const fontStyles = StyleSheet.create({
    
    // Main font
    fontRoboto: {
        fontFamily: Platform.OS === 'ios' ? 'Roboto Mono' : 'RobotoMono',
    },
});