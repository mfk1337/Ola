import React from "react";
import { StyleSheet, View } from "react-native";
import { ImageZoom } from '@likashefqet/react-native-image-zoom'; // https://github.com/likashefqet/react-native-image-zoom
import { TopModalButton } from "../components/top-modal-button";
import { Colors } from "react-native/Libraries/NewAppScreen";

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