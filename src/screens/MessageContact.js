import React from 'react';
import { View, Text } from 'react-native';
import ChatButton from './ChatButton';
import { io } from 'socket.io-client';

const MessageContact = ({ relationship, userInfo, navigation }) => {
  const otherUser = relationship.users.find(user => user.id !== userInfo.user_data.id);
  const socket = io('http://10.129.3.45:5555');

  return (
    <View>
      <Text>
        {otherUser.first_name} {otherUser.last_name} ({relationship.relationship_type})
      </Text>
      <ChatButton onPress={() => navigation.navigate('Chat', { relationship, otherUser, userInfo })} />
    </View>
  );
};

export default MessageContact;