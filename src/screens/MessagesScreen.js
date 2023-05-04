import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MessageStack from '../navigation/MessageStack';
import { io } from 'socket.io-client';

const MessagesScreen = () => {

  const [messages, setMessages] = useState([]);

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
    <MessageStack messages={messages} setMessages={setMessages}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;