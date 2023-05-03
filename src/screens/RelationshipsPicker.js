import React, { useDebugValue, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const RelationshipsPicker = ({ route }) => {
  const navigation = useNavigation();
  const { relationship }=route.params;
const [relationshipType, setRelationshipType] = useState(relationship.relationship_type || " ");
  const updateRelationshipType = async () => {
    const response = await fetch(
      `http://10.129.3.45:5555/relationships/${relationship.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relationship_type: relationshipType,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      // Update the state with the new relationship type
      setRelationshipType(data.relationship_type);
    } else {
      console.log('Error updating relationship type');
    }
    navigation.navigate('RelationshipsScreen');
  };
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={relationshipType}
        onValueChange={itemValue => setRelationshipType(itemValue)}>
        <Picker.Item label="Family" value="Family" />
        <Picker.Item label = "Close Friends" value = "Close Friends" />
        <Picker.Item label="Friends" value="Friends" />
        <Picker.Item label="Acquaintances" value="Acquaintances" />
        <Picker.Item label="Work Friends" value="Work Friends" />
        <Picker.Item label="Former Colleagues" value="Former Colleagues" />
      </Picker>
      <TouchableOpacity style={styles.button} title="Update Relationship Type" onPress={updateRelationshipType}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
  },
  imgCon: {},
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDat: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
    backgroundColor: '#fff'
  },
  txt: {
    fontSize: 18,
  },
  name: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#f5793b',
    padding: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#222831',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RelationshipsPicker;