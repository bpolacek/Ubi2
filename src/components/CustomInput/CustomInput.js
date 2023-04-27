import React from "react";
import { View, TextInput, StyleSheet} from 'react-native'

const CustomInput = ({value, placeholder, onChangeText, secureTextEntry}) =>{
    return(
        <View style={styles.container}>
            <TextInput 
            value={value} 
            onChangeText={onChangeText} 
            placeholder={placeholder} 
            style={styles.input}
            secureTextEntry={secureTextEntry}></TextInput>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#37414f',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    input:{
        height:40,
    }
})
export default CustomInput;