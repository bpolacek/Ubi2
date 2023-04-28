import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const[isLoading,setIsLoading]=useState(false);
    const[userToken, setUserToken]=useState(null);
    const[userInfo, setUserInfo]= useState(null);

    const authToken = AsyncStorage.getItem('authToken');

    // const login = async(email, password) =>{
    //     setIsLoading(true);
    //     console.log(authToken)
    //     try{
    //         const response = await fetch('http://10.129.3.45:5555/login', {
    //             method: 'POST',
    //             headers: {
               
    //                 'Content-Type':'application/json',
    //                 'Authorization':`Bearer ${userToken}`
    //             },
    //             body: JSON.stringify({
    //                 email:email,
    //                 password:password,
    //             }),
    //     });
    //     const data = await response.json();
    //     console.log(data)

    //     if (data.auth_token){
    //         setUserToken(data.auth_token);
    //         setUserInfo({email:email});
    //         AsyncStorage.setItem('userInfo', JSON.stringify({email:email}));
    //         AsyncStorage.setItem('userToken', data.auth_token);
    //     }else{console.log("unsuccessful login")}
    //     } catch (error) {
    //         console.log('Login error:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
      
    // };
    const login = async(email, password) =>{
        setIsLoading(true);
        try{
            const response = await fetch('http://10.129.3.45:5555/login', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:email,
                    password:password,
                }),
        });
        const data = await response.json();
    
        if (data.auth_token){
            setUserToken(data.auth_token);
            setUserInfo({email:email});
            AsyncStorage.setItem('userInfo', JSON.stringify({email:email}));
            AsyncStorage.setItem('userToken', data.auth_token);
        }else{console.log("unsuccessful login")}
        } catch (error) {
            console.log('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    
    };

    const logout = () =>{
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false)
    }
    const isLoggedIn = async() =>{
        try{
        let userInfo = await AsyncStorage.getItem('userInfo');
        let userToken = await AsyncStorage.getItem('userToken');
        userInfo = JSON.parse(userInfo);
        setUserToken(userToken);
        setIsLoading(false);

        if ( userInfo ){
            // setUserToken(userToken);
            setUserInfo(userInfo);
        }
        setIsLoading(false);
    } catch(e) {
        console.log(`isLogged in error ${e}`)
    }finally {
        setIsLoading(false);
    }
    useEffect(()=>{
        isLoggedIn();
    },[])
}
    return(
        <AuthContext.Provider value ={{login, logout, isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
    }