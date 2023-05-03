import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { io } from 'socket.io-client';

const MessagesList = ({navigation}) => {
    const [messages,setMessages]=useState([]);
    useEffect(() => {
        const socket = io('http://10.129.3.45:5555'); // replace with your server's URL
    
        // Fetch messages
        socket.emit('get_messages');
    
        // Update messages when 'load_messages' event is received
        socket.on('load_messages', (data) => {
          setMessages(data);
        });
    
        // Clean up the effect
        return () => socket.disconnect();
      }, []);
      return (
        <View>
          {messages.map((message, index) => (
            <Text key={index}>{message.message}</Text> 
          ))}
          <Button title="New Chat" onPress={()=> navigation.navigate('New Chat')} />
        </View>
      );

}
export default MessagesList;