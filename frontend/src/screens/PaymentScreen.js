import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';

const PaymentScreen = ({ navigation }) => {
    // Simulating the user and their cart for testing purposes
    const userId = "user_12345";
    const cartItems = [
        { id: 1, name: 'Lemon Juice', price: 100, quantity: 2, discount: 0 },
        { id: 2, name: 'Chicken Burger', price: 200, quantity: 3, discount: 20 }
    ];

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    // Calculate total purely for displaying on the screen
    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += (item.price * item.quantity) - (item.discount || 0);
        });
        return total;
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;

            const response = await axios.post(`${apiUrl}/api/payment/process`, {
                userId: userId,
                cartItems: cartItems,
                paymentMethod: paymentMethod
            });

            if (paymentMethod === 'CARD' && response.data.url) {
                Linking.openURL(response.data.url);
            } else if (paymentMethod === 'COD') {
                navigation.navigate('Success');
            }


        } catch (error) {
            console.error("Payment Error:", error);
            Alert.alert("Error", "Payment failed. Check if the backend is running.");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Complete Your Order</Text>

                <View style={styles.summaryBox}>
                    <Text style={styles.subtitle}>Order Summary</Text>
                    {cartItems.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemText}>{item.quantity}x {item.name}</Text>
                            <Text style={styles.itemText}>Rs. {(item.price * item.quantity) - (item.discount || 0)}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>Total Amount:</Text>
                        <Text style={styles.totalText}>Rs. {calculateTotal()}</Text>
                    </View>
                </View>

                <View style={styles.paymentBox}>
                    <Text style={styles.subtitle}>Select Payment Method</Text>

                    <TouchableOpacity style={styles.radioOption} onPress={() => setPaymentMethod('COD')}>
                        <View style={styles.radioCircle}>
                            {paymentMethod === 'COD' && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.radioText}>Cash on Delivery (COD)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.radioOption} onPress={() => setPaymentMethod('CARD')}>
                        <View style={styles.radioCircle}>
                            {paymentMethod === 'CARD' && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.radioText}>Credit / Debit Card</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Pay Rs. {calculateTotal()}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
    },
    summaryBox: {
        backgroundColor: '#f1f3f5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemText: {
        color: '#444',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#dee2e6',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    paymentBox: {
        marginBottom: 25,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
    },
    radioText: {
        fontSize: 15,
        color: '#495057',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PaymentScreen;