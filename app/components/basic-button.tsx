import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Colors } from "../assets/styles/colors";

interface BasicButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    color?: string;
    disabled?: boolean;
    onPress?: () => void;
}


export const BasicButton: React.FC<BasicButtonProps> = props => {
    const { style, title, color, disabled, onPress } = props;
    return (
        <View
            style={styles.buttonContainer}>
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress}>
                <Text style={styles.buttonTitle}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 1,
        borderColor: Colors.darkGrey,
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        backgroundColor: Colors.black,
        
    },
    buttonTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.white,
    },
});
