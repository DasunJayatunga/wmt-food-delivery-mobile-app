const Cart = require('../models/Cart');

// Get a user's cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await Cart.findOne({ userId });

        // For testing purposes: If the user doesn't have a cart yet, create a dummy one
        if (!cart) {
            cart = await Cart.create({
                userId: userId,
                items: [
                    { name: 'Lemon Juice', price: 100, quantity: 2, discount: 0 },
                    { name: 'Chicken Burger', price: 200, quantity: 3, discount: 20 },
                    { name: 'French Fries', price: 150, quantity: 1, discount: 0 }
                ]
            });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Server error fetching cart" });
    }
};

// Delete an item from the cart
const removeCartItem = async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ error: "Cart not found" });

        // Filter out the item that needs to be deleted
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ error: "Server error deleting item" });
    }
};

module.exports = { getCart, removeCartItem };