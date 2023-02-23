import { StyleSheet, Platform } from 'react-native';

export const fontStyles = StyleSheet.create({
    fontRoboto: {
        fontFamily: Platform.OS === 'ios' ? 'Roboto Mono' : 'RobotoMono',
    },
});