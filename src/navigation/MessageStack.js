import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../screens/Chat';
import NewChat from '../screens/NewChat';
import MessagesList from '../screens/MessagesList';
import MessageContact from '../screens/MessageContact';
import ChatButton from '../screens/ChatButton';

const Stack = createStackNavigator();

const MessageStack = ({messages, setMessages}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages List" component={MessagesList} initialParams={{messages:messages, setMessages: setMessages}}/>
      <Stack.Screen name="New Chat" component={NewChat} initialParams={{messages:messages, setMessages: setMessages}} />
      <Stack.Screen name="Chat" component={Chat} initialParams={{messages:messages, setMessages: setMessages}} />
      <Stack.Screen name="Chat Button" component={ChatButton} />
      <Stack.Screen name="Message Contact" component={MessageContact} initialParams={{messages:messages, setMessages:setMessages}} />
    </Stack.Navigator>
  );
};

export default MessageStack;