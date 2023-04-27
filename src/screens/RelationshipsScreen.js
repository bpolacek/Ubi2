import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as Contacts from 'expo-contacts'
import Contact from './Contact';

const RelationshipsScreen = () => {
    const[contacts,setContacts] = useState([])
    const[permission,setPermission] = useState(false)
    const[index, setIndex] = useState(0);
  
    useEffect(() => {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          setPermission(true)
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
          });
          console.log(`${data.Contacts} data from Contacts`)
          if (data.length > 0) {
            setContacts(data)
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
  
    const renderItem = ({item, index})=>{
      console.log('Contact data', item);
      return <Contact contact={item} />
    }
  return (
    <View style={styles.container}>
      <Text>Relationships Screen</Text>
      {permission ? (
      <FlatList
      data={contacts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      />
      ) : (
        <Text>We need permission to access your contacts.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list:{
    flex:1,
    width:"100%"
  }
});

export default RelationshipsScreen;