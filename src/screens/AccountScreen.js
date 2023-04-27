import React, {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";

const AccountScreen = () => {
  const {logout} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <CustomButton text="Logout" onPress={()=>{logout()}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccountScreen;