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

interface SubHeaderProps {
    style?: StyleProp<any>;
    text: string;
    color?: string;
    size?: string;
}


export const Header: React.FC<HeaderProps> = props => {

    const { style, title, color, size } = props;

    return <Text style={[style, styles.bigHeader]}>{title}</Text>

}

export const SubHeader: React.FC<SubHeaderProps> = props => {

    const { style, text, color, size } = props;

    return <Text style={[style, styles.subHeader]}>{text}</Text>

}

// Local stylesheet for this screen
const styles = StyleSheet.create({
    bigHeader: {
        fontSize:21,
        ...fontStyles.fontRoboto,
        color: Colors.black,
        paddingLeft:10,
        paddingRight:10,
    },

    subHeader: {
        fontSize:13,
        ...fontStyles.fontRoboto,
        color: Colors.black,
        paddingLeft:50,
        paddingRight:50,
    },
   
});
  