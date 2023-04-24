import React, { useState } from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from 'react-native'
import Logo from "../../Logo.png"
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";


const SignIns = () => {
    const[emailaddress, setEmailAddress] =useState('')
    const[password, setPassword]=useState('')
    const {height} =useWindowDimensions();

    const onSignInPress = () =>{
        console.warn("Sign In");
    }
    const onForgotPasswordPress = () =>{
        console.warn("Forgot Password")
    }
    const onSignUpPress = () =>{
        console.warn("User Signup")
    }
    return(
        <ScrollView>
        <View style={styles.root}>
            <Image source={Logo} styles={[styles.logo, {height:height * 0.3}]} resizeMode="contain" />

        <CustomInput 
            placeholder="Email Address" 
            value={emailaddress} 
            setValue={setEmailAddress}/>
        <CustomInput 
            placeholder="Password" 
            value={password} 
            setValue={setPassword} 
            secureTextEntry={true}/>

        <CustomButton text="Sign In" onPress={onSignInPress}/>
        <CustomButton text="Forgot Password" onPress={onForgotPasswordPress} type="TERTIARY"/>
        <CustomButton text="Don't have an Account? Create One" onPress={onSignUpPress} type="TERTIARY"/>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width:'70%',
        maxWidth: 350,
        maxHeight:200,
    },
});
export default SignIns;