import React, { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, ScrollView} from 'react-native'
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from '@react-navigation/native'


const ConfirmEmail = () => {
    const[code, setCode] =useState('')

    const navigation = useNavigation();

    const onConfirmPressed = () =>{
        console.warn("Sign Up");
        navigation.navigate('Map')
    }
    const onResendPress = () =>{
        console.warn("Resend Code");
    }
    const onSignInPress = () =>{
        console.warn("Sign In Back");
        navigation.navigate('Sign In')
    }

    return(
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title}>Confirm your Email</Text>
            <CustomInput 
            placeholder="Enter your Confirmation Code" 
            value={code} 
            onChangeText={text=>setCode(text)}/>
            
        <CustomButton text="Confirm" onPress={()=>{onConfirmPressed(code)}}/>
        <CustomButton text="Resend Code" onPress={onResendPress} type="SECONDARY"/>
        <CustomButton text="Back to Sign In" onPress={onSignInPress} type="TERTIARY"/>
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
export default ConfirmEmail;