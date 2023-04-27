import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as Contacts from 'expo-contacts'
import Contact from './Contact';

const RelationshipsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [permission, setPermission] = useState(false);
  const [index, setIndex] = useState(0);
  const [sortedContacts, setSortedContacts] = useState([]);

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

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredContacts = sortedContacts.filter((contact) =>
    contact.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const keyExtractor = (item, index) => {
    const recordId = item?.recordId;
    return recordId ? recordId.toString() : index.toString();
  };

  const RelationshipsScene = () => (
    <View style={styles.container}>
      <Text>Add Relationships</Text>
    </View>
  );

  const AddRelationshipScene = () => {
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
          data={filteredContacts}
          renderItem={({ item }) => <Contact contact={item} />}
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
  }
});

export default RelationshipsScreen;