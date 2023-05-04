import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Relationship from './Relationship';
import MessageContact from './MessageContact';

const NewChat = ({navigation, route}) => {
    const { messages, setMessages, chats, setChats} = route.params;

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

      return (
        <View style={styles.container}>
          <Text>Your Relationships</Text>
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
      backgroundColor: '#2196F3',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
export default NewChat;