import React from 'react';
import { StyleSheet } from 'react-native';
import MessageStack from '../navigation/MessageStack';

const MessagesScreen = () => {
  return (
    <MessageStack />
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