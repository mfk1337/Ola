import React, { useRef, useState } from "react";
import { Alert, Image, SafeAreaView, TextInput, View } from "react-native";
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'; // https://github.com/react-native-google-signin/google-signin

import { sharedStyles, Colors } from "../assets/styles";
import { BasicButton, Loading } from "../components";
import { signInFirebaseEmailPassword, signInFirebaseFacebook, signInFirebaseGoogleSignin } from "../services/firebase/auth.service";
import { formInputValidation } from "../libs/form-validation";

export const LoginScreen = ({navigation}: {navigation: any}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const inputFieldRefPassword = useRef<TextInput | null>(null); // Reference to the Password TextInput

  const handleSignInWithGoogle = async () => {

    setLoading(true)

    signInFirebaseGoogleSignin()
    .then((response) => {

      if(response=="logged-in")
      {
        setLoading(false)
        navigation.navigate('Rooms')
      }

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

      setLoading(false) 

    }).catch(error => {    
      console.log("signInFirebaseGoogleSignin catch error:",error)
      setLoading(false) 
    });
    

  }

  const handleSignInWithFacebook = async () => {
    
    setLoading(true)
    
    signInFirebaseFacebook()
    .then((response) => {

      if(response=="logged-in")
      {
        setLoading(false)
        navigation.navigate('Rooms')
      }

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

      setLoading(false) 

    }).catch(error => {    
      console.log("signInFirebaseFacebook catch error:",error)
      setLoading(false) 
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

    signInFirebaseEmailPassword(email, password)
    .then((response) => {

        if(response=="logged-in")
        {
          setLoading(false)
          navigation.navigate('Rooms')
        }

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

        setLoading(false) 

    }).catch(error => {    
      console.log("signInFirebaseEmailPassword catch error:",error)
      setLoading(false) 
    });
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
          
        <BasicButton title="Sign in with Facebook" onPress={handleSignInWithFacebook} style={{marginTop:10}}/>

        <View style={{alignItems:"center"}}>
          <GoogleSigninButton
            style={{ width: 192, height: 48, marginTop:5}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleSignInWithGoogle}
            disabled={loading}
          />
        </View>

      </View>

        { loading ? (<Loading />):(null)}
    </SafeAreaView>
    
  )

}