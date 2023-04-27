import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as Contacts from 'expo-contacts'
import Contact from './Contact';

const RelationshipsScreen = () => {
    const[contacts,setContacts] = useState([])
    const[permission,setPermission] = useState(false)
    const[index, setIndex] = useState(0);
    const[sortedContacts,setSortedContacts]=useState([])
  
    useEffect(() => {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          setPermission(true)
          const { data } = await Contacts.getContactsAsync({
            // fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
          });
          if (data.length > 0) {
            // console.log(contacts.map(contact => contact.name).sort());
            setContacts(data)
            // console.log(contacts.sort((a, b) => a.name.localeCompare(b.name)))
            // console.log(contacts.map(contact => contact.name).sort());
            // const sortedData = contacts.map(contact => contact).sort();
            const sortedData = data.slice().sort((a, b) => {
              if (a.name && b.name) {
                return a.name.localeCompare(b.name);
              }
              return 0;
            });
            // console.log(sortedData)
            setSortedContacts(sortedData)
            // console.log(sortedData)
          
          }
        } else {
          setPermission(false)
        }
      })();
    }, []);
  
    const keyExtractor = (item,index) =>{
      const recordId = item?.recordId;
      return recordId ? recordId.toString() : index.toString();
    };

    const RelationshipsScene = () => (
      <View style={styles.container}>
      <Text>Add Relationships</Text>
    </View>
    );

    const AddRelationshipScene = () => (

      <FlatList
      data={sortedContacts}
      renderItem={({ item }) => <Contact contact={item} />}
      keyExtractor={keyExtractor}
      style={styles.list}
    />
    );
  
    // const renderItem = ({item, index})=>{
    //   console.log('Contact data', item);
    //   return <Contact contact={item} />
    // }

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
  navigationState={{ index, routes: [{ key: 'relationships', title: 'Relationships' }, { key: 'addRelationship', title: 'Add Relationship' }] }}
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
  }
});

export default RelationshipsScreen;