import React from 'react';
import { View, Text } from 'react-native';
import ChatButton from './ChatButton';

const MessageContact = ({ relationship, userInfo, navigation }) => {
  const otherUser = relationship.users.find(user => user.id !== userInfo.user_data.id);

  return (
    <View>
      <Text>
        {otherUser.first_name} {otherUser.last_name} ({relationship.relationship_type})
      </Text>
      <ChatButton onPress={() => navigation.navigate('Chat', { relationship })} />
    </View>
  );
};

export default MessageContact;