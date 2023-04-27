import {View,Text, ActivityIndicator } from 'react-native'
import React, {useContext} from 'react'

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainStack from './MainStack'
import { AuthContext } from '../context/AuthContext';

const AppNav = () =>{
    const {isLoading, userToken} = useContext(AuthContext);
    
    if( isLoading) {
        return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'}/>
        </View>
        );
    }
    return(
    <NavigationContainer>
        { userToken !== null ? <MainStack/> : <AuthStack /> }
    </NavigationContainer>
    );
}
export default AppNav;