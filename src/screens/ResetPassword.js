import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView} from 'react-native'
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from '@react-navigation/native'



const ResetPassword = () => {
    const[code, setCode] =useState('')
    const[newPassword, setNewPassword]=useState('')

    const navigation = useNavigation();


    const onSubmitPressed = () =>{
        console.warn("Sign Up");
        navigation.navigate('Map')
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
            placeholder="Code" 
            value={code} 
            onChangeText={text=>setCode(text)}/>
            <CustomInput 
            placeholder="Enter New Password" 
            value={newPassword} 
            onChangeText={text=>setNewPassword(text)}/>
            
        <CustomButton text="Submit" onPress={()=>onSubmitPressed(code, newPassword)}/>
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
export default ResetPassword;