import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../assets/styles/colors";
import { fontStyles } from "../assets/styles/fonts";

interface IconButtonProps {
    style?: StyleProp<ViewStyle>;
    icon: string;
    color?: string;
    disabled?: boolean;
    loader?: boolean;
    onPress?: () => void;
}


export const IconButton: React.FC<IconButtonProps> = props => {
    const { style, icon, color, disabled, loader,  onPress } = props;
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[styles.iconButtonContainer, style]}>            
            {loader ? (
                <ActivityIndicator size="small" color={Colors.white} style={{height:22}} />
            ):(
                <Icon size={25} color={color} name={icon}/>                
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconButtonContainer: {
        borderWidth: 1,
        borderColor: Colors.black,
        alignItems:"center",
        justifyContent:"center",
        height: 40,
        width: 40,
        borderRadius: 40,
        marginTop: 10,
        padding:7,
        paddingTop: 5,
        backgroundColor: Colors.black,
        
    },
});