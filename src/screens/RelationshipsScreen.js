import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as Contacts from 'expo-contacts'
import Contact from './Contact';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Relationship from './Relationship';
import Request from './Request';
import { AuthContext } from '../context/AuthContext';
import { WebView } from 'react-native-webview';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const RelationshipsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [permission, setPermission] = useState(false);
  const [index, setIndex] = useState(0);
  const [sortedContacts, setSortedContacts] = useState([]);
  // const[authenticatedUsers, setIsAuthenticatedUsers] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([]);
  const[relationships, setRelationships]=useState([]);
  const[requests, setRequests]=useState([]);
  const[users,setUsers]=useState([]);

  const navigation = useNavigation();

  const { userInfo } = useContext(AuthContext);
  // console.log(userInfo.user_data.id);

  const url = 'http://192.168.1.30:5555/users'
  // const authToken = AsyncStorage.getItem('authToken');
useEffect(() =>{
  fetch(url)
  .then(response => response.json())
  .then(data => {
    setUsers(data);
    const phoneNumbers = [...new Set(data.map(user => {
      // Ensure user.phone_number is not null or undefined before trying to replace
      return user.phone_number ? user.phone_number.replace(/\D/g, '') : null;
    }))].filter(Boolean); // Filter out null and undefined values

    const filtered = sortedContacts.filter(contact => {
      let found = false;
      if (contact.phoneNumbers) {
        contact.phoneNumbers.forEach(phone => {
          // Check if phone.number exists and is a string before trying to call .replace()
          if (phone.number && typeof phone.number === 'string') {
            const normalizedPhone = phone.number.replace(/\D/g, '');
            if (phoneNumbers.includes(normalizedPhone)) {
              found = true;
            }
          }
        });
      }
      return found;
    });
    const contactsWithUsers = filtered.map(contact => {
      const user = data.find(user=>user.phone_number === contact.phoneNumbers[0].number.replace(/\D/g, ''));
      return {...contact, user: user || {} };
    });
    
    setFilteredContacts(contactsWithUsers);
  })
  .catch(error => console.log(error));
  }, [sortedContacts]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setPermission(true);
        const { data } = await Contacts.getContactsAsync();
        if (data.length > 0) {
          setContacts(data);
          const sortedData = data
            .slice()
            .sort((a, b) => {
              if (a.name && b.name) {
                return a.name.localeCompare(b.name);
              }
              return 0;
            });
          setSortedContacts(sortedData);
        }
      } else {
        setPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetch('http://192.168.1.30:5555/relationships')
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

  useEffect(() => {
   
    fetch('http://192.168.1.30:5555/friend_requests')
      .then(response => response.json())
      .then(data => {
        // Filter the requests to only include those where the requested user id matches the userInfo id
        // console.log(data)
        const requestedIds = data.map(request => request.requested_id);
        // console.log(requestedIds);
        const filteredRequests = data.filter(request => request.requested_id === userInfo.user_data.id && request.status === "pending");
        setRequests(filteredRequests);
        console.log(filteredRequests)
      })
      .catch(error => console.log(error))
  }, [userInfo.user_data.id]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const searchedContacts = filteredContacts.filter((contact) =>
    contact.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const keyExtractor = (item, index) => {
    const recordId = item?.recordId;
    return recordId ? recordId.toString() : index.toString();
  };

  const RelationshipsScene = () => (
    
    <View style={styles.container}>
      <Text>Requests</Text>
      <FlatList 
        data={requests}
        renderItem={({ item }) => <Request request={item} />}
        keyExtractor={item => item.id.toString()}      
      />
      <Text>Your Relationships</Text>
      <FlatList
        data={relationships}
        renderItem={({ item }) => <Relationship relationship={item} userInfo={userInfo} />}
        keyExtractor={item => item.id.toString()}
    />
    </View>
  );

  const AddRelationshipScene = () => {
    const friendRequestStatus = (user) => {
      const relationship = relationships.find(relationship =>
        relationship.users.some(u => u.id === user.id)
      );
      if (relationship) {
        return 'already_connected';
      } else {
        const request = requests.find(request => request.requested_id === user.id);
        return request ? request.status : 'not_requested';
      }
    };
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <FlatList
          data={searchedContacts}
          renderItem={({ item }) => <Contact 
          contact={item} 
          user = {item.user} 
          userId={userInfo.user_data.id}
          friendRequestStatus={friendRequestStatus(item.user)}
           />}
          keyExtractor={keyExtractor}
          style={styles.list}
          keyboardDismissMode='none'
        />
      </View>
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  function handleRefresh() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'RelationshipsScreen' }], // Replace 'Home' with the name of your root screen
      })
    );
  }
  

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{
          index,
          routes: [
            { key: 'relationships', title: 'Relationships' },
            { key: 'addRelationship', title: 'Add Relationship' },
          ],
        }}
        renderScene={SceneMap({
          relationships: RelationshipsScene,
          addRelationship: AddRelationshipScene,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={renderTabBar}
      />
      <View style={styles.refreshContainer}>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list:{
    flex:1,
  },
  tabBar:{
    backgroundColor:'#f1f1f1',
    
  },
  tabIndicator: {
    backgroundColor: "#333",
  },
  tabLabel: {
    color: 'black',
  },
  searchBarContainer:{
    padding: 5,
    height:30
  },
  refreshContainer:{
    position: 'absolute',
    bottom:0,
    width:'100%',
    alignItems: 'center'
  },
  refreshButton: {
    backgroundColor: '#37414f',
    padding: 10,
    borderRadius: 20,
    width: '50%',
    alignItems: 'center',
    
  },
  refreshText: {
    color: "#fff",
    fontSize: 18
  }
});

export default RelationshipsScreen;