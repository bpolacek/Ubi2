import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { io } from 'socket.io-client';

const MessagesList = ({navigation, route}) => {
    const { messages, setMessages} = route.params;
    useEffect(() => {
        const socket = io('http://10.129.3.45:5555');
    
        // Fetch messages
        socket.emit('get_messages');
    
        // Update messages when 'load_messages' event is received
        socket.on('load_messages', (data) => {
          setMessages(data);
        });
    
        // Clean up the effect
        return () => socket.disconnect();
      }, [messages]);
      return (
        <View>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <Text key={index}>{message.message}</Text>
            ))
          ) : (
            <Text>No messages yet</Text>
          )}
          <Button title="New Chat" onPress={() => navigation.navigate('New Chat')} />
        </View>
      );
    };

export default MessagesList;