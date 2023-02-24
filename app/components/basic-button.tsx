import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Colors } from "../assets/styles/colors";
import { fontStyles } from "../assets/styles/fonts";

interface BasicButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    color?: string;
    disabled?: boolean;
    loader?: boolean;
    onPress?: () => void;
}


export const BasicButton: React.FC<BasicButtonProps> = props => {
    const { style, title, color, disabled, loader,  onPress } = props;
    return (
        <View
            style={[styles.buttonContainer, style]}>            
            {loader ? (<ActivityIndicator size="small" color={Colors.white} style={{height:22}} />):(
                <TouchableOpacity
                disabled={disabled}
                onPress={onPress}>
                    <Text style={styles.buttonTitle}>{title}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 1,
        borderColor: Colors.darkGrey,
        padding: 12,
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
