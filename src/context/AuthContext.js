import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const[isLoading,setIsLoading]=useState(false);
    const[userToken, setUserToken]=useState(null);
    const[userInfo, setUserInfo]= useState(null);
    const[user,setUser]=useState(null)

    const login = async(email, password) =>{
        setIsLoading(true);
        try{
            const response = await fetch('http://192.168.1.30:5555/login', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:email,
                    password:password,
                }),
        });
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        const data = await response.json();
        console.log('Data',data)
        if (data.auth_token){
            setUserToken(data.auth_token);
            // setUserInfo({email:email});
            setUserInfo(data)
            console.log(`userINFO Id ${data.user_data.id}`)
            AsyncStorage.setItem('userInfo', JSON.stringify({email:email}));
            AsyncStorage.setItem('userToken', data.auth_token);
        }else{console.log("unsuccessful login")}
        } catch (error) {
            console.log('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    
    };

    const getToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
    };

    const logout = () =>{
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false)
    }
    const fetchUser = async () => {
        console.log('Token:', userToken)
        if (userToken) {
          try {
            const response = await fetch('http://192.168.1.30:5555/protected', {
              headers: {
                Authorization: `Bearer ${userToken}`
              }
            });
            const data = await response.json();
            setUser(data);
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
      };
      const isLoggedIn = async () => {
        try {
          let userInfo = await AsyncStorage.getItem('userInfo');
          let userToken = await AsyncStorage.getItem('userToken');
          userInfo = JSON.parse(userInfo);
          setUserToken(userToken);
          setIsLoading(false);
    
          if (userInfo) {
            setUserInfo(userInfo);
          }
          setIsLoading(false);
        } catch (e) {
          console.log(`isLogged in error ${e}`);
        } finally {
          setIsLoading(false);
        }
      };
    useEffect(()=>{
        getToken();
        isLoggedIn();
        fetchUser();
    },[]);
    console.log(`HI Hi Hi ${userInfo}`)
    return(
        <AuthContext.Provider value ={{login, logout, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    );
};