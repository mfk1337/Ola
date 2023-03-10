/**
 * Default styles to use throughout the app
 */

import { StyleSheet } from 'react-native';
import { isLightTheme } from '../../libs/colorscheme';
import { Colors } from './colors';
import { fontStyles } from './fonts';

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.green,
    },      
    textInput: {
        borderWidth: 1,
        borderColor: isLightTheme() ? Colors.white : Colors.darkestGrey,
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 17,
        backgroundColor: isLightTheme() ? Colors.white : Colors.darkestGrey,
        color: isLightTheme() ? Colors.black : Colors.lightGrey,
    },
    
    errorMsgGrey: {
        textAlign: 'center',
        fontSize: 13,
        color: Colors.medGrey,
        ...fontStyles.fontRoboto

    }
    
});
