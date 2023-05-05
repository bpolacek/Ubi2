import React from 'react';
import { View, Text } from 'react-native';
import ChatButton from './ChatButton';
import { io } from 'socket.io-client';

const MessageContact = ({ relationship, userInfo, navigation }) => {
  const otherUser = relationship.users.find(user => user.id !== userInfo.user_data.id);
  const socket = io('http://10.129.3.45:5555');

  return (
    <View>
    <Text style={styles.name}>{otherUser.first_name} {otherUser.last_name}</Text>
    <Text style={styles.relationshipType}> ({relationship.relationship_type})</Text>
    <ChatButton onPress={() => navigation.navigate('Chat', { relationship, otherUser, userInfo })} />
  </View>
  );
};
const styles = {
    name: {
      fontSize: 20, // Adjust the size as needed
      fontWeight: 'bold',
    },
    relationshipType: {
      fontSize: 16, // Adjust the size as needed
    },
  };
export default MessageContact;