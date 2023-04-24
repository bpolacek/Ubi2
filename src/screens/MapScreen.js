import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import * as Location from 'expo-location';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
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
      } catch (error) {
        setErrorMsg('Error while retrieving location');
      }
    })();
  }, []);

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
    region={region} // Use the 'region' prop instead of 'initialRegion'
    showsUserLocation={true}
  />
);
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    
  },
});

export default MapScreen;