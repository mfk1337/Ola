/**
 * Text headers
 * Desc: Custom text headers for titles, headlines etc.
 */

import React from "react";
import { StyleProp, StyleSheet, Text, View } from "react-native";
import { Colors, fontStyles } from "../assets/styles";
import { isLightTheme } from "../libs/colorscheme";

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

    return (
        <View style={styles.subHeaderContainer}>
            <Text style={[style, styles.subHeaderText]}>{text}</Text>
        </View>
    )

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

    subHeaderContainer: {
        backgroundColor: isLightTheme() ? Colors.lightGreen : Colors.darkGrey,
    },

    subHeaderText: {
        textAlign: "center",
        fontSize:13,
        ...fontStyles.fontRoboto,
        color: isLightTheme() ? Colors.black : Colors.green,
        padding:10,
        paddingRight:10,
    },
   
});
  