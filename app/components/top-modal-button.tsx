import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Colors, fontStyles } from "../assets/styles";

interface TopModalButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    disabled?: boolean;
    loader?: boolean;
    onPress?: () => void;
}


export const TopModalButton: React.FC<TopModalButtonProps> = props => {
    const { style, title, disabled, loader,  onPress } = props;
    return (
        <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
            style={[styles.buttonContainer, style]}>            
            {loader ? (
                <ActivityIndicator size="small" color={Colors.white} style={{height:22}} />
                ):(               
                <Text style={styles.buttonTitle}>{title}</Text>                
            )}
        </TouchableOpacity>
    );
};

// Local stylesheet for this component
const styles = StyleSheet.create({
    buttonContainer: {
        borderBottomColor: Colors.lightGreen,
        borderBottomWidth: 1,
        alignItems:"center",
        justifyContent:"center",
        height: 40,
        borderRadius: 0,
        backgroundColor: Colors.darkestGrey,
        
    },
    buttonTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.white,
        ...fontStyles.fontRoboto
    },
});
