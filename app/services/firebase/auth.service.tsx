/*
* All Firebase Authentication services:
* Login with email/password
* Login with Google signin
* Login with Facebook
*/

import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GOOGLESIGNIN_CLIENTID } from '../../constants';

/**
 * Function name: signInFirebaseEmailPassword
 * Function desc: Sign in with Firebase Auth Email/password
 * @param email 
 * @param password 
 * @returns response string
 */
export const signInFirebaseEmailPassword = async (email: string, password: string) => {
    try {

        var response = ''

        await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log('User account signed in!');
            response = "logged-in"
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log("The email address is already in use!");
            }

            if (error.code === 'auth/invalid-email') {
                console.log("The email address is invalid!");
            }

            if (error.code === 'auth/wrong-password') {
                console.log("The password is invalid");
            }

            if (error.code === 'auth/too-many-requests') {
                console.log("Access to this account has been temporarily disabled due to many failed login attempts");
            }
            response = error.code
            console.log({error});
        });

        // Return login response
        return response;
        
    } catch (err) {
        // If any error in firebase auth, throw error.
        throw err;
    }
}

/**
 * Function name: signInFirebaseGoogleSignin
 * Function desc: Sign in with Firebase Auth Google signin
 * @returns response string
 */
export const signInFirebaseGoogleSignin = async () => {

    try {

        var response = ''

        await GoogleSignin.configure({
            webClientId: GOOGLESIGNIN_CLIENTID,
        });
      
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
        .catch(error => {
        console.log("GoogleSignin error #1:", error)
        response = "error"
        });

        // Get the users ID token
        var idToken = ''
        await GoogleSignin.signIn()
        .then((userInfo) => {
        console.log("idToken: "+ userInfo.idToken)
        console.log({userInfo})
        idToken = userInfo.idToken as string
        })
        .catch((error) => {
        console.log("GoogleSignin error #2:", error)
        response = "error"
        });
    
        console.log('3');
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
        // Sign-in the user with the credential
        auth()
        .signInWithCredential(googleCredential)
        .then(() => {
            console.log('User account signed in!');
            response = "logged-in"
        })
        .catch(error => {
    
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("SIGN_IN_CANCELLED");
            }
        
            if (error.code === 'auth/email-already-in-use') {
                console.log("The email address is already in use!");
            }
        
            if (error.code === 'auth/email-already-in-use') {
                console.log("The email address is already in use!");
            }
        
            if (error.code === 'auth/invalid-email') {
                console.log("The email address is invalid!");
            }
        
            if (error.code === 'auth/invalid-credential') {
                console.log("The supplied auth credential is malformed or has expired.");
            }
        
            if (error.code === 'auth/too-many-requests') {
                console.log("Access to this account has been temporarily disabled due to many failed login attempts");
            }
        
            response = error.code
            console.log(error);


        });
        // Return login response
        return response;
        
    } catch (err) {
        // If any error in firebase auth, throw error.
        throw err;
    }

}

/**
 * Function name: signInFirebaseFacebook
 * Function desc: Sign in with Firebase Auth Facebook login
 * @returns response string
 */
export const signInFirebaseFacebook = async () => {

    try {

        var response = ''

        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    
        if (result.isCancelled) {
        console.log("User cancelled the login process")
        response = "user-cancelled"
        return response
        }
    
        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();
    
        if (!data) {
        response = "error"
        return response
        }
    
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        auth()
        .signInWithCredential(facebookCredential).
        then(() => {
            console.log('User account signed in!');
            response = "logged-in"
        })
        .catch(error => {

            if (error.code === 'auth/email-already-in-use') {
                console.log("The email address is already in use!");
            }

            if (error.code === 'auth/invalid-email') {
                console.log("The email address is invalid!");
            }

            if (error.code === 'auth/too-many-requests') {
                console.log("Access to this account has been temporarily disabled due to many failed login attempts");
            }

            response = error.code
            console.log(error);
        });

        // Return login response
        return response;
        
    } catch (err) {
        // If any error in firebase auth, throw error.
        throw err;
    }

}

/**
 * Function name: signOutFirebase
 * Function desc: Sign out, log out, capish!
 */
export const signOutFirebase = () => {
    auth()
    .signOut()
    .then(() => {
        console.log('User signed off, going to login screen...');
        return true
    });
}