import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Colors } from "../assets/styles/colors";
import { fontStyles } from "../assets/styles/fonts";

interface NoFrameButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    color?: string;
    disabled?: boolean;
    loader?: boolean;
    onPress?: () => void;
}


export const NoFrameButton: React.FC<NoFrameButtonProps> = props => {
    const { style, title, color, disabled, loader,  onPress } = props;
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
        alignItems:"center",
        justifyContent:"center",
        height: 50,
        backgroundColor: 'transparent',
        
    },
    buttonTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.black,
        ...fontStyles.fontRoboto
    },
});
