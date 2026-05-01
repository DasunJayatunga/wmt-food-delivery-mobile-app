const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const processPayment = async (req, res) => {
    try {
        const { userId, cartItems, paymentMethod } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "User is not logged in." });
        }

        const customerName = "Dineth Sasmitha";
        const address = "SLIIT Campus, Malabe, Sri Lanka";

        // Secure Backend Calculation: (Price * Qty) - Discount
        let totalAmount = 0;
        let totalDiscount = 0;
        cartItems.forEach(item => {
            const itemTotal = (item.price * item.quantity) - (item.discount || 0);
            totalAmount += itemTotal;
            totalDiscount += (item.discount || 0);
        });

        // Handle Cash on Delivery (COD)
        if (paymentMethod === 'COD') {

            const newOrder = new Order({
                userId, customerName, address, items: cartItems,
                totalAmount, discount: totalDiscount, paymentMethod
            });
            await newOrder.save();
            return res.status(200).json({
                success: true,
                message: "Order placed successfully with Cash on Delivery.",
                totalPaid: totalAmount,
                orderId: newOrder._id
            });
        }

        // Handle Online Payment (Stripe)
        if (paymentMethod === 'CARD') {
            const line_items = cartItems.map((item) => {
                const finalPrice = item.price - (item.discount || 0);
                return {
                    price_data: {
                        currency: 'lkr',
                        product_data: { name: item.name },
                        unit_amount: finalPrice * 100, // Stripe requires cents
                    },
                    quantity: item.quantity,
                };
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: line_items,
                mode: 'payment',
                // Using generic success/cancel URLs for now. We will update these for mobile later.
                success_url: 'https://success.com',
                cancel_url: 'https://cancel.com',
            });

            return res.status(200).json({ url: session.url });
        }

        res.status(400).json({ error: "Invalid payment method." });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ error: "Server error during payment." });
    }
};

module.exports = { processPayment };