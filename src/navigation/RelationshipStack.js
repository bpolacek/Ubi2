import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RelationshipsPicker from '../screens/RelationshipsPicker';
import RelationshipsScreen from '../screens/RelationshipsScreen';

const Stack = createStackNavigator();

const RelationshipsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RelationshipsScreen" component={RelationshipsScreen} />
      <Stack.Screen name="RelationshipsPicker" component={RelationshipsPicker} />
    </Stack.Navigator>
  );
};

export default RelationshipsStack;