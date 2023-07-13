import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity} from 'react-native'
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUps = () => {
    const[email, setEmail] =useState('')
    const[password, setPassword]=useState('')
    const[firstName, setFirstName] = useState('')
    const[lastName, setLastName]=useState('')
    const[phoneNumber, setPhoneNumber]=useState('')
   
    const navigation = useNavigation();

    async function signUp(firstName, lastName, email, phoneNumber, password) {
        
        try {
          const response = await fetch('http://192.168.1.30:5555/signup', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone_number: phoneNumber,
              password: password,
            })
          });
          console.log("hello")
          const responseData = await response.json();

          if(response.status === 200) {
            await AsyncStorage.setItem('authToken', responseData.auth_token);
          }

          return response.status;

        } catch (error) {
            console.log("hello fail")
            console.error(error.message);
            return null;
        }
    }
      
  

      const onCreateAccountPressed = async () => {
          const responseStatus = await signUp(firstName, lastName, email, phoneNumber, password);
          if (responseStatus === 200) {
            navigation.navigate('Sign In');
          } else {
            console.warn('Error signing up');
          }
      };

    const onSignInPress = () =>{
        navigation.navigate('Sign In')
    }

    return(
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title}>Create an Account</Text>
            <CustomInput 
            placeholder="First Name" 
            value={firstName} 
            onChangeText={text=>setFirstName(text)}/>
            <CustomInput 
            placeholder="Last Name" 
            value={lastName} 
            onChangeText={text=>setLastName(text)}/>
            <CustomInput 
                placeholder="Email Address" 
                value={email} 
                onChangeText={text => setEmail(text)} />
            <CustomInput 
                placeholder="Phone Number" 
                value={phoneNumber} 
                onChangeText={text=>setPhoneNumber(text)}/>
            <CustomInput 
                placeholder="Password" 
                value={password} 
                onChangeText={text=>setPassword(text)} 
                secureTextEntry={true}/>

        <CustomButton text="Create Account" onPress={()=>onCreateAccountPressed(firstName,lastName,email,phoneNumber,password)}/>

        <CustomButton text="Have an Account? Sign In" onPress={onSignInPress} type="TERTIARY"/>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize:24,
        fontWeight:'bold',
        color: '#222831',
        margin: 10,
    }
});
export default SignUps;