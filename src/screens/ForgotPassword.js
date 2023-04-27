import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView} from 'react-native'
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from '@react-navigation/native'


const ForgotPassword = () => {
    const[email, setEmail] =useState('')

    const navigation = useNavigation();


    const onSendPressed = () =>{
        console.warn("Sign Up");
        navigation.navigate('Forgot Password')
    }
    const onSignInPress = () =>{
        console.warn("Sign In Back");
        navigation.navigate('Sign In')
    }

    return(
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title}>Reset your Password</Text>
            <CustomInput 
            placeholder="Email Address" 
            value={email} 
            onChangeText={text=>setEmail(text)}/>
            
        <CustomButton text="Send" onPress={()=>{onSendPressed(email)}}/>
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
export default ForgotPassword;