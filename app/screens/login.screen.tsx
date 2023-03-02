import React, { useRef, useState } from "react";
import { Alert, Button, Image, SafeAreaView, Text, TextInput, View } from "react-native";
import { sharedStyles } from "../assets/styles/shared.styles";
import { BasicButton } from "../components/basic-button";

import auth from '@react-native-firebase/auth';
import { formInputValidation } from "../libs/form-validation";
import { Loading } from "../components/loading-overlay";

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'; // https://github.com/react-native-google-signin/google-signin
import { Colors } from "../assets/styles/colors";

import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export const LoginScreen = ({navigation}: {navigation: any}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const inputFieldRefPassword = useRef<TextInput | null>(null); // Reference to the Password TextInput

  const handleSignInWithGoogle = async () => {

    setLoading(true)

    await GoogleSignin.configure({
      webClientId: '627663599334-l2m77tbhh1p67j8d71p5ihpqk3fbeba0.apps.googleusercontent.com',
    });

    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    .catch(error => {
      setLoading(false)
      console.log('1');
      console.log(error);
    });
    // Get the users ID token
    var idToken = ''
    await GoogleSignin.signIn()
    .then((userInfo) => {
      console.log("idToken: "+ userInfo.idToken)
      console.log({userInfo})
      idToken = userInfo.idToken as string
    })
    .catch(error => {
      setLoading(false)
      console.log('2');
      console.log(error);
      return;
    });

    console.log('3');
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    auth()
    .signInWithCredential(googleCredential)
    .then(() => {
        console.log('User account signed in!');
        setLoading(false)
        navigation.navigate('Rooms')
    })
    .catch(error => {

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setLoading(false)
        Alert.alert("SIGN_IN_CANCELLED");
      }

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("The email address is already in use!");
      }

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("The email address is already in use!");
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert("The email address is invalid!");
      }

      if (error.code === 'auth/invalid-credential') {
        Alert.alert("The supplied auth credential is malformed or has expired.");
      }

      if (error.code === 'auth/too-many-requests') {
        Alert.alert("Access to this account has been temporarily disabled due to many failed login attempts");
      }

      setLoading(false)

      console.log(error);
    });

  }
  
  const handleSignIn = async () => {

    if(!formInputValidation([    
      {
          fieldname: 'E-mail',
          fieldvalue: email,
          fieldtype: 'email',
          minchars: 4,
      },
      {
          fieldname: 'Password',
          fieldvalue: password,
          fieldtype: 'password',
          minchars: 8,
      }]))
    {
        Alert.alert("Some fields are empty or invalid...");
        return
    }

    setLoading(true)

    auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log('User account signed in!');
        setLoading(false)
        navigation.navigate('Rooms')
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("The email address is already in use!");
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert("The email address is invalid!");
      }

      if (error.code === 'auth/wrong-password') {
        Alert.alert("The password is invalid");
      }

      if (error.code === 'auth/too-many-requests') {
        Alert.alert("Access to this account has been temporarily disabled due to many failed login attempts");
      }

      setLoading(false)

      console.log(error);
    });


  }


  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }


  return(
    <SafeAreaView style={sharedStyles.container}>
                
      <View style={{marginHorizontal: 60, marginTop: 90, }}>
        <Image source={require('../assets/img/app_logo.png')} style={{width:170, height:170, alignSelf: 'center'}}/>
        <TextInput
                style={sharedStyles.textInput}
                placeholder="E-mail"
                value={email}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                keyboardType="email-address"
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                editable={!loading}
                onChangeText={text => setEmail(text)}
                placeholderTextColor={Colors.medGrey}
                onSubmitEditing={() => inputFieldRefPassword.current?.focus()}
            />
            <TextInput
                ref={inputFieldRefPassword}
                style={sharedStyles.textInput}
                placeholder='Password'
                value={password}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                secureTextEntry={true}
                returnKeyType="go"
                enablesReturnKeyAutomatically={true}
                editable={!loading}
                onChangeText={text => setPassword(text)}
                placeholderTextColor={Colors.medGrey}
                onSubmitEditing={handleSignIn}
            />
          <BasicButton title="Login" onPress={handleSignIn} />

          <View style={{alignItems:"center"}}>
            <GoogleSigninButton
              style={{ width: 192, height: 48, marginTop:15}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={handleSignInWithGoogle}
              disabled={loading}
            />
          </View>

          <Button
          title="Facebook Sign-In"
          onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
        />

        </View>
        { loading ? (<Loading />):(null)}
    </SafeAreaView>
    
  )

}