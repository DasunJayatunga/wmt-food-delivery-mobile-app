import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

import DeliveryTrackingScreen from '../screens/DeliveryTrackingScreen';


import PaymentScreen from '../screens/PaymentScreen';
import SuccessScreen from '../screens/SuccessScreen';
import CartScreen from '../screens/CartScreen';

// --- 3. Temporary Placeholder Screens ---
const DummyHomeScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>🏠 Home Page</Text>
    </View>
);
const DummyOrderScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>🍔 Order Page</Text>
    </View>
);

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            {/*
        We are setting initial Route Name to "Payment" so the app opens directly
        to your work for easy testing. When the whole app is done, your team
        will likely change this to "Home".
      */}
            <Stack.Navigator initialRouteName="Cart">

                <Stack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ title: 'My Cart' }}
                />

                {/* === TEAMMATE'S ROUTES === */}
                <Stack.Screen
                    name="DeliveryTracking"
                    component={DeliveryTrackingScreen}
                    initialParams={{ deliveryId: 'PASTE_YOUR_DELIVERY_ID_HERE' }}
                    options={{ title: 'Track Delivery' }}
                />

                {/* === YOUR PAYMENT ROUTES === */}
                <Stack.Screen
                    name="Payment"
                    component={PaymentScreen}
                    options={{ title: 'Checkout' }}
                />

                <Stack.Screen
                    name="Success"
                    component={SuccessScreen}
                    options={{ headerShown: false }} // Hides the top header for a cleaner look
                />

                <Stack.Screen
                    name="Home"
                    component={DummyHomeScreen}
                    options={{ title: 'Home' }}
                />

                <Stack.Screen
                    name="Order"
                    component={DummyOrderScreen}
                    options={{ title: 'Menu' }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;