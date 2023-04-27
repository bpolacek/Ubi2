import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapScreen from './src/screens/MapScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import AccountScreen from './src/screens/AccountScreen';
import RelationshipsScreen from './src/screens/RelationshipsScreen';
import { AuthProvider } from './src/context/AuthContext'
import AppNav from './src/navigation/AppNav';
import * as Contacts from 'expo-contacts'
import Contact from './src/screens/Contact';

export default function App() {

  const[user,setUser]=useState(null)

  const handleSignIn = () =>{
    setIsAuthenticated(true);
  }
  
  const handleUser = (userData) => {
    setUser(userData)
  }

  return (
    <>
    <AuthProvider>
    <StatusBar style="auto" />
      <AppNav />
    </AuthProvider>
  </>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
