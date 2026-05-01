import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// We are keeping your teammate's 'createStackNavigator' import to ensure their code stays safe
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// --- 1. Import Teammate's Screens ---
import DeliveryTrackingScreen from '../screens/DeliveryTrackingScreen';

// --- 2. Import Your Screens ---
import PaymentScreen from '../screens/PaymentScreen';
import SuccessScreen from '../screens/SuccessScreen';

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
        We are setting initialRouteName to "Payment" so the app opens directly
        to your work for easy testing. When the whole app is done, your team
        will likely change this to "Home".
      */}
            <Stack.Navigator initialRouteName="Payment">

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