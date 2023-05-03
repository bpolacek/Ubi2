import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [filteredRelationships, setFilteredRelationships]=useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [relationships, setRelationships]=useState([]);
  const { userInfo } = useContext(AuthContext);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const fetchRelationships = async () => {
    try {
      const response = await fetch('http://10.129.3.45:5555/relationships'); // Replace with your endpoint
      const data = await response.json();
      const filteredRelationships = data.filter(relationship =>
        relationship.users.some(user => user && user.id === userInfo.user_data.id) &&
        location && // Add a check for location to ensure it is not null
        calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          relationship.users.find(user => user && user.id !== userInfo.user_data.id).latitude,
          relationship.users.find(user => user && user.id !== userInfo.user_data.id).longitude
        ) <=
        ((relationship.relationship_type === "Family" && 50) ||
        (relationship.relationship_type === "Close Friends" && 30) ||
        (relationship.relationship_type === "Friends" && 15) ||
        (relationship.relationship_type === "Acquaintances" && 2) ||
        (relationship.relationship_type === "Work Friends" && 0.1) ||
        (relationship.relationship_type === "Former Colleagues" && 0.5))
      );
      setFilteredRelationships(filteredRelationships);
      console.log(filteredRelationships.map(relationship => relationship.relationship_type));
    } catch (error) {
      console.error('Error fetching relationships:', error);
    }
  };

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

    // const fetchRelationships = async () => {
    //   try {
    //     const response = await fetch('http://10.129.3.45:5555/relationships'); // Replace with your endpoint
    //     const data = await response.json();
    //     const filteredRelationships = data.filter(relationship =>
    //       relationship.users.some(user => user && user.id === userInfo.user_data.id) &&
    //       location && // Add a check for location to ensure it is not null
    //       calculateDistance(
    //         location.coords.latitude,
    //         location.coords.longitude,
    //         relationship.users.find(user => user && user.id !== userInfo.user_data.id).latitude,
    //         relationship.users.find(user => user && user.id !== userInfo.user_data.id).longitude
    //       ) <=
    //       ((relationship.relationship_type === "Family" && 50) ||
    //       (relationship.relationship_type === "Close friend" && 30) ||
    //       (relationship.relationship_type === "Friend" && 15) ||
    //       (relationship.relationship_type === "Acquaintance" && 2) ||
    //       (relationship.relationship_type === "Work friend" && 1) ||
    //       (relationship.relationship_type === "Former colleague" && 0.5))
    //     );
    //     // setRelationships(filteredRelationships);
    //     setFilteredRelationships(filteredRelationships);
    //     console.log(filteredRelationships.map(relationship => relationship.relationship_type));
    //   } catch (error) {
    //     console.error('Error fetching relationships:', error);
    //   }
    // };


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
        console.log(relationships)
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
    {filteredRelationships.map((relationship, index) => {
      const otherUser = relationship.users.find((user) => user.id !== userInfo.user_data.id);
      if (otherUser) {
        return (
          <Marker
            key={index}
            coordinate={{ latitude: otherUser.latitude, longitude: otherUser.longitude }}
            title={`${otherUser.first_name} ${otherUser.last_name}`}
            pinColor="#FF5733"
          />
        );
      }
      return null;
    })}
    {filteredRelationships.length === 0 && (
      <Marker
        key="defaultMarker"
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
        title="My Location"
      />
    )}
  </MapView>
);

};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    
  },
});

export default MapScreen;