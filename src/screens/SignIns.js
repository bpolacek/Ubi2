import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity} from 'react-native'
import Logo from "../../assets/images/Logosmall.png"
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from "../context/AuthContext";


const SignIns = () => {
    const[email, setEmail] =useState('')
    const[password, setPassword]=useState('')
    const {height} = useWindowDimensions();
    const navigation = useNavigation();
    const {login} = useContext(AuthContext);

    const handleUserSignIn = () => {
    
                navigation.navigate('Map');
    }

    const onForgotPasswordPress = () =>{
        navigation.navigate('Forgot Password')
    }
    const onSignUpPress = () =>{
        navigation.navigate('Sign Up')
    }
    return(
        <ScrollView>
        <View style={styles.root}>
            <Image source={Logo} style={[styles.logo, {height: height * 0.4}]} resizeMode="contain" />

        <CustomInput 
            placeholder="Email Address" 
            value={email} 
            onChangeText={text => setEmail(text)}/>

        <CustomInput 
            placeholder="Password" 
            value={password} 
            onChangeText={text=>setPassword(text)} 
            secureTextEntry={true}/>

        <CustomButton text="Sign In" onPress={()=>{login(email, password)}}/>
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
        width:'40%',
        maxWidth: 200,
        maxHeight:200,
    },
});
export default SignIns;