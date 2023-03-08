import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Colors, fontStyles } from "../assets/styles";

interface BasicButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    disabled?: boolean;
    loader?: boolean;
    onPress?: () => void;
}

export const BasicButton: React.FC<BasicButtonProps> = props => {
    const { style, title, disabled, loader,  onPress } = props;
    return (
        <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
                style={[styles.buttonContainer, style]}>            
            {loader ? 
            (
                <ActivityIndicator size="small" color={Colors.white} style={{height:22}} />            
            ):(
               <Text style={styles.buttonTitle}>{title}</Text>               
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 1,
        borderColor: Colors.black,
        alignItems:"center",
        justifyContent:"center",
        height: 50,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: Colors.black,
        
    },
    buttonTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.white,
        ...fontStyles.fontRoboto
    },
});
