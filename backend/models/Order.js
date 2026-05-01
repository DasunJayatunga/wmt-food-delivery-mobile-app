const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    items: Array,
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);