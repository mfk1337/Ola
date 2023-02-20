import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

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
        marginTop: 16,
        fontSize: 18,
        backgroundColor: Colors.white
    },
    
    
});
