import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";

const AccountScreen = () => {
  const { logout } = useContext(AuthContext);
  const [imageSource, setImageSource] = useState(null);

  const showImagePicker = async () => {
    // Request camera roll permissions if necessary
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImageSource(result.uri);
      // TODO: Implement the logic to upload the image to your server and set it as the user's profile picture.
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Profile Picture" onPress={showImagePicker} />
      {imageSource && (
        <Image source={{ uri: imageSource }} style={{ width: 100, height: 100 }} />
      )}
      <CustomButton text="Logout" onPress={() => logout()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AccountScreen;