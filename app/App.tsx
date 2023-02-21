/**
 * Ola - Chat App
 * https://github.com/mfk1337/Ola
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen'

import { LoginScreen, RoomsScreen } from './screens';

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

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {
          !loggedInUser ? (
            // User is not logged in, show login screen
            <Stack.Screen name="Login" component={LoginScreen} />
          ):(
            // User is logged in, show app content
            <Stack.Screen name="Rooms" component={RoomsScreen} options={{ title: 'Chat rooms' }}/>
          )
        }                
      </Stack.Navigator>
    </NavigationContainer>
  )

}



export default App;
