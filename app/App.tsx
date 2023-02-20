/**
 * Ola - Chat App
 * https://github.com/mfk1337/Ola
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen'

import { LoginScreen } from './screens';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  });

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}



export default App;
