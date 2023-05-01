import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Relationship = ({relationship = null}) => {
    if(!relationship) {
        return null;
    }

    console.log(relationship)

    if (relationship.users.length < 2) {
        console.warn('Relationship does not contain enough users');
        return null;
    }

    const user1 = relationship.users[0];
    const user2 = relationship.users[1];

    return (
        <View style={styles.contactCon}>
          <View style={styles.imgCon}>
            <View style={styles.placeholder}>
              <Text style={styles.txt}>
                {relationship.relationship_type}
              </Text>
            </View>
          </View>
          <View style={styles.contactDat}>
            <Text style={styles.name}>
              {/* {user1.first_name} {user1.last_name}  */}
            {user2.first_name} {user2.last_name}
            </Text>
            {/* <Text style={styles.phoneNumber}>
              {relationship.relationship_types.type}
            </Text> */}
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
});
export default Relationship;