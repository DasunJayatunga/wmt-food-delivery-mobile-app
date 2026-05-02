import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeliveryTrackingScreen from '../screens/DeliveryTrackingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="DeliveryTracking"
          component={DeliveryTrackingScreen}
          initialParams={{ deliveryId: '69f5bf380d546ea90bc17406' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
