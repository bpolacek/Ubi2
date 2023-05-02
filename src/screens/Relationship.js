import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RelationshipsPicker from './RelationshipsPicker';

const Relationship = ({ relationship = null, userInfo }) => {
  const navigation = useNavigation();
  const [relationshipType, setRelationshipType] = useState(
    relationship?.relationship_type || ''
  );

  const handlePress = () => {
    navigation.navigate('RelationshipsPicker', {
        relationshipType,
        setRelationshipType,
        relationship
    });
  };

  if (!relationship) {
    return null;
  }

  if (relationship.users.length < 2) {
    console.warn('Relationship does not contain enough users');
    return null;
  }
console.log(userInfo)
  const friend = relationship.users.find(user => user.first_name !== userInfo.user_data.first_name);
  console.log(friend[0]);

  const deleteRelationship = async () => {
    const response = await fetch(
      `http://10.129.3.45:5555/relationships/${relationship.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      console.log('Relationship deleted successfully');
      Alert.alert('Relationship deleted successfully');
    } else {
      console.log('Error deleting relationship');
    }
  };

  return (
    <View style={styles.contactCon}>
      <View style={styles.imgCon}>
        <View style={styles.placeholder}>
          <Text style={styles.txt}>{relationshipType}</Text>
        </View>
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>
          {friend.first_name} {friend.last_name}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RelationshipsPicker', { relationship })}>
            <Text style={styles.buttonText}>Update Relationship</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteRelationship}>
            <Text style={styles.secondaryButton}>Delete Relationship</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  phoneNumber: {
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#f5793b',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width:150,
    height:40
  },
  buttonText: {
    color: '#222831',
    fontSize: 12,
    fontWeight: 'semi-bold',
  },
  secondaryButton:{
    color: '#f5793b', // This will be the color of the text
    fontSize: 12,
    fontWeight: 'semi-bold',
    textDecorationLine: 'underline', // This will make the text underlined
    paddingVertical: 5, // You might want to add some padding to separate the buttons
  },
});
export default Relationship;