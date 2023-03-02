/**
 * Ola - Chat App
 * https://github.com/mfk1337/Ola
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen'

import { LoginScreen, RoomsScreen, SingleRoomScreen, ImageFullsizeScreen } from './screens';

import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  });

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState();

  // Handle user state changes
  const onAuthStateChanged = (loggedInUser: any) => {
  setLoggedInUser(loggedInUser);
  
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  console.log(loggedInUser)

  /**
   * mfk: hJr4w8043aRo08DFceOr5ApEaNR2
   * bear: 2sHbgIZRSIQJlot6kiWQRVIxqsS2
   * 
   */

  return(
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
  )

}

export default App;
