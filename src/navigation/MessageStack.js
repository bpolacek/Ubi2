import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../screens/Chat';
import NewChat from '../screens/NewChat';
import MessagesList from '../screens/MessagesList';
import MessageContact from '../screens/MessageContact';
import ChatButton from '../screens/ChatButton';

const Stack = createStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages List" component={MessagesList} />
      <Stack.Screen name="New Chat" component={NewChat} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Chat Button" component={ChatButton} />
      <Stack.Screen name="Message Contact" component={MessageContact} />


    </Stack.Navigator>
  );
};

export default MessageStack;