import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const SuccessScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Background Image */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.background}
                imageStyle={{ opacity: 0.15 }}
                resizeMode="cover"
            >
                <View style={styles.content}>
                    <Text style={styles.emoji}>🎉 👏</Text>
                    <Text style={styles.title}>Congratulations!</Text>
                    <Text style={styles.subtitle}>Your order has been placed successfully.</Text>

                    {/* Go to Home Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.homeButton]}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.buttonText}>Go to Home Page</Text>
                    </TouchableOpacity>

                    {/* Place Another Order Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.orderButton]}
                        onPress={() => navigation.navigate('Order')}
                    >
                        <Text style={[styles.buttonText, styles.orderButtonText]}>Place Another Order</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emoji: {
        fontSize: 65,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555555',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    button: {
        width: '100%',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    homeButton: {
        backgroundColor: '#007bff',
    },
    orderButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderButtonText: {
        color: '#007bff',
    }
});

export default SuccessScreen;