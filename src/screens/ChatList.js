import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import MessageContact from './MessageContact';

const ChatList = ({navigation, route}) => {
    const { messages, setMessages} = route.params;
    const[relationships, setRelationships]=useState([]);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        fetch('http://10.129.3.45:5555/relationships')
          .then(response => response.json())
          .then(data => {
            // Filter the relationships to only include those where the current user id is found in the users attribute
            const filteredRelationships = data.filter(relationship =>
              relationship.users.some(user => user.id === userInfo.user_data.id)
            );
            setRelationships(filteredRelationships);
          })
          .catch(error => console.log(error));
      }, [userInfo.user_data.id]);


      const keyExtractor = (item, index) => {
        const recordId = item?.recordId;
        return recordId ? recordId.toString() : index.toString();
      };
    useEffect(() => {
        const socket = io('http://10.129.3.45:5555');
    
        // Fetch messages
        socket.emit('get_messages');
    
        socket.on('load_messages', (data) => {
          setMessages(data);
        });
    
        // Clean up the effect
        return () => socket.disconnect();
      }, [messages]);
      return (
        <View style={styles.container}>
          <View style={styles.banner}>
          <Text style={styles.bannerText}>Your Relationships</Text>
          </View>
          <FlatList
            data={relationships}
            renderItem={({ item }) => (
              <MessageContact relationship={item} userInfo={userInfo} navigation={navigation} />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      );
    };
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#F5FCFF',
          paddingTop: 10,
          paddingHorizontal: 15,
        },
        banner: {
          backgroundColor: '#37414f',
          padding: 5,
          alignItems: 'center',
          marginBottom: 10,
          borderRadius: 5,
        },
        bannerText: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        relationshipContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          marginVertical: 5,
          backgroundColor: '#FFF',
          borderRadius: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
          elevation: 2, // for android
        },
        relationshipText: {
          fontSize: 18,
        },
        button: {
          backgroundColor: '#f5793B',
          padding: 10,
          borderRadius: 5,
        },
        buttonText: {
          color: 'white',
          fontWeight: 'bold',
        },
      });
export default ChatList;