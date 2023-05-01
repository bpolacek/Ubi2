import {View,Text} from 'react-native'
import React, { useContext, useState, useEffect, create } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import MessagesScreen from '../screens/MessagesScreen';
import AccountScreen from '../screens/AccountScreen';
import RelationshipsStack from './RelationshipStack';
import RelationshipsScreen from '../screens/RelationshipsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'

const Tab = createBottomTabNavigator();

function MainStack() {

    return (
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Relationships" component={RelationshipsStack} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    );
  };

  export default MainStack;