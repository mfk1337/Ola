import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';
import { fontStyles } from './fonts';

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.green,
    },      
    textInput: {
        borderWidth: 1,
        borderColor: Colors.white,
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 17,
        backgroundColor: Colors.white
    },
    
    errorMsgGrey: {
        textAlign: 'center',
        fontSize: 13,
        color: Colors.medGrey,
        ...fontStyles.fontRoboto

    }
    
});
