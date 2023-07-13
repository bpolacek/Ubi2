import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Chat = ({ route }) => {
  const { relationship, otherUser, userInfo } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef();

  console.log(otherUser);
  console.log(`chat user info ${userInfo}`)

  const storeMessages = async (messages) => {
    try {
      const jsonValue = JSON.stringify(messages);
      await AsyncStorage.setItem(`messages_${relationship.id}`, jsonValue);
    } catch (e) {
      console.error(e);
    }
  };
  
  const loadMessages = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`messages_${relationship.id}`);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const storedMessages = await loadMessages();
      setMessages(storedMessages);
    })();
  
    socketRef.current = io('http://192.168.1.30:5555'); 
  
    // Join the chat room for this relationship
    socketRef.current.emit('join_chat', { relationshipId: relationship.id });
  
    // Load the initial messages for this chat
    socketRef.current.emit('load_chat', { relationshipId: relationship.id });
  
    // Update messages when 'load_messages' event is received
    socketRef.current.on('load_chat', (data) => {
      setMessages(data);
      storeMessages(data);
    });
  
    socketRef.current.on('new_message', (data) => {
      setMessages((prevMessages) => {
        data.timestamp=new Date(data.timestamp);
        const newMessages = [...prevMessages, data];
        storeMessages(newMessages);
        return newMessages;
      });
    });
  
    // Clean up the effect
    return () => socketRef.current.disconnect();
  }, [relationship.id, socketRef]);

  const handleSend = () => {
    // Send the message to the server
    socketRef.current.emit('send_message', {
      relationshipId: relationship.id,
      message: inputText,
      user_1: userInfo.user_data.id,
      user_2: otherUser.id,
      timestamp: Date.now(),
    });
  
    // Clear the input field
    setInputText('');
  };
  

  console.log(messages.length > 0 ? messages[0] : 'No messages');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
    style={styles.container}>
    <ScrollView>
      <View style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={[
            styles.messageWrapper,
            message.user_1 === userInfo.user_data.id ? styles.myMessage : styles.otherUserMessage
          ]}>
            <Text style={styles.messageText}>{message.message}</Text>
            <Text style={styles.timestampText}>
              {new Date(message.timestamp).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
    <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
      padding: 10,
    },
    messageWrapper: {
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#DCF8C6',
    },
    otherUserMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#f2f2f2',
    },
    messageText: {
      fontSize: 16,
    },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timestampText: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
});

export default Chat;