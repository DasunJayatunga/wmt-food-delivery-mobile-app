import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const CartScreen = ({ navigation }) => {
    const userId = "user_12345"; // Simulating logged-in user
    const [cartItems, setCartItems] = useState([]);
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get your IP from your .env file
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/cart/${userId}`);
            setCartItems(response.data.items);
            // Auto-select all items by default
            setSelectedItemIds(response.data.items.map(item => item._id));
        } catch (error) {
            console.error("Error fetching cart:", error);
            Alert.alert("Error", "Could not load cart data.");
        }
        setLoading(false);
    };

    const toggleSelection = (itemId) => {
        if (selectedItemIds.includes(itemId)) {
            setSelectedItemIds(selectedItemIds.filter(id => id !== itemId)); // Deselect
        } else {
            setSelectedItemIds([...selectedItemIds, itemId]); // Select
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`${apiUrl}/api/cart/${userId}/item/${itemId}`);
            // Remove from local state to update UI instantly
            setCartItems(cartItems.filter(item => item._id !== itemId));
            setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
        } catch (error) {
            Alert.alert("Error", "Could not delete item.");
        }
    };

    const calculateSelectedTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            if (selectedItemIds.includes(item._id)) {
                total += (item.price * item.quantity) - (item.discount || 0);
            }
        });
        return total;
    };

    const handleCheckout = () => {
        if (selectedItemIds.length === 0) {
            Alert.alert("Notice", "Please select at least one item to checkout.");
            return;
        }
        // Filter the full item objects that are selected
        const selectedItemsToPass = cartItems.filter(item => selectedItemIds.includes(item._id));

        // Navigate to Payment Screen AND pass the selected items
        navigation.navigate('Payment', { selectedItems: selectedItemsToPass });
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedItemIds.includes(item._id);
        const itemTotal = (item.price * item.quantity) - (item.discount || 0);

        return (
            <View style={styles.cartItem}>
                {/* Custom Checkbox */}
                <TouchableOpacity onPress={() => toggleSelection(item._id)} style={styles.checkboxContainer}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </TouchableOpacity>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubText}>Qty: {item.quantity}  |  Rs. {item.price} each</Text>
                    {item.discount > 0 && <Text style={styles.discountText}>Discount: -Rs. {item.discount}</Text>}
                    <Text style={styles.itemTotal}>Total: Rs. {itemTotal}</Text>
                </View>

                {/* Delete Button */}
                <TouchableOpacity onPress={() => deleteItem(item._id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) return <ActivityIndicator size="large" color="#007bff" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Your Cart</Text>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty.</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {/* Bottom Checkout Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.totalLabel}>Selected Total:</Text>
                    <Text style={styles.totalPrice}>Rs. {calculateSelectedTotal()}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutBtnText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', padding: 20, color: '#333' },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
    },
    checkboxContainer: { paddingRight: 15 },
    checkbox: {
        width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#007bff',
        alignItems: 'center', justifyContent: 'center',
    },
    checkboxSelected: { backgroundColor: '#007bff' },
    checkmark: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    itemSubText: { fontSize: 14, color: '#666' },
    discountText: { fontSize: 12, color: '#28a745', marginTop: 2 },
    itemTotal: { fontSize: 15, fontWeight: 'bold', color: '#007bff', marginTop: 4 },
    deleteBtn: { padding: 10 },
    deleteBtnText: { color: '#dc3545', fontSize: 18, fontWeight: 'bold' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#888' },
    bottomBar: {
        position: 'absolute', bottom: 0, width: '100%',
        backgroundColor: '#fff', padding: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderTopWidth: 1, borderColor: '#eee',
        elevation: 10,
    },
    totalLabel: { fontSize: 14, color: '#666' },
    totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    checkoutBtn: { backgroundColor: '#007bff', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 },
    checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CartScreen;