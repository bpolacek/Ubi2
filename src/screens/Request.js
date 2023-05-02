import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Request = ({request = null}) => {
    if(!request) {
        return null;
    }
    const requester = request.requester.first_name;
    const requested = request.requested.first_name;

    const handleAccept = async () => {
      try {
        const response = await fetch(`http://10.129.3.45:5555/friend_requests/${request.id}/response`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({action: 'accept'}),
        });
        const data = await response.json();
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    const handleReject = async () => {
      try {
        const response = await fetch(`http://10.129.3.45:5555/friend_requests/${request.id}/response`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({action: 'reject'}),
        });
        const data = await response.json();
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };


    return (
        <View style={styles.contactCon}>
          <View style={styles.imgCon}>
            <View style={styles.placeholder}>
              <Text style={styles.txt}>
                {requester}
              </Text>
            </View>
          </View>
          <View style={styles.contactDat}>
            <Text style={styles.name}>
            {requester} wants to be friends with you
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={handleReject}>
                <Text style={styles.secondaryButton}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
  },
  imgCon: {},
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDat: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
    backgroundColor: '#fff'
  },
  txt: {
    fontSize: 18,
  },
  name: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#f5793b',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#222831',
    fontSize: 14,
    fontWeight: 'semi-bold'
  },
  secondaryButton:{
    color: '#f5793b', // This will be the color of the text
    fontSize: 12,
    fontWeight: 'semi-bold',
    textDecorationLine: 'underline', // This will make the text underlined
    paddingVertical: 5, // You might want to add some padding to separate the buttons
  },
});
export default Request;