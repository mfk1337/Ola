import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { makeMutable } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../assets/styles/colors";
import { fontStyles } from "../assets/styles/fonts";

interface CustomNavProps {
    title: string;
    style?: StyleProp<any>;    
    leftButtonVisible?: boolean;
    leftButtonIcon?: string;
    leftButtonOnPress?: () => void;
    rightButtonVisible?: boolean;
    rightButtonIcon?: string;
    rightButtonOnPress?: () => void;
}


export const CustomNav: React.FC<CustomNavProps> = props => {

    const { style, title, leftButtonVisible, leftButtonIcon, leftButtonOnPress, rightButtonVisible, rightButtonIcon, rightButtonOnPress } = props;

    return (
        <View style={[style, styles.container]}>
             
            {leftButtonVisible ? (
                <TouchableOpacity style={styles.leftButton} onPress={leftButtonOnPress}>
                    <Icon size={34} color="black" name={leftButtonIcon!}/>
                </TouchableOpacity>    
            ):(<View style={styles.leftButton} ></View>) /* Empty container for space */}                           

            <Text style={[styles.navBarHeader]}>{title}</Text>   

            {rightButtonVisible ? (
                <TouchableOpacity style={styles.rightButton} onPress={rightButtonOnPress}>
                    <Icon size={34} color="black" name={rightButtonIcon!}/>
                </TouchableOpacity>    
            ):(<View style={styles.rightButton} ></View>) /* Empty container for space */}   

        </View>
    )

}

// Local stylesheet for this component
const styles = StyleSheet.create({
   
    container: {
        backgroundColor: Colors.green,
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
    },

    leftButton: {
        width: 40,
    },

    rightButton: {
        width: 40,
    },

    navBarHeader: {
        textAlign:"center",
        flex:1,
        fontSize:21,
        ...fontStyles.fontRoboto,
        color: Colors.black,
        paddingLeft:10,
        paddingRight:10,
    },
 
   
});