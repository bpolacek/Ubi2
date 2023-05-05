import React from "react";
import { View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIns from '../screens/SignIns';
import SignUps from '../screens/SignUps';
import ForgotPassword from '../screens/ForgotPassword';
// import ConfirmEmail from '../screens/ConfirmEmail';
import ResetPassword from '../screens/ResetPassword';

const Stack = createNativeStackNavigator();

const AuthStack = () =>{
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Sign In" component={SignIns} />
          <Stack.Screen name="Sign Up" component={SignUps} />
          {/* <Stack.Screen name="Confirm Email" component={ConfirmEmail} /> */}
          <Stack.Screen name="Reset Password" component={ResetPassword} />
          <Stack.Screen name="Forgot Password" component={ForgotPassword} />
        </Stack.Navigator>
      );
    };
    
export default AuthStack;