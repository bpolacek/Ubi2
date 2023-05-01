import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RelationshipsPicker from './RelationshipsPicker';

const Relationship = ({ relationship = null }) => {
  const navigation = useNavigation();
  const [relationshipType, setRelationshipType] = useState(
    relationship?.relationship_type || ''
  );

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
      console.log(data);
      // Update the state with the new relationship type
      setRelationshipType(data.relationship_type);
    } else {
      console.log('Error updating relationship type');
    }
  };

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

  const user2 = relationship.users[1];

  return (
    <View style={styles.contactCon}>
      <View style={styles.imgCon}>
        <View style={styles.placeholder}>
          <Text style={styles.txt}>{relationshipType}</Text>
        </View>
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>
          {user2.first_name} {user2.last_name}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RelationshipsPicker', { relationship })}>
            <Text style={styles.buttonText}>Update Relationship</Text>
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
    fontSize: 18,
  },
  name: {
    fontSize: 16,
  },
  phoneNumber: {
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width:140,
    height:40
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
export default Relationship;