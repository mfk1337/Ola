/**
 * Login screen
 * Desc:  Main "entry" for the Ola chat app, the login screen
 */

import React, { useRef, useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'; // https://github.com/react-native-google-signin/google-signin

import { sharedStyles, Colors } from "../assets/styles";
import { BasicButton, Loading } from "../components";
import { signInFirebaseEmailPassword, signInFirebaseFacebook, signInFirebaseGoogleSignin } from "../services/firebase/auth.service";
import { formInputValidation } from "../libs/form-validation";
import { isLightTheme } from "../libs/colorscheme";

export const LoginScreen = ({navigation}: {navigation: any}) => {

  // State for inputfield Email
  const [email, setEmail] = useState('');
  // State for inputfield Password
  const [password, setPassword] = useState('');
  // State for loader overlay
  const [loading, setLoading] = useState(false);
  // Ref for inputfield Password, used to go directly from keyboard Go to password field from Email field.
  const inputFieldRefPassword = useRef<TextInput | null>(null);


  // Handle Google SignIn
  const handleSignInWithGoogle = async () => {

    setLoading(true)

    // Call Firebase auth service function from Services library/folder
    signInFirebaseGoogleSignin()
    .then((response) => {

      // If logged in is succes go Room screen, even tho its handle in App.tsx also.
      if(response=="logged-in")
      {
        setLoading(false)
        navigation.navigate('Rooms')
      }

      // Handle error messages and show to user
      if (response === 'auth/email-already-in-use') {
        Alert.alert("The email address is already in use!");
      }

      if (response === 'auth/invalid-email') {
        Alert.alert("The email address is invalid!");
      }

      if (response === 'auth/wrong-password') {
        Alert.alert("The password is invalid");
      }

      if (response === 'auth/too-many-requests') {
        Alert.alert("Access to this account has been temporarily disabled due to many failed login attempts");
      }

      if (response === 'auth/network-request-failed') {
        Alert.alert("Network error, no internet");
      }

      setLoading(false) 

    }).catch(error => {    
      console.log("signInFirebaseGoogleSignin catch error:",error)
      setLoading(false) 
    });
    

  }

  // Handle Facebook SignIn
  const handleSignInWithFacebook = async () => {
    
    setLoading(true)
    
    // Call Firebase auth service function from Services library/folder
    signInFirebaseFacebook()
    .then((response) => {

      // If logged in is succes go Room screen, even tho its handle in App.tsx also.
      if(response=="logged-in")
      {
        setLoading(false)
        navigation.navigate('Rooms')
      }

      // Handle error messages and show to user
      if (response === 'auth/email-already-in-use') {
        Alert.alert("The email address is already in use!");
      }

      if (response === 'auth/invalid-email') {
        Alert.alert("The email address is invalid!");
      }

      if (response === 'auth/wrong-password') {
        Alert.alert("The password is invalid");
      }

      if (response === 'auth/too-many-requests') {
        Alert.alert("Access to this account has been temporarily disabled due to many failed login attempts");
      }

      if (response === 'auth/network-request-failed') {
        Alert.alert("Network error, no internet");
      }

      setLoading(false) 

    }).catch(error => {    
      console.log("signInFirebaseFacebook catch error:",error)
      setLoading(false) 
    });

  }

  // Handle sign in with email and password
  const handleSignIn = async () => {

    // Basic validation of the 2 inputfields
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

     // Call Firebase auth service function from Services library/folder
    signInFirebaseEmailPassword(email, password)
    .then((response) => {

        // If logged in is succes go Room screen, even tho its handle in App.tsx also.
        if(response=="logged-in")
        {
          setLoading(false)
          //navigation.navigate('Rooms')
        }

        // Handle error messages and show to user
        if (response === 'auth/email-already-in-use') {
          Alert.alert("The email address is already in use!");
        }
  
        if (response === 'auth/invalid-email') {
          Alert.alert("The email address is invalid!");
        }
  
        if (response === 'auth/wrong-password') {
          Alert.alert("The password is invalid");
        }
  
        if (response === 'auth/too-many-requests') {
          Alert.alert("Access to this account has been temporarily disabled due to many failed login attempts");
        }

        if (response === 'auth/network-request-failed') {
          Alert.alert("Network error, no internet");
        }

        setLoading(false) 

    }).catch(error => {    
      console.log("signInFirebaseEmailPassword catch error:",error)
      setLoading(false) 
    });
  }


  return(
    <SafeAreaView style={sharedStyles.container}>
                
      <View style={styles.loginItemsContainer}>
        
        <Image source={require('../assets/img/app_logo.png')} style={styles.appLogo}/>
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
          
        <BasicButton title="Sign in with Facebook" onPress={handleSignInWithFacebook} style={{marginTop:10}}/>

        <View style={{alignItems:"center"}}>
          <GoogleSigninButton
            style={styles.buttonGoogleSignin}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleSignInWithGoogle}
            disabled={loading}
          />
        </View>

      </View>

        { // Loader overlay
        loading ? (<Loading />):(null)}
    </SafeAreaView>
    
  )

}

// Local stylesheet for this screen
const styles = StyleSheet.create({
    buttonGoogleSignin: {
      width: 192, 
      height: 48, 
      marginTop:5        
    },
    appLogo: {
      width:170,
      height:170,
      alignSelf: 'center'
    },
    loginItemsContainer: {
      marginHorizontal: 60,
      marginTop: 60, 
    }
    
});
