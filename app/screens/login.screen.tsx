import React from "react";
import { Button, Image, SafeAreaView, Text, TextInput, View } from "react-native";
import { Colors } from "../assets/styles/colors";
import { sharedStyles } from "../assets/styles/shared.styles";
import { BasicButton } from "../components/basic-button";

export const LoginScreen = () => {

    return(
        <SafeAreaView style={sharedStyles.container}>
                   
          <View style={{marginHorizontal: 60, marginTop: 60, }}>
            <Image source={require('../assets/img/app_logo.png')} style={{width:200, height:200, alignSelf: 'center'}}/>
            <TextInput
                    style={sharedStyles.textInput}
                    placeholder="E-mail"
                   // value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    returnKeyType="next"
                    enablesReturnKeyAutomatically={true}
                    //editable={!isLoading}
                    //onChangeText={text => setEmail(text)}
                    //onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
                <TextInput
                    //ref={passwordInputRef}
                    style={sharedStyles.textInput}
                    placeholder='Kodeord'
                    //value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    secureTextEntry={true}
                    returnKeyType="go"
                    enablesReturnKeyAutomatically={true}
                    //editable={!isLoading}
                    //onChangeText={text => setPassword(text)}
                    //onSubmitEditing={handleSignIn}
                />
              <BasicButton title="Login"  />
            </View>
        </SafeAreaView>
        )

}