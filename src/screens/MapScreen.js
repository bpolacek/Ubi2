import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [relationships, setRelationships]=useState([]);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const updateUserLocation = async (latitude, longitude) => {
      const userId = userInfo?.user_data?.id;
      if (!userId) {
        console.log('User info not available');
        return;
      }

      try {
        const response = await fetch(`http://10.129.3.45:5555/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude,
            longitude,
          }),
        });

        if (response.ok) {
          console.log('User location updated successfully');
        } else {
          console.log('Error updating user location');
        }
      } catch (error) {
        console.error('Error updating user location:', error);
      }
    };

    const fetchRelationships = async () => {
      try {
        const response = await fetch('http://10.129.3.45:5555/relationships'); // Replace with your endpoint
        const data = await response.json();
        setRelationships(data);
      } catch (error) {
        console.error('Error fetching relationships:', error);
      }
    };

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        updateUserLocation(location.coords.latitude, location.coords.longitude);
        fetchRelationships();
      } catch (error) {
        setErrorMsg('Error while retrieving location');
      }
    })();
  }, [userInfo]);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Fetching location...</Text>;
  }
  return (
    <MapView
    style={styles.map}
    provider={PROVIDER_GOOGLE}
    region={region}
    showsUserLocation={true}
  >
    {relationships.map((relationship, index) => {
      const user = relationship.users.find(user => user.first_name !== userInfo.user_data.first_name);

      // Replace user.latitude and user.longitude with the actual paths to the latitude and longitude in your data
      // Assuming each user in the relationship has a 'location' property that has 'latitude' and 'longitude'
      if (user?.latitude && user?.longitude) {
        return (
          <Marker
            key={index}
            coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            title={`${user.first_name} ${user.last_name}`}
          />
        );
      }
      return null;
    })}
  </MapView>
);
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    
  },
});

export default MapScreen;