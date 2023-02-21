import React from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import auth from '@react-native-firebase/auth';

export const RoomsScreen = () => {

    return(
        <SafeAreaView style={[sharedStyles.container, {alignItems: "center"}]}>
            <Text style={{marginTop:100}}>User logged in</Text>

            <Button title="Log off" onPress={()=>{
                auth()
                .signOut()
                .then(() => console.log('User signed out!'));
            }} />

        </SafeAreaView>
        
    )

}