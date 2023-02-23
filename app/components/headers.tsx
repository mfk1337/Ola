import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "../assets/styles/colors";
import { fontStyles } from "../assets/styles/fonts";

interface HeaderProps {
    style?: StyleProp<any>;
    title: string;
    color?: string;
    size?: string;
}

export const Header: React.FC<HeaderProps> = props => {

    const { style, title, color, size } = props;

    return <Text style={[style, styles.bigHeader]}>{title}</Text>

}

// Local stylesheet for this screen
const styles = StyleSheet.create({
    bigHeader: {
        fontSize:23,
        ...fontStyles.fontRoboto,
        color: Colors.black,
        marginBottom: 10,
    },
   
});
  