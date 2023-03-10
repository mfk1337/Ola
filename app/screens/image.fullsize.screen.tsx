/**
 * Image fullsize screen
 * Desc: For showing image in full screen with zoom.
 */
import React from "react";
import { StyleSheet, View } from "react-native";
import { ImageZoom } from '@likashefqet/react-native-image-zoom'; // Imagezoom: https://github.com/likashefqet/react-native-image-zoom

import { TopModalButton } from "../components";
import { Colors } from "../assets/styles";

export const ImageFullsizeScreen = ({route,navigation}: {route: any,navigation: any}) => {

    const { image_url } = route.params;

    return (
        <>
            <View style={{backgroundColor: Colors.black}}>
            <TopModalButton title='Close' onPress={() => navigation.goBack()}  />
            </View>
            <ImageZoom
                uri={image_url}
                containerStyle={styles.container}
                activityIndicatorProps={{
                color: 'white',
                style: styles.loader,
                }}
                minScale={0.6}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black',
    },
    loader: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black',
    },
});