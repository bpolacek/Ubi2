import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { io } from 'socket.io-client';

const Chat = ({ route }) => {
  const { relationship } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const socket = io('http://10.129.3.45:5555'); // replace with your server's URL

    // Join the chat room for this relationship
    socket.emit('join_chat', { relationshipId: relationship.id });

    // Load the initial messages for this chat
    socket.emit('load_chat', { relationshipId: relationship.id });

    // Update messages when 'load_messages' event is received
    socket.on('load_chat', (data) => {
      setMessages(data);
    });

    // Clean up the effect
    return () => socket.disconnect();
  }, [relationship.id]);

  const handleSend = () => {
    const socket = io('http://10.129.3.45:5555'); // replace with your server's URL

    // Send the message to the server
    socket.emit('send_message', {
      relationshipId: relationship.id,
      message: inputText,
    });

    // Clear the input field
    setInputText('');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageWrapper}>
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </View>
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
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignSelf: 'flex-start',
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
});

export default Chat;