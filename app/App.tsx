/**
 * Ola - Chat App
 * https://github.com/mfk1337/Ola
 * This is here where the magic starts
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen'
import { LoginScreen, RoomsScreen, SingleRoomScreen, ImageFullsizeScreen } from './screens';
import auth from '@react-native-firebase/auth';
import { UserContext, UserCredentials } from './context/auth.context';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  });

  // Set init UserCredentials, basically no one is logged in.
  const [userCred, setUserCreds] = useState<UserCredentials>({
    uid: 'unknown',
    email: 'unknown'
  })

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState();

  // Handle user state changes
  const onAuthStateChanged = (loggedInUser: any) => {
    setLoggedInUser(loggedInUser);
    console.log({loggedInUser})
    if(loggedInUser){
      setUserCreds({
        uid: loggedInUser.uid,
        name: loggedInUser.displayName ? loggedInUser.displayName : '',
        avatar_url: loggedInUser.photoURL ? loggedInUser.photoURL : '',
        email: loggedInUser.email,
    })
    }    
    
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Firebase auth listener for user state changes, logged-in or logged-out
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log("onAuthStateChanged",loggedInUser)
    return subscriber; // unsubscribe the listener on unmount
  }, []);

  if (initializing) return null;

  return(
    <UserContext.Provider value={userCred}>
      <NavigationContainer>
          {
            !loggedInUser ? (
              // User is not logged in, show login screen
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={LoginScreen} />
              </Stack.Navigator>
            ):(
              // User is logged in, show app content
              <Stack.Navigator >
                <Stack.Screen name="Rooms" component={RoomsScreen} options={{ title: 'Chat rooms',headerShown: false }}/>
                <Stack.Screen name="SingleRoom" component={SingleRoomScreen} options={{ title: 'Chat room',headerShown: false }}/>
                <Stack.Screen name="ImageFullsize" component={ImageFullsizeScreen} options={{ title: 'Image fullsize screen', presentation: 'modal',headerShown: false,}}/>
              </Stack.Navigator>
            )
          }                
      </NavigationContainer>
    </UserContext.Provider>
  )

}

export default App;
